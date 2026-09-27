"use client";

import { useMemo, useState } from "react";
import {
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
  ENQUIRY_TYPE_LABELS,
  SPAM_RETENTION_DAYS,
  computeSpamDeleteAt,
  daysUntilDeletion,
  isSpamDueForDeletion,
  type Enquiry,
  type EnquiryStatus,
} from "@/lib/enquiries";
import { formatDateTime } from "@/lib/format";
import { whatsappTo } from "@/lib/whatsapp";
import { StatusBadge } from "@/components/admin/status-badge";
import { WhatsappIcon, MailIcon, PhoneIcon, TrashIcon } from "@/components/ui/icons";

type Filter = "all" | EnquiryStatus | "spam";

function firstName(name: string) {
  const trimmed = name.trim();
  return trimmed.split(/\s+/)[0] || trimmed;
}

// A polite opener the admin can extend. Uses only the customer-facing
// reference — never the internal database id.
function replyMessage(enq: Enquiry) {
  const hi = `Hi ${firstName(enq.name)},`;
  const ref = ` (ref ${enq.reference})`;
  if (enq.type === "product" && enq.product_name) {
    return `${hi} thank you for your enquiry about the ${enq.product_name}${ref}. `;
  }
  return `${hi} thank you for contacting MIH GEMS${ref}. `;
}

export function EnquiriesManager({ enquiries }: { enquiries: Enquiry[] }) {
  const [items, setItems] = useState<Enquiry[]>(enquiries);
  const [filter, setFilter] = useState<Filter>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: items.length,
      new: 0,
      read: 0,
      responded: 0,
      archived: 0,
      spam: 0,
    };
    for (const item of items) {
      if (item.is_spam) base.spam += 1;
      else base[item.status] += 1;
    }
    return base;
  }, [items]);

  const visible = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "spam") return items.filter((i) => i.is_spam);
    return items.filter((i) => !i.is_spam && i.status === filter);
  }, [items, filter]);

  async function updateStatus(id: string, status: EnquiryStatus) {
    const previous = items;
    setError("");
    setSavingId(id);
    // Optimistic update.
    setItems((current) =>
      current.map((i) => (i.id === id ? { ...i, status } : i)),
    );

    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Could not update status.");
      }
    } catch (err) {
      setItems(previous); // revert
      setError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setSavingId(null);
    }
  }

  async function updateSpam(id: string, spam: boolean) {
    const previous = items;
    setError("");
    setSavingId(id);
    // Optimistic update.
    setItems((current) =>
      current.map((i) => {
        if (i.id !== id) return i;
        if (spam) {
          return {
            ...i,
            is_spam: true,
            spam_marked_at: new Date().toISOString(),
            spam_delete_at: computeSpamDeleteAt(),
          };
        }
        return {
          ...i,
          is_spam: false,
          spam_marked_at: null,
          spam_delete_at: null,
        };
      }),
    );

    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spam }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Could not update spam status.");
      }
    } catch (err) {
      setItems(previous); // revert
      setError(err instanceof Error ? err.message : "Could not update spam status.");
    } finally {
      setSavingId(null);
    }
  }

  const FILTERS: Filter[] = ["all", ...ENQUIRY_STATUSES, "spam"];

  return (
    <div className="mt-10">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((key) => {
          const on = filter === key;
          const label =
            key === "all"
              ? "All"
              : key === "spam"
                ? "Spam"
                : ENQUIRY_STATUS_LABELS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
                on
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-outline/25 text-muted hover:text-ivory"
              }`}
            >
              {label}
              <span className="ml-2 text-outline">{counts[key]}</span>
            </button>
          );
        })}
      </div>

      {filter === "spam" && counts.spam > 0 ? (
        <div className="mt-6 border border-gold/20 bg-gold/5 px-5 py-4 text-sm text-muted">
          <p className="text-ivory">
            Spam is retained for{" "}
            <span className="font-mono text-gold">{SPAM_RETENTION_DAYS} days</span>{" "}
            after marking, then permanently deleted by a scheduled server-side
            job. Use <span className="text-ivory">Restore</span> to bring an
            enquiry back into the active list at any time.
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 border border-danger/40 bg-danger/10 px-5 py-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {/* List */}
      {visible.length === 0 ? (
        <div className="mt-10 border border-gold/12 px-6 py-16 text-center">
          <p className="font-serif text-lg text-ivory">No enquiries here.</p>
          <p className="mt-2 text-sm text-muted">
            {filter === "all"
              ? "New enquiries from the website will appear here."
              : filter === "spam"
                ? "No spam enquiries yet."
                : "Nothing matches this filter."}
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-5">
          {visible.map((enq) => {
            const wa = whatsappTo(enq.phone, replyMessage(enq));
            const mailto = enq.email
              ? `mailto:${enq.email}?subject=${encodeURIComponent(
                  `Re: Your MIH GEMS enquiry (${enq.reference})`,
                )}&body=${encodeURIComponent(replyMessage(enq))}`
              : null;
            const detailEntries = Object.entries(enq.details ?? {});

            return (
              <li key={enq.id} className="card-luxe p-6 sm:p-8">
                <div className="flex flex-col gap-4 border-b border-outline/12 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm text-gold">
                        {enq.reference}
                      </span>
                      <span className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                        {ENQUIRY_TYPE_LABELS[enq.type] ?? enq.type}
                      </span>
                      <StatusBadge status={enq.status} />
                      {enq.is_spam ? (
                        <span className="text-[0.62rem] uppercase tracking-[0.14em] text-gold">
                          Spam
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 font-serif text-2xl text-ivory">
                      {enq.name}
                    </h3>
                    <p className="mt-1 text-xs text-outline">
                      {formatDateTime(enq.created_at)}
                    </p>
                    {enq.is_spam && enq.spam_marked_at ? (
                      <p className="mt-2 text-xs text-outline">
                        Marked spam {formatDateTime(enq.spam_marked_at)}
                        {enq.spam_delete_at
                          ? isSpamDueForDeletion(enq.spam_delete_at)
                            ? ` · due for deletion`
                            : ` · ${daysUntilDeletion(enq.spam_delete_at)} day${
                                daysUntilDeletion(enq.spam_delete_at) === 1
                                  ? ""
                                  : "s"
                              } left`
                          : null}
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0">
                    {enq.is_spam ? (
                      <button
                        type="button"
                        disabled={savingId === enq.id}
                        onClick={() => updateSpam(enq.id, false)}
                        className="btn btn-ghost btn-sm disabled:opacity-50"
                      >
                        Restore
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <label className="shrink-0">
                          <span className="sr-only">Update status</span>
                          <select
                            value={enq.status}
                            disabled={savingId === enq.id}
                            onChange={(e) =>
                              updateStatus(enq.id, e.target.value as EnquiryStatus)
                            }
                            className="input-luxe py-2 text-sm disabled:opacity-50"
                          >
                            {ENQUIRY_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {ENQUIRY_STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          disabled={savingId === enq.id}
                          onClick={() => updateSpam(enq.id, true)}
                          className="btn btn-ghost btn-sm disabled:opacity-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Mark as spam
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact + meta */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {enq.email ? (
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                        Email
                      </p>
                      <a
                        href={`mailto:${enq.email}`}
                        className="mt-1 block break-all text-sm text-ivory hover:text-gold"
                      >
                        {enq.email}
                      </a>
                    </div>
                  ) : null}
                  {enq.phone ? (
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                        Phone
                      </p>
                      <a
                        href={`tel:${enq.phone.replace(/\s+/g, "")}`}
                        className="mt-1 block text-sm text-ivory hover:text-gold"
                      >
                        {enq.phone}
                      </a>
                    </div>
                  ) : null}
                  {enq.product_name ? (
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                        Product
                      </p>
                      <p className="mt-1 text-sm text-ivory">
                        {enq.product_name}
                      </p>
                    </div>
                  ) : null}
                  {enq.subject ? (
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                        Subject
                      </p>
                      <p className="mt-1 text-sm text-ivory">{enq.subject}</p>
                    </div>
                  ) : null}
                </div>

                {/* Details (type-specific) */}
                {detailEntries.length > 0 ? (
                  <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-outline/12 pt-5 sm:grid-cols-2">
                    {detailEntries.map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                          {key}
                        </dt>
                        <dd className="mt-1 text-sm text-ivory">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {/* Message */}
                {enq.message ? (
                  <div className="mt-5 border-l-2 border-gold/40 bg-noir-deep/40 p-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                      {enq.message}
                    </p>
                  </div>
                ) : null}

                {/* Reply actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {wa ? (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm"
                    >
                      <WhatsappIcon className="h-4 w-4" />
                      Reply on WhatsApp
                    </a>
                  ) : null}
                  {mailto ? (
                    <a href={mailto} className="btn btn-ghost btn-sm">
                      <MailIcon className="h-4 w-4" />
                      Reply by email
                    </a>
                  ) : null}
                  {!wa && !mailto ? (
                    <p className="inline-flex items-center gap-2 text-xs text-outline">
                      <PhoneIcon className="h-4 w-4" />
                      No contact details on file
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { whatsappLink, enquiryWhatsappMessage } from "@/lib/whatsapp";
import type { EnquiryFormConfig, EnquiryField } from "./enquiry-fields";
import {
  CheckIcon,
  ChevronDownIcon,
  WhatsappIcon,
} from "@/components/ui/icons";

type EnquiryFormProps = {
  config: EnquiryFormConfig;
  /** Optional product context (for product enquiries). */
  productName?: string;
  productSlug?: string;
};

type Collected = {
  core: { name: string; email: string; phone: string; subject: string; message: string };
  details: Record<string, string>;
};

function labelFor(field: EnquiryField, value: string): string {
  if (!field.options) return value;
  return field.options.find((o) => o.value === value)?.label ?? value;
}

export default function EnquiryForm({
  config,
  productName,
  productSlug,
}: EnquiryFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const collect = (): Collected => {
    const core = { name: "", email: "", phone: "", subject: "", message: "" };
    const details: Record<string, string> = {};
    for (const field of config.fields) {
      const raw = (values[field.name] ?? "").trim();
      if (!raw) continue;
      const display = labelFor(field, raw);
      if (field.core) core[field.core] = display;
      else details[field.label] = display;
    }
    return { core, details };
  };

  // WhatsApp fallback reflects whatever the customer has typed so far.
  const whatsappHref = useMemo(() => {
    const { core, details } = collect();
    if (productName) details["Piece"] = productName;
    return whatsappLink(
      enquiryWhatsappMessage({
        type: config.type,
        name: core.name,
        subject: core.subject,
        message: core.message,
        details,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, config.type, productName]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const missing = config.fields.find(
      (f) => f.required && !(values[f.name] ?? "").trim(),
    );
    if (missing) {
      setError(`Please complete “${missing.label}”.`);
      return;
    }

    const { core, details } = collect();
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: config.type,
          name: core.name,
          email: core.email,
          phone: core.phone,
          subject: core.subject,
          message: core.message,
          details,
          productName,
          productSlug,
          company: honeypot, // honeypot — must stay empty
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; reference?: string; error?: string }
        | null;

      if (!res.ok || !data?.ok || !data.reference) {
        setError(
          data?.error ??
            "We couldn't send your enquiry. Please try again or use WhatsApp.",
        );
        return;
      }
      setReference(data.reference);
    } catch {
      setError(
        "Something went wrong sending your enquiry. Please try again or use WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="card-luxe flex flex-col items-center gap-6 p-10 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center border border-gold/40 bg-gold/10 text-gold">
          <CheckIcon className="h-8 w-8" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-3xl text-ivory">Enquiry received</h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            Thank you for reaching out to MIH GEMS. We&rsquo;ve received your
            enquiry and will be in touch shortly to help with the details.
          </p>
        </div>
        <div className="w-full max-w-xs border border-outline/20 bg-noir/40 px-6 py-4">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted">
            Reference number
          </p>
          <p className="mt-1 font-mono text-lg tracking-widest text-gold">
            {reference}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-gold btn-sm">
            Return home
          </Link>
          <Link href="/shop" className="btn btn-ghost btn-sm">
            Browse the collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-luxe p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {config.fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={values[field.name] ?? ""}
            onChange={(v) => setValue(field.name, v)}
          />
        ))}
      </div>

      {/* Honeypot: hidden from humans, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-6 border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-gold btn-block sm:flex-1"
        >
          {submitting ? "Sending…" : config.submitLabel}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-block sm:flex-1"
        >
          <WhatsappIcon className="h-4 w-4" />
          Send on WhatsApp
        </a>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        We&rsquo;ll only use your details to respond to this enquiry. Prefer to
        talk? WhatsApp reaches us fastest.
      </p>
    </form>
  );
}

type FieldProps = {
  field: EnquiryField;
  value: string;
  onChange: (value: string) => void;
};

function Field({ field, value, onChange }: FieldProps) {
  const id = `enq-${field.name}`;
  const spanClass = field.full ? "sm:col-span-2" : "";

  return (
    <div className={`flex flex-col gap-2 ${spanClass}`}>
      <label htmlFor={id} className="field-label">
        {field.label}
        {field.required ? <span className="text-gold"> *</span> : null}
      </label>

      {field.kind === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          rows={field.rows ?? 4}
          required={field.required}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-luxe resize-y"
        />
      ) : field.kind === "select" ? (
        <div className="relative">
          <select
            id={id}
            name={field.name}
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-luxe appearance-none pr-10"
          >
            <option value="">
              {field.placeholder ?? "Please select…"}
            </option>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>
      ) : field.kind === "chips" ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label={field.label}>
          {field.options?.map((o) => {
            const active = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(active ? "" : o.value)}
                className={active ? "chip chip-gold" : "chip chip-muted"}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.kind}
          required={field.required}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-luxe"
          inputMode={field.kind === "tel" ? "tel" : undefined}
        />
      )}

      {field.help ? (
        <p className="text-xs leading-relaxed text-muted">{field.help}</p>
      ) : null}
    </div>
  );
}

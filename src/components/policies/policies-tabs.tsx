"use client";

import { useState } from "react";

export type PolicyBlock = {
  heading?: string;
  body?: string;
  bullets?: string[];
};

export type PolicyFaq = { q: string; a: string };

export type PolicySection = {
  id: string;
  label: string;
  heading: string;
  intro?: string;
  blocks?: PolicyBlock[];
  faqs?: PolicyFaq[];
};

export default function PoliciesTabs({
  sections,
}: {
  sections: PolicySection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  if (!active) return null;

  return (
    <div className="mt-14 flex flex-col gap-10 lg:flex-row lg:gap-14">
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Policies and FAQ"
        className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {sections.map((section) => {
          const selected = section.id === active.id;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              id={`tab-${section.id}`}
              aria-selected={selected}
              aria-controls={`panel-${section.id}`}
              onClick={() => setActiveId(section.id)}
              className={`shrink-0 whitespace-nowrap border-l-2 px-4 py-3 text-left text-sm uppercase tracking-[0.12em] transition-colors lg:whitespace-normal ${
                selected
                  ? "border-gold text-gold"
                  : "border-transparent text-muted hover:text-ivory"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="card-luxe flex-1 p-8 lg:p-10"
      >
        <h2 className="font-serif text-3xl text-ivory">{active.heading}</h2>
        <div className="divider-gold mt-4" />

        {active.intro ? (
          <p className="mt-6 text-sm leading-relaxed text-muted">
            {active.intro}
          </p>
        ) : null}

        {active.blocks?.length ? (
          <div className="mt-8 flex flex-col gap-8">
            {active.blocks.map((block, i) => (
              <div key={block.heading ?? i}>
                {block.heading ? (
                  <h3 className="font-serif text-lg text-ivory">
                    {block.heading}
                  </h3>
                ) : null}
                {block.body ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {block.body}
                  </p>
                ) : null}
                {block.bullets?.length ? (
                  <ul className="mt-3 flex flex-col gap-2">
                    {block.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {active.faqs?.length ? (
          <div className="mt-8 flex flex-col divide-y divide-outline/15">
            {active.faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ivory">
                  <span className="font-serif text-lg">{faq.q}</span>
                  <span className="text-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

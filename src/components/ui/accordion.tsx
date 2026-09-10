"use client";

import { useState, useId, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className = "",
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState(0);
  const headingId = useId();
  const panelId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div className={`border border-outline/20 ${className}`}>
      <button
        id={headingId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="flex items-center justify-between gap-4 w-full p-4 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-xs uppercase tracking-[0.18em] text-muted font-medium">
          {title}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-muted transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? contentHeight : 0 }}
      >
        <div
          ref={contentRef}
          className="px-4 pb-4 pt-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
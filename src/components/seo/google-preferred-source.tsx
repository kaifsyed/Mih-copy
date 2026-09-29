"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google "Preferred Source" button (news.google.com/swg/js/v1/publisher.js).
 *
 * The button is rendered with a fixed height so the footer layout is reserved
 * before the script loads — otherwise the injected button reflows the footer
 * column once publisher.js resolves. The third-party script itself is loaded
 * only once the footer is far from the viewport (IntersectionObserver), which
 * keeps news.google.com off the critical path entirely on a normal page load
 * and only fetches it if the visitor actually scrolls to the footer.
 *
 * Google's script sets its own third-party cookies, which is the source of the
 * "third-party cookie may be blocked" Chrome DevTools diagnostic. That is
 * Google's behaviour and cannot be configured from this site; deferring the
 * fetch keeps it off the critical path without breaking the button.
 */
export function GooglePreferredSource() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || inView) return;

    if (typeof IntersectionObserver === "undefined") {
      // No IntersectionObserver (very old browser). Defer to a macrotask so
      // this still isn't a synchronous setState inside the effect body, which
      // would cause a cascading render.
      const id = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      // Only once the footer is genuinely near the viewport, with a generous
      // bottom margin so it triggers slightly before the user scrolls to it.
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView) return;

    if (
      !document.querySelector(
        'script[src="https://news.google.com/swg/js/v1/publisher.js"]',
      )
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://news.google.com/swg/js/v1/publisher.js";
      document.head.appendChild(script);
    }
  }, [inView]);

  return (
    <div
      ref={containerRef}
      google-add-preferred-source-btn=""
      data-theme="dark"
      style={{ minHeight: 44 }}
    />
  );
}
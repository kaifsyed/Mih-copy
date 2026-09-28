"use client";

import { useEffect, useState } from "react";

/**
 * Google "Preferred Source" button (news.google.com/swg/js/v1/publisher.js).
 *
 * The button is rendered with a fixed height so the footer layout is reserved
 * before the script loads — otherwise the injected button reflows the footer
 * column once publisher.js resolves, which is the main source of the reported
 * desktop layout shift. The third-party script itself is only fetched after the
 * component has been clicked (or, on first paint, after a short delay), which
 * also removes it from the mobile critical path.
 */
export function GooglePreferredSource() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer the network request past the first paint so it never competes
    // with the hero image for the mobile connection budget.
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (typeof window === "undefined") return;

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
  }, [ready]);

  return (
    <div
      google-add-preferred-source-btn=""
      data-theme="dark"
      style={{ minHeight: 44 }}
    />
  );
}
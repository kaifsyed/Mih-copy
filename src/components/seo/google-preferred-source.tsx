"use client";

import { useEffect } from "react";

export function GooglePreferredSource() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.querySelector('script[src="https://news.google.com/swg/js/v1/publisher.js"]')) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://news.google.com/swg/js/v1/publisher.js";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      google-add-preferred-source-btn=""
      data-theme="dark"
    />
  );
}
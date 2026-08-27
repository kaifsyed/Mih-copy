"use client";

import { useEffect } from "react";

// Catches errors thrown in the root layout itself. It replaces the entire
// document, so it must render its own <html>/<body> and cannot rely on the
// global stylesheet — styles are inlined to stay on-brand regardless.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "2rem",
          textAlign: "center",
          background: "#13140d",
          color: "#e4e3d7",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#e9c349",
          }}
        >
          Something went wrong
        </p>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 600 }}>
          We hit an unexpected snag
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: "28rem",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "#c4c7c7",
          }}
        >
          The application ran into a problem. Please try again — if it keeps
          happening, reach out and we&apos;ll help you directly.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "1px solid #e9c349",
            background: "#e9c349",
            color: "#13140d",
            padding: "0.75rem 1.5rem",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

/**
 * FAQPage JSON-LD (Schema.org).
 *
 * Only emitted when the page genuinely contains a question-and-answer set that
 * complies with Google's documented FAQPage requirements. The data is sourced
 * from the same `PolicyFaq[]` array the Policies page renders, so the schema
 * always matches the visible FAQ content — no fabricated Q&A.
 */
export function FaqJsonLd({
  questions,
}: {
  questions: { q: string; a: string }[];
}) {
  if (!questions.length) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
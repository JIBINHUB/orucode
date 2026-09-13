type Json = Record<string, unknown>;

/** Structured data for search and answer engines; `<` is escaped so content can't close the script tag. */
export default function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import DeveloperView from "@/components/views/DeveloperView";
import { IDS, absoluteUrl, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Jibin Chacko — Web Designer & Developer in Kerala, India",
  description:
    "Jibin Chacko is a designer and developer from Kerala, India who builds websites and apps and runs Leaf Creationism. He made ORU CODE, a free library of website designs and animations.",
  path: "/developer",
});

export default function DeveloperPage() {
  return (
    <>
      <DeveloperView />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: absoluteUrl("/developer"),
          mainEntity: { "@id": IDS.person },
          isPartOf: { "@id": IDS.website },
        }}
      />
    </>
  );
}

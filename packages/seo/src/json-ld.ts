export type WebsiteInfo = {
  url: string;
  name: string;
  description: string;
};

export function websiteJsonLd({ url, name, description }: WebsiteInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url,
    name,
    description,
  };
}

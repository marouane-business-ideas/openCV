import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://onlineresume.dev",
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: "https://onlineresume.dev/resume",
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: "https://onlineresume.dev/sign-in",
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: "https://onlineresume.dev/sign-up",
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
  ];
}
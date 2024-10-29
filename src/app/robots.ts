import type { MetadataRoute } from 'next'

const baseUrl = 'https://kaizen.haritpatel.site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: baseUrl,
  }
}
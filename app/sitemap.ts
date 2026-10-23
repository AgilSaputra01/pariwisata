import { MetadataRoute } from 'next';
import { POPULAR_ROUTES } from '@/lib/data/routes';
import { POPULAR_SERVICES } from '@/lib/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://baliride-trans.com';
  const currentDate = new Date().toISOString();

  // Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#routes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#destinations`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic Service pages (Programmatic SEO)
  const servicePages: MetadataRoute.Sitemap = POPULAR_SERVICES.map((s) => ({
    url: `${baseUrl}/services/${s.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic Route pages (Fastboat Routes SEO)
  const routePages: MetadataRoute.Sitemap = POPULAR_ROUTES.map((r) => ({
    url: `${baseUrl}/routes/${r.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticPages, ...servicePages, ...routePages];
}

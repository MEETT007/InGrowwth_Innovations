import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ingrowwthinnovations.com';

  const routes = [
    '',
    '/services',
    '/projects',
    '/technologies',
    '/blog',
    '/careers',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In a real application, you would also fetch dynamic blog posts, projects, etc.
  // from your database here and append them to the routes array.

  return routes;
}

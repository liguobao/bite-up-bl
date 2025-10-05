import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const baseUrlArg = args.find((arg) => arg.startsWith('--base-url='));
const baseUrl = baseUrlArg?.split('=')[1] || process.env.BASE_URL || 'https://biteup.house2048.com';

if (!/^https?:\/\//i.test(baseUrl)) {
  console.error('Base URL must include protocol, e.g. https://example.com');
  process.exit(1);
}

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/links', changefreq: 'weekly', priority: '0.6' },
];

const resolveUrl = (pathname) => new URL(pathname, baseUrl).toString().replace(/\/$/, pathname === '/' ? '/' : '');

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildStaticEntries = (timestamp) =>
  staticRoutes.map((route) => ({
    loc: resolveUrl(route.path),
    lastmod: timestamp,
    changefreq: route.changefreq,
    priority: route.priority,
  }));

const buildDynamicEntries = (list) =>
  list
    .filter((item) => item?.bvid)
    .map((item) => {
      const lastmod = formatDate(item?.metadata?.updatedAt) || formatDate(item?.videoInfo?.publishDate);
      return {
        loc: resolveUrl(`/content/${item.bvid}`),
        lastmod,
        changefreq: 'weekly',
        priority: '0.7',
      };
    });

const createSitemapXml = (entries) => {
  const urlNodes = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`];
      if (entry.lastmod) {
        parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      }
      if (entry.changefreq) {
        parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      }
      if (entry.priority) {
        parts.push(`    <priority>${entry.priority}</priority>`);
      }
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>\n`;
};

const main = async () => {
  const listPath = path.resolve(projectRoot, 'src', 'data', 'list.json');
  const outputPath = path.resolve(projectRoot, 'public', 'sitemap.xml');

  const rawList = await readFile(listPath, 'utf-8');
  const list = JSON.parse(rawList);

  if (!Array.isArray(list)) {
    throw new Error(`Expected an array in list.json, received ${typeof list}`);
  }

  const now = new Date().toISOString();
  const entries = [...buildStaticEntries(now), ...buildDynamicEntries(list)];

  const seen = new Set();
  const deduped = entries.filter((entry) => {
    if (seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });

  const sitemapXml = createSitemapXml(deduped);
  await writeFile(outputPath, sitemapXml, 'utf-8');
  console.log(`Sitemap generated with ${deduped.length} entries at ${outputPath}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

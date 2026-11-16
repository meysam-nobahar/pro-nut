import data from '../data/products.json';

export const categories = data.categories;
export const products = data.products;

const formOrder = ['Powder', 'Capsules', 'Tablets', 'Liquid'];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

export const inCategory = (slug) => products.filter((p) => p.category === slug);

export const forms = formOrder.map((name) => ({
  name,
  slug: name.toLowerCase(),
  count: products.filter((p) => p.form === name).length,
}));

export const pick = (slugs) => slugs.map((s) => productBySlug[s]);

export function metaLine(p) {
  // "Tablets · 480 tablets" repeats itself, so count-based sizes stand alone.
  if (p.size && /tablets|capsules|softgels/i.test(p.size)) return p.size[0].toUpperCase() + p.size.slice(1);
  return [p.form, p.size].filter(Boolean).join(' · ');
}

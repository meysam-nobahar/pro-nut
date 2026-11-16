const num = (s) => parseFloat(String(s).replace(',', '.'));

// Share of protein, carbohydrates and fat in 100 g, read from the product's own "Per 100 g" column.
// Returns null when the label does not carry all three.
export function composition(p) {
  const section = p.nutrition[0];
  if (!section) return null;
  const cols = section.columns ?? p.columns;
  const col = cols.findIndex((c) => /per 100 g$/i.test(c));
  if (col < 0) return null;
  const grams = (pattern) => {
    const row = section.rows.find((r) => !r.indent && pattern.test(r.label));
    const m = row?.values[col]?.match(/^([\d.,]+)\s*g\b/);
    return m ? num(m[1]) : null;
  };
  const parts = [['Protein', grams(/^protein/i)], ['Carbohydrates', grams(/^carbohydrate/i)], ['Fat', grams(/^fat/i)]];
  if (parts.some(([, g]) => g == null)) return null;
  const sum = parts.reduce((t, [, g]) => t + g, 0);
  if (sum <= 0 || sum > 100.5) return null;
  const other = Math.round((100 - sum) * 10) / 10;
  return [...parts.map(([name, g], i) => ({ name, g, tone: i })), ...(other >= 0.5 ? [{ name: 'Other', g: other, tone: 3 }] : [])];
}

// The quality standards of Royal Nutrition, shown on the About page, the home page and every product page.
// Supplied by the brand owner. Update the wording here and every page follows.
export const standards = [
  { icon: 'package', title: 'GMP-Based Manufacturing', text: 'Production follows Good Manufacturing Practice principles from the first ingredient to the sealed pack.' },
  { icon: 'shield', title: 'HACCP-Based Food Safety', text: 'Hazards are identified and controlled at every critical point of the process.' },
  { icon: 'chart', title: 'Quality Control Testing', text: 'Routine checks on ingredients, production and finished products.' },
  { icon: 'badge', title: 'Batch Quality Verification', text: 'Every batch is verified against its specification before it is released.' },
  { icon: 'flask', title: 'Raw Material Quality Assessment', text: 'Raw materials are assessed for quality before they enter production.' },
  { icon: 'search', title: 'Third-Party Laboratory Testing', text: 'Independent laboratories test our products as an extra layer of verification.' },
  { icon: 'badge', title: 'ISO 22000 Certified', text: 'Food safety management certified to the international ISO 22000 standard.' },
];

// Text seals shown beside the list. They are Royal Nutrition artwork, not the certification bodies' official marks:
// replace them with the official logos once the certificates are available.
export const seals = [
  { label: 'GMP', sub: 'Based manufacturing' },
  { label: 'HACCP', sub: 'Based food safety' },
  { label: 'ISO', sub: '22000 certified' },
];

// What each range is designed for. Neutral wording: a purpose, not a health claim.
export const purpose = {
  'protein-mass': 'Designed for people building muscle and meeting high daily protein needs.',
  'amino-recovery': 'Designed around the amino acids athletes use around their training.',
  'creatine-strength': 'Designed for strength and power training.',
  'pre-workout-pump': 'Designed to be taken before training.',
  'hormone-support': 'Designed for athletes who want plant-extract, mineral and amino acid formulas.',
  'weight-management': 'Designed to sit alongside a balanced diet and consistent training.',
  'health-wellness': 'Designed as everyday nutritional support.',
};

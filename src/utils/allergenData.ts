export interface AllergenInfo {
  id: string;
  label: string;
  symbol: string;
  color: string;
}

export const ALLERGENS: AllergenInfo[] = [
  { id: 'gluten', label: 'Gluten', symbol: 'Gl', color: '#D97706' },
  { id: 'crustaces', label: 'Crustaces', symbol: 'Cr', color: '#DC2626' },
  { id: 'oeufs', label: 'Oeufs', symbol: 'Oe', color: '#F59E0B' },
  { id: 'poisson', label: 'Poisson', symbol: 'Po', color: '#0284C7' },
  { id: 'arachides', label: 'Arachides', symbol: 'Ar', color: '#92400E' },
  { id: 'soja', label: 'Soja', symbol: 'So', color: '#65A30D' },
  { id: 'lait', label: 'Lait (lactose)', symbol: 'La', color: '#E5E7EB' },
  { id: 'fruits-coque', label: 'Fruits a coque', symbol: 'Fc', color: '#78350F' },
  { id: 'celeri', label: 'Celeri', symbol: 'Ce', color: '#16A34A' },
  { id: 'moutarde', label: 'Moutarde', symbol: 'Mo', color: '#CA8A04' },
  { id: 'sesame', label: 'Sesame', symbol: 'Se', color: '#A16207' },
  { id: 'sulfites', label: 'Sulfites', symbol: 'Su', color: '#7C3AED' },
  { id: 'lupin', label: 'Lupin', symbol: 'Lu', color: '#2563EB' },
  { id: 'mollusques', label: 'Mollusques', symbol: 'Ml', color: '#475569' },
];

export function getAllergenById(id: string): AllergenInfo | undefined {
  return ALLERGENS.find((a) => a.id === id);
}

export interface CertificationInfo {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
}

export const CERTIFICATIONS: CertificationInfo[] = [
  { id: 'bio-ab', label: 'Bio AB', shortLabel: 'AB', color: '#16A34A', bgColor: '#DCFCE7' },
  { id: 'bio-eu', label: 'Bio EU', shortLabel: 'EU', color: '#16A34A', bgColor: '#DCFCE7' },
  { id: 'fairtrade', label: 'Fairtrade', shortLabel: 'FT', color: '#0284C7', bgColor: '#DBEAFE' },
  { id: 'utz', label: 'UTZ', shortLabel: 'UTZ', color: '#65A30D', bgColor: '#ECFCCB' },
  { id: 'rainforest', label: 'Rainforest Alliance', shortLabel: 'RA', color: '#16A34A', bgColor: '#DCFCE7' },
  { id: 'label-rouge', label: 'Label Rouge', shortLabel: 'LR', color: '#DC2626', bgColor: '#FEE2E2' },
  { id: 'aop', label: 'AOP', shortLabel: 'AOP', color: '#B91C1C', bgColor: '#FEE2E2' },
  { id: 'igp', label: 'IGP', shortLabel: 'IGP', color: '#0369A1', bgColor: '#DBEAFE' },
  { id: 'stg', label: 'STG', shortLabel: 'STG', color: '#0369A1', bgColor: '#DBEAFE' },
  { id: 'sans-gluten', label: 'Sans Gluten', shortLabel: 'SG', color: '#D97706', bgColor: '#FEF3C7' },
  { id: 'vegan', label: 'Vegan', shortLabel: 'VG', color: '#16A34A', bgColor: '#DCFCE7' },
  { id: 'halal', label: 'Halal', shortLabel: 'HL', color: '#059669', bgColor: '#D1FAE5' },
  { id: 'casher', label: 'Casher', shortLabel: 'KS', color: '#1D4ED8', bgColor: '#DBEAFE' },
  { id: 'msc', label: 'MSC', shortLabel: 'MSC', color: '#0284C7', bgColor: '#DBEAFE' },
  { id: 'asc', label: 'ASC', shortLabel: 'ASC', color: '#0EA5E9', bgColor: '#E0F2FE' },
  { id: 'rspo', label: 'RSPO', shortLabel: 'RSPO', color: '#EA580C', bgColor: '#FED7AA' },
];

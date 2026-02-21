import { useState, useEffect, useCallback, useRef } from 'react';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1THGnjS_6ef6gf8HkYEIPiDbjymDJ8KbF-J4yGSctUsE/gviz/tq?tqx=out:csv&sheet=articles';
const CACHE_KEY = 'productCache';
const CACHE_TS_KEY = 'productCacheTimestamp';
const CACHE_TTL = 24 * 60 * 60 * 1000;

export interface CatalogProduct {
  codeArticle: string;
  libelle: string;
  stockReel: string;
  tonnageReel: string;
  marque: string;
  categorie: string;
  poidsNet: string;
  conditionnement: string;
  ingredients: string;
  allergenes: string;
  energieKJ: string;
  energieKcal: string;
  matieresGrasses: string;
  dontSatures: string;
  glucides: string;
  dontSucres: string;
  proteines: string;
  sel: string;
  dlcDluo: string;
  conservation: string;
  certifications: string;
  origine: string;
  codeEAN: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csv: string): CatalogProduct[] {
  const lines = csv.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];

  return lines.slice(1).map((line) => {
    const cols = parseCSVLine(line);
    return {
      codeArticle: cols[0] || '',
      libelle: cols[1] || '',
      stockReel: cols[2] || '',
      tonnageReel: cols[3] || '',
      marque: cols[4] || '',
      categorie: cols[5] || '',
      poidsNet: cols[6] || '',
      conditionnement: cols[7] || '',
      ingredients: cols[8] || '',
      allergenes: cols[9] || '',
      energieKJ: cols[10] || '',
      energieKcal: cols[11] || '',
      matieresGrasses: cols[12] || '',
      dontSatures: cols[13] || '',
      glucides: cols[14] || '',
      dontSucres: cols[15] || '',
      proteines: cols[16] || '',
      sel: cols[17] || '',
      dlcDluo: cols[18] || '',
      conservation: cols[19] || '',
      certifications: cols[20] || '',
      origine: cols[21] || '',
      codeEAN: cols[22] || '',
    };
  }).filter((p) => p.codeArticle || p.libelle);
}

function getCachedData(): CatalogProduct[] | null {
  try {
    const ts = localStorage.getItem(CACHE_TS_KEY);
    if (!ts) return null;
    const age = Date.now() - parseInt(ts, 10);
    if (age > CACHE_TTL) return null;
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CatalogProduct[];
  } catch {
    return null;
  }
}

function setCachedData(products: CatalogProduct[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
  } catch { /* storage full, ignore */ }
}

export function useProductCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const cached = getCachedData();
    if (cached) {
      setProducts(cached);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(SHEET_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csv = await res.text();
        const parsed = parseCSV(csv);
        setProducts(parsed);
        setCachedData(parsed);
      } catch {
        setError('Catalogue non disponible, saisie manuelle possible');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const search = useCallback(
    (query: string, marqueFilter?: string): CatalogProduct[] => {
      if (!query.trim()) return [];
      const q = query.toLowerCase();
      let filtered = products;
      if (marqueFilter) {
        filtered = filtered.filter(
          (p) => p.marque.toLowerCase() === marqueFilter.toLowerCase()
        );
      }
      return filtered
        .filter(
          (p) =>
            p.codeArticle.toLowerCase().includes(q) ||
            p.libelle.toLowerCase().includes(q)
        )
        .slice(0, 10);
    },
    [products]
  );

  return { products, loading, error, search };
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, BookOpen, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useProductCatalog, type CatalogProduct } from '../../../hooks/useProductCatalog';
import { useFiche } from '../FicheProduitContext';
import { ALLERGENS } from '../../../utils/allergenData';
import { CERTIFICATIONS } from '../../../utils/certificationData';
import type { AllergenSelection, Marque, Gamme, NutritionValues } from '../../../types/product';

const MARQUE_MAP: Record<string, Marque> = {
  fuseau: 'FUSEAU',
  'delices agro': 'DELICES AGRO',
  "c'propre": "C'PROPRE",
  cpropre: "C'PROPRE",
};

const GAMME_VALUES: Gamme[] = [
  'Chocolats', 'Farines & Amidons', 'Cremes & Beurres', 'Fruits & Purees',
  'Epices & Aromes', 'Sucres & Edulcorants', 'Levures & Agents levants',
  'Huiles & Graisses', 'Fruits secs & Oleagineux', 'Produits laitiers',
  'Oeufs & Ovoproduits', 'Gelatines & Gelifiants', 'Colorants & Decorations',
  'Snacking', 'Boulangerie', 'Patisserie',
];

function matchMarque(raw: string): Marque {
  const lower = raw.trim().toLowerCase();
  return MARQUE_MAP[lower] || '';
}

function matchGamme(raw: string): Gamme {
  const lower = raw.trim().toLowerCase();
  const found = GAMME_VALUES.find((g) => g.toLowerCase() === lower);
  return found || '';
}

function parseAllergens(raw: string): AllergenSelection[] {
  const parts = raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  return ALLERGENS.map((a) => {
    const label = a.label.toLowerCase();
    const id = a.id.toLowerCase();
    let selected = false;
    let traces = false;

    for (const part of parts) {
      const clean = part.replace(/\(traces?\)/i, '').trim();
      const isTraces = /\(traces?\)/i.test(part);
      if (clean === label || clean === id || label.includes(clean) || clean.includes(label)) {
        selected = true;
        traces = isTraces;
        break;
      }
    }
    return { id: a.id, selected, traces };
  });
}

function parseCertifications(raw: string): string[] {
  const parts = raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const matched: string[] = [];
  for (const part of parts) {
    const found = CERTIFICATIONS.find(
      (c) =>
        c.label.toLowerCase() === part ||
        c.shortLabel.toLowerCase() === part ||
        c.id === part
    );
    if (found) matched.push(found.id);
  }
  return matched;
}

export function ProductSearch() {
  const { state, dispatch } = useFiche();
  const { loading, error, search } = useProductCatalog();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatalogProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        const marqueFilter = state.formData.marque || undefined;
        const found = search(value, marqueFilter);
        setResults(found);
        setOpen(found.length > 0);
      }, 300);
    },
    [search, state.formData.marque]
  );

  const handleSelect = (product: CatalogProduct) => {
    setSelected(product);
    setQuery('');
    setResults([]);
    setOpen(false);

    const allergenes = parseAllergens(product.allergenes);
    const certifications = parseCertifications(product.certifications);
    const marque = matchMarque(product.marque);
    const gamme = matchGamme(product.categorie);

    const nutritionValues: NutritionValues = {
      energieKJ: product.energieKJ,
      energieKcal: product.energieKcal,
      matieresGrasses: product.matieresGrasses,
      acidesGrasSatures: product.dontSatures,
      glucides: product.glucides,
      sucres: product.dontSucres,
      proteines: product.proteines,
      sel: product.sel,
      fibres: '',
    };

    dispatch({
      type: 'UPDATE_FORM',
      payload: {
        referenceInterne: product.codeArticle,
        nomProduit: product.libelle,
        marque,
        gamme,
        codeEAN: product.codeEAN,
        poidsNet: product.poidsNet,
        conditionnement: product.conditionnement,
        ingredients: product.ingredients,
        allergenes,
        nutritionValues,
        dlcDluo: product.dlcDluo,
        conservation: product.conservation,
        certifications,
        origine: product.origine,
      },
    });
  };

  const handleClear = () => {
    setSelected(null);
    dispatch({ type: 'RESET_FORM' });
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {selected ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-300 truncate">
              Produit charge : {selected.codeArticle} — {selected.libelle}
            </p>
          </div>
          <button
            onClick={handleClear}
            className="w-6 h-6 rounded-full flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {loading ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder={loading ? 'Chargement du catalogue produits...' : 'Rechercher un produit par code ou nom...'}
              disabled={loading}
              className="w-full bg-slate-800/60 border-2 border-amber-500/25 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all disabled:opacity-50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <BookOpen className="w-4 h-4 text-amber-500/40" />
            </div>
          </div>

          {open && results.length > 0 && (
            <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
              {results.map((p) => (
                <button
                  key={p.codeArticle}
                  onClick={() => handleSelect(p)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-amber-400">{p.codeArticle}</span>
                    <span className="text-slate-500 mx-1.5">—</span>
                    <span className="text-sm text-slate-200">{p.libelle}</span>
                  </div>
                  {p.marque && (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-slate-600/50 text-[10px] font-bold text-slate-300 uppercase">
                      {p.marque}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 mt-1.5">
              <AlertCircle className="w-3 h-3 text-slate-500" />
              <p className="text-[11px] text-slate-500">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <p className="text-[11px] text-slate-500 mt-1.5">
              Selectionnez un produit du catalogue pour pre-remplir le formulaire, ou saisissez tout manuellement
            </p>
          )}
        </div>
      )}
    </div>
  );
}

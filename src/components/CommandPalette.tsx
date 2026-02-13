import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Camera,
  ImagePlus,
  Video,
  UtensilsCrossed,
  Share2,
  Command,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface CommandItem {
  id: string;
  label: string;
  section: string;
  icon: React.ElementType;
  keywords: string[];
}

const COMMANDS: CommandItem[] = [
  {
    id: 'scene-composition',
    label: 'Mise en situation Packaging',
    section: 'Designer',
    icon: ImagePlus,
    keywords: ['packaging', 'mise en situation', 'scene', 'composition'],
  },
  {
    id: 'background-removal',
    label: 'Detourage Studio',
    section: 'Designer',
    icon: Camera,
    keywords: ['detourage', 'studio', 'fond', 'blanc', 'packshot'],
  },
  {
    id: 'product-scene',
    label: 'Produit Brut',
    section: 'Designer',
    icon: ImagePlus,
    keywords: ['produit', 'brut', 'mise en situation'],
  },
  {
    id: 'recipe-scene',
    label: 'Recettes du Chef',
    section: 'Designer',
    icon: UtensilsCrossed,
    keywords: ['recette', 'chef', 'cuisine', 'gastronomie'],
  },
  {
    id: 'video-generation',
    label: 'Generation Videos',
    section: 'Designer',
    icon: Video,
    keywords: ['video', 'generation', 'animation'],
  },
  {
    id: 'social-media',
    label: 'Generateur de posts',
    section: 'Reseaux Sociaux',
    icon: Share2,
    keywords: ['social', 'media', 'post', 'reseaux', 'sociaux', 'linkedin', 'instagram'],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useApp();

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.section.toLowerCase().includes(q) ||
        cmd.keywords.some((kw) => kw.includes(q))
    );
  }, [query]);

  const navigate = useCallback(
    (id: string) => {
      dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: id });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'treatment' });
      setOpen(false);
      setQuery('');
    },
    [dispatch]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        navigate(filtered[selectedIndex].id);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [filtered, selectedIndex, navigate]
  );

  useEffect(() => {
    if (listRef.current) {
      const active = listRef.current.querySelector('[data-active="true"]');
      active?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-[15vh] z-[101] mx-auto max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation rapide"
          >
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Rechercher une page..."
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                  aria-label="Rechercher une page"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="command-list"
                  aria-activedescendant={filtered[selectedIndex]?.id}
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                  ESC
                </kbd>
              </div>

              <div
                ref={listRef}
                id="command-list"
                role="listbox"
                className="max-h-72 overflow-y-auto p-2"
              >
                {filtered.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-gray-400">
                    Aucun resultat
                  </p>
                ) : (
                  filtered.map((cmd, i) => {
                    const Icon = cmd.icon;
                    const active = i === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        id={cmd.id}
                        role="option"
                        aria-selected={active}
                        data-active={active}
                        onClick={() => navigate(cmd.id)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          active
                            ? 'bg-gray-50 text-fuseau-primary'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            active ? 'bg-fuseau-primary text-white' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{cmd.label}</p>
                          <p className="truncate text-[11px] text-gray-400">{cmd.section}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2">
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-gray-200 bg-white px-1 py-0.5 text-[10px]">&uarr;&darr;</kbd>
                    naviguer
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-gray-200 bg-white px-1 py-0.5 text-[10px]">&crarr;</kbd>
                    ouvrir
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

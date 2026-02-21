import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  ImagePlus,
  Video,
  UtensilsCrossed,
  Share2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Palette,
  MessageCircle,
  Sparkles,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface NavChild {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  defaultOpen: boolean;
  disabled?: boolean;
  children: NavChild[];
}

const sections: NavSection[] = [
  {
    id: 'designer',
    label: 'Designer',
    icon: Palette,
    defaultOpen: true,
    children: [
      { id: 'scene-composition', label: 'Mise en situation Packaging', icon: ImagePlus },
      { id: 'background-removal', label: 'Detourage Studio', icon: Camera },
      { id: 'product-scene', label: 'Produit Brut', icon: ImagePlus },
      { id: 'chef-recipe', label: 'Recettes du Chef', icon: UtensilsCrossed },
      { id: 'video-generation', label: 'Generation Videos', icon: Video },
    ],
  },
  {
    id: 'reseaux-sociaux',
    label: 'Reseaux Sociaux',
    icon: Share2,
    defaultOpen: true,
    children: [
      { id: 'social-media', label: 'Generateur de posts', icon: Share2 },
    ],
  },
  {
    id: 'fiche-produit',
    label: 'Fiche Produit IA',
    icon: FileText,
    defaultOpen: true,
    children: [
      { id: 'fiche-produit', label: 'Generateur de fiches', icon: FileText },
    ],
  },
  {
    id: 'community-manager',
    label: 'Community Manager',
    icon: MessageCircle,
    defaultOpen: false,
    disabled: true,
    children: [],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

function CollapsedFlyout({
  section,
  anchorRect,
  onSelect,
  activeId,
  onClose,
}: {
  section: NavSection;
  anchorRect: DOMRect;
  onSelect: (id: string) => void;
  activeId: string | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-[60] bg-slate-800 rounded-lg shadow-xl border border-white/10 py-2 min-w-[220px]"
      style={{
        left: anchorRect.right + 8,
        top: anchorRect.top,
      }}
    >
      <p className="px-3 pb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
        {section.label}
      </p>
      {section.children.map((child) => {
        const Icon = child.icon;
        const active = activeId === child.id;
        return (
          <button
            key={child.id}
            onClick={() => {
              onSelect(child.id);
              onClose();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors duration-150 ${
              active
                ? 'bg-[#E88C30] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/8'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-[13px] font-medium truncate">{child.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Sidebar({ collapsed, onToggle, mobile, onNavigate }: SidebarProps) {
  const { state, dispatch } = useApp();
  const currentId = state.selectedTreatmentType;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((s) => {
      initial[s.id] = s.defaultOpen;
    });
    return initial;
  });

  const [flyout, setFlyout] = useState<{ sectionId: string; rect: DOMRect } | null>(null);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNav = (id: string) => {
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: id });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'treatment' });
    onNavigate?.();
  };

  const sectionHasActive = (section: NavSection) =>
    section.children.some((c) => c.id === currentId);

  const handleCollapsedClick = (section: NavSection, e: React.MouseEvent<HTMLButtonElement>) => {
    if (section.disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyout((prev) =>
      prev?.sectionId === section.id ? null : { sectionId: section.id, rect }
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-200 ${
        mobile ? 'w-[280px] max-w-[85vw]' : collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
      style={{ background: '#0F172A' }}
      role="navigation"
      aria-label="Menu principal"
    >
      <div className="px-5 pt-6 pb-4">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1.5">
              <img
                src="/Logo_Fuseau.png"
                alt="Fuseau"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-xl px-4 py-3">
              <img
                src="/Logo_Fuseau.png"
                alt="Fuseau"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-slate-400 text-xs leading-snug mt-3">
              Centre Marketing du groupe
            </p>
          </div>
        )}
      </div>
      <div className="px-3 mb-2">
        <div className="h-px bg-slate-700/60" />
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {sections.map((section, idx) => {
          const SectionIcon = section.icon;
          const isOpen = openSections[section.id];
          const hasActive = sectionHasActive(section);

          if (collapsed) {
            return (
              <div key={section.id} className="px-2 mb-1">
                <button
                  onClick={(e) => handleCollapsedClick(section, e)}
                  title={section.label}
                  aria-label={section.label}
                  aria-disabled={section.disabled || undefined}
                  className={`w-full flex items-center justify-center rounded-lg px-2 py-2.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-fuseau-accent/40 ${
                    section.disabled
                      ? 'opacity-30 cursor-not-allowed'
                      : hasActive
                        ? 'text-[#E88C30]'
                        : 'text-white/50 hover:text-white hover:bg-white/8'
                  }`}
                >
                  <SectionIcon className="w-[18px] h-[18px]" />
                </button>
              </div>
            );
          }

          return (
            <div key={section.id}>
              {idx > 0 && (
                <div className="px-4 my-2">
                  <div className="h-px bg-white/5" />
                </div>
              )}

              <div className="px-2">
                <button
                  onClick={() => !section.disabled && toggleSection(section.id)}
                  aria-expanded={isOpen}
                  aria-disabled={section.disabled || undefined}
                  aria-label={`${section.label}${section.disabled ? ' (bientot disponible)' : ''}`}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-fuseau-accent/40 ${
                    section.disabled
                      ? 'opacity-30 cursor-not-allowed'
                      : hasActive
                        ? 'text-[#E88C30]/90'
                        : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <SectionIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider flex-1 text-left truncate">
                    {section.label}
                  </span>
                  {!section.disabled && section.children.length > 0 && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? '' : '-rotate-90'
                      }`}
                    />
                  )}
                  {section.disabled && (
                    <span className="text-[9px] bg-white/10 text-white/30 rounded px-1.5 py-0.5 font-medium">
                      Bientot
                    </span>
                  )}
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen && !section.disabled ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <ul className="space-y-0.5 px-2 pt-1 pb-1">
                  {section.children.map((child) => {
                    const active = currentId === child.id;
                    const Icon = child.icon;
                    return (
                      <li key={child.id}>
                        <button
                          onClick={() => handleNav(child.id)}
                          aria-current={active ? 'page' : undefined}
                          aria-label={child.label}
                          className={`w-full flex items-center gap-3 rounded-lg transition-colors duration-150 px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-fuseau-accent/40 ${
                            active
                              ? 'bg-[#E88C30] text-white'
                              : 'text-white/60 hover:text-white hover:bg-white/8'
                          }`}
                        >
                          <Icon className="w-[16px] h-[16px] flex-shrink-0" />
                          <span className="text-[13px] font-medium truncate">{child.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-2 pb-3">
        <button
          onClick={() => handleNav('liens-utiles')}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-fuseau-accent/40 ${
            currentId === 'liens-utiles'
              ? 'bg-[#E88C30] text-white'
              : 'text-white/50 hover:text-white hover:bg-white/8'
          } ${collapsed ? 'justify-center' : ''}`}
          title="Liens utiles IA"
          aria-label="Liens utiles IA"
          aria-current={currentId === 'liens-utiles' ? 'page' : undefined}
        >
          <Sparkles className="w-[16px] h-[16px] flex-shrink-0" />
          {!collapsed && (
            <span className="text-[13px] font-medium truncate">Liens utiles IA</span>
          )}
        </button>
      </div>

      <div className="border-t border-white/10" />

      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Ouvrir le menu' : 'Reduire le menu'}
        className={`absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-fuseau-primary/30 ${
          mobile ? 'hidden' : ''
        }`}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {flyout &&
        (() => {
          const section = sections.find((s) => s.id === flyout.sectionId);
          if (!section) return null;
          return (
            <CollapsedFlyout
              section={section}
              anchorRect={flyout.rect}
              onSelect={handleNav}
              activeId={currentId}
              onClose={() => setFlyout(null)}
            />
          );
        })()}
    </aside>
  );
}

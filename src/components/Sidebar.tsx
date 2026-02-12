import React from 'react';
import {
  Camera,
  ImagePlus,
  Video,
  UtensilsCrossed,
  Settings,
  Archive,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'scene-composition', label: 'Mise en situation Packaging', icon: ImagePlus },
  { id: 'background-removal', label: 'Detourage Studio', icon: Camera },
  { id: 'product-scene', label: 'Produit Brut', icon: ImagePlus },
  { id: 'recipe-scene', label: 'Recettes du Chef', icon: UtensilsCrossed },
  { id: 'video-generation', label: 'Generation Videos', icon: Video },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { state, dispatch } = useApp();

  const currentId = state.selectedTreatmentType;

  const handleNav = (id: string) => {
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: id });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'treatment' });
  };

  const isActive = (id: string) => currentId === id;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-200 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
      style={{ background: '#0F1D3D' }}
    >
      <div className={`flex items-center h-16 border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
        <img
          src="/GROUPE_FUSEAU_V2.png"
          alt="Fuseau"
          className={`object-contain transition-all ${collapsed ? 'h-7' : 'h-9'}`}
        />
        {!collapsed && (
          <div className="ml-3 min-w-0">
            <p className="text-white text-xs font-semibold leading-tight truncate">Studio Produit</p>
            <p className="text-white/40 text-[10px] font-medium truncate">IA Generatrice d'images</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {!collapsed && (
          <p className="px-5 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
            Traitements
          </p>
        )}
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const active = isActive(item.id);
            const Icon = item.icon;
            return (
              <li key={item.id ?? 'home'}>
                <button
                  onClick={() => handleNav(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 rounded-lg transition-colors duration-150 ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
                  } ${
                    active
                      ? 'bg-[#E88C30] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-[13px] font-medium truncate">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={`border-t border-white/10 py-3 ${collapsed ? 'px-2' : 'px-2'}`}>
        <ul className="space-y-0.5">
          <li>
            <button
              title={collapsed ? 'Archives' : undefined}
              className={`w-full flex items-center gap-3 rounded-lg text-white/40 hover:text-white/70 transition-colors duration-150 ${
                collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
              }`}
            >
              <Archive className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-[12px] font-medium">Archives</span>}
            </button>
          </li>
          <li>
            <button
              title={collapsed ? 'Parametres' : undefined}
              className={`w-full flex items-center gap-3 rounded-lg text-white/40 hover:text-white/70 transition-colors duration-150 ${
                collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
              }`}
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-[12px] font-medium">Parametres</span>}
            </button>
          </li>
        </ul>

        {!collapsed && (
          <div className="mt-3 mx-1 p-3 rounded-lg bg-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E88C30] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-[11px] font-semibold truncate">Fuseau Admin</p>
              <p className="text-white/40 text-[10px] truncate">admin@fuseau.fr</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-50"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}

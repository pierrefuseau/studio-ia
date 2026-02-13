import React from 'react';
import {
  Camera,
  ImagePlus,
  Video,
  UtensilsCrossed,
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
      style={{ background: '#0F172A' }}
    >
      <div className="px-5 pt-6 pb-4">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1.5">
              <img
                src="/Logo_Fuseau_Vectorisé.png"
                alt="Fuseau"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="bg-white rounded-xl px-4 py-3">
              <img
                src="/Logo_Fuseau_Vectorisé.png"
                alt="Fuseau"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-slate-400 text-xs leading-snug mt-3">
              Gestion de Contrats clients
            </p>
          </div>
        )}
      </div>
      <div className="px-3 mb-2">
        <div className="h-px bg-slate-700/60" />
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

      <div className="border-t border-white/10" />

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

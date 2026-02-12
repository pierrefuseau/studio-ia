import React from 'react';
import {
  Camera,
  ImagePlus,
  Video,
  UtensilsCrossed,
  Sparkles,
  Image,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ContentHeader } from './ContentHeader';

const treatments = [
  {
    id: 'background-removal',
    name: 'Detourage Studio',
    description: 'Packshot professionnel sur fond blanc immacule',
    icon: Camera,
    color: '#C8102E',
    bgColor: 'bg-red-50',
    textColor: 'text-fuseau-primary',
  },
  {
    id: 'scene-composition',
    name: 'Mise en situation Packaging',
    description: 'Integration de votre packaging dans un environnement realiste',
    icon: ImagePlus,
    color: '#E88C30',
    bgColor: 'bg-orange-50',
    textColor: 'text-fuseau-accent',
  },
  {
    id: 'product-scene',
    name: 'Mise en situation Produit Brut',
    description: 'Integration de produit brut dans un environnement personnalise',
    icon: ImagePlus,
    color: '#0284C7',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-600',
  },
  {
    id: 'recipe-scene',
    name: 'Recettes du Chef',
    description: 'Sublimez vos plats avec une mise en scene gastronomique',
    icon: UtensilsCrossed,
    color: '#059669',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    id: 'video-generation',
    name: 'Generation de videos',
    description: 'Creez des videos dynamiques a partir de vos images',
    icon: Video,
    color: '#7C3AED',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
  },
];

const stats = [
  {
    label: 'Traitements disponibles',
    value: '5',
    icon: Sparkles,
    trend: 'Types de visuels',
    bgColor: 'bg-red-50',
    textColor: 'text-fuseau-primary',
  },
  {
    label: 'Images traitees',
    value: '--',
    icon: Image,
    trend: 'En attente de traitement',
    bgColor: 'bg-orange-50',
    textColor: 'text-fuseau-accent',
  },
  {
    label: 'Dernier traitement',
    value: '--',
    icon: Clock,
    trend: 'Aucun traitement',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-600',
  },
  {
    label: 'Performance',
    value: '99%',
    icon: TrendingUp,
    trend: 'Disponibilite du service',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
];

export function DashboardHome() {
  const { dispatch } = useApp();

  const handleSelect = (id: string) => {
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: id });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'treatment' });
  };

  return (
    <div className="max-w-6xl">
      <ContentHeader
        breadcrumbs={[{ label: 'Accueil' }]}
        title="Tableau de bord"
        subtitle="Bienvenue sur le Studio Produit IA - Maison Familiale depuis 1973"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bgColor} ${stat.textColor} flex items-center justify-center`}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-gray-900 mb-0.5">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-[10px] text-gray-400 mt-1">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Traitements disponibles</h2>
        <span className="text-xs text-gray-400">{treatments.length} traitements</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {treatments.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-card text-left hover:shadow-card-hover hover:border-fuseau-primary/20 hover:-translate-y-0.5 transition-all duration-150 group"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-lg ${t.bgColor} ${t.textColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{t.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

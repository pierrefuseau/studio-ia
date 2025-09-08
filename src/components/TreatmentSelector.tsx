import React, { useState } from 'react';
import { Camera, ImagePlus, FileText, Share2, Settings, Sparkles, Crown, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BentoCard } from './ui/Card';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';

export function TreatmentSelector() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const [expandedTreatment, setExpandedTreatment] = useState<string | null>(null);

  const toggleTreatment = (treatmentId: string) => {
    dispatch({ type: 'TOGGLE_TREATMENT', payload: treatmentId });
    
    const treatment = state.treatments.find(t => t.id === treatmentId);
    if (treatment) {
      addToast({
        type: treatment.enabled ? 'info' : 'success',
        title: treatment.enabled ? 'Traitement désactivé' : 'Traitement activé',
        description: treatment.name
      });
    }
  };

  const toggleExpanded = (treatmentId: string) => {
    setExpandedTreatment(expandedTreatment === treatmentId ? null : treatmentId);
  };

  const treatments = [
    {
      id: 'background-removal',
      name: 'Détourage Studio',
      description: 'Packshot professionnel sur fond blanc',
      icon: Camera,
      badge: 'Rapide',
      badgeColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      gridArea: 'bento-item-1',
      features: ['Détourage précis', 'Fond blanc pro', 'Ombres naturelles']
    },
    {
      id: 'scene-composition',
      name: 'Mise en Situation',
      description: 'Intégration dans un environnement réaliste',
      icon: ImagePlus,
      badge: 'Premium',
      badgeColor: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      gridArea: 'bento-item-2',
      features: ['Environnements 3D', 'Éclairage réaliste', 'Perspectives multiples']
    },
    {
      id: 'magazine-layout',
      name: 'Page Magazine A4',
      description: 'Mise en page publicitaire professionnelle',
      icon: FileText,
      badge: 'Nouveau',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-orange-500',
      gradient: 'from-blue-500 via-blue-600 to-orange-500',
      gridArea: 'bento-item-3',
      features: ['Templates premium', 'Typography pro', 'Print ready']
    },
    {
      id: 'social-pack-ig',
      name: 'Instagram',
      description: 'Stories & Posts optimisés',
      icon: Share2,
      badge: 'Viral',
      badgeColor: 'bg-orange-400',
      gradient: 'from-orange-400 to-orange-500',
      gridArea: 'bento-item-4',
      features: ['Stories 9:16', 'Posts 1:1', 'Reels ready']
    },
    {
      id: 'social-pack-fb',
      name: 'Facebook',
      description: 'Posts & Ads performants',
      icon: Share2,
      badge: 'Pro',
      badgeColor: 'bg-blue-600',
      gradient: 'from-blue-600 to-blue-700',
      gridArea: 'bento-item-5',
      features: ['Ads format', 'Cover photos', 'Event banners']
    },
    {
      id: 'preview-live',
      name: 'Preview Live',
      description: 'Aperçu temps réel',
      icon: Zap,
      badge: 'Live',
      badgeColor: 'bg-gradient-to-r from-blue-400 to-orange-400',
      gradient: 'from-blue-400 via-blue-500 to-orange-400',
      gridArea: 'bento-item-6',
      features: ['Temps réel', 'Comparaison', 'Export instant']
    }
  ];

  const selectedCount = state.treatments.filter(t => t.enabled).length;

  return (
    <div className="space-y-8">
      {/* Header avec stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Sélection des Traitements
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choisissez les transformations IA pour votre produit
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Compteur sélections */}
          <div className="glass-card px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Bouton tout sélectionner */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              state.treatments.forEach(treatment => {
                if (!treatment.enabled) {
                  dispatch({ type: 'TOGGLE_TREATMENT', payload: treatment.id });
                }
              });
            }}
            className="group"
          >
            <Sparkles className="w-4 h-4 mr-2 group-hover:animate-spin text-blue-500 group-hover:text-orange-500" />
            Tout sélectionner
          </Button>
        </div>
      </div>

      {/* Grille Bento */}
      <div className="bento-grid">
        {treatments.map((treatment, index) => {
          const Icon = treatment.icon;
          const isEnabled = state.treatments.find(t => t.id === treatment.id)?.enabled || false;
          const isExpanded = expandedTreatment === treatment.id;
          
          return (
            <BentoCard
              key={treatment.id}
              className={`relative overflow-hidden transition-all duration-500 cursor-pointer group hover-lift ${
                isEnabled ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
              }`}
              style={{ gridArea: treatment.gridArea }}
              onClick={() => toggleTreatment(treatment.id)}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${treatment.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Floating orbs */}
              <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-xl animate-blob-blue"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-br from-orange-300/20 to-transparent rounded-full blur-lg animate-blob-orange animation-delay-1000"></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${treatment.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Badge */}
                  <div className={`px-3 py-1 ${treatment.badgeColor} text-white text-xs font-bold rounded-full shadow-lg animate-pulse`}>
                    {treatment.badge}
                  </div>
                </div>
                
                {/* Title & Description */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {treatment.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {treatment.description}
                  </p>
                </div>
                
                {/* Features */}
                <div className="mt-4 space-y-2">
                  {treatment.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center text-xs text-gray-500 dark:text-gray-400 transition-all duration-300 ${
                        isEnabled ? 'opacity-100 translate-x-0' : 'opacity-70 translate-x-2'
                      }`}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <div className={`w-1.5 h-1.5 ${idx % 2 === 0 ? 'bg-blue-400' : 'bg-orange-400'} rounded-full mr-2 animate-pulse`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {/* Selection indicator */}
                <div className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  isEnabled 
                    ? 'bg-blue-500 border-blue-500 scale-110' 
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                }`}>
                  {isEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
                
                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
                
                {/* Selection glow */}
                {isEnabled && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                )}
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </div>
            </BentoCard>
          );
        })}
      </div>

    </div>
  );
}
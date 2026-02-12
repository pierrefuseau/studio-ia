import React from 'react';
import { Camera, ImagePlus, Video, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function HeroSection() {
  const { dispatch } = useApp();

  const treatments = [
    {
      id: 'background-removal',
      name: 'Detourage Studio',
      description: 'Packshot professionnel sur fond blanc immacule',
      icon: <Camera className="w-5 h-5" />,
      recommended: true,
      enabled: true
    },
    {
      id: 'scene-composition',
      name: 'Mise en situation Packaging',
      description: 'Integration de votre packaging dans un environnement realiste et chaleureux',
      icon: <ImagePlus className="w-5 h-5" />,
      enabled: true
    },
    {
      id: 'product-scene',
      name: 'Mise en situation Produit Brut',
      description: 'Integration de produit brut dans un environnement personnalise et professionnel',
      icon: <ImagePlus className="w-5 h-5" />,
      enabled: true
    },
    {
      id: 'recipe-scene',
      name: 'Mise en situation des recettes du chef',
      description: 'Sublimez vos plats avec une mise en scene gastronomique',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      enabled: true
    },
    {
      id: 'video-generation',
      name: 'Generation de videos',
      description: 'Creez des videos dynamiques a partir de vos images produits',
      icon: <Video className="w-5 h-5" />,
      enabled: true
    }
  ];

  const handleSelectTreatment = (treatmentId: string) => {
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: treatmentId });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'treatment' });
  };

  return (
    <div className="min-h-screen bg-gradient-fuseau">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <img
              src="/GROUPE_FUSEAU_V2.png"
              alt="Fuseau"
              className="h-20 md:h-24 object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-card border border-gray-200/70 mb-7">
            <Sparkles className="w-3.5 h-3.5 text-fuseau-accent" />
            <span className="text-xs font-semibold text-fuseau-secondary tracking-wide">
              Intelligence Artificielle au service du visuel produit
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-extrabold text-gray-900 mb-5 leading-[1.1] tracking-tight">
            Transformez vos images
            <br />
            <span className="text-gradient-primary">en visuels d'exception</span>
          </h1>

          <p className="text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
            Creez des visuels marketing professionnels en quelques clics grace a
            notre IA de generation d'images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {treatments.map((treatment, index) => (
            <div
              key={treatment.id}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {treatment.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-fuseau-accent text-white text-[10px] font-bold rounded-full shadow-sm uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5" />
                    Recommande
                  </span>
                </div>
              )}
              <button
                onClick={() => handleSelectTreatment(treatment.id)}
                disabled={!treatment.enabled}
                className="w-full text-left rounded-xl p-5 border border-gray-200 bg-white shadow-card hover:shadow-card-hover hover:border-fuseau-primary/30 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fuseau-primary/20 focus:ring-offset-2 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 text-fuseau-primary flex items-center justify-center group-hover:bg-fuseau-primary group-hover:text-white transition-colors duration-150">
                    {treatment.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm text-gray-900 mb-0.5">
                      {treatment.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {treatment.description}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

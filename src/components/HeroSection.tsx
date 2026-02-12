import React from 'react';
import { Camera, ImagePlus, Video, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function HeroSection() {
  const { dispatch } = useApp();

  const treatments = [
    {
      id: 'background-removal',
      name: 'Détourage Studio',
      description: 'Packshot professionnel sur fond blanc immaculé',
      icon: <Camera className="w-6 h-6" />,
      recommended: true,
      enabled: true
    },
    {
      id: 'scene-composition',
      name: 'Mise en situation Packaging',
      description: 'Intégration de votre packaging dans un environnement réaliste et chaleureux',
      icon: <ImagePlus className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'product-scene',
      name: 'Mise en situation Produit Brut',
      description: 'Intégration de produit brut dans un environnement personnalisé et professionnel',
      icon: <ImagePlus className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'recipe-scene',
      name: 'Mise en situation des recettes du chef',
      description: 'Sublimez vos plats avec une mise en scène gastronomique',
      icon: <UtensilsCrossed className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'video-generation',
      name: 'Génération de vidéos',
      description: 'Créez des vidéos dynamiques à partir de vos images produits',
      icon: <Video className="w-6 h-6" />,
      enabled: true
    }
  ];

  const handleSelectTreatment = (treatmentId: string) => {
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: treatmentId });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'treatment' });
  };

  return (
    <div className="min-h-screen bg-gradient-fuseau">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-14 animate-fade-in">
          <div className="flex justify-center mb-8">
            <img
              src="/GROUPE_FUSEAU_V2.png"
              alt="Fuseau"
              className="h-20 md:h-24 object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/60 mb-8">
            <Sparkles className="w-4 h-4 text-fuseau-accent" />
            <span className="text-sm font-semibold text-fuseau-secondary">
              Intelligence Artificielle au service du visuel produit
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            Transformez vos images
            <br />
            <span className="text-gradient-primary">en visuels d'exception</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Créez des visuels marketing professionnels en quelques clics grâce à
            notre IA de génération d'images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {treatments.map((treatment, index) => (
            <div
              key={treatment.id}
              className={`relative animate-fade-in ${
                treatments.length % 2 !== 0 && index === treatments.length - 1
                  ? 'md:col-span-1'
                  : ''
              }`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {treatment.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-fuseau-accent text-fuseau-secondary text-xs font-bold rounded-full shadow-sm uppercase tracking-wide">
                    <Sparkles className="w-3 h-3" />
                    Recommandé
                  </span>
                </div>
              )}
              <button
                onClick={() => handleSelectTreatment(treatment.id)}
                disabled={!treatment.enabled}
                className="w-full text-left rounded-2xl p-6 border border-gray-200/80 bg-white hover:border-fuseau-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuseau-primary focus:ring-offset-2 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 text-fuseau-primary flex items-center justify-center group-hover:bg-fuseau-primary group-hover:text-white transition-colors duration-200">
                    {treatment.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-base text-gray-900 mb-1">
                      {treatment.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
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

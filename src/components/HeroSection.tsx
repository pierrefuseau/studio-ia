import React from 'react';
import { Camera, ImagePlus, Video, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { TreatmentCard } from './ui/Card';

export function HeroSection() {
  const { dispatch } = useApp();

  const treatments = [
    {
      id: 'background-removal',
      name: 'Détourage Studio',
      description: 'Packshot professionnel sur fond blanc immaculé',
      icon: <Camera className="w-6 h-6" />,
      badge: 'Rapide',
      enabled: true
    },
    {
      id: 'scene-composition',
      name: 'Mise en situation Packaging',
      description: 'Intégration de votre packaging dans un environnement réaliste et chaleureux',
      icon: <ImagePlus className="w-6 h-6" />,
      badge: 'Premium',
      enabled: true
    },
    {
      id: 'product-scene',
      name: 'Mise en situation Produit Brut',
      description: 'Intégration de produit brut dans un environnement personnalisé et professionnel',
      icon: <ImagePlus className="w-6 h-6" />,
      badge: 'Nouveau',
      enabled: true
    },
    {
      id: 'video-generation',
      name: 'Génération de vidéos',
      description: 'Créez des vidéos dynamiques à partir de vos images produits',
      icon: <Video className="w-6 h-6" />,
      badge: 'Admin',
      enabled: true
    }
  ];

  const handleSelectTreatment = (treatmentId: string) => {
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: treatmentId });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'treatment' });
  };

  return (
    <div className="min-h-screen bg-gradient-fuseau">
      <div className="container-fuseau py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-6">
            <Sparkles className="w-4 h-4 text-fuseau-accent" />
            <span className="text-sm font-semibold text-fuseau-secondary">
              Intelligence Artificielle au service du visuel produit
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            Transformez vos images
            <br />
            <span className="text-gradient-primary">en visuels d'exception</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Créez des visuels marketing professionnels en quelques clics grâce à notre IA de génération d'images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {treatments.map((treatment, index) => (
            <div
              key={treatment.id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TreatmentCard
                {...treatment}
                onClick={() => handleSelectTreatment(treatment.id)}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Connexion IA active</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4 text-fuseau-accent" />
              <span>Qualité professionnelle garantie</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </div>
  );
}

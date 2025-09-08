import React from 'react';
import { Camera, ImagePlus, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function HeroSection() {
  const { dispatch } = useApp();

  const treatments = [
    {
      id: 'background-removal',
      name: 'Détourage Studio',
      description: 'Packshot professionnel sur fond blanc',
      icon: <Camera className="w-5 h-5" />,
      badge: 'Rapide'
    },
    {
      id: 'scene-composition',
      name: 'Mise en Situation',
      description: 'Intégration dans un environnement réaliste',
      icon: <ImagePlus className="w-5 h-5" />,
      badge: 'Premium'
    },
    {
      id: 'magazine-layout',
      name: 'Page Magazine',
      description: 'Mise en page publicitaire professionnelle',
      icon: <FileText className="w-5 h-5" />,
      badge: 'Nouveau'
    }
  ];

  const handleSelectTreatment = (treatmentId: string) => {
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: treatmentId });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Titre centré et simple */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Transformez vos images produits
          </h1>
          <p className="text-gray-500 text-lg">
            Intelligence artificielle pour visuels marketing professionnels
          </p>
        </div>

        {/* Grille 2x2 simple */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {treatments.map((treatment) => (
            <button
              key={treatment.id}
              onClick={() => handleSelectTreatment(treatment.id)}
              className="group p-8 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  {treatment.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">
                      {treatment.name}
                    </h3>
                    {treatment.badge && (
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {treatment.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {treatment.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
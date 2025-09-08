import React from 'react';

export function ProcessingStatus() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">
          Traitement en cours...
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1">
        <div 
          className="bg-gray-600 h-1 rounded-full transition-all duration-300" 
          style={{width: '45%'}}
        ></div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Votre demande est en cours de traitement par l'IA
      </p>
    </div>
  );
}
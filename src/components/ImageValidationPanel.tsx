import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ImageValidationResult } from '../types';
import { Card } from './ui/Card';

interface ImageValidationPanelProps {
  validation: ImageValidationResult;
  fileName: string;
}

export function ImageValidationPanel({ validation, fileName }: ImageValidationPanelProps) {
  const { isValid, errors, warnings, suggestions } = validation;

  if (isValid && warnings.length === 0 && suggestions.length === 0) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-1">Image validée</h4>
            <p className="text-sm text-green-700">
              {fileName} est prête pour le traitement
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      {/* Titre */}
      <div className="flex items-center gap-2">
        {!isValid ? (
          <AlertCircle className="w-5 h-5 text-red-600" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
        )}
        <h4 className="font-medium text-gray-900">
          {!isValid ? 'Validation échouée' : 'Avertissements'}
        </h4>
      </div>

      {/* Nom du fichier */}
      <p className="text-sm text-gray-600">{fileName}</p>

      {/* Erreurs */}
      {errors.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-red-900">Erreurs :</h5>
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-red-900">{error.message}</p>
                {error.value !== undefined && error.limit !== undefined && (
                  <p className="text-xs text-red-700 mt-1">
                    Valeur actuelle: {error.value.toFixed(2)} / Limite: {error.limit}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Avertissements */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-yellow-900">Avertissements :</h5>
          {warnings.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-yellow-900">{warning.message}</p>
                {warning.value !== undefined && warning.recommended !== undefined && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Valeur actuelle: {warning.value.toFixed(2)} / Recommandé: {warning.recommended}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-blue-900">Suggestions :</h5>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">{suggestion}</p>
            </div>
          ))}
        </div>
      )}

      {/* Message final */}
      {!isValid && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            Veuillez corriger les erreurs avant de continuer le traitement.
          </p>
        </div>
      )}
    </Card>
  );
}

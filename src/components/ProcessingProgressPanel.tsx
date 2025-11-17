import React, { useEffect, useState } from 'react';
import { Loader, CheckCircle, XCircle, Upload, Eye, Cpu, Sparkles, Clock } from 'lucide-react';
import { ProcessingProgress } from '../types';
import { Card } from './ui/Card';

interface ProcessingProgressPanelProps {
  progress: ProcessingProgress;
}

export function ProcessingProgressPanel({ progress }: ProcessingProgressPanelProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStepIcon = (step: ProcessingProgress['status']) => {
    switch (step) {
      case 'queued':
        return <Clock className="w-5 h-5" />;
      case 'uploading':
        return <Upload className="w-5 h-5" />;
      case 'analyzing':
        return <Eye className="w-5 h-5" />;
      case 'processing':
        return <Cpu className="w-5 h-5" />;
      case 'rendering':
        return <Sparkles className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'failed':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Loader className="w-5 h-5" />;
    }
  };

  const getStepLabel = (step: ProcessingProgress['status']) => {
    switch (step) {
      case 'queued':
        return 'En file d\'attente';
      case 'uploading':
        return 'Upload en cours';
      case 'analyzing':
        return 'Analyse de l\'image';
      case 'processing':
        return 'Traitement en cours';
      case 'rendering':
        return 'Génération du résultat';
      case 'completed':
        return 'Traitement terminé';
      case 'failed':
        return 'Échec du traitement';
      default:
        return step;
    }
  };

  const getStatusColor = (step: ProcessingProgress['status']) => {
    switch (step) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const steps: Array<{ key: ProcessingProgress['status']; label: string }> = [
    { key: 'queued', label: 'File d\'attente' },
    { key: 'uploading', label: 'Upload' },
    { key: 'analyzing', label: 'Analyse' },
    { key: 'processing', label: 'Traitement' },
    { key: 'rendering', label: 'Rendu' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === progress.status);

  return (
    <Card className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getStatusColor(progress.status)}`}>
            {getStepIcon(progress.status)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{getStepLabel(progress.status)}</h3>
            {progress.message && (
              <p className="text-sm text-gray-600">{progress.message}</p>
            )}
          </div>
        </div>

        {progress.status !== 'completed' && progress.status !== 'failed' && (
          <Loader className="w-5 h-5 text-blue-600 animate-spin" />
        )}
      </div>

      {/* Barre de progression */}
      {progress.status !== 'completed' && progress.status !== 'failed' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="font-medium text-gray-900">{progress.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Étapes */}
      {progress.status !== 'completed' && progress.status !== 'failed' && (
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isCurrent ? 'bg-blue-50' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isCurrent
                      ? 'font-medium text-gray-900'
                      : isCompleted
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Info temporelles */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm">
          <span className="text-gray-500">Temps écoulé: </span>
          <span className="font-medium text-gray-900">{formatTime(elapsedTime)}</span>
        </div>
        {progress.estimatedTimeRemaining !== undefined && progress.status !== 'completed' && (
          <div className="text-sm">
            <span className="text-gray-500">Temps restant: </span>
            <span className="font-medium text-gray-900">
              ~{formatTime(progress.estimatedTimeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Message de statut */}
      {progress.status === 'completed' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-900 font-medium">
              Traitement terminé avec succès !
            </p>
          </div>
        </div>
      )}

      {progress.status === 'failed' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-red-900 font-medium">Échec du traitement</p>
              {progress.message && (
                <p className="text-xs text-red-700 mt-1">{progress.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

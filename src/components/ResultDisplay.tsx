import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Maximize2, X, ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { WebhookResponse } from '../services/webhookService';
import { removeChromaKey } from '../utils/chromaKey';

interface ResultDisplayProps {
  result: WebhookResponse | null;
  isLoading: boolean;
  onRegenerate: () => void;
}

const TREATMENT_LABELS: Record<string, string> = {
  'background-removal': 'Détourage Studio',
  'scene-composition': 'Mise en situation Packaging',
  'product-scene': 'Produit Brut',
  'chef-recipe': 'Recettes du Chef',
};

const CHECKERBOARD_STYLE: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  backgroundColor: '#f3f4f6',
};

function downloadBase64Image(base64: string, mimeType: string, fileName: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getDownloadInfo(result: WebhookResponse, processedBase64: string | null) {
  const isTransparent = result.transparentRequested && processedBase64;
  const base64 = isTransparent ? processedBase64 : result.imageBase64!;
  const mime = 'image/png';

  let fileName = result.fileName || 'image.png';
  if (isTransparent && !fileName.includes('_transparent')) {
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex > 0) {
      fileName = fileName.slice(0, dotIndex) + '_transparent.png';
    } else {
      fileName = fileName + '_transparent.png';
    }
  }

  return { base64, mime, fileName };
}

export function ResultDisplay({ result, isLoading, onRegenerate }: ResultDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [processedBase64, setProcessedBase64] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    setProcessedBase64(null);
    setIsConverting(false);

    if (!result?.success || !result.transparentRequested || !result.imageBase64) return;

    let cancelled = false;
    setIsConverting(true);

    removeChromaKey(result.imageBase64, result.chromaKeyColor || '#FF00FF')
      .then((converted) => {
        if (!cancelled) {
          setProcessedBase64(converted);
          setIsConverting(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProcessedBase64(null);
          setIsConverting(false);
        }
      });

    return () => { cancelled = true; };
  }, [result]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center gap-5 min-h-[280px] shadow-sm"
      >
        <div className="relative flex items-center justify-center w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-fuseau-accent/20"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border-4 border-fuseau-accent/10"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          />
          <Loader2 className="w-7 h-7 text-fuseau-accent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">Génération en cours...</p>
          <p className="text-xs text-gray-500 mt-1">Cela peut prendre jusqu'à 60 secondes</p>
        </div>
        <div className="w-full max-w-[220px] h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full w-1/2 bg-gradient-to-r from-fuseau-accent to-fuseau-primary rounded-full"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-8 flex flex-col items-center justify-center gap-3 min-h-[280px]">
        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-sm text-gray-400 font-medium text-center">
          Votre image générée apparaîtra ici
        </p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-red-200 bg-red-50 p-5 flex flex-col gap-4 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-800">Erreur de génération</p>
            <p className="text-xs text-red-600 mt-1 break-words leading-relaxed">
              {result.error || "Une erreur inattendue s'est produite"}
            </p>
          </div>
        </div>
        <button
          onClick={onRegenerate}
          className="self-start flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Réessayer
        </button>
      </motion.div>
    );
  }

  if (isConverting) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center gap-4 min-h-[200px] shadow-sm"
      >
        <Loader2 className="w-6 h-6 text-fuseau-accent animate-spin" />
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">Conversion en cours...</p>
          <p className="text-xs text-gray-500 mt-1">Suppression du fond magenta</p>
        </div>
      </motion.div>
    );
  }

  const isTransparent = result.transparentRequested && processedBase64;
  const displayBase64 = isTransparent ? processedBase64 : result.imageBase64;
  const displayMime = isTransparent ? 'image/png' : result.mimeType;
  const imageSrc = `data:${displayMime};base64,${displayBase64}`;

  const treatmentLabel = result.treatmentType
    ? (TREATMENT_LABELS[result.treatmentType] ?? result.treatmentType)
    : null;

  const dlInfo = getDownloadInfo(result, processedBase64);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm"
      >
        <div className="relative group">
          <div style={isTransparent ? CHECKERBOARD_STYLE : { backgroundColor: '#f9fafb' }}>
            <motion.img
              initial={isTransparent ? { opacity: 0 } : undefined}
              animate={isTransparent ? { opacity: 1 } : undefined}
              transition={isTransparent ? { duration: 0.3 } : undefined}
              src={imageSrc}
              alt={result.fileName || 'Image générée'}
              className="w-full object-contain min-h-[400px] max-h-[600px]"
            />
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-3 right-3 p-2 bg-white/90 border border-gray-200 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            title="Plein écran"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          {isTransparent && (
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 border border-gray-200 rounded-md text-[10px] font-semibold text-gray-600 uppercase tracking-wide shadow-sm">
              Transparent
            </span>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              {result.fileName && (
                <p className="text-xs font-semibold text-gray-800 truncate">{dlInfo.fileName}</p>
              )}
              {treatmentLabel && (
                <p className="text-[11px] text-gray-400 mt-0.5">{treatmentLabel}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Régénérer
              </button>
              <button
                onClick={() => downloadBase64Image(dlInfo.base64, dlInfo.mime, dlInfo.fileName)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-fuseau-primary hover:bg-fuseau-primary/90 text-white text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-xl overflow-hidden shadow-2xl"
                style={isTransparent ? CHECKERBOARD_STYLE : undefined}
              >
                <img
                  src={imageSrc}
                  alt={result.fileName || 'Image générée'}
                  className="max-w-[90vw] max-h-[88vh] object-contain"
                />
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                {result.fileName && (
                  <p className="text-white/60 text-xs truncate max-w-[55%]">{dlInfo.fileName}</p>
                )}
                <button
                  onClick={() => downloadBase64Image(dlInfo.base64, dlInfo.mime, dlInfo.fileName)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors ml-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from './ui/Toast';
import { webhookService, WebhookResponse } from '../services/webhookService';
import { ResultDisplay } from './ResultDisplay';

interface UploadedFile {
  file: File;
  id: string;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export function UploadZone() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentMode, setCurrentMode] = useState<'none' | 'single' | 'batch'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<WebhookResponse | null>(null);

  const MAX_FILES = 50;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const getMaxFiles = () => {
    if (state.selectedTreatmentType === 'scene-composition') {
      return 1;
    }
    return MAX_FILES;
  };

  const handleFiles = useCallback((files: File[]) => {
    console.log("📦 Fichiers reçus dans handleFiles :", files.length);

    const maxFiles = getMaxFiles();

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        addToast({
          type: 'error',
          title: 'Format invalide',
          description: `${file.name} n'est pas une image`
        });
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        addToast({
          type: 'error',
          title: 'Fichier trop volumineux',
          description: `${file.name} dépasse 10MB`
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (validFiles.length > maxFiles) {
      validFiles.splice(maxFiles);
      addToast({
        type: 'warning',
        title: 'Limite atteinte',
        description: state.selectedTreatmentType === 'scene-composition'
          ? 'Une seule image autorisée pour la mise en situation'
          : `Maximum ${maxFiles} images autorisées`
      });
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    console.log("✅ Fichiers validés :", newFiles.length);
    setUploadedFiles(newFiles);
    setCurrentMode(newFiles.length === 1 ? 'single' : 'batch');
    setResult(null);

    if (newFiles.length > 0) {
      dispatch({ type: 'CLEAR_PRODUCTS' });

      dispatch({
        type: 'ADD_PRODUCTS',
        payload: newFiles.map(f => ({
          id: Date.now().toString() + f.id,
          file: f.file,
          preview: f.preview
        }))
      });
    }
  }, [addToast, dispatch, state.selectedTreatmentType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      console.log("🎯 onDrop - Fichiers acceptés :", acceptedFiles.length);
      if (acceptedFiles.length > 0) {
        handleFiles(acceptedFiles);
      }
    },
    multiple: state.selectedTreatmentType !== 'scene-composition',
    accept: {
      'image/*': []
    },
    maxFiles: getMaxFiles(),
    maxSize: MAX_FILE_SIZE
  });

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id);
      if (newFiles.length === 0) {
        setCurrentMode('none');
        setResult(null);
        dispatch({ type: 'CLEAR_PRODUCTS' });
      } else {
        setCurrentMode(newFiles.length === 1 ? 'single' : 'batch');
        dispatch({ type: 'REMOVE_PRODUCT', payload: id });
      }
      return newFiles;
    });
  }, [dispatch]);

  const processImages = useCallback(async () => {
    if (isProcessing || state.products.length === 0) return;

    if (state.selectedTreatmentType === 'scene-composition' || state.selectedTreatmentType === 'product-scene') {
      const productName = state.product?.name || state.products[0]?.name || state.selectedProduct?.name;
      const productDescription = state.product?.description || state.products[0]?.description || state.selectedProduct?.description;

      if (!productName?.trim()) {
        addToast({
          type: 'error',
          title: 'Nom requis',
          description: 'Le nom du produit est obligatoire pour la mise en situation'
        });
        return;
      }

      if (state.selectedTreatmentType === 'scene-composition' && !productDescription?.trim()) {
        addToast({
          type: 'error',
          title: 'Description requise',
          description: 'La description est obligatoire pour la mise en situation packaging'
        });
        return;
      }
    }

    console.log('🎬 === DÉBUT TRAITEMENT IMAGES ===');

    setIsProcessing(true);
    setResult(null);
    setProgress({ current: 0, total: state.products.length });

    try {
      const allFiles = state.products.map(product => product.file);

      state.products.forEach(product => {
        dispatch({
          type: 'UPDATE_PRODUCT',
          payload: { id: product.id, updates: { status: 'processing' } }
        });
      });

      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));

      const webhookResult = await webhookService.sendTreatmentRequest({
        treatmentType: state.selectedTreatmentType || 'background-removal',
        treatmentDisplayName: state.products.length === 1 ? 'Traitement Simple' : 'Traitement Batch',
        backgroundOption: (state.product as any)?.backgroundOption || 'white',
        productData: {
          name: state.product?.name || state.selectedProduct?.name || `Batch ${state.products.length} images`,
          description: state.product?.description || state.selectedProduct?.description || 'Traitement par lot',
          imageFiles: allFiles,
          originalFileName: allFiles[0]?.name
        },
        timestamp: new Date().toISOString(),
        sessionId: 'session-' + Date.now()
      });

      setResult(webhookResult);

      if (webhookResult.success) {
        state.products.forEach(product => {
          dispatch({
            type: 'UPDATE_PRODUCT',
            payload: { id: product.id, updates: { status: 'completed' } }
          });
        });

        setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'completed' })));

        addToast({
          type: 'success',
          title: 'Image générée',
          description: 'Votre image est prête au téléchargement'
        });
      } else {
        state.products.forEach(product => {
          dispatch({
            type: 'UPDATE_PRODUCT',
            payload: { id: product.id, updates: { status: 'error' } }
          });
        });

        setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
      }

      setProgress({ current: state.products.length, total: state.products.length });

    } catch (error) {
      console.error('💥 Erreur de traitement:', error);

      const errResult: WebhookResponse = {
        success: false,
        error: 'Une erreur inattendue s\'est produite'
      };
      setResult(errResult);

      state.products.forEach(product => {
        dispatch({
          type: 'UPDATE_PRODUCT',
          payload: { id: product.id, updates: { status: 'error' } }
        });
      });

      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
    } finally {
      setIsProcessing(false);
      console.log('🏁 === FIN TRAITEMENT ===');
    }
  }, [isProcessing, state, addToast, dispatch]);

  const resetAll = useCallback(() => {
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setUploadedFiles([]);
    setCurrentMode('none');
    setIsProcessing(false);
    setProgress({ current: 0, total: 0 });
    setResult(null);
    dispatch({ type: 'CLEAR_PRODUCTS' });
  }, [uploadedFiles, dispatch]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 mb-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
          Télécharger des images
        </h3>

        <div
          {...getRootProps()}
          className={`rounded-xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 relative flex items-center justify-center
            p-4 sm:p-6 lg:p-9
            min-h-[120px] sm:min-h-[180px] lg:min-h-[220px]
            ${uploadedFiles.length > 0 ? 'min-h-[80px] sm:min-h-[120px] p-3 sm:p-4' : ''}
            ${isDragActive
              ? 'border-fuseau-primary bg-fuseau-primary/[0.04] shadow-[0_0_0_3px_rgba(15,29,61,0.08)]'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-fuseau-primary'
            }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-2.5">
            <div className={`transition-all duration-200 ${isDragActive ? 'text-fuseau-primary -translate-y-1' : 'text-gray-300'}`}>
              <Upload className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16" strokeWidth={1} />
            </div>

            <p className="text-sm sm:text-[15px] font-medium text-gray-600">
              {isDragActive
                ? (state.selectedTreatmentType === 'scene-composition' ? 'Déposez votre image ici' : 'Déposez vos images ici')
                : (state.selectedTreatmentType === 'scene-composition' ? 'Glissez-déposez votre image ici' : 'Glissez-déposez vos images ici')
              }
            </p>

            <p className="text-xs sm:text-[13px] text-gray-500">ou cliquez pour parcourir</p>

            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-1">
              <span className="text-[10px] sm:text-[11px] text-gray-500">JPG, PNG, WEBP &bull; Max 10 Mo</span>
              <span className="text-[10px] sm:text-[11px] text-fuseau-accent">
                &bull; {state.selectedTreatmentType === 'scene-composition' ? 'Une seule image' : 'Jusqu\'à 50 images'}
              </span>
            </div>
          </div>

          {currentMode !== 'none' && (
            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-fuseau-primary text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
              {currentMode === 'single' ? '1 IMAGE' : `${uploadedFiles.length} IMAGES`}
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && currentMode === 'single' && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg mb-1.5 last:mb-0">
                <span className="text-[13px] text-gray-600 flex-1 truncate">{file.file.name}</span>
                <span className="text-[11px] text-gray-500 mx-3 shrink-0">{formatFileSize(file.file.size)}</span>
                <button
                  className="text-gray-400 p-1 opacity-70 hover:opacity-100 hover:text-gray-600 hover:scale-110 transition-all touch:opacity-100"
                  onClick={() => removeFile(file.id)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentMode === 'batch' && (
        <div className="mb-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
              <span>Images à traiter</span>
              <span className="text-xs font-medium text-gray-500">{uploadedFiles.length} fichiers</span>
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5 max-h-[280px] overflow-y-auto p-1 scrollbar-thin">
              {uploadedFiles.map((file, index) => (
                <div
                  key={file.id}
                  className={`group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent transition-all duration-150 cursor-pointer hover:border-fuseau-primary hover:scale-[1.03]
                    ${file.status === 'processing' ? 'opacity-50' : ''}
                    ${file.status === 'completed' ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}
                  `}
                >
                  <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-fuseau-primary text-white w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold">
                    {index + 1}
                  </span>
                  <button
                    className="absolute top-1 right-1 bg-gray-700/80 backdrop-blur-sm text-white w-[18px] h-[18px] rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(file.id)}
                  >
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm mb-4">
          <div className="space-y-2">
            <button
              onClick={processImages}
              disabled={isProcessing || state.products.length === 0}
              className="w-full rounded-lg bg-fuseau-accent py-2.5 text-[13px] font-semibold text-white tracking-wide transition-all duration-150 hover:bg-fuseau-accent-dark hover:-translate-y-px hover:shadow-lg hover:shadow-fuseau-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isProcessing ? 'Génération en cours...' : `Générer ${state.products.length} image(s)`}
            </button>

            <button
              onClick={resetAll}
              disabled={isProcessing}
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2.5 text-[13px] font-semibold text-gray-500 tracking-wide transition-all duration-150 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Réinitialiser
            </button>
          </div>

          {isProcessing && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                <span>Génération en cours...</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fuseau-primary to-fuseau-accent rounded-full transition-all duration-300 relative after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:animate-[shimmer_2s_infinite]"
                  style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <ResultDisplay
        result={result}
        isLoading={isProcessing}
        onRegenerate={processImages}
      />
    </div>
  );
}

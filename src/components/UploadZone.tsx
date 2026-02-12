import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from './ui/Toast';
import { webhookService } from '../services/webhookService';

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

  const MAX_FILES = 50;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Limite selon le type de traitement
  const getMaxFiles = () => {
    if (state.selectedTreatmentType === 'scene-composition') {
      return 1; // Une seule image pour la mise en situation
    }
    return MAX_FILES;
  };

  const handleFiles = useCallback((files: File[]) => {
    console.log("📦 Fichiers reçus dans handleFiles :", files.length);
    
    const maxFiles = getMaxFiles();
    
    // Validation des fichiers
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

    // Limite du nombre de fichiers selon le traitement
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

    // Créer les objets UploadedFile
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    console.log("✅ Fichiers validés :", newFiles.length);
    setUploadedFiles(newFiles);
    setCurrentMode(newFiles.length === 1 ? 'single' : 'batch');

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
  }, [addToast, dispatch]);

  // Configuration react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      console.log("🎯 onDrop - Fichiers acceptés :", acceptedFiles.length);
      if (acceptedFiles.length > 0) {
        handleFiles(acceptedFiles); // ✅ envoie TOUS les fichiers
      }
    },
    multiple: state.selectedTreatmentType !== 'scene-composition', // Une seule image pour mise en situation
    accept: {
      'image/*': [] // ✅ limite aux images
    },
    maxFiles: getMaxFiles(),
    maxSize: MAX_FILE_SIZE
  });

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id);
      if (newFiles.length === 0) {
        setCurrentMode('none');
        dispatch({ type: 'CLEAR_PRODUCTS' });
      } else {
        setCurrentMode(newFiles.length === 1 ? 'single' : 'batch');
        // Supprimer le fichier du state global
        dispatch({ type: 'REMOVE_PRODUCT', payload: id });
      }
      return newFiles;
    });
  }, [dispatch]);

  const processImages = useCallback(async () => {
    if (isProcessing || state.products.length === 0) return;

    // Validation spécifique pour les mises en situation
    if (state.selectedTreatmentType === 'scene-composition' || state.selectedTreatmentType === 'product-scene') {
      const productName = state.product?.name || state.products[0]?.name || state.selectedProduct?.name;
      const productDescription = state.product?.description || state.products[0]?.description || state.selectedProduct?.description;
      
      console.log('🔍 Validation mise en situation:', {
        productName,
        productDescription,
        stateProduct: state.product,
        firstProduct: state.products[0],
        selectedProduct: state.selectedProduct
      });
      
      if (!productName?.trim()) {
        addToast({
          type: 'error',
          title: 'Nom requis',
          description: 'Le nom du produit est obligatoire pour la mise en situation'
        });
        return;
      }
      
      // Description obligatoire seulement pour scene-composition (packaging)
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
    console.log('📊 État initial:', {
      nombreFichiers: state.products.length,
      fichiers: state.products.map(p => ({ name: p.file.name, size: p.file.size })),
      produitSélectionné: state.selectedProduct?.name || 'Aucun sélectionné',
      traitement: state.selectedTreatmentType
    });

    setIsProcessing(true);
    setProgress({ current: 0, total: state.products.length });

    try {
      console.log('📦 Préparation des fichiers...');
      
      // ✅ Récupérer tous les fichiers depuis state.products
      const allFiles = state.products.map(product => product.file);
      
      // ✅ Mettre à jour le statut de tous les produits
      state.products.forEach(product => {
        dispatch({
          type: 'UPDATE_PRODUCT',
          payload: { id: product.id, updates: { status: 'processing' } }
        });
      });
      
      // Synchroniser avec uploadedFiles local
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));

      const success = await webhookService.sendTreatmentRequest({
        treatmentType: state.selectedTreatmentType || 'background-removal',
        treatmentDisplayName: state.products.length === 1 ? 'Traitement Simple' : 'Traitement Batch',
        productData: {
          name: state.product?.name || state.selectedProduct?.name || `Batch ${state.products.length} images`,
          description: state.product?.description || state.selectedProduct?.description || 'Traitement par lot',
          imageFiles: allFiles, // ✅ Envoyer TOUS les fichiers
          originalFileName: allFiles[0]?.name
        },
        timestamp: new Date().toISOString(),
        sessionId: 'session-' + Date.now()
      });

      if (success) {
        // ✅ Mettre à jour le statut de tous les produits
        state.products.forEach(product => {
          dispatch({
            type: 'UPDATE_PRODUCT',
            payload: { id: product.id, updates: { status: 'completed' } }
          });
        });
        
        // Synchroniser avec uploadedFiles local
        setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'completed' })));
        
        addToast({
          type: 'success',
          title: 'Images traitées',
          description: `${state.products.length} image(s) envoyée(s) pour traitement`
        });
      } else {
        throw new Error('Échec du traitement');
      }

      setProgress({ current: state.products.length, total: state.products.length });
      
    } catch (error) {
      console.error('💥 Erreur de traitement:', error);
      
      // ✅ Mettre à jour le statut d'erreur pour tous les produits
      state.products.forEach(product => {
        dispatch({
          type: 'UPDATE_PRODUCT',
          payload: { id: product.id, updates: { status: 'error' } }
        });
      });
      
      // Synchroniser avec uploadedFiles local
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
      
      addToast({
        type: 'error',
        title: 'Erreur de traitement',
        description: 'Impossible de traiter les images'
      });
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
    <div className="upload-container">
      {/* Card principale */}
      <div className="upload-card">
        <h3 className="card-header">Télécharger des images</h3>
        
        <div 
          {...getRootProps()}
          className={`drop-zone ${isDragActive ? 'drag-over' : ''} ${uploadedFiles.length > 0 ? 'has-files' : ''}`}
        >
          <input {...getInputProps()} />
          
          {/* Zone de contenu central */}
          <div className="drop-content">
            {/* Icône upload */}
            <div className="drop-icon">
              <Upload size={64} strokeWidth={1} />
            </div>
            
            {/* Texte principal */}
            <p className="drop-title">
              {isDragActive 
                ? (state.selectedTreatmentType === 'scene-composition' ? 'Déposez votre image ici' : 'Déposez vos images ici')
                : (state.selectedTreatmentType === 'scene-composition' ? 'Glissez-déposez votre image ici' : 'Glissez-déposez vos images ici')
              }
            </p>
            
            {/* Texte secondaire */}
            <p className="drop-subtitle">ou cliquez pour parcourir</p>
            
            {/* Info formats */}
            <div className="drop-formats">
              <span className="format-text">JPG, PNG, WEBP • Max 10 Mo</span>
              <span className="batch-text">
                • {state.selectedTreatmentType === 'scene-composition' ? 'Une seule image' : 'Jusqu\'à 50 images'}
              </span>
            </div>
          </div>
          
          {/* Badge de mode */}
          {currentMode !== 'none' && (
            <div className="mode-badge">
              <span className="badge-text">
                {currentMode === 'single' ? '1 IMAGE' : `${uploadedFiles.length} IMAGES`}
              </span>
            </div>
          )}
        </div>
        
        {/* Liste des fichiers */}
        {uploadedFiles.length > 0 && currentMode === 'single' && (
          <div className="files-list">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-item">
                <span className="file-name">{file.file.name}</span>
                <span className="file-size">{formatFileSize(file.file.size)}</span>
                <button className="file-remove" onClick={() => removeFile(file.id)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Grille pour mode batch */}
      {currentMode === 'batch' && (
        <div className="batch-grid">
          <div className="batch-card">
            <h3 className="card-header">
              <span>Images à traiter</span>
              <span className="batch-count">{uploadedFiles.length} fichiers</span>
            </h3>
            <div className="batch-items">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={file.id} 
                  className={`batch-item ${file.status === 'processing' ? 'processing' : ''} ${file.status === 'completed' ? 'completed' : ''}`}
                >
                  <img src={file.preview} alt={file.file.name} />
                  <span className="batch-item-number">{index + 1}</span>
                  <button 
                    className="batch-item-remove" 
                    onClick={() => removeFile(file.id)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {uploadedFiles.length > 0 && (
        <div className="upload-card">
          <div className="space-y-3">
            <button 
              onClick={processImages}
              disabled={isProcessing || state.products.length === 0}
              className="btn-generate"
            >
              {isProcessing ? 'Traitement...' : `Traiter ${state.products.length} image(s)`}
            </button>
            
            <button 
              onClick={resetAll}
              className="btn-reset"
            >
              Réinitialiser
            </button>
          </div>

          {/* Progress bar */}
          {isProcessing && (
            <div className="batch-progress">
              <div className="progress-info">
                <span>Traitement en cours...</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .upload-container {
          --primary-color: #C8102E;
          --primary-light: rgba(200, 16, 46, 0.12);
          --accent-color: #E88C30;
          --text-primary: #111827;
          --text-secondary: #4B5563;
          --text-muted: #6B7280;
          --border-color: #E5E7EB;
          --bg-card: #FFFFFF;
          width: 100%;
        }

        .upload-card,
        .preview-card,
        .batch-card,
        .actions-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(15, 29, 61, 0.06);
        }

        .card-header {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drop-zone {
          background: #F9FAFB;
          border: 2px dashed #D1D5DB;
          border-radius: 10px;
          padding: 36px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drop-zone:hover {
          background: #F3F4F6;
          border-color: var(--primary-color);
        }

        .drop-zone.drag-over {
          background: rgba(200, 16, 46, 0.04);
          border-color: var(--primary-color);
          border-style: solid;
          box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.08);
        }

        .drop-zone.has-files {
          min-height: 120px;
          padding: 16px;
        }

        .drop-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .drop-icon {
          color: #D1D5DB;
          transition: all 0.2s ease;
        }

        .drop-zone:hover .drop-icon {
          color: var(--primary-color);
          transform: translateY(-3px);
        }

        .drop-title {
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 500;
          margin: 0;
        }

        .drop-subtitle {
          color: var(--text-muted);
          font-size: 13px;
          margin: 0;
        }

        .drop-formats {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }

        .format-text,
        .batch-text {
          color: var(--text-muted);
          font-size: 11px;
        }

        .batch-text {
          color: var(--accent-color);
        }

        .mode-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: var(--primary-color);
          color: white;
          padding: 3px 10px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .files-list {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #F9FAFB;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          margin-bottom: 6px;
        }

        .file-name {
          color: var(--text-secondary);
          font-size: 13px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          color: var(--text-muted);
          font-size: 11px;
          margin: 0 12px;
        }

        .file-remove {
          background: transparent;
          border: none;
          color: #EF4444;
          cursor: pointer;
          padding: 4px;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
        }

        .file-remove:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .preview-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 20px;
          align-items: center;
          padding: 20px 0;
        }

        .preview-original,
        .preview-result {
          position: relative;
        }

        .preview-label {
          position: absolute;
          top: -22px;
          left: 0;
          color: var(--text-muted);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .preview-original img,
        .preview-result img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .preview-arrow {
          color: var(--primary-color);
          font-size: 20px;
          opacity: 0.5;
        }

        .result-placeholder {
          width: 100%;
          aspect-ratio: 1;
          background: #F9FAFB;
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .batch-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 10px;
          max-height: 280px;
          overflow-y: auto;
          padding: 4px;
        }

        .batch-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: #F3F4F6;
          border: 2px solid transparent;
          transition: all 0.15s ease;
          cursor: pointer;
        }

        .batch-item:hover {
          border-color: var(--primary-color);
          transform: scale(1.03);
        }

        .batch-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .batch-item-number {
          position: absolute;
          top: 4px;
          left: 4px;
          background: var(--primary-color);
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
        }

        .batch-item-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #EF4444;
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        .batch-item:hover .batch-item-remove {
          display: flex;
        }

        .batch-item.processing {
          opacity: 0.5;
        }

        .batch-item.completed::after {
          content: '';
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: #059669;
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        .btn-generate,
        .btn-reset {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.02em;
        }

        .btn-generate {
          background: var(--primary-color);
          color: white;
          margin-bottom: 8px;
        }

        .btn-generate:hover:not(:disabled) {
          background: #A00D25;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(200, 16, 46, 0.2);
        }

        .btn-generate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-reset {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }

        .btn-reset:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
          color: var(--text-secondary);
        }

        .batch-progress {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          color: var(--text-muted);
          font-size: 11px;
          margin-bottom: 6px;
        }

        .progress-bar {
          height: 4px;
          background: #E5E7EB;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
          border-radius: 2px;
          transition: width 0.3s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .loading-spinner {
          width: 28px;
          height: 28px;
          border: 2px solid #E5E7EB;
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .batch-items::-webkit-scrollbar,
        .files-list::-webkit-scrollbar {
          width: 4px;
        }

        .batch-items::-webkit-scrollbar-track,
        .files-list::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 2px;
        }

        .batch-items::-webkit-scrollbar-thumb,
        .files-list::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 2px;
        }

        .batch-items::-webkit-scrollbar-thumb:hover,
        .files-list::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }

        @media (max-width: 768px) {
          .drop-zone {
            padding: 24px 16px;
          }

          .preview-content {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .preview-arrow {
            transform: rotate(90deg);
            text-align: center;
          }

          .batch-items {
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
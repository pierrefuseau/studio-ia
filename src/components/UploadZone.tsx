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

  const handleFiles = useCallback((files: File[]) => {
    console.log("📦 Fichiers reçus dans handleFiles :", files.length);
    
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

    // Limite du nombre de fichiers
    if (validFiles.length > MAX_FILES) {
      validFiles.splice(MAX_FILES);
      addToast({
        type: 'warning',
        title: 'Limite atteinte',
        description: `Maximum ${MAX_FILES} images autorisées`
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

    // Ajouter tous les fichiers au state global
    if (newFiles.length > 0) {
      // Vider d'abord les produits existants
      dispatch({ type: 'CLEAR_PRODUCTS' });
      
      // Ajouter tous les nouveaux fichiers
      dispatch({ type: 'ADD_PRODUCTS', payload: newFiles });
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
    multiple: true, // ✅ autoriser plusieurs fichiers
    accept: {
      'image/*': [] // ✅ limite aux images
    },
    maxFiles: MAX_FILES,
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
    if (isProcessing || uploadedFiles.length === 0) return;

    console.log('🎬 === DÉBUT TRAITEMENT IMAGES ===');
    console.log('📊 État initial:', {
      nombreFichiers: uploadedFiles.length,
      fichiers: uploadedFiles.map(f => ({ name: f.file.name, size: f.file.size })),
      produit: state.product?.name || 'Pas de nom',
      traitement: state.selectedTreatmentType
    });

    setIsProcessing(true);
    setProgress({ current: 0, total: uploadedFiles.length });

    try {
      console.log('📦 Préparation des fichiers...');
      
      // Toujours envoyer tous les fichiers en une seule fois
      const allFiles = uploadedFiles.map(f => f.file);
      
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));

      const success = await webhookService.sendTreatmentRequest({
        treatmentType: state.selectedTreatmentType || 'background-removal',
        treatmentDisplayName: currentMode === 'single' ? 'Traitement Simple' : 'Traitement Batch',
        productData: {
          name: state.product?.name,
          description: state.product?.description,
          imageFiles: allFiles, // ✅ Envoyer TOUS les fichiers
          originalFileName: allFiles[0]?.name
        },
        timestamp: new Date().toISOString(),
        sessionId: 'session-' + Date.now()
      });

      if (success) {
        setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'completed' })));
        addToast({
          type: 'success',
          title: 'Images traitées',
          description: `${uploadedFiles.length} image(s) envoyée(s) pour traitement`
        });
      } else {
        throw new Error('Échec du traitement');
      }

      setProgress({ current: uploadedFiles.length, total: uploadedFiles.length });
      
    } catch (error) {
      console.error('💥 Erreur de traitement:', error);
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
  }, [isProcessing, uploadedFiles, currentMode, state, addToast]);

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
              {isDragActive ? 'Déposez vos images ici' : 'Glissez-déposez vos images ici'}
            </p>
            
            {/* Texte secondaire */}
            <p className="drop-subtitle">ou cliquez pour parcourir</p>
            
            {/* Info formats */}
            <div className="drop-formats">
              <span className="format-text">JPG, PNG, WEBP • Max 10 Mo</span>
              <span className="batch-text">• Jusqu'à 50 images</span>
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
      
      {/* Zone de preview pour mode simple */}
      {currentMode === 'single' && (
        <div className="preview-single">
          <div className="preview-card">
            <h3 className="card-header">Aperçu</h3>
            <div className="preview-content">
              <div className="preview-original">
                <span className="preview-label">Original</span>
                <img src={uploadedFiles[0]?.preview} alt="Original" />
              </div>
              <div className="preview-arrow">→</div>
              <div className="preview-result">
                <span className="preview-label">Après traitement</span>
                <div className="result-placeholder">
                  {isProcessing ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <span>En attente...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              disabled={isProcessing}
              className="btn-generate"
            >
              {isProcessing ? 'Traitement...' : `Traiter ${uploadedFiles.length} image(s)`}
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
        /* Variables du thème actuel */
        .upload-container {
          --bg-dark: #0F0F1A;
          --card-bg: rgba(160, 82, 45, 0.15);
          --card-border: rgba(160, 82, 45, 0.3);
          --primary-color: #A0522D;
          --primary-light: rgba(160, 82, 45, 0.4);
          --text-primary: #FFFFFF;
          --text-secondary: rgba(255, 255, 255, 0.7);
          --text-muted: rgba(255, 255, 255, 0.5);
          width: 100%;
        }

        /* Cards style actuel */
        .upload-card,
        .preview-card,
        .batch-card,
        .actions-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .card-header {
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(160, 82, 45, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Zone de drop exacte comme sur le site */
        .drop-zone {
          background: linear-gradient(135deg, 
            rgba(196, 164, 132, 0.15) 0%, 
            rgba(160, 82, 45, 0.25) 100%);
          border: 2px dashed var(--primary-light);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drop-zone:hover {
          background: linear-gradient(135deg, 
            rgba(196, 164, 132, 0.25) 0%, 
            rgba(160, 82, 45, 0.35) 100%);
          border-color: var(--primary-color);
          transform: scale(1.01);
        }

        .drop-zone.drag-over {
          background: linear-gradient(135deg, 
            rgba(196, 164, 132, 0.35) 0%, 
            rgba(160, 82, 45, 0.45) 100%);
          border-color: #D2691E;
          border-style: solid;
          box-shadow: 0 0 30px rgba(160, 82, 45, 0.3);
        }

        .drop-zone.has-files {
          min-height: 150px;
          padding: 20px;
        }

        /* Contenu de la zone de drop */
        .drop-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .drop-icon {
          color: var(--primary-light);
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .drop-zone:hover .drop-icon {
          color: var(--primary-color);
          opacity: 0.8;
          transform: translateY(-5px);
        }

        .drop-title {
          color: var(--text-secondary);
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .drop-subtitle {
          color: var(--text-muted);
          font-size: 14px;
          margin: 0;
        }

        .drop-formats {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .format-text,
        .batch-text {
          color: var(--text-muted);
          font-size: 12px;
        }

        .batch-text {
          color: rgba(210, 105, 30, 0.8);
        }

        /* Badge de mode */
        .mode-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--primary-color);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Liste des fichiers */
        .files-list {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(160, 82, 45, 0.2);
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .file-name {
          color: var(--text-secondary);
          font-size: 14px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          color: var(--text-muted);
          font-size: 12px;
          margin: 0 12px;
        }

        .file-remove {
          background: transparent;
          border: none;
          color: rgba(239, 68, 68, 0.8);
          cursor: pointer;
          padding: 4px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-remove:hover {
          color: #EF4444;
          transform: scale(1.1);
        }

        /* Preview mode simple */
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
          top: -25px;
          left: 0;
          color: var(--text-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .preview-original img,
        .preview-result img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          border: 1px solid rgba(160, 82, 45, 0.2);
        }

        .preview-arrow {
          color: var(--primary-color);
          font-size: 24px;
          opacity: 0.6;
        }

        .result-placeholder {
          width: 100%;
          aspect-ratio: 1;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 14px;
        }

        /* Grille batch */
        .batch-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
          max-height: 300px;
          overflow-y: auto;
          padding: 4px;
        }

        .batch-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .batch-item:hover {
          border-color: var(--primary-color);
          transform: scale(1.05);
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
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }

        .batch-item-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .batch-item:hover .batch-item-remove {
          display: flex;
        }

        .batch-item.processing {
          opacity: 0.5;
        }

        .batch-item.completed::after {
          content: '✓';
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: #10B981;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        /* Boutons style actuel */
        .btn-generate,
        .btn-reset {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-generate {
          background: linear-gradient(135deg, #A0522D, #8B4513);
          color: white;
          margin-bottom: 12px;
        }

        .btn-generate:hover:not(:disabled) {
          background: linear-gradient(135deg, #8B4513, #704214);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(160, 82, 45, 0.3);
        }

        .btn-generate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-reset {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-reset:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Progress bar */
        .batch-progress {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(160, 82, 45, 0.2);
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          color: var(--text-secondary);
          font-size: 12px;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 6px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #A0522D, #D2691E);
          border-radius: 3px;
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
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Loading spinner */
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(160, 82, 45, 0.2);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Scrollbar custom */
        .batch-items::-webkit-scrollbar,
        .files-list::-webkit-scrollbar {
          width: 6px;
        }

        .batch-items::-webkit-scrollbar-track,
        .files-list::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .batch-items::-webkit-scrollbar-thumb,
        .files-list::-webkit-scrollbar-thumb {
          background: var(--primary-light);
          border-radius: 3px;
        }

        .batch-items::-webkit-scrollbar-thumb:hover,
        .files-list::-webkit-scrollbar-thumb:hover {
          background: var(--primary-color);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .drop-zone {
            padding: 30px 20px;
          }
          
          .preview-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .preview-arrow {
            transform: rotate(90deg);
            text-align: center;
          }
          
          .batch-items {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
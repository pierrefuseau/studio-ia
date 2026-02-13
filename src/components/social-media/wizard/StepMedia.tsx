import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, Link as LinkIcon, Info, Plus } from 'lucide-react';
import type { SocialMediaState, UploadedFile } from '../../../types';
import { useToast } from '../../ui/Toast';

interface StepMediaProps {
  state: SocialMediaState;
  onChange: (updates: Partial<SocialMediaState>) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPT = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 o';
  const k = 1024;
  const sizes = ['o', 'Ko', 'Mo'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

export default function StepMedia({ state, onChange }: StepMediaProps) {
  const { addToast } = useToast();

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newFiles: UploadedFile[] = accepted.map((file) => ({
        id: Math.random().toString(36).slice(2, 11),
        file,
        preview: isImage(file) ? URL.createObjectURL(file) : '',
        status: 'pending' as const,
      }));
      onChange({ uploadedFiles: [...state.uploadedFiles, ...newFiles] });
      if (accepted.length === 1) {
        addToast({ type: 'success', title: 'Fichier ajoute' });
      } else if (accepted.length > 1) {
        addToast({ type: 'success', title: `${accepted.length} fichiers ajoutes` });
      }
    },
    [state.uploadedFiles, onChange, addToast]
  );

  const removeFile = useCallback(
    (id: string) => {
      const file = state.uploadedFiles.find((f) => f.id === id);
      if (file && file.preview) URL.revokeObjectURL(file.preview);
      onChange({ uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id) });
    },
    [state.uploadedFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    noClick: false,
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">URL de reference</h3>
        <p className="mb-3 text-xs sm:text-sm text-gray-500">
          Lien vers un article, une page produit ou une source d'inspiration (optionnel)
        </p>
        <div className="relative">
          <LinkIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="url"
            value={state.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-fuseau-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">Fichiers joints</h3>
        <p className="mb-3 text-xs sm:text-sm text-gray-500">
          Ajoutez des images ou documents pour enrichir la generation
        </p>

        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 sm:p-6 lg:p-8 text-center transition-all duration-200 min-h-[100px] sm:min-h-[140px] flex items-center justify-center ${
            isDragActive
              ? 'border-fuseau-primary bg-gray-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
            className="flex flex-col items-center gap-2 sm:gap-3"
          >
            <div
              className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl transition-colors ${
                isDragActive
                  ? 'bg-fuseau-primary text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                {isDragActive ? 'Deposez vos fichiers' : 'Glissez-deposez vos fichiers ici'}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-gray-400">
                PDF, JPG, PNG &middot; 10 Mo max par fichier
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="mt-1 sm:hidden inline-flex items-center gap-1.5 rounded-lg bg-fuseau-primary px-3 py-1.5 text-xs font-medium text-white active:scale-95 transition-transform"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter des fichiers
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {state.uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 sm:mt-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {state.uploadedFiles.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    {f.preview ? (
                      <img
                        src={f.preview}
                        alt={`Apercu de ${f.file.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gray-50">
                        {f.file.type === 'application/pdf' ? (
                          <FileText className="h-6 w-6 text-fuseau-secondary" />
                        ) : (
                          <Image className="h-6 w-6 text-fuseau-secondary" />
                        )}
                        <span className="px-2 text-center text-[10px] text-gray-500 leading-tight truncate max-w-full">
                          {f.file.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2 pb-1.5 pt-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <p className="truncate text-[10px] font-medium text-white">{f.file.name}</p>
                      <p className="text-[9px] text-white/70">{formatSize(f.file.size)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(f.id);
                      }}
                      aria-label={`Supprimer ${f.file.name}`}
                      className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700/80 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 sm:mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-fuseau-secondary" />
          <p className="text-[10px] sm:text-xs leading-relaxed text-gray-600">
            Les fichiers joints seront analyses par l'IA pour enrichir le post.
            Les images pourront etre utilisees comme visuels du post.
          </p>
        </div>
      </div>
    </div>
  );
}

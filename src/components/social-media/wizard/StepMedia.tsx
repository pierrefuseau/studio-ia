import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, Link as LinkIcon, Info } from 'lucide-react';
import type { SocialMediaState, UploadedFile } from '../../../types';

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
  const onDrop = useCallback(
    (accepted: File[]) => {
      const newFiles: UploadedFile[] = accepted.map((file) => ({
        id: Math.random().toString(36).slice(2, 11),
        file,
        preview: isImage(file) ? URL.createObjectURL(file) : '',
        status: 'pending' as const,
      }));
      onChange({ uploadedFiles: [...state.uploadedFiles, ...newFiles] });
    },
    [state.uploadedFiles, onChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      const file = state.uploadedFiles.find((f) => f.id === id);
      if (file && file.preview) URL.revokeObjectURL(file.preview);
      onChange({ uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id) });
    },
    [state.uploadedFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">URL de reference</h3>
        <p className="mb-3 text-sm text-gray-500">
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
        <p className="mb-3 text-sm text-gray-500">
          Ajoutez des images ou documents pour enrichir la generation
        </p>

        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            isDragActive
              ? 'border-fuseau-primary bg-fuseau-cream'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                isDragActive
                  ? 'bg-fuseau-primary text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragActive ? 'Deposez vos fichiers' : 'Glissez-deposez vos fichiers ici'}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PDF, JPG, PNG &middot; 10 Mo max par fichier
              </p>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {state.uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              {state.uploadedFiles.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
                >
                  {f.preview ? (
                    <img
                      src={f.preview}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fuseau-cream">
                      {f.file.type === 'application/pdf' ? (
                        <FileText className="h-5 w-5 text-fuseau-primary" />
                      ) : (
                        <Image className="h-5 w-5 text-fuseau-primary" />
                      )}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">{f.file.name}</p>
                    <p className="text-xs text-gray-400">{formatSize(f.file.size)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-fuseau-cream p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-fuseau-primary" />
          <p className="text-xs leading-relaxed text-gray-600">
            Les fichiers joints seront analyses par l'IA pour enrichir le post.
            Les images pourront etre utilisees comme visuels du post.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface FPFileUploadProps {
  preview: string;
  onFileSelect: (file: File, preview: string) => void;
  onClear: () => void;
  error?: string;
}

export function FPFileUpload({ preview, onFileSelect, onClear, error }: FPFileUploadProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => onFileSelect(file, reader.result as string);
      reader.readAsDataURL(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  if (preview) {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Photo produit
        </label>
        <div className="relative group">
          <div className="w-full aspect-square max-w-[240px] rounded-lg overflow-hidden border border-slate-600/40 bg-slate-800">
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          </div>
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        Photo produit
      </label>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150',
          isDragActive
            ? 'border-amber-500/60 bg-amber-500/5'
            : error
              ? 'border-red-500/50 bg-red-500/5'
              : 'border-slate-600/40 bg-slate-700/20 hover:border-slate-500'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isDragActive ? (
            <ImageIcon className="w-8 h-8 text-amber-400" />
          ) : (
            <Upload className="w-8 h-8 text-slate-500" />
          )}
          <p className="text-sm text-slate-300">
            {isDragActive ? 'Deposez ici' : 'Glissez une image ou cliquez'}
          </p>
          <p className="text-xs text-slate-500">JPG, PNG ou WEBP - Max 10 Mo</p>
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

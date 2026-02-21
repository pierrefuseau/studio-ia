import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, X, Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useFiche } from '../FicheProduitContext';
import { cn } from '../../../utils/cn';

const MAX_SIZE = 20 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PDFUpload() {
  const { state, dispatch } = useFiche();
  const { formData } = state;
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPdf = !!formData.pdfBase64;

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    if (file.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptes.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Le fichier depasse 20 MB. Veuillez compresser le PDF.');
      return;
    }

    setConverting(true);
    dispatch({ type: 'UPDATE_FORM', payload: { pdfFile: file, pdfFileName: file.name } });

    try {
      const base64 = await fileToBase64(file);
      dispatch({ type: 'UPDATE_FORM', payload: { pdfBase64: base64 } });
    } catch {
      setError('Erreur lors de la lecture du fichier.');
      dispatch({ type: 'UPDATE_FORM', payload: { pdfFile: null, pdfBase64: '', pdfFileName: '' } });
    } finally {
      setConverting(false);
    }
  }, [dispatch]);

  const handleRemove = () => {
    setError(null);
    dispatch({ type: 'UPDATE_FORM', payload: { pdfFile: null, pdfBase64: '', pdfFileName: '' } });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      if (accepted.length > 0) handleFile(accepted[0]);
    },
    onDropRejected: (rejections) => {
      const r = rejections[0];
      if (r?.errors?.some((e) => e.code === 'file-too-large')) {
        setError('Le fichier depasse 20 MB. Veuillez compresser le PDF.');
      } else {
        setError('Seuls les fichiers PDF sont acceptes.');
      }
    },
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    multiple: false,
    disabled: converting,
  });

  return (
    <div className="rounded-xl border-2 border-amber-500/25 bg-slate-800/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Fiche technique produit</h3>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-red-500/15 text-[10px] font-bold text-red-400 uppercase tracking-wider">
          Obligatoire
        </span>
      </div>

      {hasPdf && !converting ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-300 truncate">{formData.pdfFileName}</p>
            {formData.pdfFile && (
              <p className="text-[11px] text-emerald-400/60">{formatSize(formData.pdfFile.size)}</p>
            )}
          </div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase mr-2">PDF pret</span>
          <button
            onClick={handleRemove}
            className="w-6 h-6 rounded-full flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : converting ? (
        <div className="flex items-center gap-3 px-4 py-6 rounded-lg border-2 border-dashed border-amber-500/30 bg-amber-500/5 justify-center">
          <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-sm text-amber-300">Lecture du PDF...</span>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200',
            isDragActive
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-amber-500/30 bg-slate-800/30 hover:border-amber-400/50 hover:bg-slate-800/50'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-amber-500/40" />
          <div className="text-center">
            <p className="text-sm text-slate-300">
              {isDragActive ? 'Deposez le fichier ici' : 'Glissez votre fiche technique PDF ici'}
            </p>
            <p className="text-xs text-slate-500 mt-1">ou cliquez pour selectionner</p>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            Formats acceptes : PDF (max 20 MB)
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {!hasPdf && !converting && !error && (
        <p className="text-[11px] text-slate-500">
          L'IA analysera le PDF pour extraire automatiquement : ingredients, allergenes, valeurs nutritionnelles, conservation, certifications, origine...
        </p>
      )}
    </div>
  );
}

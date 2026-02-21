import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, ArrowLeft, ChevronLeft, ChevronRight, FileText, Info } from 'lucide-react';
import { useFiche } from '../FicheProduitContext';
import { ProductPagePreview } from './ProductPagePreview';
import { RecipePagePreview } from './RecipePagePreview';
import { generatePDF } from '../pdf/pdfExport';

export function ResultScreen({ onRegenerate }: { onRegenerate: () => void }) {
  const { state, dispatch } = useFiche();
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generatePDF(state.formData, state.editedContent, state.generatedContent);
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleModify = () => {
    dispatch({ type: 'SET_VIEW', payload: 'new' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Fiche generee</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Cliquez sur un texte pour le modifier avant le telechargement
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              currentPage === 1 ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Page 1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              currentPage === 2 ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Page 2
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-full max-w-lg">
          <button
            onClick={() => setCurrentPage(currentPage === 1 ? 2 : 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-600 transition-colors z-10 hidden lg:flex"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(currentPage === 1 ? 2 : 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-600 transition-colors z-10 hidden lg:flex"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 1 ? <ProductPagePreview /> : <RecipePagePreview />}
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {downloading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {downloading ? 'Generation...' : 'Telecharger le PDF'}
        </button>
        <button
          onClick={onRegenerate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerer
        </button>
        <button
          onClick={handleModify}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Modifier
        </button>
      </div>

      <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-400">Informations de generation</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-slate-500">Produit</p>
            <p className="text-slate-300 font-medium">{state.formData.nomProduit}</p>
          </div>
          <div>
            <p className="text-slate-500">Marque</p>
            <p className="text-slate-300 font-medium">{state.formData.marque}</p>
          </div>
          <div>
            <p className="text-slate-500">Gamme</p>
            <p className="text-slate-300 font-medium">{state.formData.gamme}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';

export function ProcessingStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white rounded-lg border border-gray-200 p-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <span className="text-sm text-gray-600">
          Traitement en cours...
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
        <motion.div
          className="bg-gray-600 h-1 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '45%' }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Votre demande est en cours de traitement par l'IA
      </p>
    </motion.div>
  );
}

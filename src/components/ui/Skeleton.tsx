import { motion } from 'framer-motion';

function Pulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-lg bg-gray-200 ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 animate-in">
      <div className="mb-6 space-y-3">
        <Pulse className="h-3 w-32" />
        <div className="flex items-center gap-3">
          <Pulse className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Pulse className="h-5 w-48" />
            <Pulse className="h-3 w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="md:col-span-1 lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <Pulse className="h-40 w-full rounded-lg" />
            <div className="mt-4 space-y-2">
              <Pulse className="h-3 w-24" />
              <Pulse className="h-3 w-48" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <Pulse className="h-4 w-36" />
            <div className="grid grid-cols-2 gap-3">
              <Pulse className="h-10 w-full" />
              <Pulse className="h-10 w-full" />
            </div>
            <Pulse className="h-20 w-full" />
          </div>
        </div>
        <div className="hidden md:block space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <Pulse className="h-4 w-28" />
            <Pulse className="h-2 w-full" />
            <Pulse className="h-3 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
      <Pulse className="h-4 w-32" />
      <Pulse className="h-3 w-full" />
      <Pulse className="h-3 w-3/4" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Pulse className="h-4 w-24" />
      <Pulse className="h-10 w-full" />
      <Pulse className="h-4 w-32" />
      <Pulse className="h-24 w-full" />
    </div>
  );
}

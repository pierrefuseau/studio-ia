import React, { Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/AppLayout';
import { CommandPalette } from './components/CommandPalette';
import { WorkspaceSkeleton } from './components/ui/Skeleton';

const TreatmentWorkspace = React.lazy(() =>
  import('./components/TreatmentWorkspace').then((m) => ({ default: m.TreatmentWorkspace }))
);
const VideoGenerationForm = React.lazy(() =>
  import('./components/VideoGenerationForm').then((m) => ({ default: m.VideoGenerationForm }))
);
const SocialMediaWorkspace = React.lazy(() => import('./components/social-media/SocialMediaWorkspace'));

const pageTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } },
};

function AppContent() {
  const { state } = useApp();
  const workspaceKey = state.selectedTreatmentType || 'default';

  const workspace = useMemo(() => {
    switch (state.selectedTreatmentType) {
      case 'video-generation':
        return <VideoGenerationForm />;
      case 'social-media':
        return <SocialMediaWorkspace />;
      default:
        return <TreatmentWorkspace />;
    }
  }, [state.selectedTreatmentType]);

  return (
    <AppLayout>
      <Suspense fallback={<WorkspaceSkeleton />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={workspaceKey}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {workspace}
          </motion.div>
        </AnimatePresence>
      </Suspense>
      <CommandPalette />
    </AppLayout>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;

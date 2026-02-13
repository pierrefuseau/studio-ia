import React, { Suspense } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/AppLayout';
import { Loader2 } from 'lucide-react';

const TreatmentWorkspace = React.lazy(() =>
  import('./components/TreatmentWorkspace').then((m) => ({ default: m.TreatmentWorkspace }))
);
const VideoGenerationForm = React.lazy(() =>
  import('./components/VideoGenerationForm').then((m) => ({ default: m.VideoGenerationForm }))
);
const SocialMediaWorkspace = React.lazy(() => import('./components/social-media/SocialMediaWorkspace'));

function WorkspaceLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-fuseau-primary" />
    </div>
  );
}

function AppContent() {
  const { state } = useApp();

  const renderWorkspace = () => {
    switch (state.selectedTreatmentType) {
      case 'video-generation':
        return <VideoGenerationForm />;
      case 'social-media':
        return <SocialMediaWorkspace />;
      default:
        return <TreatmentWorkspace />;
    }
  };

  return (
    <AppLayout>
      <Suspense fallback={<WorkspaceLoader />}>
        {renderWorkspace()}
      </Suspense>
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

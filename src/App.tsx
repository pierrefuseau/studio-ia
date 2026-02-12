import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/AppLayout';
import { TreatmentWorkspace } from './components/TreatmentWorkspace';
import { VideoGenerationForm } from './components/VideoGenerationForm';

function AppContent() {
  const { state } = useApp();

  const isVideo = state.selectedTreatmentType === 'video-generation';

  return (
    <AppLayout>
      {isVideo ? <VideoGenerationForm /> : <TreatmentWorkspace />}
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

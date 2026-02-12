import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/AppLayout';
import { DashboardHome } from './components/DashboardHome';
import { TreatmentWorkspace } from './components/TreatmentWorkspace';
import { VideoGenerationForm } from './components/VideoGenerationForm';

function AppContent() {
  const { state } = useApp();

  const isHome = !state.selectedTreatmentType || state.currentStep === 'hero';
  const isVideo = state.selectedTreatmentType === 'video-generation';

  return (
    <AppLayout>
      {isHome ? (
        <DashboardHome />
      ) : isVideo ? (
        <VideoGenerationForm />
      ) : (
        <TreatmentWorkspace />
      )}
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

import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/AppLayout';
import { TreatmentWorkspace } from './components/TreatmentWorkspace';
import { VideoGenerationForm } from './components/VideoGenerationForm';
import SocialMediaWorkspace from './components/social-media/SocialMediaWorkspace';

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
      {renderWorkspace()}
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

import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { HeroSection } from './components/HeroSection';
import { TreatmentWorkspace } from './components/TreatmentWorkspace';
import { Header } from './components/Header';
import { VideoGenerationPage } from './components/VideoGenerationPage';
import { useApp } from './contexts/AppContext';

function AppContent() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-white">
      {state.selectedTreatmentType === 'video-generation' ? (
        <VideoGenerationPage />
      ) : state.currentStep === 'hero' ? (
        <HeroSection />
      ) : (
        <>
          <Header />
          <TreatmentWorkspace />
        </>
      )}
    </div>
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
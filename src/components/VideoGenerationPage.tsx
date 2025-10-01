import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { VideoGenerationForm } from './VideoGenerationForm';

export function VideoGenerationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('videoGenAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('videoGenAuth', 'true');
  };

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={handleAuthenticated} />;
  }

  return <VideoGenerationForm />;
}

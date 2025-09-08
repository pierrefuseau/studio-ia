import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { webhookService } from '../services/webhookService';

interface WebhookStatusProps {
  className?: string;
}

export function WebhookStatus({ className = '' }: WebhookStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    const isConnected = await webhookService.testConnection();
    setStatus(isConnected ? 'connected' : 'disconnected');
    setLastCheck(new Date());
  };

  useEffect(() => {
    // Vérification initiale
    checkConnection();
    
    // Vérification périodique toutes les 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return {
          icon: Wifi,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'Vérification...',
          animate: 'animate-pulse'
        };
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          text: 'n8n connecté',
          animate: ''
        };
      case 'disconnected':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          text: 'n8n déconnecté',
          animate: 'animate-bounce'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.bgColor} ${className}`}>
      <Icon className={`w-4 h-4 ${config.color} ${config.animate}`} />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
      {lastCheck && (
        <span className="text-xs text-gray-400">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
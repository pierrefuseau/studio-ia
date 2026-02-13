import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AdminLoginProps {
  onAuthenticated: () => void;
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onAuthenticated();
      setError('');
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 rounded-full p-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
          Génération de vidéos
        </h1>
        <p className="text-slate-600 text-center mb-8">
          Accès administrateur requis
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Mot de passe administrateur"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}

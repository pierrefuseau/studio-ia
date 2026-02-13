import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-fuseau-cream">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[999] focus:top-2 focus:left-2 focus:rounded-lg focus:bg-fuseau-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Aller au contenu principal
      </a>

      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-screen z-50 lg:hidden"
          >
            <Sidebar
              collapsed={false}
              onToggle={closeMobile}
              onNavigate={closeMobile}
              mobile
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`transition-[margin] duration-200 ${
          collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
        }`}
      >
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fuseau-primary/30"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src="/GROUPE_FUSEAU_V2.png"
            alt="Logo Groupe Fuseau"
            className="h-7 object-contain"
          />
          <span className="text-xs font-semibold text-fuseau-secondary">Studio Produit</span>
        </header>

        <main id="main-content" className="p-3 sm:p-4 md:p-6 lg:p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

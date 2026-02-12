import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sidebarWidth = collapsed ? 68 : 260;

  return (
    <div className="min-h-screen bg-fuseau-cream">
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`hidden lg:block`}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {isMobile && (
        <div
          className={`fixed top-0 left-0 z-40 transition-transform duration-200 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
        </div>
      )}

      <div
        className="transition-all duration-200"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {isMobile && (
          <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img
              src="/GROUPE_FUSEAU_V2.png"
              alt="Fuseau"
              className="h-7 object-contain"
            />
            <span className="text-xs font-semibold text-fuseau-secondary">Studio Produit</span>
          </div>
        )}

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

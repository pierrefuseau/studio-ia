import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  glow?: boolean;
  magnetic?: boolean;
  breathe?: boolean;
  liquid?: boolean;
}

export function Card({ 
  children, 
  className, 
  hover = false, 
  glass = false,
  glow = false,
  magnetic = false,
  breathe = false,
  liquid = false
}: CardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetic) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    card.style.transform = `perspective(1000px) rotateX(${y * 0.05}deg) rotateY(${x * 0.05}deg) scale(1.02)`;
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetic) return;
    
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div className="relative group">
      {/* Glow effect */}
      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      )}
      
      {/* Floating orbs for glass cards */}
      {glass && (
        <>
          <div className="absolute top-4 left-4 w-20 h-20 floating-orb-blue opacity-30 animate-blob-blue"></div>
          <div className="absolute top-4 right-4 w-16 h-16 floating-orb-orange opacity-25 animate-blob-orange animation-delay-2000"></div>
        </>
      )}
      
      <div
        className={cn(
          'relative rounded-2xl border transition-all duration-300 overflow-hidden',
          {
            // Glass effect
            'glass-card shadow-2xl': glass,
            
            // Regular card
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg': !glass,
            
            // Hover effects
            'hover-lift cursor-pointer transform-gpu': hover,
            'hover:shadow-blue-500/25 dark:hover:shadow-blue-500/25': hover && glass,
            
            // Animations
            'animate-breathe': breathe,
            'animate-liquid-morph': liquid,
          },
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
          transition: magnetic ? 'transform 0.2s ease-out' : undefined
        }}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Border gradient animation */}
        {glow && (
          <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 to-orange-500 animate-border-rotate-blue">
            <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
}

// Card spécialisée avec effet néon
export function NeonCard({ children, className, ...props }: CardProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-300 animate-glow-pulse-blue"></div>
      <Card
        className={cn(
          'relative bg-gray-900/90 dark:bg-white/90 border-blue-500/50 neon-glow-blue',
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </div>
  );
}

// Card Bento pour la grille
export function BentoCard({ 
  children, 
  className, 
  gridArea,
  ...props 
}: CardProps & { gridArea?: string }) {
  return (
    <Card
      glass
      hover
      magnetic
      className={cn(
        'p-6 group cursor-pointer',
        className
      )}
      style={{ gridArea }}
      {...props}
    >
      {children}
    </Card>
  );
}
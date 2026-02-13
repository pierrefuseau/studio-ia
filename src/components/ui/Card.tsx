import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  noBorder?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hover = false,
  noBorder = false,
  onClick
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white transition-all duration-200',
        !noBorder && 'border border-gray-200 shadow-card',
        hover && 'hover:shadow-card-hover hover:border-fuseau-primary/30 hover:-translate-y-0.5 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface TreatmentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export function TreatmentCard({
  icon,
  title,
  description,
  enabled,
  onClick,
  selected = false
}: TreatmentCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      className={cn(
        'w-full text-left rounded-xl p-3 sm:p-4 lg:p-5 border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-fuseau-primary/20 focus:ring-offset-2',
        enabled
          ? selected
            ? 'bg-white border-fuseau-primary shadow-card-hover'
            : 'bg-white border-gray-200 shadow-card hover:border-fuseau-primary/30 hover:shadow-card-hover hover:-translate-y-0.5'
          : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed',
        'group relative overflow-hidden'
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors duration-150',
          selected
            ? 'bg-fuseau-primary text-white'
            : enabled
              ? 'bg-red-50 text-fuseau-primary group-hover:bg-fuseau-primary group-hover:text-white'
              : 'bg-gray-100 text-gray-400'
        )}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-heading font-semibold text-xs sm:text-sm mb-0.5 transition-colors duration-150',
            selected || enabled ? 'text-gray-900' : 'text-gray-500'
          )}>
            {title}
          </h3>
          <p className={cn(
            'text-xs leading-relaxed',
            selected || enabled ? 'text-gray-500' : 'text-gray-400'
          )}>
            {description}
          </p>
        </div>
      </div>

      {selected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuseau-primary via-fuseau-accent to-fuseau-primary" />
      )}
    </button>
  );
}

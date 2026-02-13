import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-fuseau-primary text-white hover:bg-fuseau-primary-dark shadow-md hover:shadow-lg active:scale-95',
    secondary: 'bg-fuseau-secondary text-white hover:bg-fuseau-secondary-dark shadow-md hover:shadow-lg active:scale-95',
    outline: 'border-2 border-fuseau-primary text-fuseau-primary hover:bg-fuseau-primary hover:text-white active:scale-95',
    ghost: 'text-fuseau-primary hover:bg-gray-50 active:scale-95',
    accent: 'bg-fuseau-accent text-fuseau-secondary hover:bg-fuseau-accent-dark shadow-md hover:shadow-lg active:scale-95'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  };

  return (
    <button
      className={cn(
        'rounded-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2',
        'focus-ring-primary',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full sm:w-auto',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Chargement...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

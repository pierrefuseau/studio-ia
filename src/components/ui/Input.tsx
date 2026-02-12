import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(
          'block text-sm font-semibold transition-colors duration-200',
          focused ? 'text-fuseau-primary' : 'text-gray-700',
          error && 'text-red-600'
        )}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-3.5 py-2.5 rounded-lg border transition-all duration-150',
            'bg-white text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-fuseau-primary/20',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-200 focus:border-fuseau-primary hover:border-gray-300',
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(
          'block text-sm font-semibold transition-colors duration-200',
          focused ? 'text-fuseau-primary' : 'text-gray-700',
          error && 'text-red-600'
        )}>
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-3.5 py-2.5 rounded-lg border transition-all duration-150 resize-none',
          'bg-white text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-fuseau-primary/20',
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-200 focus:border-fuseau-primary hover:border-gray-300',
          className
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

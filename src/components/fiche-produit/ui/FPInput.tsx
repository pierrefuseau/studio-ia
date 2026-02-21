import { cn } from '../../../utils/cn';

interface FPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function FPInput({ label, error, helperText, required, className, ...props }: FPInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
        {required && <span className="text-amber-400 ml-0.5">*</span>}
      </label>
      <input
        className={cn(
          'w-full bg-slate-700/50 border rounded-lg px-3.5 py-2.5',
          'text-sm text-slate-100 placeholder-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50',
          'transition-colors duration-150',
          error ? 'border-red-500/60' : 'border-slate-600/50 hover:border-slate-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

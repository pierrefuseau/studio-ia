import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Option {
  value: string;
  label: string;
}

interface FPSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function FPSelect({ label, value, onChange, options, placeholder, error, required }: FPSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
        {required && <span className="text-amber-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full appearance-none bg-slate-700/50 border rounded-lg px-3.5 py-2.5 pr-10',
            'text-sm text-slate-100 placeholder-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50',
            'transition-colors duration-150',
            error ? 'border-red-500/60' : 'border-slate-600/50 hover:border-slate-500'
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

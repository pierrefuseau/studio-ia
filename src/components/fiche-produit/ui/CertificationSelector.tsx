import { cn } from '../../../utils/cn';
import { CERTIFICATIONS } from '../../../utils/certificationData';
import { Check } from 'lucide-react';

interface CertificationSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function CertificationSelector({ selected, onToggle }: CertificationSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        Certifications
      </label>
      <div className="flex flex-wrap gap-2">
        {CERTIFICATIONS.map((cert) => {
          const isActive = selected.includes(cert.id);
          return (
            <button
              key={cert.id}
              type="button"
              onClick={() => onToggle(cert.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                'border transition-all duration-150',
                isActive
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-slate-600/40 text-slate-400 hover:text-slate-200 hover:border-slate-500'
              )}
              style={
                isActive
                  ? { backgroundColor: cert.color }
                  : undefined
              }
            >
              {isActive && <Check className="w-3 h-3" />}
              {cert.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

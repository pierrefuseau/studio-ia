import { useState, useRef, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  as?: 'p' | 'h2' | 'h3' | 'span';
  className?: string;
  multiline?: boolean;
}

export function EditableField({
  value,
  onChange,
  as: Tag = 'p',
  className = '',
  multiline = false,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const save = () => {
    onChange(draft);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setEditing(false);
              if (e.key === 'Enter' && e.metaKey) save();
            }}
            rows={3}
            className="w-full bg-white/10 border border-amber-500/40 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500/40 resize-none"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setEditing(false);
              if (e.key === 'Enter') save();
            }}
            className="w-full bg-white/10 border border-amber-500/40 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
          />
        )}
        <button
          onClick={save}
          className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md"
        >
          <Check className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => setEditing(true)}
    >
      <Tag className={className}>{value}</Tag>
      <Pencil className="absolute -right-1 -top-1 w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

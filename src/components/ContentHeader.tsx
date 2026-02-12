import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ContentHeaderProps {
  breadcrumbs: { label: string; onClick?: () => void }[];
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function ContentHeader({ breadcrumbs, title, subtitle, icon, action }: ContentHeaderProps) {
  return (
    <div className="mb-6">
      <nav className="flex items-center gap-1.5 text-xs mb-4">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            {crumb.onClick ? (
              <button
                onClick={crumb.onClick}
                className="text-gray-400 hover:text-fuseau-secondary transition-colors"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-gray-600 font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-red-50 text-fuseau-primary flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-xl font-heading font-semibold text-gray-900 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

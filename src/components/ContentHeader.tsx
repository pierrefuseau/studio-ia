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
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col-reverse sm:flex-col gap-1.5 sm:gap-0">
        <nav className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs sm:mb-4">
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

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            {icon && (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 text-fuseau-primary flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-heading font-semibold text-gray-900 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isTvMode?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  controls,
  children,
  className = '',
  isTvMode = false,
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-800/80 bg-[#101726]/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-slate-700/80 ${
        isTvMode ? 'p-6 lg:p-8' : 'p-3.5 sm:p-5 lg:p-6'
      } ${className}`}
    >
      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold tracking-tight text-slate-100 ${
                isTvMode ? 'text-lg lg:text-xl' : 'text-sm sm:text-base'
              }`}
            >
              {title}
            </h3>
            {badge && (
              <span
                className={`font-medium text-cyan-400 shrink-0 ${
                  isTvMode ? 'text-xs' : 'text-[11px] sm:text-xs'
                }`}
              >
                · {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p
              className={`mt-0.5 text-slate-400 ${
                isTvMode ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {controls && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">{controls}</div>
        )}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

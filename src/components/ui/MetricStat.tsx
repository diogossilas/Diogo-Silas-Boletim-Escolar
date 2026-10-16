import React from 'react';

interface MetricStatProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  valueColorClass?: string;
  className?: string;
  isTvMode?: boolean;
}

export const MetricStat: React.FC<MetricStatProps> = ({
  label,
  value,
  unit,
  subtext,
  valueColorClass = 'text-slate-100',
  className = '',
  isTvMode = false,
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-800/80 bg-[#111726]/80 transition-colors hover:border-slate-700/80 ${
        isTvMode ? 'p-4 lg:p-6' : 'p-3 sm:p-3.5 lg:p-4'
      } ${className}`}
    >
      <div
        className={`font-medium text-slate-400 ${
          isTvMode ? 'text-xs lg:text-sm' : 'text-[10px] sm:text-[11px] lg:text-xs'
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1 font-mono font-bold tabular-nums tracking-tight ${
          isTvMode
            ? 'text-xl sm:text-2xl lg:text-3xl'
            : 'text-base sm:text-lg lg:text-xl'
        } ${valueColorClass}`}
      >
        {value}{' '}
        {unit && (
          <span
            className={`font-normal text-slate-500 ${
              isTvMode ? 'text-sm' : 'text-xs'
            }`}
          >
            {unit}
          </span>
        )}
      </div>
      {subtext && (
        <div
          className={`mt-0.5 truncate text-slate-500 ${
            isTvMode ? 'text-xs' : 'text-[10px] sm:text-[11px]'
          }`}
          title={subtext}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};

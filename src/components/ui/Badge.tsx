import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple';
  size?: 'xs' | 'sm';
  className?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'xs',
  className = '',
}) => {
  const sizeStyle = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${VARIANT_STYLES[variant]} ${sizeStyle} ${className}`}
    >
      {children}
    </span>
  );
};

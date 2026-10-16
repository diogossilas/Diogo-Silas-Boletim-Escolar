import React from 'react';

interface FooterProps {
  totalSubjectsCount: number;
}

export const Footer: React.FC<FooterProps> = ({ totalSubjectsCount }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090d16] py-4 text-xs text-slate-500">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1840px] 4xl:max-w-[2200px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span>Visualização Gráfica Integrada · 8º Ano EF ao 3º Ano EM · Dados Oficiais</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-[11px]">
          <span className="tabular-nums text-slate-400">
            {totalSubjectsCount} registros curriculares analisados
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-cyan-400/80">Design Responsivo Multi-Dispositivo</span>
        </div>
      </div>
    </footer>
  );
};

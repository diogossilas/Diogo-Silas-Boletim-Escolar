import React from 'react';
import { BookmarkCheck, Layers, Tv, Maximize2, Minimize2, Play, Pause } from 'lucide-react';
import { ViewTab } from '../../types/navigation';

interface HeaderProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  isTvMode: boolean;
  onToggleTvMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isAutoPresenting?: boolean;
  onToggleAutoPresenting?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isTvMode,
  onToggleTvMode,
  isFullscreen,
  onToggleFullscreen,
  isAutoPresenting = false,
  onToggleAutoPresenting,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0c121e]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1840px] 4xl:max-w-[2200px] items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-3.5">
        {/* Brand & Wordmark Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold tracking-tight text-slate-100 whitespace-nowrap">
              Painel Gráfico Escolar
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden md:block">
              8º EF ao 3º EM · Visualização Analítica & SoC
            </div>
          </div>
        </div>

        {/* Clean Nav Links Zone (Notebooks & PCs) */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => onTabChange('all')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'all' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => onTabChange('evolution')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'evolution' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Evolução
          </button>
          <button
            onClick={() => onTabChange('radar')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'radar' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => onTabChange('heatmap')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'heatmap' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Matriz Térmica
          </button>
          <button
            onClick={() => onTabChange('attendance')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'attendance' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Assiduidade
          </button>
          <button
            onClick={() => onTabChange('qualitative')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'qualitative' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Conceitos
          </button>
          <button
            onClick={() => onTabChange('architecture')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'architecture'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-amber-400/90 hover:text-amber-300'
            }`}
          >
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded border border-amber-500/30">
              SoC
            </span>
            <span>Studio Modular</span>
          </button>
        </nav>

        {/* Actions Zone: TV Mode + Fullscreen + PDF Export */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* TV Presentation Mode Toggle */}
          <button
            onClick={onToggleTvMode}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              isTvMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-white'
            }`}
            title="Alternar Modo TV / Telão (tipografia ampliada e layout para grandes telas)"
          >
            <Tv className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Modo TV</span>
          </button>

          {/* Fullscreen Toggle (great for TVs, projectors and notebooks) */}
          <button
            onClick={onToggleFullscreen}
            className="flex items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/60 p-1.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            title={isFullscreen ? 'Sair da tela cheia' : 'Modo Tela Cheia (F11 / Apresentação)'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5 text-cyan-400" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 text-slate-400 hover:text-cyan-400" />
            )}
          </button>

          {/* Auto Presentation Play / Pause (Only in TV mode or desktop) */}
          {isTvMode && onToggleAutoPresenting && (
            <button
              onClick={onToggleAutoPresenting}
              className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                isAutoPresenting
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white'
              }`}
              title="Apresentação automática contínua de abas para telão"
            >
              {isAutoPresenting ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span className="hidden md:inline">Auto</span>
            </button>
          )}

          {/* Export / PDF */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white whitespace-nowrap"
            title="Exportar visualização para impressão ou PDF"
          >
            <BookmarkCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};

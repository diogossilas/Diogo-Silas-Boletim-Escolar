import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Radar,
  Grid3X3,
  ScatterChart,
  SlidersHorizontal,
  Code2,
} from 'lucide-react';
import { ViewTab, NAVIGATION_TABS } from '../../types/navigation';

interface TabNavigationProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  isTvMode?: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  isTvMode = false,
}) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'all':
        return <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />;
      case 'evolution':
        return <TrendingUp className="h-3.5 w-3.5 shrink-0" />;
      case 'radar':
        return <Radar className="h-3.5 w-3.5 shrink-0" />;
      case 'heatmap':
        return <Grid3X3 className="h-3.5 w-3.5 shrink-0" />;
      case 'attendance':
        return <ScatterChart className="h-3.5 w-3.5 shrink-0" />;
      case 'qualitative':
        return <BarChart3 className="h-3.5 w-3.5 shrink-0" />;
      case 'architecture':
        return <Code2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />;
      default:
        return <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />;
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-800/80 bg-[#0f1523] p-1 shadow-inner">
      <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent">
        {NAVIGATION_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isStudio = tab.id === 'architecture';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all touch-manipulation min-h-[38px] ${
                isTvMode ? 'text-sm px-4 py-2.5' : ''
              } ${
                isActive
                  ? isStudio
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : isStudio
                  ? 'text-cyan-400/90 hover:text-cyan-200 hover:bg-slate-800/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {renderIcon(tab.iconName)}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
              {tab.badge && (
                <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

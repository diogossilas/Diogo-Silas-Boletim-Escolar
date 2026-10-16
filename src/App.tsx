import React, { useState } from 'react';
import { ViewTab } from './types/navigation';
import { useAcademicData } from './hooks/useAcademicData';
import { useDisplayMode } from './hooks/useDisplayMode';
import { Header } from './components/layout/Header';
import { KpiOverview } from './components/layout/KpiOverview';
import { TabNavigation } from './components/layout/TabNavigation';
import { Footer } from './components/layout/Footer';

// Modular Visualization Chart Units
import { HistoricalEvolutionChart } from './components/charts/HistoricalEvolutionChart';
import { GradeDistributionBoxPlotChart } from './components/charts/GradeDistributionBoxPlotChart';
import { RadarCompetenceChart } from './components/charts/RadarCompetenceChart';
import { DivergingBarChart } from './components/charts/DivergingBarChart';
import { GradeHeatmapChart } from './components/charts/GradeHeatmapChart';
import { BimestralBarChart } from './components/charts/BimestralBarChart';
import { ScatterCorrelationChart } from './components/charts/ScatterCorrelationChart';
import { AttendanceDonutGauges } from './components/charts/AttendanceDonutGauges';
import { AbsenceAreaTimelineChart } from './components/charts/AbsenceAreaTimelineChart';
import { QualitativeConceptMatrixChart } from './components/charts/QualitativeConceptMatrixChart';

// Architecture & Modular Design Studio
import { ModularArchitectureStudio } from './components/architecture/ModularArchitectureStudio';
import { Tv, Sparkles, X } from 'lucide-react';

/**
 * App Root Component
 * Architectural Role: Top-level Orchestrator & View Switcher.
 * Adheres strictly to Separation of Concerns:
 * - Domain logic delegated to `src/services/`
 * - State and memoization delegated to `src/hooks/`
 * - Layout elements decoupled into `src/components/layout/`
 * - Visualizations encapsulated in individual cohesive chart modules.
 * - Responsive layout adapted for mobile screens (320px+), notebooks, PCs, and 4K TVs.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('all');
  const { globalMetrics } = useAcademicData();
  const {
    isTvMode,
    isFullscreen,
    isAutoPresenting,
    toggleTvMode,
    toggleFullscreen,
    toggleAutoPresenting,
  } = useDisplayMode(setActiveTab);

  return (
    <div
      className={`min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 ${
        isTvMode ? 'tv-presentation-mode' : ''
      }`}
    >
      {/* Decoupled Responsive Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isTvMode={isTvMode}
        onToggleTvMode={toggleTvMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isAutoPresenting={isAutoPresenting}
        onToggleAutoPresenting={toggleAutoPresenting}
      />

      {/* Main Viewport Container: Fluid from 320px mobile to 4K TVs */}
      <main
        className={`mx-auto w-full flex-1 px-3 sm:px-6 py-4 sm:py-6 space-y-6 transition-all duration-300 ${
          isTvMode
            ? 'max-w-[2100px] text-base lg:text-lg 2xl:px-8'
            : 'max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1840px] 4xl:max-w-[2200px]'
        }`}
      >
        {/* Subtle TV Mode Indicator when active */}
        {isTvMode && (
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent px-4 py-2.5 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>Modo TV / Apresentação Ativo:</strong> Tipografia ampliada e layout
                ultra-widescreen para telões, salas de reunião e televisores.
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isAutoPresenting && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <Sparkles className="h-3 w-3" /> Ciclo Automático (14s)
                </span>
              )}
              <button
                onClick={toggleTvMode}
                className="text-amber-400 hover:text-white transition-colors"
                title="Desativar Modo TV"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* KPI Strip: Separated Domain Presentation */}
        <KpiOverview metrics={globalMetrics} isTvMode={isTvMode} />

        {/* Tab Navigation: Modular View Switcher */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} isTvMode={isTvMode} />

        {/* Modular View Renderer */}
        <div className="space-y-6">
          {/* Studio de Arquitetura & Modularização (Brief → Sketch → Studio → Modularização) */}
          {activeTab === 'architecture' && <ModularArchitectureStudio />}

          {/* Section 1: Historical Evolution & Longitudinal Trajectories */}
          {(activeTab === 'all' || activeTab === 'evolution') && (
            <div className="space-y-6">
              <HistoricalEvolutionChart />
              <GradeDistributionBoxPlotChart />
            </div>
          )}

          {/* Section 2: Multidimensional Radar & Diverging Variance */}
          {(activeTab === 'all' || activeTab === 'radar') && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <RadarCompetenceChart />
              <DivergingBarChart />
            </div>
          )}

          {/* Section 3: Bimestral Performance & Heatmap Matrix */}
          {(activeTab === 'all' || activeTab === 'heatmap') && (
            <div className="space-y-6">
              <GradeHeatmapChart />
              <BimestralBarChart />
            </div>
          )}

          {/* Section 4: Attendance, Donut Gauges & Quadrant Scatter Plot */}
          {(activeTab === 'all' || activeTab === 'attendance') && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <ScatterCorrelationChart />
              </div>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <AttendanceDonutGauges />
                <AbsenceAreaTimelineChart />
              </div>
            </div>
          )}

          {/* Section 5: Qualitative Formative Assessments (ET / ES / EP) */}
          {(activeTab === 'all' || activeTab === 'qualitative') && (
            <div className="space-y-6">
              <QualitativeConceptMatrixChart />
            </div>
          )}
        </div>
      </main>

      {/* Decoupled Editorial Footer */}
      <Footer totalSubjectsCount={globalMetrics.totalSubjectsCount} />
    </div>
  );
}

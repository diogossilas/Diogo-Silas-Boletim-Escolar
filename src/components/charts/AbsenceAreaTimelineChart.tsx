import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { SCHOOL_DATA } from '../../data/schoolData';

export const AbsenceAreaTimelineChart: React.FC = () => {
  const [selectedYearId, setSelectedYearId] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    yearName: string;
    bimester: string;
    absences: number;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  // Compute total absences per bimester for each year
  const yearBimesterTotals = SCHOOL_DATA.map((year) => {
    const totals = [0, 0, 0, 0];
    year.subjects.forEach((s) => {
      s.absences.forEach((a, i) => {
        totals[i] += a;
      });
    });
    return {
      id: year.id,
      name: year.name,
      shortName: year.shortName,
      totals,
      grandTotal: totals.reduce((a, b) => a + b, 0),
    };
  });

  const svgWidth = 760;
  const svgHeight = 280;
  const padding = { top: 28, right: 36, bottom: 45, left: 45 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const yearColors: Record<string, string> = {
    '8ef': '#38bdf8',
    '9ef': '#f43f5e',
    '1em': '#eab308',
    '2em': '#10b981',
    '3em': '#a855f7',
  };

  const bimesters = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
  const maxVal = 60; // Max absences in a bimester

  const getX = (idx: number) => padding.left + (idx / 3) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - (val / maxVal) * chartHeight;

  const displayYears =
    selectedYearId === 'all'
      ? yearBimesterTotals
      : yearBimesterTotals.filter((y) => y.id === selectedYearId);

  return (
    <ChartCard
      title="Sazonalidade das Ausências (Área & Linhas Bimestrais)"
      subtitle="Evolução do volume total de faltas ao longo dos 4 bimestres em cada ano letivo"
      badge="Gráfico de Área Temporal"
      controls={
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedYearId('all')}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
              selectedYearId === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            Todos
          </button>
          {SCHOOL_DATA.map((y) => (
            <button
              key={y.id}
              onClick={() => setSelectedYearId(y.id)}
              className={`rounded-md px-2 py-1 font-medium transition-colors ${
                selectedYearId === y.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {y.shortName}
            </button>
          ))}
        </div>
      }
    >
      {/* Fluid SVG Container without horizontal scroll clipping */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none overflow-visible"
        >
          {/* Subtle Grid lines */}
          {[0, 15, 30, 45, 60].map((v) => {
            const y = getY(v);
            return (
              <g key={v}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeWidth={0.6}
                  strokeOpacity={0.3}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono text-[10px] tabular-nums fill-slate-400"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {bimesters.map((bim, i) => {
            const x = getX(i);
            return (
              <g key={bim}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={svgHeight - padding.bottom}
                  stroke="#334155"
                  strokeWidth={0.6}
                  strokeOpacity={0.2}
                />
                <text
                  x={x}
                  y={svgHeight - padding.bottom + 20}
                  textAnchor="middle"
                  className="fill-slate-300 text-xs font-medium"
                >
                  {bim}
                </text>
              </g>
            );
          })}

          {/* Year Lines and Shaded Areas */}
          {displayYears.map((yData) => {
            const color = yearColors[yData.id];
            const isSingleYearSelected = selectedYearId === yData.id;
            const pts = yData.totals.map((val, i) => ({
              x: getX(i),
              y: getY(val),
              val,
              bimester: bimesters[i],
            }));

            // Area path
            const areaPath = `M ${pts[0].x} ${getY(0)} L ${pts
              .map((p) => `${p.x} ${p.y}`)
              .join(' L ')} L ${pts[pts.length - 1].x} ${getY(0)} Z`;

            // Line path
            const linePath = `M ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')}`;

            return (
              <g key={yData.id}>
                {/* Translucent fill */}
                <path
                  d={areaPath}
                  fill={color}
                  fillOpacity={isSingleYearSelected ? 0.22 : 0.08}
                  className="transition-all duration-300"
                />
                {/* Line stroke */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  strokeWidth={isSingleYearSelected ? 3 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />

                {/* Nodes with values */}
                {pts.map((p, i) => {
                  const isHovered =
                    hoveredPoint?.yearName === yData.shortName &&
                    hoveredPoint?.bimester === p.bimester;

                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          yearName: yData.shortName,
                          bimester: p.bimester,
                          absences: p.val,
                          color,
                          x: p.x,
                          y: p.y,
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => {
                        setSelectedYearId(yData.id);
                        setHoveredPoint({
                          yearName: yData.shortName,
                          bimester: p.bimester,
                          absences: p.val,
                          color,
                          x: p.x,
                          y: p.y,
                        });
                      }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 6 : isSingleYearSelected ? 5 : 4}
                        fill="#0b0f17"
                        stroke={color}
                        strokeWidth={isHovered ? 3 : 2}
                        className="transition-all duration-150"
                      />
                      {/* Only show persistent text if a single year is filtered to prevent overlapping labels */}
                      {(isSingleYearSelected || isHovered) && (
                        <text
                          x={p.x}
                          y={p.y - 8}
                          textAnchor="middle"
                          className="font-mono text-[10px] font-bold tabular-nums"
                          fill={color}
                        >
                          {p.val}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <g
              transform={`translate(${Math.min(
                Math.max(hoveredPoint.x - 70, 10),
                svgWidth - 150
              )}, ${Math.max(hoveredPoint.y - 50, 10)})`}
              className="pointer-events-none"
            >
              <rect
                width={140}
                height={42}
                rx={6}
                fill="#0f172a"
                stroke={hoveredPoint.color}
                strokeWidth={1.5}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
              />
              <text
                x={70}
                y={16}
                textAnchor="middle"
                className="fill-slate-300 text-[10px] font-semibold"
              >
                {hoveredPoint.yearName} · {hoveredPoint.bimester}
              </text>
              <text
                x={70}
                y={32}
                textAnchor="middle"
                className="font-mono text-xs font-bold tabular-nums"
                fill={hoveredPoint.color}
              >
                {hoveredPoint.absences} faltas
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Interactive Year Badges Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {yearBimesterTotals.map((y) => {
            const isSelected = selectedYearId === y.id || selectedYearId === 'all';
            return (
              <button
                key={y.id}
                onClick={() => setSelectedYearId(selectedYearId === y.id ? 'all' : y.id)}
                className={`flex items-center gap-1.5 rounded px-2 py-0.5 transition-colors cursor-pointer ${
                  selectedYearId === y.id
                    ? 'bg-slate-800 border border-slate-700 text-white'
                    : 'hover:bg-slate-900/60 text-slate-400'
                }`}
                title={`Clique para filtrar ${y.name}`}
              >
                <span
                  className="h-2 w-2 rounded-full transition-opacity"
                  style={{
                    backgroundColor: yearColors[y.id],
                    opacity: isSelected ? 1 : 0.4,
                  }}
                />
                <span className="font-medium">{y.shortName}</span>
                <span className="font-mono text-slate-500 tabular-nums">({y.grandTotal})</span>
              </button>
            );
          })}
        </div>
        <div className="text-[11px] text-slate-500">
          Pico: <strong className="text-purple-400">53 faltas</strong> no 4º Bim (3ª Série)
        </div>
      </div>
    </ChartCard>
  );
};

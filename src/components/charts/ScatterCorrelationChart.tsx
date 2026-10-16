import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { SCHOOL_DATA } from '../../data/schoolData';

export const ScatterCorrelationChart: React.FC = () => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    subject: string;
    yearName: string;
    cf: number;
    freq: number;
    absences: number;
    ac?: number;
    category: string;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  // Gather scatter points
  const points: {
    id: string;
    subject: string;
    yearName: string;
    yearId: string;
    cf: number;
    freq: number;
    absences: number;
    ac?: number;
    category: string;
    color: string;
  }[] = [];

  SCHOOL_DATA.forEach((year) => {
    year.subjects.forEach((sub) => {
      if (sub.cf !== null && sub.finalFrequency !== null) {
        points.push({
          id: `${year.id}-${sub.id}`,
          subject: sub.name,
          yearName: year.shortName,
          yearId: year.id,
          cf: sub.cf,
          freq: sub.finalFrequency,
          absences: sub.totalAbsences,
          ac: sub.acTotal,
          category: sub.category,
          color: sub.color,
        });
      }
    });
  });

  const filteredPoints =
    selectedYearFilter === 'all'
      ? points
      : points.filter((p) => p.yearId === selectedYearFilter);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 360;
  const padding = { top: 30, right: 40, bottom: 50, left: 55 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const minFreq = 70;
  const maxFreq = 100;
  const minGrade = 4;
  const maxGrade = 10;

  const getX = (freq: number) => {
    const clamped = Math.max(minFreq, Math.min(maxFreq, freq));
    return padding.left + ((clamped - minFreq) / (maxFreq - minFreq)) * chartWidth;
  };

  const getY = (grade: number) => {
    const clamped = Math.max(minGrade, Math.min(maxGrade, grade));
    return padding.top + chartHeight - ((clamped - minGrade) / (maxGrade - minGrade)) * chartHeight;
  };

  const quadSplitX = getX(90);
  const quadSplitY = getY(7.0);

  return (
    <ChartCard
      title="Correlação: Frequência (%) vs. Nota Final (CF)"
      subtitle="Diagrama de dispersão em 4 quadrantes relacionando presença e rendimento final"
      badge="Gráfico de Dispersão / Bolhas"
      controls={
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedYearFilter('all')}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
              selectedYearFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            Todos os Anos
          </button>
          {SCHOOL_DATA.map((y) => (
            <button
              key={y.id}
              onClick={() => setSelectedYearFilter(y.id)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                selectedYearFilter === y.id
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
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[650px] select-none"
        >
          {/* Quadrant backgrounds */}
          {/* Top-Right: Excelência */}
          <rect
            x={quadSplitX}
            y={padding.top}
            width={svgWidth - padding.right - quadSplitX}
            height={quadSplitY - padding.top}
            fill="#10b981"
            fillOpacity={0.05}
          />
          {/* Top-Left: Resiliência */}
          <rect
            x={padding.left}
            y={padding.top}
            width={quadSplitX - padding.left}
            height={quadSplitY - padding.top}
            fill="#06b6d4"
            fillOpacity={0.03}
          />
          {/* Bottom-Right: Foco Pedagógico */}
          <rect
            x={quadSplitX}
            y={quadSplitY}
            width={svgWidth - padding.right - quadSplitX}
            height={svgHeight - padding.bottom - quadSplitY}
            fill="#f59e0b"
            fillOpacity={0.04}
          />
          {/* Bottom-Left: Alerta */}
          <rect
            x={padding.left}
            y={quadSplitY}
            width={quadSplitX - padding.left}
            height={svgHeight - padding.bottom - quadSplitY}
            fill="#f43f5e"
            fillOpacity={0.05}
          />

          {/* Quadrant Labels */}
          <text
            x={svgWidth - padding.right - 10}
            y={padding.top + 16}
            textAnchor="end"
            className="fill-emerald-400/80 text-[10px] font-semibold tracking-wider"
          >
            QUADRANTE I: EXCELÊNCIA (Freq ≥ 90%, Nota ≥ 7.0)
          </text>
          <text
            x={padding.left + 10}
            y={padding.top + 16}
            textAnchor="start"
            className="fill-cyan-400/70 text-[10px] font-semibold tracking-wider"
          >
            QUADRANTE II: ALTA EFICIÊNCIA (Freq &lt; 90%, Nota ≥ 7.0)
          </text>
          <text
            x={svgWidth - padding.right - 10}
            y={svgHeight - padding.bottom - 10}
            textAnchor="end"
            className="fill-amber-400/80 text-[10px] font-semibold tracking-wider"
          >
            QUADRANTE IV: ESFORÇO ACADÊMICO (Freq ≥ 90%, Nota &lt; 7.0)
          </text>
          <text
            x={padding.left + 10}
            y={svgHeight - padding.bottom - 10}
            textAnchor="start"
            className="fill-rose-400/80 text-[10px] font-semibold tracking-wider"
          >
            QUADRANTE III: ATENÇÃO CRÍTICA (Freq &lt; 90%, Nota &lt; 7.0)
          </text>

          {/* Dividing axes for quadrants */}
          <line
            x1={quadSplitX}
            y1={padding.top}
            x2={quadSplitX}
            y2={svgHeight - padding.bottom}
            stroke="#475569"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <line
            x1={padding.left}
            y1={quadSplitY}
            x2={svgWidth - padding.right}
            y2={quadSplitY}
            stroke="#475569"
            strokeWidth={1}
            strokeDasharray="4 3"
          />

          {/* Y Axis Grid (Grades 4 to 10) */}
          {[4, 5, 6, 7, 8, 9, 10].map((g) => {
            const y = getY(g);
            return (
              <g key={g}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeWidth={0.5}
                  strokeOpacity={0.25}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono text-[10px] tabular-nums fill-slate-400"
                >
                  {g}.0
                </text>
              </g>
            );
          })}

          {/* X Axis Grid (Frequency 70% to 100%) */}
          {[70, 75, 80, 85, 90, 95, 100].map((f) => {
            const x = getX(f);
            return (
              <g key={f}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={svgHeight - padding.bottom}
                  stroke="#334155"
                  strokeWidth={0.5}
                  strokeOpacity={0.25}
                />
                <text
                  x={x}
                  y={svgHeight - padding.bottom + 18}
                  textAnchor="middle"
                  className="font-mono text-[10px] tabular-nums fill-slate-400"
                >
                  {f}%
                </text>
              </g>
            );
          })}

          {/* Axis Titles */}
          <text
            x={padding.left + chartWidth / 2}
            y={svgHeight - 12}
            textAnchor="middle"
            className="fill-slate-400 text-xs font-medium"
          >
            Frequência Final (%)
          </text>
          <text
            x={-svgHeight / 2}
            y={16}
            transform="rotate(-90)"
            textAnchor="middle"
            className="fill-slate-400 text-xs font-medium"
          >
            Nota do Conselho Final (CF)
          </text>

          {/* Scatter Bubbles */}
          {filteredPoints.map((pt) => {
            const cx = getX(pt.freq);
            // Add tiny deterministic jitter if overlapping
            const hash = pt.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            const jitterY = ((hash % 7) - 3) * 1.5;
            const cy = getY(pt.cf) + jitterY;

            // Radius proportional to absences
            const r = Math.min(14, Math.max(5, 5 + Math.sqrt(pt.absences) * 1.4));
            const isHovered =
              hoveredPoint?.subject === pt.subject &&
              hoveredPoint?.yearName === pt.yearName;

            return (
              <g
                key={pt.id}
                className="cursor-pointer"
                onMouseEnter={() =>
                  setHoveredPoint({
                    subject: pt.subject,
                    yearName: pt.yearName,
                    cf: pt.cf,
                    freq: pt.freq,
                    absences: pt.absences,
                    ac: pt.ac,
                    category: pt.category,
                    color: pt.color,
                    x: cx,
                    y: cy,
                  })
                }
                onClick={() =>
                  setHoveredPoint({
                    subject: pt.subject,
                    yearName: pt.yearName,
                    cf: pt.cf,
                    freq: pt.freq,
                    absences: pt.absences,
                    ac: pt.ac,
                    category: pt.category,
                    color: pt.color,
                    x: cx,
                    y: cy,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? r + 3 : r}
                  fill={pt.color}
                  fillOpacity={isHovered ? 0.9 : 0.65}
                  stroke={isHovered ? '#ffffff' : '#0b0f17'}
                  strokeWidth={isHovered ? 2 : 1.2}
                  className="transition-all duration-150"
                />
                {/* Center dot */}
                <circle cx={cx} cy={cy} r={1.5} fill="#ffffff" fillOpacity={0.8} />
              </g>
            );
          })}

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <g
              transform={`translate(${Math.min(
                Math.max(hoveredPoint.x - 85, 10),
                svgWidth - 180
              )}, ${Math.max(hoveredPoint.y - 75, 10)})`}
              className="pointer-events-none"
            >
              <rect
                width={170}
                height={65}
                rx={6}
                fill="#1e293b"
                stroke={hoveredPoint.color}
                strokeWidth={1.5}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
              />
              <text
                x={85}
                y={16}
                textAnchor="middle"
                className="fill-slate-200 text-[11px] font-semibold"
              >
                {hoveredPoint.subject}
              </text>
              <text
                x={85}
                y={30}
                textAnchor="middle"
                className="text-[10px] fill-slate-400"
              >
                {hoveredPoint.yearName} · {hoveredPoint.category}
              </text>
              <text
                x={85}
                y={46}
                textAnchor="middle"
                className="font-mono text-xs font-bold tabular-nums fill-cyan-300"
              >
                Nota CF: {hoveredPoint.cf}.0 | Freq: {hoveredPoint.freq}%
              </text>
              <text
                x={85}
                y={58}
                textAnchor="middle"
                className="font-mono text-[9px] tabular-nums fill-slate-400"
              >
                Faltas: {hoveredPoint.absences}
                {hoveredPoint.ac ? ` (Compensadas: ${hoveredPoint.ac})` : ''}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
        <div className="flex items-center gap-2">
          <span>* O diâmetro de cada bolha é proporcional ao volume total de faltas.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Freq &gt; 90%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
            Freq &lt; 85%
          </span>
        </div>
      </div>
    </ChartCard>
  );
};

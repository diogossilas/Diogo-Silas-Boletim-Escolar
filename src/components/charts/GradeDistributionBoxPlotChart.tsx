import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { SCHOOL_DATA } from '../../data/schoolData';

export const GradeDistributionBoxPlotChart: React.FC = () => {
  const [selectedDisciplineHighlight, setSelectedDisciplineHighlight] = useState<string>('all');

  // Compute stats for each year
  const yearStats = SCHOOL_DATA.map((year) => {
    const cfGrades = year.subjects
      .map((s) => ({ name: s.name, cf: s.cf, color: s.color }))
      .filter((s): s is { name: string; cf: number; color: string } => s.cf !== null);

    const values = cfGrades.map((g) => g.cf).sort((a, b) => a - b);
    const min = values[0] ?? 0;
    const max = values[values.length - 1] ?? 0;
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = values.length ? Number((sum / values.length).toFixed(1)) : 0;
    const median = values.length
      ? values.length % 2 === 0
        ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
        : values[Math.floor(values.length / 2)]
      : 0;

    return {
      id: year.id,
      name: year.shortName,
      min,
      max,
      mean,
      median,
      grades: cfGrades,
    };
  });

  const svgWidth = 780;
  const svgHeight = 320;
  const padding = { top: 30, right: 30, bottom: 50, left: 45 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const minVal = 4;
  const maxVal = 10;

  const getY = (v: number) =>
    padding.top + chartHeight - ((v - minVal) / (maxVal - minVal)) * chartHeight;

  const getColX = (colIdx: number) =>
    padding.left + (colIdx + 0.5) * (chartWidth / yearStats.length);

  return (
    <ChartCard
      title="Dispersão Estatística das Notas por Ano Letivo"
      subtitle="Distribuição pontual, média, mediana e amplitude das notas do Conselho Final"
      badge="Gráfico de Dispersão / Boxplot Strip"
    >
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[620px] select-none">
          {/* Y Axis Grid lines */}
          {[4, 5, 6, 7, 8, 9, 10].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke={val === 5 ? '#f43f5e' : val === 8 ? '#10b981' : '#334155'}
                  strokeWidth={val === 5 || val === 8 ? 1.2 : 0.6}
                  strokeDasharray={val === 5 || val === 8 ? '4 3' : undefined}
                  strokeOpacity={val === 5 || val === 8 ? 0.6 : 0.25}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono text-[10px] tabular-nums fill-slate-400"
                >
                  {val}.0
                </text>
              </g>
            );
          })}

          {/* Columns for each year */}
          {yearStats.map((stat, idx) => {
            const colX = getColX(idx);
            const minY = getY(stat.min);
            const maxY = getY(stat.max);
            const meanY = getY(stat.mean);
            const medianY = getY(stat.median);

            return (
              <g key={stat.id}>
                {/* Column background strip */}
                <rect
                  x={colX - 45}
                  y={padding.top}
                  width={90}
                  height={chartHeight}
                  fill="#ffffff"
                  fillOpacity={idx % 2 === 0 ? 0.015 : 0}
                  rx={6}
                />

                {/* Range vertical whisker */}
                <line
                  x1={colX}
                  y1={minY}
                  x2={colX}
                  y2={maxY}
                  stroke="#475569"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                />

                {/* Min / Max horizontal caps */}
                <line
                  x1={colX - 16}
                  y1={minY}
                  x2={colX + 16}
                  y2={minY}
                  stroke="#64748b"
                  strokeWidth={2}
                />
                <line
                  x1={colX - 16}
                  y1={maxY}
                  x2={colX + 16}
                  y2={maxY}
                  stroke="#64748b"
                  strokeWidth={2}
                />

                {/* Median Line */}
                <line
                  x1={colX - 22}
                  y1={medianY}
                  x2={colX + 22}
                  y2={medianY}
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                />

                {/* Mean Diamond */}
                <polygon
                  points={`${colX},${meanY - 5} ${colX + 5},${meanY} ${colX},${meanY + 5} ${colX - 5},${meanY}`}
                  fill="#eab308"
                />

                {/* Individual Grade Dots */}
                {stat.grades.map((item, gIdx) => {
                  const hash = item.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                  const jitterX = ((hash % 7) - 3) * 6;
                  const itemY = getY(item.cf);

                  return (
                    <circle
                      key={`${item.name}-${gIdx}`}
                      cx={colX + jitterX}
                      cy={itemY}
                      r={4}
                      fill={item.color}
                      fillOpacity={0.8}
                      stroke="#0b0f17"
                      strokeWidth={1.5}
                    >
                      <title>
                        {item.name}: {item.cf}.0
                      </title>
                    </circle>
                  );
                })}

                {/* Year Label */}
                <text
                  x={colX}
                  y={svgHeight - padding.bottom + 18}
                  textAnchor="middle"
                  className="fill-slate-200 text-xs font-semibold"
                >
                  {stat.name}
                </text>

                {/* Mean Badge Below Label */}
                <text
                  x={colX}
                  y={svgHeight - padding.bottom + 32}
                  textAnchor="middle"
                  className="font-mono text-[10px] tabular-nums fill-amber-400 font-medium"
                >
                  Média: {stat.mean}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-[#38bdf8]" />
            <span>Mediana</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rotate-45 bg-[#eab308]" />
            <span>Média Aritmética</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Notas Individuais</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          * Note a elevação da mediana de <span className="text-cyan-400">5.0</span> na 1ª Série para{' '}
          <span className="text-emerald-400">8.0</span> nas 2ª e 3ª Séries.
        </div>
      </div>
    </ChartCard>
  );
};

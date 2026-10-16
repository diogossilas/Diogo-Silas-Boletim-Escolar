import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { SCHOOL_DATA, YearReport, SubjectData } from '../../data/schoolData';

export const BimestralBarChart: React.FC = () => {
  const [selectedYearId, setSelectedYearId] = useState<string>('8ef');
  const [hoveredBar, setHoveredBar] = useState<{
    subject: string;
    bimester: number;
    grade: number | string | null;
    absences: number;
    freq: number | null;
    x: number;
    y: number;
  } | null>(null);

  const currentYear: YearReport =
    SCHOOL_DATA.find((y) => y.id === selectedYearId) || SCHOOL_DATA[0];

  // Only subjects with numeric grades or active concepts
  const subjectsWithGrades = currentYear.subjects.filter(
    (s) => s.grades.some((g) => g !== null) || s.cf !== null
  );

  const bimesterColors = ['#38bdf8', '#818cf8', '#c084fc', '#f43f5e'];

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 64, left: 45 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const maxVal = 10;
  const minVal = 0;

  const getY = (val: number) => {
    return padding.top + chartHeight - (val / maxVal) * chartHeight;
  };

  const groupWidth = chartWidth / subjectsWithGrades.length;
  const barWidth = Math.min(12, (groupWidth - 14) / 4);

  return (
    <ChartCard
      title="Desempenho Bimestral por Disciplina"
      subtitle="Distribuição em barras agrupadas dos 4 bimestres com indicador do Conselho Final (CF)"
      badge="Gráfico de Barras Agrupadas"
      controls={
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {SCHOOL_DATA.map((year) => (
            <button
              key={year.id}
              onClick={() => setSelectedYearId(year.id)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                selectedYearId === year.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {year.shortName}
            </button>
          ))}
        </div>
      }
    >
      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#38bdf8]" />
          <span className="text-slate-300">1º Bimestre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#818cf8]" />
          <span className="text-slate-300">2º Bimestre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#c084fc]" />
          <span className="text-slate-300">3º Bimestre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#f43f5e]" />
          <span className="text-slate-300">4º Bimestre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rotate-45 bg-amber-400" />
          <span className="text-amber-300">Conselho Final (CF)</span>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[720px] select-none"
        >
          {/* Y Grid lines */}
          {[0, 2, 4, 5, 6, 8, 10].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke={val === 5 ? '#f43f5e' : '#334155'}
                  strokeWidth={val === 5 ? 1.2 : 0.6}
                  strokeDasharray={val === 5 ? '4 3' : undefined}
                  strokeOpacity={val === 5 ? 0.6 : 0.3}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono text-[10px] tabular-nums fill-slate-400"
                >
                  {val}
                </text>
              </g>
            );
          })}

          <text
            x={svgWidth - padding.right}
            y={getY(5) - 5}
            textAnchor="end"
            className="fill-rose-400 text-[10px]"
          >
            Nota de corte (5.0)
          </text>

          {/* Grouped bars for each subject */}
          {subjectsWithGrades.map((subject: SubjectData, sIdx: number) => {
            const groupX = padding.left + sIdx * groupWidth;
            const groupCenterX = groupX + groupWidth / 2;
            const startX = groupCenterX - (4 * barWidth) / 2;

            return (
              <g key={subject.id}>
                {/* Subtle column background highlight */}
                <rect
                  x={groupX + 4}
                  y={padding.top}
                  width={groupWidth - 8}
                  height={chartHeight}
                  fill="#ffffff"
                  fillOpacity={sIdx % 2 === 0 ? 0.015 : 0}
                  rx={4}
                />

                {/* 4 bimester bars */}
                {subject.grades.map((grade, bIdx) => {
                  const bimesterNum = bIdx + 1;
                  const numGrade = grade ?? 0;
                  const barX = startX + bIdx * barWidth;
                  const barH = (numGrade / maxVal) * chartHeight;
                  const barY = getY(numGrade);

                  return (
                    <g
                      key={bIdx}
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredBar({
                          subject: subject.name,
                          bimester: bimesterNum,
                          grade: grade !== null ? `${grade}.0` : (subject.concepts?.[bIdx] ?? '-'),
                          absences: subject.absences[bIdx] ?? 0,
                          freq: subject.frequency[bIdx] ?? null,
                          x: barX + barWidth / 2,
                          y: barY,
                        })
                      }
                      onMouseLeave={() => setHoveredBar(null)}
                      onClick={() =>
                        setHoveredBar({
                          subject: subject.name,
                          bimester: bimesterNum,
                          grade: grade !== null ? `${grade}.0` : (subject.concepts?.[bIdx] ?? '-'),
                          absences: subject.absences[bIdx] ?? 0,
                          freq: subject.frequency[bIdx] ?? null,
                          x: barX + barWidth / 2,
                          y: barY,
                        })
                      }
                    >
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth - 2}
                        height={Math.max(barH, 2)}
                        fill={bimesterColors[bIdx]}
                        rx={2}
                        className="transition-all duration-150 hover:brightness-125"
                      />
                    </g>
                  );
                })}

                {/* Conselho Final diamond marker */}
                {subject.cf !== null && (() => {
                  const cfVal = subject.cf;
                  const cfY = getY(cfVal);
                  return (
                    <g
                      transform={`translate(${groupCenterX - 1}, ${cfY})`}
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredBar({
                          subject: subject.name,
                          bimester: 0,
                          grade: `CF: ${cfVal}.0`,
                          absences: subject.totalAbsences,
                          freq: subject.finalFrequency,
                          x: groupCenterX,
                          y: cfY,
                        })
                      }
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <polygon
                        points="0,-5 5,0 0,5 -5,0"
                        fill="#f59e0b"
                        stroke="#0b0f17"
                        strokeWidth={1.5}
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
                      />
                    </g>
                  );
                })()}

                {/* Subject label at bottom rotated */}
                <text
                  x={groupCenterX}
                  y={svgHeight - padding.bottom + 16}
                  textAnchor="middle"
                  className="fill-slate-300 text-[10px] font-medium"
                >
                  {subject.name.length > 14
                    ? `${subject.name.substring(0, 12)}...`
                    : subject.name}
                </text>
                <text
                  x={groupCenterX}
                  y={svgHeight - padding.bottom + 30}
                  textAnchor="middle"
                  className="font-mono text-[9px] tabular-nums fill-amber-400"
                >
                  CF: {subject.cf ?? subject.cfConcept ?? '-'}
                </text>
              </g>
            );
          })}

          {/* Hover Tooltip */}
          {hoveredBar && (
            <g
              transform={`translate(${Math.min(
                Math.max(hoveredBar.x - 75, 10),
                svgWidth - 160
              )}, ${Math.max(hoveredBar.y - 65, 10)})`}
              className="pointer-events-none"
            >
              <rect
                width={150}
                height={55}
                rx={6}
                fill="#1e293b"
                stroke="#475569"
                strokeWidth={1}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
              />
              <text
                x={75}
                y={16}
                textAnchor="middle"
                className="fill-slate-200 text-[11px] font-semibold"
              >
                {hoveredBar.subject}
              </text>
              <text
                x={75}
                y={32}
                textAnchor="middle"
                className="font-mono text-xs font-bold tabular-nums fill-cyan-300"
              >
                {hoveredBar.bimester === 0 ? hoveredBar.grade : `${hoveredBar.bimester}º Bim: ${hoveredBar.grade}`}
              </text>
              <text
                x={75}
                y={46}
                textAnchor="middle"
                className="font-mono text-[10px] tabular-nums fill-slate-400"
              >
                Faltas: {hoveredBar.absences} | Freq: {hoveredBar.freq ? `${hoveredBar.freq}%` : '-'}
              </text>
            </g>
          )}
        </svg>
      </div>
    </ChartCard>
  );
};

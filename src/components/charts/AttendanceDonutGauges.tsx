import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { SCHOOL_DATA, YearReport } from '../../data/schoolData';

export const AttendanceDonutGauges: React.FC = () => {
  const [selectedYearId, setSelectedYearId] = useState<string>('9ef');
  const [hoveredSlice, setHoveredSlice] = useState<{
    name: string;
    absences: number;
    pct: number;
    color: string;
  } | null>(null);

  const currentYear: YearReport =
    SCHOOL_DATA.find((y) => y.id === selectedYearId) || SCHOOL_DATA[1];

  // Subjects with absences > 0
  const subjectsWithAbsences = currentYear.subjects
    .filter((s) => s.totalAbsences > 0)
    .sort((a, b) => b.totalAbsences - a.totalAbsences);

  const totalAbsences = subjectsWithAbsences.reduce((acc, s) => acc + s.totalAbsences, 0);

  // Overall attendance calculation
  const validFreqs = currentYear.subjects
    .map((s) => s.finalFrequency)
    .filter((f): f is number => f !== null);

  const avgAttendance = validFreqs.length
    ? Math.round(validFreqs.reduce((a, b) => a + b, 0) / validFreqs.length)
    : 100;

  // Donut SVG geometry
  const donutSize = 220;
  const donutRadius = 80;
  const donutStrokeWidth = 28;
  const donutCenter = donutSize / 2;
  const circumference = 2 * Math.PI * donutRadius;

  let cumulativeAngle = 0;
  const donutSlices = subjectsWithAbsences.map((sub) => {
    const slicePercent = totalAbsences > 0 ? sub.totalAbsences / totalAbsences : 0;
    const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle * circumference;
    cumulativeAngle += slicePercent;

    return {
      id: sub.id,
      name: sub.name,
      absences: sub.totalAbsences,
      pct: Math.round(slicePercent * 100),
      color: sub.color,
      strokeDasharray,
      strokeDashoffset,
      ac: sub.acTotal,
    };
  });

  // Overall circular gauge
  const gaugeRadius = 60;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeDashOffset = gaugeCircumference * (1 - avgAttendance / 100);

  return (
    <ChartCard
      title="Análise de Assiduidade e Distribuição de Faltas"
      subtitle="Indicadores circulares de presença global e diagrama de composição das ausências"
      badge="Gráficos de Rosca / Donut & Gauges"
      controls={
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {SCHOOL_DATA.map((y) => (
            <button
              key={y.id}
              onClick={() => setSelectedYearId(y.id)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
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
      <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {/* Left Column: Overall Attendance Gauge */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Frequência Global do Ano
          </div>

          <div className="relative my-3 flex items-center justify-center">
            <svg width={150} height={150} className="-rotate-90 select-none">
              {/* Background ring */}
              <circle
                cx={75}
                cy={75}
                r={gaugeRadius}
                fill="transparent"
                stroke="#1e293b"
                strokeWidth={12}
              />
              {/* Progress ring */}
              <circle
                cx={75}
                cy={75}
                r={gaugeRadius}
                fill="transparent"
                stroke={avgAttendance >= 90 ? '#10b981' : avgAttendance >= 80 ? '#f59e0b' : '#f43f5e'}
                strokeWidth={12}
                strokeDasharray={gaugeCircumference}
                strokeDashoffset={gaugeDashOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-mono text-2xl font-bold tabular-nums text-slate-100">
                {avgAttendance}%
              </span>
              <span className="text-[10px] text-slate-400">Presença Média</span>
            </div>
          </div>

          <div className="flex w-full items-center justify-around border-t border-slate-800/60 pt-3 text-xs">
            <div className="text-center">
              <div className="font-mono text-sm font-semibold tabular-nums text-cyan-400">
                {totalAbsences}
              </div>
              <div className="text-[10px] text-slate-400">Total Faltas</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-sm font-semibold tabular-nums text-emerald-400">
                {currentYear.subjects.reduce((acc, s) => acc + (s.acTotal || 0), 0)}
              </div>
              <div className="text-[10px] text-slate-400">Ausências Comp. (AC)</div>
            </div>
          </div>
        </div>

        {/* Center Column: Donut chart of absence burden */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Concentração de Faltas
          </div>

          <div className="relative flex items-center justify-center">
            {totalAbsences > 0 ? (
              <svg width={donutSize} height={donutSize} className="-rotate-90 select-none">
                {donutSlices.map((slice) => (
                  <circle
                    key={slice.id}
                    cx={donutCenter}
                    cy={donutCenter}
                    r={donutRadius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={donutStrokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onMouseEnter={() =>
                      setHoveredSlice({
                        name: slice.name,
                        absences: slice.absences,
                        pct: slice.pct,
                        color: slice.color,
                      })
                    }
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                ))}
              </svg>
            ) : (
              <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full border border-dashed border-emerald-500/30 text-center text-xs text-emerald-400">
                100% de Presença!
                <br />0 faltas registradas.
              </div>
            )}

            {totalAbsences > 0 && (
              <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
                <span className="font-mono text-lg font-bold tabular-nums text-slate-100">
                  {hoveredSlice ? `${hoveredSlice.pct}%` : `${totalAbsences}`}
                </span>
                <span className="max-w-[100px] truncate text-[10px] text-slate-400">
                  {hoveredSlice ? hoveredSlice.name : 'Faltas Registradas'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Breakdown Table of Top Absences */}
        <div className="sm:col-span-2 xl:col-span-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Disciplinas com Maior Ausência
          </div>

          <div className="space-y-2">
            {subjectsWithAbsences.slice(0, 5).map((sub) => {
              const pct = totalAbsences > 0 ? Math.round((sub.totalAbsences / totalAbsences) * 100) : 0;
              return (
                <div key={sub.id} className="rounded-lg bg-slate-900/40 p-2 border border-slate-800/50">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                      <span className="truncate font-medium text-slate-300">{sub.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="font-semibold text-rose-400">{sub.totalAbsences} faltas</span>
                      <span className="text-[10px] text-slate-500">({pct}%)</span>
                    </div>
                  </div>

                  {/* Micro progress bar */}
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: sub.color,
                      }}
                    />
                  </div>

                  {sub.acTotal ? (
                    <div className="mt-1 text-[10px] text-emerald-400 font-mono">
                      {sub.acTotal} faltas compensadas (AC)
                    </div>
                  ) : null}
                </div>
              );
            })}

            {subjectsWithAbsences.length === 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center text-xs text-slate-400">
                Nenhuma falta registrada neste ano letivo.
              </div>
            )}
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

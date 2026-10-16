import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { HISTORICAL_CF_DATA } from '../../data/schoolData';

export const RadarCompetenceChart: React.FC = () => {
  const [primaryYear, setPrimaryYear] = useState<'8º Ano' | '9º Ano' | '1ª Série' | '2ª Série' | '3ª Série'>('3ª Série');
  const [comparisonYear, setComparisonYear] = useState<'8º Ano' | '9º Ano' | '1ª Série' | '2ª Série' | '3ª Série' | 'none'>('8º Ano');

  const years = ['8º Ano', '9º Ano', '1ª Série', '2ª Série', '3ª Série'] as const;

  // Filter subjects that have numeric grades in at least one selected year
  const activeSubjects = HISTORICAL_CF_DATA.filter((s) => {
    const val1 = s.grades[primaryYear];
    const val2 = comparisonYear !== 'none' ? s.grades[comparisonYear] : null;
    return val1 !== null || val2 !== null;
  });

  const size = 420;
  const center = size / 2;
  const radius = center - 50;
  const totalAxes = activeSubjects.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getAxisEnd = (index: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const getLabelCoords = (index: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const labelRadius = radius + 24;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  };

  // Build polygon path for a year
  const buildPolygon = (year: '8º Ano' | '9º Ano' | '1ª Série' | '2ª Série' | '3ª Série') => {
    const points: string[] = [];
    activeSubjects.forEach((sub, i) => {
      const val = sub.grades[year] ?? 5; // fallback to 5 if not in that year
      const coords = getCoordinates(val, i);
      points.push(`${coords.x},${coords.y}`);
    });
    return points.join(' ');
  };

  const primaryAvg = (
    activeSubjects.reduce((acc, s) => acc + (s.grades[primaryYear] ?? 0), 0) /
    activeSubjects.filter((s) => s.grades[primaryYear] !== null).length
  ).toFixed(1);

  const compAvg =
    comparisonYear !== 'none'
      ? (
          activeSubjects.reduce((acc, s) => acc + (s.grades[comparisonYear] ?? 0), 0) /
          activeSubjects.filter((s) => s.grades[comparisonYear] !== null).length
        ).toFixed(1)
      : null;

  return (
    <ChartCard
      title="Radar de Perfil Acadêmico Multidimensional"
      subtitle="Distribuição poligonal de competências por disciplina e comparação entre ciclos"
      badge="Gráfico Teia / Spider"
      controls={
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Ano Principal:</span>
            <select
              value={primaryYear}
              onChange={(e) => setPrimaryYear(e.target.value as any)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Comparar com:</span>
            <select
              value={comparisonYear}
              onChange={(e) => setComparisonYear(e.target.value as any)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="none">Nenhum</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* Radar SVG */}
        <div className="flex justify-center lg:col-span-8">
          <svg
            viewBox="-50 -30 520 480"
            className="w-full max-w-[320px] sm:max-w-[420px] 2xl:max-w-[480px] h-auto select-none"
          >
            {/* Concentric Polygons */}
            {[2, 4, 6, 8, 10].map((ring) => {
              const ringPoints = activeSubjects
                .map((_, i) => {
                  const c = getCoordinates(ring, i);
                  return `${c.x},${c.y}`;
                })
                .join(' ');
              return (
                <g key={ring}>
                  <polygon
                    points={ringPoints}
                    fill={ring === 10 ? '#0f172a' : 'none'}
                    stroke="#334155"
                    strokeWidth={ring === 6 || ring === 10 ? 1.2 : 0.6}
                    strokeDasharray={ring === 6 ? '3 3' : undefined}
                    strokeOpacity={ring === 10 ? 0.6 : 0.4}
                  />
                  {/* Axis scale label */}
                  <text
                    x={center + 4}
                    y={center - (ring / 10) * radius + 10}
                    className="font-mono text-[9px] tabular-nums fill-slate-500"
                  >
                    {ring}
                  </text>
                </g>
              );
            })}

            {/* Radial Spoke Lines */}
            {activeSubjects.map((_, i) => {
              const axis = getAxisEnd(i);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={axis.x}
                  y2={axis.y}
                  stroke="#334155"
                  strokeWidth={0.8}
                  strokeOpacity={0.4}
                />
              );
            })}

            {/* Comparison Year Polygon */}
            {comparisonYear !== 'none' && (
              <g>
                <polygon
                  points={buildPolygon(comparisonYear)}
                  fill="#f43f5e"
                  fillOpacity={0.15}
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />
                {activeSubjects.map((sub, i) => {
                  const val = sub.grades[comparisonYear];
                  if (val === null) return null;
                  const c = getCoordinates(val, i);
                  return (
                    <circle
                      key={`comp-${i}`}
                      cx={c.x}
                      cy={c.y}
                      r={3}
                      fill="#f43f5e"
                      stroke="#0b0f17"
                      strokeWidth={1.5}
                    />
                  );
                })}
              </g>
            )}

            {/* Primary Year Polygon */}
            <polygon
              points={buildPolygon(primaryYear)}
              fill="#06b6d4"
              fillOpacity={0.25}
              stroke="#06b6d4"
              strokeWidth={2.5}
            />

            {/* Primary Year Vertices */}
            {activeSubjects.map((sub, i) => {
              const val = sub.grades[primaryYear];
              if (val === null) return null;
              const c = getCoordinates(val, i);
              return (
                <g key={`pri-${i}`}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={4}
                    fill="#06b6d4"
                    stroke="#0b0f17"
                    strokeWidth={2}
                  />
                </g>
              );
            })}

            {/* Axis Subject Labels */}
            {activeSubjects.map((sub, i) => {
              const coords = getLabelCoords(i);
              const isRight = coords.x > center + 10;
              const isLeft = coords.x < center - 10;
              const textAnchor = isRight ? 'start' : isLeft ? 'end' : 'middle';

              return (
                <text
                  key={sub.subject}
                  x={coords.x}
                  y={coords.y + 3}
                  textAnchor={textAnchor}
                  className="fill-slate-300 text-[10px] font-medium"
                >
                  {sub.shortName}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legend and Comparison Table */}
        <div className="flex flex-col gap-3 lg:col-span-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="text-xs font-semibold text-slate-300">Legenda de Análise</div>
            <div className="mt-2 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400" />
                  <span className="text-slate-200">{primaryYear}</span>
                </div>
                <span className="font-mono text-cyan-400 font-bold tabular-nums">
                  Média {primaryAvg}
                </span>
              </div>

              {comparisonYear !== 'none' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                    <span className="text-slate-200">{comparisonYear}</span>
                  </div>
                  <span className="font-mono text-rose-400 font-bold tabular-nums">
                    Média {compAvg}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="text-xs font-semibold text-slate-300">Disciplinas em Destaque</div>
            <div className="mt-2 divide-y divide-slate-800/60 text-xs">
              {activeSubjects.slice(0, 5).map((s) => {
                const pVal = s.grades[primaryYear];
                const cVal = comparisonYear !== 'none' ? s.grades[comparisonYear] : null;
                const delta = pVal !== null && cVal !== null ? pVal - cVal : null;

                return (
                  <div key={s.subject} className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">{s.shortName}</span>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-cyan-300 font-medium">{pVal ?? '-'}</span>
                      {comparisonYear !== 'none' && (
                        <>
                          <span className="text-slate-600">vs</span>
                          <span className="text-rose-400 font-medium">{cVal ?? '-'}</span>
                          {delta !== null && (
                            <span
                              className={`text-[10px] font-bold ${
                                delta > 0
                                  ? 'text-emerald-400'
                                  : delta < 0
                                  ? 'text-rose-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              ({delta > 0 ? `+${delta}` : delta})
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

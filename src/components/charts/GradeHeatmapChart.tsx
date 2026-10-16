import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { SCHOOL_DATA, YearReport } from '../../data/schoolData';

export const GradeHeatmapChart: React.FC = () => {
  const [selectedYearId, setSelectedYearId] = useState<string>('3em');
  const [metricMode, setMetricMode] = useState<'grades' | 'frequency' | 'absences'>('grades');

  const currentYear: YearReport =
    SCHOOL_DATA.find((y) => y.id === selectedYearId) || SCHOOL_DATA[4];

  // Grade color helper
  const getGradeCellColor = (val: number | null, concept?: string | null) => {
    if (val === null && !concept) return { bg: 'bg-slate-900/40', text: 'text-slate-600', border: 'border-slate-800/40' };
    
    if (concept) {
      if (concept === 'ET') return { bg: 'bg-emerald-950/80', text: 'text-emerald-300 font-bold', border: 'border-emerald-700/50' };
      if (concept === 'ES') return { bg: 'bg-cyan-950/80', text: 'text-cyan-300 font-bold', border: 'border-cyan-700/50' };
      if (concept === 'EP') return { bg: 'bg-amber-950/80', text: 'text-amber-300 font-bold', border: 'border-amber-700/50' };
      return { bg: 'bg-purple-950/80', text: 'text-purple-300 font-bold', border: 'border-purple-700/50' };
    }

    if (val! >= 9) return { bg: 'bg-emerald-900/70', text: 'text-emerald-200 font-bold', border: 'border-emerald-600/60' };
    if (val! >= 7) return { bg: 'bg-cyan-900/60', text: 'text-cyan-200 font-semibold', border: 'border-cyan-600/50' };
    if (val! >= 5) return { bg: 'bg-amber-900/50', text: 'text-amber-200', border: 'border-amber-600/40' };
    return { bg: 'bg-rose-950/80', text: 'text-rose-200 font-bold', border: 'border-rose-600/60' };
  };

  // Frequency color helper
  const getFreqCellColor = (freq: number | null) => {
    if (freq === null) return { bg: 'bg-slate-900/40', text: 'text-slate-600', border: 'border-slate-800/40' };
    if (freq >= 95) return { bg: 'bg-emerald-900/70', text: 'text-emerald-200 font-bold', border: 'border-emerald-600/60' };
    if (freq >= 90) return { bg: 'bg-teal-900/60', text: 'text-teal-200 font-semibold', border: 'border-teal-600/50' };
    if (freq >= 80) return { bg: 'bg-amber-900/50', text: 'text-amber-200', border: 'border-amber-600/40' };
    return { bg: 'bg-rose-950/80', text: 'text-rose-200 font-bold', border: 'border-rose-600/60' };
  };

  // Absences color helper
  const getAbsenceCellColor = (abs: number) => {
    if (abs === 0) return { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-900/30' };
    if (abs <= 2) return { bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-700/40' };
    if (abs <= 5) return { bg: 'bg-amber-950/60', text: 'text-amber-300 font-medium', border: 'border-amber-700/50' };
    return { bg: 'bg-rose-950/80', text: 'text-rose-300 font-bold', border: 'border-rose-700/60' };
  };

  return (
    <ChartCard
      title="Matriz Térmica (Heatmap) de Aproveitamento"
      subtitle="Visualização matricial de densidade por disciplina e período avaliativo"
      badge="Mapa de Calor / Heatmap"
      controls={
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Mode Switcher */}
          <div className="flex rounded-lg border border-slate-700/80 bg-slate-900/80 p-0.5">
            <button
              onClick={() => setMetricMode('grades')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                metricMode === 'grades'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Notas
            </button>
            <button
              onClick={() => setMetricMode('frequency')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                metricMode === 'frequency'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Frequência (%)
            </button>
            <button
              onClick={() => setMetricMode('absences')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                metricMode === 'absences'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Faltas (Qtd)
            </button>
          </div>

          {/* Year Switcher */}
          <select
            value={selectedYearId}
            onChange={(e) => setSelectedYearId(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {SCHOOL_DATA.map((y) => (
              <option key={y.id} value={y.id}>
                {y.shortName}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {/* Heatmap Legend */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Escala de Intensidade:</span>
          {metricMode === 'grades' ? (
            <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
              <span className="rounded bg-rose-950/80 px-2 py-0.5 text-rose-300 border border-rose-700/40">
                &lt; 5.0
              </span>
              <span className="rounded bg-amber-900/50 px-2 py-0.5 text-amber-200 border border-amber-700/40">
                5.0 – 6.0
              </span>
              <span className="rounded bg-cyan-900/60 px-2 py-0.5 text-cyan-200 border border-cyan-700/40">
                7.0 – 8.0
              </span>
              <span className="rounded bg-emerald-900/70 px-2 py-0.5 text-emerald-200 border border-emerald-700/40">
                9.0 – 10.0
              </span>
            </div>
          ) : metricMode === 'frequency' ? (
            <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
              <span className="rounded bg-rose-950/80 px-2 py-0.5 text-rose-300 border border-rose-700/40">
                &lt; 80%
              </span>
              <span className="rounded bg-amber-900/50 px-2 py-0.5 text-amber-200 border border-amber-700/40">
                80% – 89%
              </span>
              <span className="rounded bg-teal-900/60 px-2 py-0.5 text-teal-200 border border-teal-700/40">
                90% – 94%
              </span>
              <span className="rounded bg-emerald-900/70 px-2 py-0.5 text-emerald-200 border border-emerald-700/40">
                ≥ 95%
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
              <span className="rounded bg-emerald-950/40 px-2 py-0.5 text-emerald-300 border border-emerald-800/40">
                0 Faltas
              </span>
              <span className="rounded bg-slate-800/60 px-2 py-0.5 text-slate-300 border border-slate-700/40">
                1 – 2 Faltas
              </span>
              <span className="rounded bg-amber-950/60 px-2 py-0.5 text-amber-300 border border-amber-700/40">
                3 – 5 Faltas
              </span>
              <span className="rounded bg-rose-950/80 px-2 py-0.5 text-rose-300 border border-rose-700/40">
                &gt; 5 Faltas
              </span>
            </div>
          )}
        </div>
        <span className="text-slate-500 text-[11px]">
          {currentYear.subjects.length} disciplinas cadastradas
        </span>
      </div>

      {/* Heatmap Grid Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/60">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400">
              <th className="py-2.5 px-3 font-semibold">Disciplina</th>
              <th className="py-2.5 px-3 font-semibold">Área</th>
              <th className="py-2.5 px-3 text-center font-semibold">1º Bim</th>
              <th className="py-2.5 px-3 text-center font-semibold">2º Bim</th>
              <th className="py-2.5 px-3 text-center font-semibold">3º Bim</th>
              <th className="py-2.5 px-3 text-center font-semibold">4º Bim</th>
              <th className="py-2.5 px-3 text-center font-semibold bg-slate-900/90 text-cyan-300 border-l border-slate-800">
                {metricMode === 'grades' ? 'Conselho Final' : metricMode === 'frequency' ? 'Freq. Final' : 'Total Faltas'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {currentYear.subjects.map((sub) => {
              return (
                <tr key={sub.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-2 px-3 font-medium text-slate-200 whitespace-nowrap">
                    {sub.name}
                  </td>
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                    {sub.category}
                  </td>

                  {/* 4 Bimesters cells */}
                  {[0, 1, 2, 3].map((bIdx) => {
                    if (metricMode === 'grades') {
                      const numVal = sub.grades[bIdx];
                      const conceptVal = sub.concepts?.[bIdx];
                      const styling = getGradeCellColor(numVal, conceptVal);
                      const display = numVal !== null ? `${numVal}` : (conceptVal ?? '—');

                      return (
                        <td key={bIdx} className="p-1 text-center">
                          <div
                            className={`mx-auto flex h-8 w-14 items-center justify-center rounded border font-mono tabular-nums text-xs ${styling.bg} ${styling.text} ${styling.border}`}
                          >
                            {display}
                          </div>
                        </td>
                      );
                    } else if (metricMode === 'frequency') {
                      const freqVal = sub.frequency[bIdx];
                      const styling = getFreqCellColor(freqVal);
                      const display = freqVal !== null ? `${freqVal}%` : '—';

                      return (
                        <td key={bIdx} className="p-1 text-center">
                          <div
                            className={`mx-auto flex h-8 w-14 items-center justify-center rounded border font-mono tabular-nums text-xs ${styling.bg} ${styling.text} ${styling.border}`}
                          >
                            {display}
                          </div>
                        </td>
                      );
                    } else {
                      const absVal = sub.absences[bIdx] ?? 0;
                      const styling = getAbsenceCellColor(absVal);

                      return (
                        <td key={bIdx} className="p-1 text-center">
                          <div
                            className={`mx-auto flex h-8 w-14 items-center justify-center rounded border font-mono tabular-nums text-xs ${styling.bg} ${styling.text} ${styling.border}`}
                          >
                            {absVal}
                          </div>
                        </td>
                      );
                    }
                  })}

                  {/* Final Column */}
                  <td className="p-1 text-center border-l border-slate-800 bg-slate-900/30">
                    {metricMode === 'grades' ? (
                      (() => {
                        const styling = getGradeCellColor(sub.cf, sub.cfConcept);
                        const display = sub.cf !== null ? `${sub.cf}` : (sub.cfConcept ?? '—');
                        return (
                          <div
                            className={`mx-auto flex h-8 w-16 items-center justify-center rounded border font-mono font-bold tabular-nums text-xs ${styling.bg} ${styling.text} ${styling.border}`}
                          >
                            {display}
                          </div>
                        );
                      })()
                    ) : metricMode === 'frequency' ? (
                      (() => {
                        const styling = getFreqCellColor(sub.finalFrequency);
                        const display = sub.finalFrequency !== null ? `${sub.finalFrequency}%` : '—';
                        return (
                          <div
                            className={`mx-auto flex h-8 w-16 items-center justify-center rounded border font-mono font-bold tabular-nums text-xs ${styling.bg} ${styling.text} ${styling.border}`}
                          >
                            {display}
                          </div>
                        );
                      })()
                    ) : (
                      (() => {
                        const styling = getAbsenceCellColor(sub.totalAbsences);
                        return (
                          <div
                            className={`mx-auto flex h-8 w-16 items-center justify-center rounded border font-mono font-bold tabular-nums text-xs ${styling.bg} ${styling.text} ${styling.border}`}
                          >
                            {sub.totalAbsences}
                          </div>
                        );
                      })()
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
};

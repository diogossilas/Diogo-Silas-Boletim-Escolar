import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { SCHOOL_DATA, YearReport } from '../../data/schoolData';

export const DivergingBarChart: React.FC = () => {
  const [selectedYearId, setSelectedYearId] = useState<string>('3em');
  const [benchmark, setBenchmark] = useState<number>(6.0);

  const currentYear: YearReport =
    SCHOOL_DATA.find((y) => y.id === selectedYearId) || SCHOOL_DATA[4];

  const subjectsWithCF = currentYear.subjects
    .filter((s) => s.cf !== null)
    .map((s) => ({
      name: s.name,
      cf: s.cf!,
      delta: Number((s.cf! - benchmark).toFixed(1)),
      category: s.category,
      color: s.color,
    }))
    .sort((a, b) => b.delta - a.delta);

  const maxDeviation = 4; // max +/- deviation

  return (
    <ChartCard
      title="Barras Divergentes: Variação vs. Linha de Corte"
      subtitle={`Desvio individual das notas em relação à referência de corte (${benchmark}.0)`}
      badge="Barras Divergentes"
      controls={
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Linha de Corte:</span>
            <div className="flex rounded-md border border-slate-700 bg-slate-900/80 p-0.5">
              {[5.0, 6.0, 7.0].map((b) => (
                <button
                  key={b}
                  onClick={() => setBenchmark(b)}
                  className={`rounded px-2 py-0.5 font-mono tabular-nums transition-colors ${
                    benchmark === b
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b}.0
                </button>
              ))}
            </div>
          </div>

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
      <div className="overflow-x-auto">
        <div className="min-w-[440px] space-y-2 py-2">
        {/* Central Baseline Axis Header */}
        <div className="grid grid-cols-12 items-center text-[11px] font-semibold text-slate-400 px-2 pb-1 border-b border-slate-800">
          <div className="col-span-4 text-left">Disciplina</div>
          <div className="col-span-3 text-right pr-2 text-rose-400">Abaixo ({`< ${benchmark}.0`})</div>
          <div className="col-span-1 text-center font-mono text-cyan-300">{benchmark}.0</div>
          <div className="col-span-3 text-left pl-2 text-emerald-400">Acima ({`> ${benchmark}.0`})</div>
          <div className="col-span-1 text-right">Nota CF</div>
        </div>

        {/* Rows */}
        {subjectsWithCF.map((item) => {
          const isPositive = item.delta > 0;
          const isNegative = item.delta < 0;
          const barWidthPercent = Math.min(100, (Math.abs(item.delta) / maxDeviation) * 100);

          return (
            <div
              key={item.name}
              className="grid grid-cols-12 items-center text-xs py-1.5 px-2 rounded hover:bg-slate-900/40 transition-colors"
            >
              {/* Subject name */}
              <div className="col-span-4 truncate font-medium text-slate-300 pr-2">
                {item.name}
              </div>

              {/* Negative deviation bar (grows to the left) */}
              <div className="col-span-3 flex justify-end pr-2">
                {isNegative && (
                  <div className="flex items-center gap-1.5 w-full justify-end">
                    <span className="font-mono text-[10px] text-rose-400 tabular-nums">
                      {item.delta}
                    </span>
                    <div
                      className="h-4 rounded-l bg-gradient-to-l from-rose-500 to-rose-700 transition-all duration-300"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Zero center axis divider */}
              <div className="col-span-1 flex justify-center">
                <div className="h-5 w-0.5 bg-slate-700" />
              </div>

              {/* Positive deviation bar (grows to the right) */}
              <div className="col-span-3 flex justify-start pl-2">
                {isPositive && (
                  <div className="flex items-center gap-1.5 w-full">
                    <div
                      className="h-4 rounded-r bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-300"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                    <span className="font-mono text-[10px] text-emerald-400 tabular-nums">
                      +{item.delta}
                    </span>
                  </div>
                )}
              </div>

              {/* Exact CF score */}
              <div className="col-span-1 text-right font-mono font-bold tabular-nums text-slate-200">
                {item.cf}.0
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </ChartCard>
  );
};

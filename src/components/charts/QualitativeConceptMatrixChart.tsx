import React from 'react';
import { ChartCard } from '../ui/ChartCard';
import { SCHOOL_DATA, CONCEPT_DESCRIPTIONS } from '../../data/schoolData';

export const QualitativeConceptMatrixChart: React.FC = () => {
  // Extract all subjects having qualitative concepts (1EM, 2EM, 3EM)
  const conceptSubjects: {
    year: string;
    name: string;
    concepts: (string | null)[];
    cfConcept?: string | null;
  }[] = [];

  const counts: Record<string, number> = { ET: 0, ES: 0, EP: 0, EXP: 0 };

  SCHOOL_DATA.slice(2).forEach((year) => {
    year.subjects.forEach((s) => {
      if (s.concepts && s.concepts.some((c) => c !== null)) {
        conceptSubjects.push({
          year: year.shortName,
          name: s.name,
          concepts: s.concepts,
          cfConcept: s.cfConcept,
        });

        s.concepts.forEach((c) => {
          if (c && counts[c] !== undefined) counts[c]++;
        });
        if (s.cfConcept && counts[s.cfConcept] !== undefined) counts[s.cfConcept]++;
      }
    });
  });

  const totalConcepts = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <ChartCard
      title="Distribuição dos Conceitos Formativos (ET / ES / EP)"
      subtitle="Mapeamento visual do engajamento nos Itinerários Formativos e Eletivas do Ensino Médio"
      badge="Gráfico Waffle / Conceitual"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Summary Concept Proportion Bars */}
        <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 lg:col-span-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Proporção Global de Engajamento
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Total de avaliações qualitativas computadas: {totalConcepts}
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(CONCEPT_DESCRIPTIONS).map(([key, info]) => {
              const count = counts[key] || 0;
              const pct = totalConcepts > 0 ? Math.round((count / totalConcepts) * 100) : 0;

              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${info.color}20`,
                          color: info.color,
                        }}
                      >
                        {key}
                      </span>
                      <span className="text-slate-300">{info.label}</span>
                    </div>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {count}x ({pct}%)
                    </span>
                  </div>

                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: info.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
            Predomínio de <span className="text-emerald-400 font-semibold">ET</span> e{' '}
            <span className="text-cyan-400 font-semibold">ES</span> (92% de engajamento pleno ou satisfatório).
          </div>
        </div>

        {/* Right: Matrix Grid of Elective Subjects */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-3 lg:col-span-7">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            Conceitos por Componente Curricular
          </div>

          <div className="space-y-2">
            {conceptSubjects.map((sub, idx) => (
              <div
                key={`${sub.year}-${sub.name}-${idx}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/50"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200">{sub.name}</div>
                  <div className="text-[10px] text-slate-500">{sub.year}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {sub.concepts.map((c, i) => {
                    const color = c ? CONCEPT_DESCRIPTIONS[c]?.color || '#94a3b8' : '#334155';
                    return (
                      <div
                        key={i}
                        className="flex h-7 w-8 items-center justify-center rounded border font-mono text-xs font-bold tabular-nums"
                        style={{
                          backgroundColor: c ? `${color}18` : 'transparent',
                          borderColor: c ? `${color}40` : '#334155',
                          color: c ? color : '#64748b',
                        }}
                        title={`${i + 1}º Bimestre: ${c || 'Sem nota'}`}
                      >
                        {c || '—'}
                      </div>
                    );
                  })}

                  {sub.cfConcept && (
                    <div
                      className="ml-2 flex h-7 items-center justify-center rounded border px-2 font-mono text-xs font-bold"
                      style={{
                        backgroundColor: `${CONCEPT_DESCRIPTIONS[sub.cfConcept]?.color}25`,
                        borderColor: CONCEPT_DESCRIPTIONS[sub.cfConcept]?.color,
                        color: CONCEPT_DESCRIPTIONS[sub.cfConcept]?.color,
                      }}
                      title="Conselho Final"
                    >
                      CF: {sub.cfConcept}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

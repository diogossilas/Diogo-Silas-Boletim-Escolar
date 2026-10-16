import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { HISTORICAL_CF_DATA, YEARS_LIST } from '../../data/schoolData';

export const HistoricalEvolutionChart: React.FC = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Matemática',
    'Língua Portuguesa',
    'História',
    'Ciências / Biologia',
    'Filosofia',
  ]);
  const [hoveredNode, setHoveredNode] = useState<{
    subject: string;
    year: string;
    grade: number;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Exatas', 'Linguagens', 'Humanas', 'Biológicas'];

  const toggleSubject = (name: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const selectAll = () => {
    setSelectedSubjects(HISTORICAL_CF_DATA.map((d) => d.subject));
  };

  const clearAll = () => {
    setSelectedSubjects([]);
  };

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'Todas') {
      setSelectedSubjects([
        'Matemática',
        'Língua Portuguesa',
        'História',
        'Ciências / Biologia',
        'Filosofia',
      ]);
    } else {
      setSelectedSubjects(
        HISTORICAL_CF_DATA.filter((d) => d.category === cat).map((d) => d.subject)
      );
    }
  };

  // SVG Chart Geometry
  const width = 800;
  const height = 340;
  const padding = { top: 28, right: 36, bottom: 44, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minGrade = 4;
  const maxGrade = 10;

  const getX = (yearIndex: number) => {
    return padding.left + (yearIndex / (YEARS_LIST.length - 1)) * chartWidth;
  };

  const getY = (grade: number) => {
    return padding.top + chartHeight - ((grade - minGrade) / (maxGrade - minGrade)) * chartHeight;
  };

  const passingY = getY(5.0);
  const excellenceY = getY(8.0);

  return (
    <ChartCard
      title="Evolução Temporal das Médias Finais (CF)"
      subtitle="Trajetória longitudinal das notas nos 5 anos letivos (8º EF ao 3º EM)"
      badge="Multi-séries com Linha de Referência"
      controls={
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <div className="flex flex-wrap rounded-lg border border-slate-700/60 bg-slate-900/60 p-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={selectAll}
            className="rounded border border-slate-700/60 px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            Todas
          </button>
          <button
            onClick={clearAll}
            className="rounded border border-slate-700/60 px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            Limpar
          </button>
        </div>
      }
    >
      {/* Subject Toggles */}
      <div className="mb-4 flex flex-wrap gap-2 pt-1">
        {HISTORICAL_CF_DATA.map((item) => {
          const isSelected = selectedSubjects.includes(item.subject);
          return (
            <button
              key={item.subject}
              onClick={() => toggleSubject(item.subject)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                isSelected
                  ? 'border border-slate-700 bg-slate-800/90 text-slate-200 shadow-sm'
                  : 'border border-transparent bg-slate-900/40 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full transition-opacity"
                style={{
                  backgroundColor: item.color,
                  opacity: isSelected ? 1 : 0.3,
                }}
              />
              <span>{item.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* SVG Chart */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[620px] select-none overflow-visible"
        >
          <defs>
            <linearGradient id="grid-glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis marks */}
          {[4, 5, 6, 7, 8, 9, 10].map((grade) => {
            const y = getY(grade);
            return (
              <g key={grade}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={grade === 5 ? '#f43f5e' : grade === 8 ? '#10b981' : '#334155'}
                  strokeWidth={grade === 5 || grade === 8 ? 1.2 : 0.75}
                  strokeDasharray={grade === 5 || grade === 8 ? '4 3' : undefined}
                  strokeOpacity={grade === 5 || grade === 8 ? 0.7 : 0.3}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono text-[11px] tabular-nums fill-slate-400"
                >
                  {grade}.0
                </text>
              </g>
            );
          })}

          {/* Reference labels */}
          <text
            x={width - padding.right}
            y={passingY - 6}
            textAnchor="end"
            className="fill-rose-400 text-[10px] font-medium tracking-wider"
          >
            Média Mínima (5.0)
          </text>
          <text
            x={width - padding.right}
            y={excellenceY - 6}
            textAnchor="end"
            className="fill-emerald-400 text-[10px] font-medium tracking-wider"
          >
            Meta de Excelência (8.0+)
          </text>

          {/* X-axis year lines & labels */}
          {YEARS_LIST.map((year, index) => {
            const x = getX(index);
            return (
              <g key={year}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#334155"
                  strokeWidth={0.75}
                  strokeOpacity={0.25}
                />
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  className="fill-slate-300 text-xs font-medium"
                >
                  {year}
                </text>
                <text
                  x={x}
                  y={height - padding.bottom + 34}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px]"
                >
                  {index < 2 ? 'EF' : 'EM'}
                </text>
              </g>
            );
          })}

          {/* Lines for each selected subject */}
          {HISTORICAL_CF_DATA.filter((d) => selectedSubjects.includes(d.subject)).map((item) => {
            const points: { x: number; y: number; grade: number; year: string }[] = [];

            YEARS_LIST.forEach((year, index) => {
              const grade = item.grades[year];
              if (grade !== null) {
                points.push({
                  x: getX(index),
                  y: getY(grade),
                  grade,
                  year,
                });
              }
            });

            if (points.length < 2) return null;

            // Generate SVG path d
            const pathData = points.reduce((acc, pt, i) => {
              return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
            }, '');

            return (
              <g key={item.subject}>
                {/* Glow filter line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={4}
                  strokeOpacity={0.25}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Main line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {points.map((pt) => {
                  const isHovered =
                    hoveredNode?.subject === item.subject && hoveredNode?.year === pt.year;
                  return (
                    <g
                      key={pt.year}
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredNode({
                          subject: item.subject,
                          year: pt.year,
                          grade: pt.grade,
                          color: item.color,
                          x: pt.x,
                          y: pt.y,
                        })
                      }
                      onClick={() =>
                        setHoveredNode({
                          subject: item.subject,
                          year: pt.year,
                          grade: pt.grade,
                          color: item.color,
                          x: pt.x,
                          y: pt.y,
                        })
                      }
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill="#0b0f17"
                        stroke={item.color}
                        strokeWidth={2.5}
                        className="transition-all duration-150"
                      />
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={10}
                          fill={item.color}
                          fillOpacity={0.2}
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Hover tooltip inside SVG */}
          {hoveredNode && (
            <g
              transform={`translate(${Math.min(
                Math.max(hoveredNode.x - 70, 10),
                width - 150
              )}, ${Math.max(hoveredNode.y - 50, 10)})`}
              className="pointer-events-none"
            >
              <rect
                width={140}
                height={40}
                rx={6}
                fill="#1e293b"
                stroke={hoveredNode.color}
                strokeWidth={1.5}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
              />
              <text
                x={70}
                y={16}
                textAnchor="middle"
                className="fill-slate-300 text-[11px] font-semibold"
              >
                {hoveredNode.subject} ({hoveredNode.year})
              </text>
              <text
                x={70}
                y={30}
                textAnchor="middle"
                className="font-mono text-xs font-bold tabular-nums"
                fill={hoveredNode.color}
              >
                Nota CF: {hoveredNode.grade}.0
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Trajectory Insights Footer */}
      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-800/80 pt-3 sm:grid-cols-3">
        <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/50 p-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <div>
            <div className="text-[11px] text-slate-400">Maior Salto de Evolução</div>
            <div className="text-xs font-semibold text-slate-200">
              Matemática <span className="text-emerald-400">+5.0 pts</span> (5.0 → 10.0)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/50 p-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <div>
            <div className="text-[11px] text-slate-400">Consistência Máxima</div>
            <div className="text-xs font-semibold text-slate-200">
              Filosofia <span className="text-cyan-400">Média 10.0</span> na 3ª Série
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/50 p-2.5">
          <div className="h-2 w-2 rounded-full bg-indigo-400" />
          <div>
            <div className="text-[11px] text-slate-400">Ponto de Inflexão</div>
            <div className="text-xs font-semibold text-slate-200">
              2ª Série EM com alta geral de notas (Média geral 7.8)
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

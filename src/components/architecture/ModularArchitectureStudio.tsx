import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Palette,
  FileCode2,
  Workflow,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Box,
  Compass,
} from 'lucide-react';
import { ChartCard } from '../ui/ChartCard';
import { useAcademicData } from '../../hooks/useAcademicData';

export const ModularArchitectureStudio: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'brief' | 'sketch' | 'studio' | 'modularization'>(
    'modularization'
  );
  const [selectedLayer, setSelectedLayer] = useState<number>(1);
  const { globalMetrics, categoryPerformance, yearSummaries } = useAcademicData();

  const stages = [
    {
      id: 'brief',
      title: '1. Brief',
      subtitle: 'Definição do Problema & Requisitos',
      icon: <Compass className="h-4 w-4" />,
      color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
      badge: 'Escopo & Metas',
      description:
        'Mapeamento dos 5 anos de trajetória acadêmica (8º EF ao 3º EM). Identificação de necessidades: evolução longitudinal, assiduidade, conceitos formativos e dispersão de notas.',
      principles: [
        'Transparência analítica dos boletins oficiais',
        'Consolidação de notas numéricas e conceitos formativos (ET, ES, EP)',
        'Mapeamento de ausências compensadas e frequência global',
      ],
    },
    {
      id: 'sketch',
      title: '2. Sketch',
      subtitle: 'Exploração Gráfica & Prototipagem',
      icon: <Palette className="h-4 w-4" />,
      color: 'from-purple-500/20 to-pink-500/20 text-pink-400 border-pink-500/30',
      badge: 'Design Visual',
      description:
        'Criação de 10 modelos geométricos distintos em SVG de alta precisão para testar qual gráfico melhor comunica cada faceta dos dados sem clichês ou ruído visual.',
      principles: [
        'Radar para competências multidimensionais',
        'Heatmap para densidade de notas nos 4 bimestres',
        'Diagrama de dispersão para correlação entre faltas e notas',
        'Box plot para amplitude e quartis estatísticos',
      ],
    },
    {
      id: 'studio',
      title: '3. Studio',
      subtitle: 'Ambiente Unificado & Interativo',
      icon: <Sparkles className="h-4 w-4" />,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      badge: 'Integração de Painéis',
      description:
        'Unificação dos protótipos em um workspace integrado com controles interativos, alternância dinâmica de disciplinas, tooltips geométricos e filtros de categoria.',
      principles: [
        'Interatividade em tempo real com micro-animações',
        'Segmentação por abas analíticas temáticas',
        'Cards de métricas imediatas (KPIs unboxed)',
      ],
    },
    {
      id: 'modularization',
      title: '4. Modularização',
      subtitle: 'Separação de Responsabilidades (SoC)',
      icon: <Layers className="h-4 w-4" />,
      color: 'from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/40',
      badge: 'Melhor Código',
      description:
        'Refatoração da aplicação em unidades coesas e relativamente independentes. Cada parte do sistema resolve estritamente um tipo de problema.',
      principles: [
        'Tipagem Forte em src/types/: contratos e interfaces formais',
        'Serviços Puros em src/services/: lógica e algoritmos desacoplados de UI',
        'Hooks em src/hooks/: reatividade e memoização de domínio',
        'Componentes Coesos em src/components/: visualizações isoladas e reutilizáveis',
      ],
    },
  ];

  const architecturalLayers = [
    {
      id: 1,
      title: 'Camada de Tipagem & Contratos',
      directory: 'src/types/',
      files: ['academic.ts', 'navigation.ts'],
      responsibility: 'Define os modelos de dados formais, enums e contratos de tipagem estrita.',
      benefits:
        'Garante consistência estrutural entre a fonte de dados, os cálculos de negócios e a renderização gráfica, eliminando qualquer tipo "any".',
      badge: 'Contratos Formais',
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      codeSnippet: `export interface SubjectData {
  id: string;
  name: string;
  category: KnowledgeCategory;
  grades: (number | null)[];
  cf: number | null;
  totalAbsences: number;
  finalFrequency: number | null;
}`,
    },
    {
      id: 2,
      title: 'Camada de Domínio & Serviços Puros',
      directory: 'src/services/',
      files: ['metricsService.ts'],
      responsibility:
        'Executa cálculos matemáticos, agregação de médias, quartis estatísticos e análises de correlação.',
      benefits:
        'Zero dependência de React ou DOM. Totalmente testável por testes unitários e reutilizável em qualquer ambiente.',
      badge: 'Lógica Pura (SoC)',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      codeSnippet: `export function calculateGlobalAcademicMetrics(
  data: YearReport[]
): GlobalAcademicMetrics {
  // Cálculo puro e determinístico de CF, Frequência e Ausências
  return { avgCF, avgGlobalFreq, totalAbsences, ... };
}`,
    },
    {
      id: 3,
      title: 'Camada de Reatividade & Hooks',
      directory: 'src/hooks/',
      files: ['useAcademicData.ts'],
      responsibility:
        'Conecta o serviço de domínio ao ciclo de vida do React, com memoização inteligente (useMemo).',
      benefits:
        'Evita re-cálculos desnecessários e provê uma API limpa para os componentes de visualização consumirem dados agregados.',
      badge: 'Orquestração de Estado',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      codeSnippet: `export function useAcademicData() {
  const globalMetrics = useMemo(() => 
    calculateGlobalAcademicMetrics(SCHOOL_DATA), []
  );
  return { globalMetrics, categoryPerformance, ... };
}`,
    },
    {
      id: 4,
      title: 'Camada de Módulos de Visualização (Gráficos)',
      directory: 'src/components/charts/',
      files: [
        'HistoricalEvolutionChart.tsx',
        'RadarCompetenceChart.tsx',
        'GradeHeatmapChart.tsx',
        'ScatterCorrelationChart.tsx',
        '+ 6 outros módulos',
      ],
      responsibility:
        'Cada componente cuida estritamente de renderizar seu tipo específico de geometria gráfica SVG.',
      benefits:
        'Alta coesão: alterações no radar não afetam o heatmap. Isolamento total de renderização e animação.',
      badge: 'Componentes Especializados',
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      codeSnippet: `<HistoricalEvolutionChart /> // Série Temporal
<RadarCompetenceChart />     // Competências
<GradeHeatmapChart />        // Matriz de Calor
<ScatterCorrelationChart />  // Dispersão Faltas x Notas`,
    },
    {
      id: 5,
      title: 'Camada de Layout & Design System',
      directory: 'src/components/layout/ & src/components/ui/',
      files: ['Header.tsx', 'KpiOverview.tsx', 'TabNavigation.tsx', 'ChartCard.tsx', 'Footer.tsx'],
      responsibility:
        'Estruturação da experiência de usuário, hierarquia tipográfica, navegação responsiva e tokens visuais.',
      benefits:
        'Desacoplamento estético: mudanças de tema ou layout não tocam a lógica de cálculo nem os cálculos matemáticos dos gráficos.',
      badge: 'Apresentação Limpa',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      codeSnippet: `<Header activeTab={activeTab} onTabChange={setActiveTab} />
<KpiOverview metrics={globalMetrics} />
<TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner de Apresentação da Filosofia */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c1626] via-[#0e1b30] to-[#0a121e] p-6 shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300">
                <ShieldCheck className="h-3 w-3" /> Princípio Arquitetural
              </span>
              <span className="text-xs text-slate-400">Software Craftsmanship</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              Modularização & Separação de Responsabilidades (SoC)
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              <strong className="text-cyan-300">Melhor Código:</strong> A modularização decompõe o
              sistema em unidades coesas e relativamente independentes, onde cada módulo é
              responsável por um aspecto bem definido do comportamento do programa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <div className="rounded-xl border border-slate-700/80 bg-slate-800/60 p-3 text-center min-w-[130px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Coesão
              </div>
              <div className="mt-1 font-mono text-base font-bold text-emerald-400">Máxima</div>
              <div className="text-[10px] text-slate-500">Unidades focadas</div>
            </div>
            <div className="rounded-xl border border-slate-700/80 bg-slate-800/60 p-3 text-center min-w-[130px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Acoplamento
              </div>
              <div className="mt-1 font-mono text-base font-bold text-cyan-400">Mínimo</div>
              <div className="text-[10px] text-slate-500">Módulos independentes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ciclo de Vida: Brief → Sketch → Studio → Modularização */}
      <ChartCard
        title="O Ciclo de Engenharia: Brief → Sketch → Studio → Modularização"
        subtitle="A evolução metodológica desde a especificação inicial até a arquitetura modular refinada"
        badge="Metodologia de Produto"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {stages.map((stage) => {
            const isCurrent = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id as any)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? `border-cyan-500/50 bg-[#162238] shadow-md ring-1 ring-cyan-500/30`
                    : 'border-slate-800/80 bg-[#0e1422] hover:border-slate-700 hover:bg-[#121929]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border bg-gradient-to-br ${stage.color}`}
                  >
                    {stage.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {stage.badge}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-100">{stage.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stage.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Detalhes do Estágio Selecionado */}
        {(() => {
          const currentStageData = stages.find((s) => s.id === activeStage)!;
          return (
            <div className="rounded-xl border border-slate-800/90 bg-[#0d1320] p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Workflow className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-100">{currentStageData.title}</h4>
                    <p className="text-xs text-slate-400">{currentStageData.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400/90 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 self-start md:self-auto">
                  {currentStageData.badge}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentStageData.principles.map((principle, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-800/80 bg-[#121929]/80 p-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-snug">{principle}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </ChartCard>

      {/* Camadas da Arquitetura (SoC - Separation of Concerns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista de Camadas */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Box className="h-4 w-4 text-cyan-400" />
              Camadas de Responsabilidade Única
            </h3>
            <span className="text-[11px] font-mono text-slate-500">5 Camadas Desacopladas</span>
          </div>

          {architecturalLayers.map((layer) => {
            const isSelected = selectedLayer === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500/60 bg-[#141e33] shadow-lg ring-1 ring-cyan-500/30'
                    : 'border-slate-800/80 bg-[#0e1422] hover:border-slate-700 hover:bg-[#111828]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${layer.color}`}>
                    {layer.directory}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">{layer.badge}</span>
                </div>

                <div className="mt-2 text-sm font-bold text-slate-100 flex items-center justify-between">
                  <span>{layer.title}</span>
                  <ArrowRight
                    className={`h-4 w-4 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{layer.responsibility}</p>
              </div>
            );
          })}
        </div>

        {/* Detalhes da Camada Selecionada & Código */}
        <div className="lg:col-span-7">
          {(() => {
            const activeLayer = architecturalLayers.find((l) => l.id === selectedLayer)!;
            return (
              <div className="rounded-xl border border-slate-800/90 bg-[#0e1526] p-6 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded border ${activeLayer.color}`}
                        >
                          {activeLayer.directory}
                        </span>
                        <h4 className="text-base font-bold text-white">{activeLayer.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{activeLayer.responsibility}</p>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Arquivos Integrantes:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeLayer.files.map((file, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-md bg-slate-800/80 text-cyan-300 border border-slate-700/60"
                        >
                          <FileCode2 className="h-3 w-3 text-cyan-400" />
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Benefício Arquitetural (SoC):
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-[#0b101c] p-3 text-xs text-slate-300 leading-relaxed">
                      {activeLayer.benefits}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Exemplo de Assinatura Desacoplada:
                    </div>
                    <div className="rounded-lg border border-slate-800/90 bg-[#070b14] p-3 font-mono text-[11px] text-cyan-200 overflow-x-auto">
                      <pre>{activeLayer.codeSnippet}</pre>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Independência e Coesão Verificada
                  </span>
                  <span className="font-mono text-slate-500">Camada {activeLayer.id} de 5</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Demonstração em Tempo Real: O Serviço de Domínio em Ação */}
      <ChartCard
        title="Demonstração do Domínio Puro (src/services/metricsService.ts)"
        subtitle="Cálculos analíticos computados deterministicamente pelo serviço de domínio sem acoplamento visual"
        badge="Pure Service Execution"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-4">
            <div className="text-xs font-medium text-slate-400">Métricas Globais Calculadas</div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Disciplinas Avaliadas:</span>
                <span className="font-mono text-cyan-300 font-semibold">
                  {globalMetrics.totalSubjectsCount}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Média CF Consolidada:</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {globalMetrics.avgCF} / 10
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Frequência Média Global:</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {globalMetrics.avgGlobalFreq}%
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Faltas Compensadas (AC):</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {globalMetrics.totalCompensatedAbsences}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-4">
            <div className="text-xs font-medium text-slate-400">
              Desempenho por Área de Conhecimento
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {categoryPerformance.map((cat, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-300">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">{cat.avgAttendance}% freq</span>
                    <span className="font-semibold text-cyan-300">{cat.avgGrade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-4">
            <div className="text-xs font-medium text-slate-400">
              Trajetória Anual (Séries Históricas)
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {yearSummaries.map((yr, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0">
                  <span className="text-slate-300 font-medium">{yr.shortName}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-amber-400/90">{yr.totalAbsences} faltas</span>
                    <span className="text-emerald-400">{yr.avgFrequency}%</span>
                    <span className="text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      {yr.avgGrade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

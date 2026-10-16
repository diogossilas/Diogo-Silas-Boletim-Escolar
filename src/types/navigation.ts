export type ViewTab =
  | 'all'
  | 'evolution'
  | 'radar'
  | 'heatmap'
  | 'attendance'
  | 'qualitative'
  | 'architecture';

export interface TabConfig {
  id: ViewTab;
  label: string;
  shortLabel: string;
  description: string;
  iconName: 'all' | 'evolution' | 'radar' | 'heatmap' | 'attendance' | 'qualitative' | 'architecture';
  badge?: string;
}

export const NAVIGATION_TABS: TabConfig[] = [
  {
    id: 'all',
    label: 'Todos os Gráficos',
    shortLabel: 'Geral',
    description: 'Visão integrada com todos os 10 módulos analíticos',
    iconName: 'all',
  },
  {
    id: 'evolution',
    label: 'Evolução & Tendência',
    shortLabel: 'Evolução',
    description: 'Séries temporais longitudinais e distribuições box-plot',
    iconName: 'evolution',
  },
  {
    id: 'radar',
    label: 'Radar & Variação',
    shortLabel: 'Radar',
    description: 'Avaliação multidimensional de competências e desvios',
    iconName: 'radar',
  },
  {
    id: 'heatmap',
    label: 'Matriz Bimestral',
    shortLabel: 'Matriz',
    description: 'Heatmap de calor e barras bimestrais por disciplina',
    iconName: 'heatmap',
  },
  {
    id: 'attendance',
    label: 'Assiduidade & Dispersão',
    shortLabel: 'Assiduidade',
    description: 'Gauges de frequência, dispersão quadrante e faltas acumuladas',
    iconName: 'attendance',
  },
  {
    id: 'qualitative',
    label: 'Conceitos Formativos',
    shortLabel: 'Conceitos',
    description: 'Avaliação socioemocional e itinerários formativos (ET/ES/EP)',
    iconName: 'qualitative',
  },
  {
    id: 'architecture',
    label: 'Studio & Modularização',
    shortLabel: 'Modularização',
    description: 'Brief → Sketch → Studio → Modularização e Separação de Responsabilidades',
    iconName: 'architecture',
    badge: 'SoC',
  },
];

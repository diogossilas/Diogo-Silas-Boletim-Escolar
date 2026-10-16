# Painel Gráfico de Desempenho Escolar
> **Plataforma Analítica de Trajetória Acadêmica e Assiduidade Escolar (8º EF ao 3º EM)**  
> *Documento Expositivo-Analítico de Integração e Engenharia para Desenvolvedores*

---

## 1. Visão Geral e Propósito do Sistema

O **Painel Gráfico de Desempenho Escolar** é uma aplicação Single-Page Application (SPA) construída com **React 19**, **TypeScript** e **Tailwind CSS v4**, projetada para transformar dados brutos de histórico escolar (notas bimestrais, conceitos finais, assiduidade, faltas justificadas e ausências compensadas) em uma experiência analítica multidimensional de alta densidade informativa.

O projeto abrange uma série longitudinal de 5 anos letivos (do 8º ano do Ensino Fundamental à 3ª série do Ensino Médio), superando a representação linear tradicional de boletins escolares em papel ou tabelas estáticas. Seu objetivo central é oferecer aos gestores pedagógicos, professores, coordenadores, estudantes e responsáveis uma visão compreensiva de:

1. **Desempenho Longitudinal:** Análise temporal contínua da evolução das notas bimestrais e do Conceito Final (CF).
2. **Correlação Multivariada:** Cruzamento entre absenteísmo (faltas) e rendimento cognitivo através de diagramas de dispersão quadrante.
3. **Distribuição Estatística:** Visualização de dispersão, quartis ($Q_1$, Mediana, $Q_3$, Mínimo e Máximo) via gráficos de *Box Plot*.
4. **Competências e Áreas do Saber:** Avaliação comparativa de categorias curriculares (Exatas, Humanas, Biológicas, Linguagens e Eletivas) por meio de polígonos de radar e desvios divergentes.
5. **Conceitos Formativos:** Mapeamento qualitativo de itinerários formativos avaliados por escalas de conceito (**ET**, **ES**, **EP**).
6. **Ambiente Multiplataforma:** Suporte fluido desde telas mobile compactas (320px) até workstations ultrawide e monitores de TV 4K para salas de reunião e conselhos de classe (*Modo Apresentação / TV*).

---

## 2. Análise Arquitetural e Princípios de Engenharia

A arquitetura do sistema adota estritamente o princípio da **Separação de Responsabilidades (*Separation of Concerns* - SoC)** e a filosofia de **Componentes Puros de Visualização Gráfica**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Camada de Visão                           │
│  App.tsx ──► Layout (Header, KPI, Tabs, Footer) ──► 10 Chart Modules   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ consome
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Camada Reativa de Estado & Hooks                 │
│        useAcademicData.ts                useDisplayMode.ts             │
│        (memoização & filtros)            (fullscreen, auto-cycle, TV)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ orquestra
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Camada de Domínio & Computação Pura                 │
│                       metricsService.ts (Funções Puras)                │
│    (calculateGlobalAcademicMetrics, calculateQuartiles, CategoryPerf)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ opera sobre
┌───────────────────────────────────▼────────────────────────────────────┐
│                     Camada de Modelagem & Dados                        │
│        src/types/academic.ts       src/data/schoolData.ts              │
│        (contratos estritos TS)     (datasets consolidados de 5 anos)   │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Justificativa Analítica das Decisões de Design

| Decisão Arquitetural | Implementação | Análise de Trade-Offs & Racional Técnico |
| :--- | :--- | :--- |
| **Visualização SVG Nativa vs. Bibliotecas Externas** | Renderização declarativa SVG inline (`<svg>`, `<polygon>`, `<circle>`, `<path>`) | **Eliminação de dependências pesadas:** Evitou-se o overhead de bibliotecas proprietárias ou wrappers complexos (Chart.js, Recharts, D3 monolítico). Garante zero bundle bloat, renderização instantânea no SSR/client, total controle sobre acessibilidade vetorial e estilização Tailwind integrada. |
| **Lógica Estatística Desacoplada** | `src/services/metricsService.ts` como funções puras | **Testabilidade e Determinismo:** Nenhuma lógica matemática reside dentro dos componentes React. Cálculos de quartis, agregações de frequência e médias ponderadas são puros, facilitando testes unitários sem mocks de DOM ou estado. |
| **Camada Intermediária de Hooks** | `useAcademicData.ts` & `useDisplayMode.ts` | **Prevenção de Renderizações Excessivas:** Centraliza chamadas com `useMemo` para evitar recálculo de métricas estáticas durante alternâncias de abas ou eventos de hover/tooltip. |
| **Tipagem Estrita sem `any`** | `src/types/academic.ts` | **Integridade Referencial:** Define contratos explícitos para anos letivos, disciplinas numéricas, conceitos qualitativos e categorias de conhecimento. Qualquer incompatibilidade estrutural é capturada em tempo de compilação. |
| **Modo TV e Apresentação Autônoma** | `useDisplayMode.ts` com carrossel cíclico (14s) | **Operação em Painéis Públicos/Conselhos:** Permite que o painel funcione como *dashboard autônomo* em TVs de salas de reunião de professores sem intervenção manual de mouse/teclado. |

---

## 3. Topologia de Diretórios e Componentes

A estrutura de pastas reflete a divisão hierárquica do código:

```text
/
├── index.html                           # Entry-point HTML com metadados e viewport
├── metadata.json                        # Descrição e capacidades do applet
├── package.json                         # Dependências e scripts de automação
├── tsconfig.json                        # Configuração do TypeScript (strict mode)
├── vite.config.ts                       # Configuração do Vite e Tailwind v4
├── docs/
│   └── GUIA_MANUTENCAO.md               # Guia analítico de manutenção para engenharia
└── src/
    ├── main.tsx                         # Bootstrap React DOM
    ├── App.tsx                          # Orquestrador raiz e comutador de visualizações
    ├── index.css                        # Estilos globais e tokens Tailwind CSS
    │
    ├── types/                           # Contratos formais e enums do sistema
    │   ├── academic.ts                  # Interfaces: YearReport, SubjectData, GlobalMetrics
    │   └── navigation.ts                # Interfaces: ViewTab, TabConfig, NAVIGATION_TABS
    │
    ├── services/                        # Regras de negócio e algoritmos estatísticos
    │   └── metricsService.ts            # Funções puras: quartis, médias, métricas globais
    │
    ├── data/                            # Dados históricos acadêmicos consolidados
    │   └── schoolData.ts                # Dataset imutável (8º EF, 9º EF, 1ª EM, 2ª EM, 3ª EM)
    │
    ├── hooks/                           # Gerenciamento de estado reativo e efeitos
    │   ├── useAcademicData.ts           # Acesso memoizado a métricas e filtros
    │   └── useDisplayMode.ts            # Controle de tela cheia, modo TV e ciclo de abas
    │
    └── components/
        ├── layout/                      # Estrutura visual da aplicação
        │   ├── Header.tsx               # Barra superior, controles de modo TV e fullscreen
        │   ├── KpiOverview.tsx          # Faixa de indicadores agregados (KPIs)
        │   ├── TabNavigation.tsx        # Navegação em abas temáticas
        │   └── Footer.tsx               # Rodapé com legenda e metadados de auditoria
        │
        ├── ui/                          # Primitivas visuais reutilizáveis
        │   ├── Badge.tsx                # Emblemas de status, categoria e conceitos
        │   ├── ChartCard.tsx            # Contêiner padronizado com cabeçalho e slots
        │   └── MetricStat.tsx           # Cartão métrico com valor, label e variação
        │
        ├── architecture/                # Módulo de Governança e Transparência de Código
        │   └── ModularArchitectureStudio.tsx # Estúdio interativo (Brief ➔ Sketch ➔ Studio ➔ Modularização)
        │
        └── charts/                      # 10 Módulos de Visualização Vetorial Específica
            ├── HistoricalEvolutionChart.tsx      # Trajetória temporal de notas
            ├── GradeDistributionBoxPlotChart.tsx # Box Plot de quartis estatísticos
            ├── RadarCompetenceChart.tsx          # Polígono de competências por área
            ├── DivergingBarChart.tsx             # Variação em relação à média de corte (7.0)
            ├── GradeHeatmapChart.tsx             # Matriz de densidade bimestral
            ├── BimestralBarChart.tsx             # Comparativo bimestral por disciplina
            ├── ScatterCorrelationChart.tsx       # Dispersão Faltas x Desempenho
            ├── AttendanceDonutGauges.tsx         # Indicadores circulares de frequência
            ├── AbsenceAreaTimelineChart.tsx      # Área acumulada de absenteísmo
            └── QualitativeConceptMatrixChart.tsx # Matriz de conceitos socioemocionais (ET/ES/EP)
```

---

## 4. O Modelo de Dados e Métricas Matemáticas

### 4.1. Entidades Principais (`src/types/academic.ts`)

- **`YearReport`**: Representa um ano letivo completo (ex.: 8º Ano EF), contendo turno, etapa de ensino, status de aprovação e a relação de disciplinas.
- **`SubjectData`**: Representa o rendimento de uma matéria específica. Possui:
  - `grades`: Array de 4 notas bimestrais (`number | null`).
  - `concepts`: Array de 4 conceitos formativos opcionais (`ET`, `ES`, `EP`).
  - `cf`: Conceito Final numérico (escala 0.0 a 10.0).
  - `absences`: Faltas apuradas por bimestre.
  - `frequency`: Porcentagem de frequência bimestral.
  - `acTotal`: Ausências Compensadas.
- **`KnowledgeCategory`**: Categorização canônica das matérias:
  - `Exatas` (`#3b82f6` - Azul)
  - `Humanas` (`#eab308` - Âmbar)
  - `Biológicas` (`#10b981` - Esmeralda)
  - `Linguagens` (`#f43f5e` - Rosa)
  - `Diversificada / Eletiva` (`#8b5cf6` - Roxo)

### 4.2. Algoritmos Estatísticos (`src/services/metricsService.ts`)

#### Cálculo de Quartis e Dispersão (`calculateQuartiles`)
Utiliza o método de interpolação linear ponderada para o cálculo de percentis sobre arrays ordenados:
$$P_p = (N - 1) \cdot p$$
Onde a parte inteira define o índice base e a parte fracionária determina a interpolação entre vizinhos:
$$\text{Percentil}(p) = V_{\text{base}} + \text{resto} \cdot (V_{\text{base}+1} - V_{\text{base}})$$
Produzindo com rigor matemático: Mínimo, $Q_1$ (25%), Mediana (50%), $Q_3$ (75%), Máximo e Média Aritmética ($\mu$).

---

## 5. Guia Operacional de Execução Local

### 5.1. Pré-requisitos
- **Node.js**: versão 20.x ou superior recomendada.
- **NPM** ou **Bun/Yarn**.

### 5.2. Instalação e Execução
```bash
# Instalação de dependências
npm install

# Inicialização do servidor de desenvolvimento local
npm run dev
```
O servidor Vite será iniciado na porta **3000** (`http://localhost:3000`).

### 5.3. Scripts Disponíveis
- `npm run dev`: Inicia o Vite na porta 3000 com escuta em todas as interfaces (`0.0.0.0`).
- `npm run build`: Executa o bundler de produção gerando a pasta otimizada `dist/`.
- `npm run lint`: Executa a validação estática de tipos TypeScript via `tsc --noEmit`.
- `npm run clean`: Remove artefatos de compilação prévios.

---

## 6. Padrões de Extensão e Boas Práticas

Para manter a integridade arquitetural do projeto, novos desenvolvedores devem seguir o seguinte fluxo ao adicionar novos recursos:

1. **Adicionar novos campos ou entidades:** Inicie sempre por `src/types/academic.ts`. Nunca adicione campos livres sem tipagem explícita.
2. **Novos cálculos matemáticos:** Adicione funções puras e exportadas em `src/services/metricsService.ts`. Não calcule médias ou somas dentro do JSX do componente.
3. **Novos gráficos e visualizações:** Crie um novo arquivo em `src/components/charts/` encapsulado pelo componente padrão `<ChartCard>`. Garanta cálculo de proporções relativas na `viewBox` do SVG para responsividade em qualquer dimensão.
4. **Novas abas de navegação:** Declare o ID correspondente em `src/types/navigation.ts` no tipo `ViewTab` e adicione o descritor em `NAVIGATION_TABS`.

Consulte o documento especializado [`docs/GUIA_MANUTENCAO.md`](./docs/GUIA_MANUTENCAO.md) para diretrizes analíticas aprofundadas sobre resolução de problemas, refatoração e checklist de manutenções preventivas.

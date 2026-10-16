# Guia Analítico e Operacional para Futuras Manutenções do Código
> **Painel Gráfico de Desempenho Escolar (8º EF ao 3º EM)**  
> *Manual Técnico de Governança, Evolução e Sustentabilidade de Software*

---

## 1. Introdução e Filosofia de Manutenibilidade

Este documento estabelece o protocolo técnico e a fundamentação teórica para intervenções, correções de bugs, refatorações e extensões funcionais no código-fonte do **Painel Gráfico de Desempenho Escolar**.

A manutenibilidade de uma aplicação analítica de dados educacionais não reside unicamente em manter dependências atualizadas, mas em preservar a **clareza semântica entre os dados pedagógicos e a sua tradução geométrica**. Qualquer manutenção futura deve aderir a três preceitos cardeais:

1. **Separação Rígida entre Cálculo e Visualização:** O código que renderiza elementos visuais (`<svg>`, `<path>`, `<div>`) jamais deve conter fórmulas de médias, variâncias ou agregações de frequência. Todas as regras de negócio residem exclusivamente em `src/services/`.
2. **Determinismo Gráfico via SVG Semântico:** As visualizações não utilizam wrappers obscuros de bibliotecas externas de gráficos; operam por meio de funções de projeção geométrica direta (mapeamento linear de coordenadas cartesianas ou polares). Modificar um gráfico exige raciocinar sobre sistemas de coordenadas (`viewBox`, escalas normatizadas).
3. **Imutabilidade e Tipagem Estrita:** Toda estrutura de dados que transita entre serviços, hooks e componentes é imutável e validada pelo compilador TypeScript em modo estrito.

---

## 2. Mapa de Dependências e Fluxo de Dados

Compreender o fluxo de dependências é indispensável para evitar efeitos colaterais indesejados durante alterações:

```
[src/data/schoolData.ts] ──────► Base estática de dados (5 anos letivos)
         │
         ▼
[src/types/academic.ts] ───────► Tipagem formal (YearReport, SubjectData, etc.)
         │
         ▼
[src/services/metricsService.ts] ► Funções matemáticas puras (médias, quartis, somatórios)
         │
         ▼
[src/hooks/useAcademicData.ts] ─► Estado reativo e memoização (useMemo)
         │
         ├────────────────────────────────┬───────────────────────────────┐
         ▼                                ▼                               ▼
[src/components/layout/]        [src/components/charts/]        [src/components/ui/]
(Header, KPI, Tabs, Footer)     (10 Módulos de Gráficos SVG)    (Badge, ChartCard, MetricStat)
         │                                │                               │
         └────────────────────────────────┴───────────────────────────────┘
                                          │
                                          ▼
                                   [src/App.tsx]
                      (Orquestrador e Comutador de Telas)
```

---

## 3. Procedimentos Operacionais de Manutenção

### 3.1. Como Adicionar ou Atualizar Dados Escolares

Os dados históricos estão centralizados em `src/data/schoolData.ts`. Para atualizar notas existentes ou inserir um novo ano letivo (por exemplo, incluir um 7º Ano EF ou dados do Ensino Superior):

#### Passo 1: Verificar o Contrato de Tipagem em `src/types/academic.ts`
Certifique-se de que a estrutura pretendida satisfaz a interface `YearReport`:
```typescript
export interface YearReport {
  id: string;               // Identificador único (ex: '7ef', '1em')
  name: string;             // Nome formal (ex: '7º Ano A (Manhã)')
  shortName: string;        // Rótulo compacto (ex: '7º Ano EF')
  stage: 'Ensino Fundamental' | 'Ensino Médio';
  shift: string;            // 'Manhã' | 'Tarde' | 'Integral'
  status: string;           // 'Aprovado(a)' | 'Pendente'
  subjects: SubjectData[];  // Lista de disciplinas do ano
}
```

#### Passo 2: Inserir a Matéria em `src/data/schoolData.ts`
Cada matéria deve seguir o formato estrito:
```typescript
{
  id: 'mat-7',
  name: 'Matemática',
  category: 'Exatas',       // Exatas | Humanas | Biológicas | Linguagens | Diversificada / Eletiva
  color: '#3b82f6',         // Cor hexadecimal canônica
  grades: [7.5, 8.0, 6.5, 9.0], // 4 bimestres (use null se não houver avaliação)
  cf: 7.8,                  // Conceito Final ponderado
  absences: [2, 1, 3, 0],   // Faltas bimestrais
  frequency: [95, 98, 92, 100], // Frequência bimestral em porcentagem
  totalAbsences: 6,
  finalFrequency: 96,
  acTotal: 2,               // Ausências Compensadas (opcional)
}
```

*Atenção:* Se a disciplina for eletiva e avaliada por conceitos qualitativos (ex.: Empreendedorismo), utilize o campo `concepts: ['ET', 'ES', 'ET', 'ET']` e `cfConcept: 'ET'`. O valor numérico de `grades` pode ser deixado como `[null, null, null, null]` ou preenchido com a nota equivalente.

#### Passo 3: Atualizar Séries Históricas
Caso a matéria pertença à série histórica longitudinal, insira as novas colunas no array `HISTORICAL_CF_DATA` dentro de `src/data/schoolData.ts` e adeque o tipo `HistoricalCF` se novos anos forem adicionados.

---

### 3.2. Como Implementar um Novo Módulo de Gráfico

Para adicionar uma 11ª visualização vetorial (por exemplo, um gráfico de *Sankey* de evasão ou um *Violin Plot* de densidade de frequência):

#### Passo 1: Criação do Componente
Crie o arquivo em `src/components/charts/NomeDoGraficoChart.tsx`. Utilize o invólucro padrão `<ChartCard>` para garantir consistência estética, suporte a modo TV e tipografia padronizada:

```tsx
import React, { useState } from 'react';
import { ChartCard } from '../ui/ChartCard';
import { useAcademicData } from '../../hooks/useAcademicData';

export const NomeDoGraficoChart: React.FC = () => {
  const { currentYear, globalMetrics } = useAcademicData();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Definir dimensões canônicas de viewBox para SVG responsivo
  const width = 800;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  return (
    <ChartCard
      title="Título Explicativo do Gráfico"
      subtitle="Subtítulo contextualizando o fenômeno analisado"
      badge="Análise Vetorial"
    >
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[420px] select-none"
        >
          {/* Renderização geométrica pura */}
        </svg>
      </div>
    </ChartCard>
  );
};
```

#### Passo 2: Exportação e Integração no `App.tsx`
Importe o novo componente em `src/App.tsx` e posicione-o na seção adequada ou condicione-o à aba de navegação temática.

#### Passo 3: Registrar Aba (se aplicável)
Se o gráfico demandar uma aba de navegação dedicada:
1. Edite `src/types/navigation.ts` para adicionar o literal em `ViewTab`.
2. Adicione a configuração do menu em `NAVIGATION_TABS`.
3. Adicione o renderizador condicional no bloco principal de `src/App.tsx`.

---

### 3.3. Como Modificar Algoritmos em `src/services/metricsService.ts`

Toda função matemática adicionada ou refatorada nesta camada deve cumprir os seguintes critérios de engenharia:
- **Ser Pura:** Não acessar `window`, `document`, estados locais ou variáveis globais mutáveis. A saída deve ser exclusivamente dependente dos parâmetros recebidos.
- **Tratamento de Valores Nulos:** Em ambientes escolares, alunos podem ter disciplinas dispensadas ou notas pendentes (`null`). Assegure-se de filtrar ou neutralizar `null` antes de computar divisões para evitar `NaN`.
- **Formatação de Ponto Flutuante:** Para evitar discrepâncias visuais causadas por imprecisões binárias do IEEE 754 (ex.: `0.1 + 0.2 = 0.30000000000000004`), utilize sempre arredondamento explícito:
  ```typescript
  Number((soma / total).toFixed(1))
  ```

---

## 4. Otimização de Performance e Diretrizes de Renderização

### 4.1. Prevenção de Reflows e Recálculos Excessivos
- **Memoização em `useAcademicData`:** Cálculos agregados globais (`globalMetrics`, `categoryPerformance`, `yearSummaries`) só devem ser recalculados se a fonte de dados for alterada. O `useMemo` já implementado previne processamentos desnecessários durante a navegação.
- **Micro-interações de Hover:** Ao implementar tooltips em nós de gráficos SVG (círculos, barras, fatias de pizza), armazene apenas o identificador ou as coordenadas essenciais no estado local do componente gráfico (`hoveredNode: { x, y, value }`). Jamais eleve o estado de hover para o `App.tsx`.

### 4.2. Compatibilidade Multi-Dispositivo e Modo TV
O sistema possui regras de estilo específicas para telas ultrawide e televisores:
- As classes baseadas no estado `isTvMode` aplicam tipografia ampliada (`tv-presentation-mode`) e espaçamento generoso para visualização a distância em salas de reunião.
- No componente `useDisplayMode.ts`, o carrossel automático alterna abas a cada **14 segundos**. Se for necessário alterar essa cadência para conselhos pedagógicos mais longos ou apresentações dinâmicas, modifique a constante do `setInterval` em `useDisplayMode.ts`.

---

## 5. Matriz de Diagnóstico e Resolução de Problemas (Troubleshooting)

| Sintoma Observado | Causa Mais Provável | Procedimento de Resolução |
| :--- | :--- | :--- |
| Elementos SVG renderizados em `NaN` ou distorcidos | Divisão por zero no cálculo de coordenadas (ex: min === max ou array vazio) | Adicionar cláusula de salvaguarda verificando se o array possui elementos antes de calcular proporções geométricas. |
| Inconsistência na média global após inserção de dados | Disciplina com `cf: null` computada indevidamente | Validar se o filtro `sub.cf !== null` está ativo em `calculateGlobalAcademicMetrics()`. |
| Erro de compilação TypeScript ao adicionar nova disciplina | Categoria informada com digitação divergente | Verificar se a categoria pertence exatamente aos tipos de `KnowledgeCategory` ('Exatas', 'Humanas', 'Biológicas', 'Linguagens', 'Diversificada / Eletiva'). |
| Modo de tela cheia não ativa em iframe | Políticas de segurança do navegador bloqueando a API `requestFullscreen()` | O hook `useDisplayMode.ts` já implementa fallback silencioso, garantindo que a aplicação alterne o layout para visualização maximizada sem travar a interface. |
| Tooltip saindo para fora do limite visual da tela | Coordenadas fixas sem compensação de borda | Aplicar restrição delimitadora (clamping): `Math.min(Math.max(x, 60), width - 60)`. |

---

## 6. Checklist de Validação Pré-Publicação

Antes de qualquer entrega ou consolidação de versão em produção:

- [ ] **Validação Estática de Tipos:** Executar `npm run lint` (`tsc --noEmit`) sem nenhum erro apontado.
- [ ] **Build de Produção:** Executar `npm run build` e confirmar geração de bundle estático em `dist/`.
- [ ] **Teste de Responsividade:** Validar renderização em 360px (mobile), 1024px (notebook) e 1920px+ (desktop/TV).
- [ ] **Integridade dos KPIs:** Confirmar que a média de CF, o percentual de frequência e as ausências compensadas coincidem com os boletins oficiais.
- [ ] **Transição de Abas:** Verificar se todos os 10 gráficos e a aba de arquitetura carregam suavemente sem warnings no console.

import React from 'react';
import { GlobalAcademicMetrics } from '../../types/academic';
import { MetricStat } from '../ui/MetricStat';

interface KpiOverviewProps {
  metrics: GlobalAcademicMetrics;
  isTvMode?: boolean;
}

export const KpiOverview: React.FC<KpiOverviewProps> = ({ metrics, isTvMode = false }) => {
  return (
    <section className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-5 2xl:gap-4">
      <MetricStat
        label="Ciclo Analisado"
        value="5 Anos"
        subtext={metrics.cycleSpan}
        valueColorClass="text-slate-100"
        isTvMode={isTvMode}
      />

      <MetricStat
        label="Média Global CF"
        value={metrics.avgCF}
        unit="/ 10"
        subtext="Todas as disciplinas"
        valueColorClass="text-cyan-400"
        isTvMode={isTvMode}
      />

      <MetricStat
        label="Frequência Geral"
        value={`${metrics.avgGlobalFreq}%`}
        subtext="Presença global"
        valueColorClass="text-emerald-400"
        isTvMode={isTvMode}
      />

      <MetricStat
        label="Total de Faltas"
        value={metrics.totalAbsences}
        subtext={`${metrics.totalCompensatedAbsences} compensadas (AC)`}
        valueColorClass="text-amber-400"
        isTvMode={isTvMode}
      />

      <div className="col-span-2 sm:col-span-4 lg:col-span-1">
        <MetricStat
          label="Situação Final"
          value={metrics.approvalStatus}
          subtext="Conclusão Ensino Médio"
          valueColorClass="text-emerald-400"
          isTvMode={isTvMode}
        />
      </div>
    </section>
  );
};

import {
  YearReport,
  GlobalAcademicMetrics,
  CategoryPerformance,
  YearSummaryMetric,
  KnowledgeCategory,
} from '../types/academic';

/**
 * Domain Service: Academic Metrics & Statistical Calculations
 * Pure functional service decoupled from React and presentation logic.
 * Adheres to the Single Responsibility Principle (SRP).
 */

const CATEGORY_COLORS: Record<KnowledgeCategory, string> = {
  Exatas: '#3b82f6',
  Humanas: '#eab308',
  Biológicas: '#10b981',
  Linguagens: '#f43f5e',
  'Diversificada / Eletiva': '#8b5cf6',
};

/**
 * Computes high-level aggregated summary metrics across all academic years
 */
export function calculateGlobalAcademicMetrics(data: YearReport[]): GlobalAcademicMetrics {
  const allCFs: number[] = [];
  const allFreqs: number[] = [];
  let totalSubjects = 0;
  let totalAbsences = 0;
  let totalAC = 0;

  data.forEach((year) => {
    totalSubjects += year.subjects.length;
    year.subjects.forEach((sub) => {
      if (sub.cf !== null) {
        allCFs.push(sub.cf);
      }
      totalAbsences += sub.totalAbsences;
      if (sub.acTotal) {
        totalAC += sub.acTotal;
      }
      if (sub.finalFrequency !== null) {
        allFreqs.push(sub.finalFrequency);
      }
    });
  });

  const avgCF =
    allCFs.length > 0 ? Number((allCFs.reduce((a, b) => a + b, 0) / allCFs.length).toFixed(1)) : 0;
  const avgGlobalFreq =
    allFreqs.length > 0
      ? Number((allFreqs.reduce((a, b) => a + b, 0) / allFreqs.length).toFixed(1))
      : 0;

  return {
    totalSubjectsCount: totalSubjects,
    avgCF,
    avgGlobalFreq,
    totalAbsences,
    totalCompensatedAbsences: totalAC,
    evaluatedYearsCount: data.length,
    approvalStatus: 'Aprovado(a)',
    cycleSpan: '8º EF ao 3º EM (5 Anos)',
  };
}

/**
 * Computes summary metrics grouped per academic year
 */
export function calculateYearSummaries(data: YearReport[]): YearSummaryMetric[] {
  return data.map((year) => {
    const cfs = year.subjects.filter((s) => s.cf !== null).map((s) => s.cf as number);
    const freqs = year.subjects
      .filter((s) => s.finalFrequency !== null)
      .map((s) => s.finalFrequency as number);
    const totalAbsences = year.subjects.reduce((sum, s) => sum + s.totalAbsences, 0);

    const avgGrade =
      cfs.length > 0 ? Number((cfs.reduce((a, b) => a + b, 0) / cfs.length).toFixed(1)) : 0;
    const avgFrequency =
      freqs.length > 0 ? Number((freqs.reduce((a, b) => a + b, 0) / freqs.length).toFixed(1)) : 0;

    return {
      yearId: year.id,
      name: year.name,
      shortName: year.shortName,
      avgGrade,
      totalAbsences,
      avgFrequency,
      subjectsCount: year.subjects.length,
    };
  });
}

/**
 * Computes category breakdown statistics (e.g. Exatas vs Humanas vs Linguagens)
 */
export function calculateCategoryPerformance(data: YearReport[]): CategoryPerformance[] {
  const map = new Map<
    KnowledgeCategory,
    { grades: number[]; frequencies: number[]; count: number }
  >();

  const allCategories: KnowledgeCategory[] = [
    'Exatas',
    'Humanas',
    'Biológicas',
    'Linguagens',
    'Diversificada / Eletiva',
  ];

  allCategories.forEach((cat) => {
    map.set(cat, { grades: [], frequencies: [], count: 0 });
  });

  data.forEach((year) => {
    year.subjects.forEach((sub) => {
      const entry = map.get(sub.category);
      if (entry) {
        entry.count++;
        if (sub.cf !== null) entry.grades.push(sub.cf);
        if (sub.finalFrequency !== null) entry.frequencies.push(sub.finalFrequency);
      }
    });
  });

  return allCategories.map((cat) => {
    const entry = map.get(cat)!;
    const avgGrade =
      entry.grades.length > 0
        ? Number((entry.grades.reduce((a, b) => a + b, 0) / entry.grades.length).toFixed(1))
        : 0;
    const avgAttendance =
      entry.frequencies.length > 0
        ? Number(
            (entry.frequencies.reduce((a, b) => a + b, 0) / entry.frequencies.length).toFixed(1)
          )
        : 0;

    return {
      category: cat,
      avgGrade,
      totalSubjects: entry.count,
      avgAttendance,
      color: CATEGORY_COLORS[cat] || '#94a3b8',
    };
  });
}

/**
 * Statistical box plot quartiles calculator: Q1, Median, Q3, Min, Max
 */
export function calculateQuartiles(values: number[]): {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
} {
  if (values.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, mean: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = Number((sorted.reduce((a, b) => a + b, 0) / n).toFixed(2));

  const getPercentile = (p: number) => {
    const pos = (n - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };

  return {
    min: sorted[0],
    q1: Number(getPercentile(0.25).toFixed(1)),
    median: Number(getPercentile(0.5).toFixed(1)),
    q3: Number(getPercentile(0.75).toFixed(1)),
    max: sorted[n - 1],
    mean,
  };
}

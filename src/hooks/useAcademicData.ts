import { useMemo, useState } from 'react';
import { SCHOOL_DATA, HISTORICAL_CF_DATA, CONCEPT_DESCRIPTIONS } from '../data/schoolData';
import {
  calculateGlobalAcademicMetrics,
  calculateCategoryPerformance,
  calculateYearSummaries,
} from '../services/metricsService';
import { YearReport } from '../types/academic';

/**
 * Custom hook providing structured access to academic data,
 * domain calculations, and reactive filter states.
 * Follows the Single Responsibility Principle: handles state & memoization of domain metrics.
 */
export function useAcademicData() {
  const [selectedYearId, setSelectedYearId] = useState<string>('8ef');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const globalMetrics = useMemo(() => {
    return calculateGlobalAcademicMetrics(SCHOOL_DATA);
  }, []);

  const categoryPerformance = useMemo(() => {
    return calculateCategoryPerformance(SCHOOL_DATA);
  }, []);

  const yearSummaries = useMemo(() => {
    return calculateYearSummaries(SCHOOL_DATA);
  }, []);

  const currentYear: YearReport = useMemo(() => {
    return SCHOOL_DATA.find((y) => y.id === selectedYearId) || SCHOOL_DATA[0];
  }, [selectedYearId]);

  return {
    rawYears: SCHOOL_DATA,
    historicalData: HISTORICAL_CF_DATA,
    conceptDescriptions: CONCEPT_DESCRIPTIONS,
    globalMetrics,
    categoryPerformance,
    yearSummaries,
    selectedYearId,
    setSelectedYearId,
    selectedCategory,
    setSelectedCategory,
    currentYear,
  };
}

export type KnowledgeCategory =
  | 'Exatas'
  | 'Humanas'
  | 'Biológicas'
  | 'Linguagens'
  | 'Diversificada / Eletiva';

export interface BimGrade {
  bimester: number;
  grade: number | null;
  concept?: string | null;
}

export interface BimAttendance {
  bimester: number;
  absences: number;
  frequencyPercent: number | null;
}

export interface SubjectData {
  id: string;
  name: string;
  category: KnowledgeCategory;
  color: string;
  grades: (number | null)[]; // [1º Bim, 2º Bim, 3º Bim, 4º Bim]
  concepts?: (string | null)[]; // For electives / qualitative: ET, ES, EP
  cf: number | null;
  cfConcept?: string | null;
  absences: number[]; // [1º Bim, 2º Bim, 3º Bim, 4º Bim]
  frequency: (number | null)[]; // [1º Bim, 2º Bim, 3º Bim, 4º Bim] in %
  totalAbsences: number;
  finalFrequency: number | null;
  acTotal?: number; // Ausências Compensadas
}

export interface YearReport {
  id: string;
  name: string;
  shortName: string;
  stage: 'Ensino Fundamental' | 'Ensino Médio';
  shift: string;
  status: string;
  subjects: SubjectData[];
}

export interface HistoricalCF {
  subject: string;
  shortName: string;
  category: KnowledgeCategory;
  color: string;
  grades: {
    '8º Ano': number | null;
    '9º Ano': number | null;
    '1ª Série': number | null;
    '2ª Série': number | null;
    '3ª Série': number | null;
  };
}

export interface ConceptDefinition {
  label: string;
  scoreEquiv: number;
  color: string;
}

export interface GlobalAcademicMetrics {
  totalSubjectsCount: number;
  avgCF: number;
  avgGlobalFreq: number;
  totalAbsences: number;
  totalCompensatedAbsences: number;
  evaluatedYearsCount: number;
  approvalStatus: string;
  cycleSpan: string;
}

export interface CategoryPerformance {
  category: KnowledgeCategory;
  avgGrade: number;
  totalSubjects: number;
  avgAttendance: number;
  color: string;
}

export interface YearSummaryMetric {
  yearId: string;
  name: string;
  shortName: string;
  avgGrade: number;
  totalAbsences: number;
  avgFrequency: number;
  subjectsCount: number;
}

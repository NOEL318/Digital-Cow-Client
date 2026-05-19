/**
 * Este archivo define los tipos typescript del modulo health/diagnoses compartidos por la api, los formularios y los componentes.
 */
export type DiagnosisStatus = 'ACTIVE' | 'RECOVERED' | 'CHRONIC' | 'DECEASED';
export type DiagnosisSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Diagnosis {
  id: number;
  animalId: number;
  diseaseId: number;
  diseaseCode?: string;
  diseaseNameEs?: string;
  diseaseNameEn?: string;
  diagnosedAt: string;
  severity: DiagnosisSeverity;
  symptoms?: string | null;
  status: DiagnosisStatus;
  resolvedAt?: string | null;
  vetVisitId?: number | null;
  notes?: string | null;
}

export interface DiagnosisCreate {
  animalId: number;
  diseaseId: number;
  diagnosedAt: string;
  severity?: DiagnosisSeverity;
  symptoms?: string;
  status?: DiagnosisStatus;
  vetVisitId?: number;
  notes?: string;
}

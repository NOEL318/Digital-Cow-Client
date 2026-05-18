export type HeatDetectionMethod = 'VISUAL' | 'PEDOMETER' | 'HEAT_PATCH' | 'CAMERA' | 'OTHER';
export type HeatIntensity = 'WEAK' | 'MODERATE' | 'STRONG';

export interface Heat {
  id: number;
  animalId: number;
  detectedAt: string;
  detectionMethod?: HeatDetectionMethod | null;
  intensity?: HeatIntensity | null;
  notes?: string | null;
  detectedByUserId?: number | null;
}

export interface HeatCreate {
  animalId: number;
  detectedAt: string;
  detectionMethod?: HeatDetectionMethod;
  intensity?: HeatIntensity;
  notes?: string;
}

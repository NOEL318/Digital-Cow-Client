/**
 * Este archivo define los tipos typescript del modulo ranches compartidos por la api, los formularios y los componentes.
 */
export interface Ranch {
  id: number;
  name: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  areaHectares?: number | null;
  notes?: string | null;
}

export interface Lot {
  id: number;
  ranchId: number;
  name: string;
  areaHectares?: number | null;
  notes?: string | null;
  polygon?: string | null;
  centerLat?: number | null;
  centerLng?: number | null;
}

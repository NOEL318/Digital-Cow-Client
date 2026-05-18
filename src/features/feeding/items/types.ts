export type FeedCategory = 'FORAGE' | 'SILAGE' | 'CONCENTRATE' | 'MINERAL' | 'BYPRODUCT' | 'OTHER';

export interface FeedItem {
  id: number;
  accountId: number | null;
  code: string;
  nameEs: string;
  nameEn: string;
  category: FeedCategory;
  dryMatterPct?: number | null;
  proteinPct?: number | null;
  energyMcalKg?: number | null;
  unitCost?: number | null;
  currency?: string | null;
  notes?: string | null;
  isGlobal?: boolean;
}

export interface FeedItemCreate {
  code: string;
  nameEs: string;
  nameEn: string;
  category: FeedCategory;
  dryMatterPct?: number;
  proteinPct?: number;
  energyMcalKg?: number;
  unitCost?: number;
  currency?: string;
  notes?: string;
}

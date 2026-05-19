/**
 * Este archivo define los tipos typescript del modulo feeding/plans compartidos por la api, los formularios y los componentes.
 */
export type FeedingPlanCategory =
  | 'DAIRY_LACTATION' | 'DAIRY_DRY' | 'BEEF_GROWING' | 'BEEF_FINISHING' | 'CALF' | 'OTHER';

export interface FeedingPlan {
  id: number;
  accountId: number;
  name: string;
  category: FeedingPlanCategory;
  description?: string | null;
}

export interface FeedingPlanItem {
  id: number;
  feedingPlanId: number;
  feedItemId: number;
  kgPerHeadDay: number;
  notes?: string | null;
}

export interface FeedingPlanDetail extends FeedingPlan {
  items: FeedingPlanItem[];
}

export interface FeedingPlanCreate {
  name: string;
  category: FeedingPlanCategory;
  description?: string;
}

export interface FeedingPlanItemCreate {
  feedItemId: number;
  kgPerHeadDay: number;
  notes?: string;
}

export interface LotFeedingPlan {
  id: number;
  lotId: number;
  feedingPlanId: number;
  assignedAt: string;
  unassignedAt?: string | null;
}

export interface LotAssignBody {
  lotId: number;
  feedingPlanId: number;
  assignedAt: string;
}

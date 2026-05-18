export interface DashboardSummary {
  totals: { totalAnimals: number; activeAnimals: number; soldThisYear: number; deadThisYear: number; ranches: number; lots: number; };
  byRanch: { ranchId: number; ranchName: string; count: number; }[];
  byBreed: { breedId: number; breedCode: string; count: number; }[];
  bySex: Record<string, number>;
  byPurpose: Record<string, number>;
  recentAdditions: { labels: string[]; counts: number[]; };
}

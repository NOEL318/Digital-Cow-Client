import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export type AnimalBadge =
  | 'VACCINE_DUE'
  | 'TREATMENT_OPEN'
  | 'WEIGHING_DUE'
  | 'IN_HEAT'
  | 'PREGNANT'
  | 'DRY'
  | string;

export interface AnimalBadgeSet {
  animalId: number;
  badges: AnimalBadge[];
}

/**
 * Resumen de badges por animal: agrupa vacunas atrasadas,
 * tratamientos abiertos, sin pesar, en celo, preñada y seca.
 */
export function useAnimalBadges() {
  return useQuery({
    queryKey: ['animals', 'badges'],
    queryFn: async () => (await http.get<AnimalBadgeSet[]>('/animals/badges')).data,
    staleTime: 1000 * 60
  });
}

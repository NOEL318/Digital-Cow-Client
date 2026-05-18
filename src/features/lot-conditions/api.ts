import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';

export type LotConditionKind =
  | 'MUD_LOW' | 'MUD_MEDIUM' | 'MUD_HIGH'
  | 'RAIN_LIGHT' | 'RAIN_HEAVY' | 'DROUGHT'
  | 'HEAT_WAVE' | 'COLD'
  | 'FLIES' | 'TICKS' | 'OTHER_PEST'
  | 'WATER_OK' | 'WATER_LOW' | 'WATER_OUT'
  | 'PASTURE_GOOD' | 'PASTURE_LOW'
  | 'INFRA_DAMAGE'
  | 'CUSTOM';

export interface LotCondition {
  id: number;
  lotId: number;
  observedAt: string;
  kind: LotConditionKind;
  severity?: number | null;
  customLabel?: string | null;
  notes?: string | null;
}

export interface LotConditionCreate {
  lotId: number;
  observedAt: string;
  kind: LotConditionKind;
  severity?: number | null;
  customLabel?: string | null;
  notes?: string | null;
}

const KEY = (lotId: number) => ['lot-conditions', lotId] as const;

export function useLotConditions(lotId: number | undefined) {
  return useQuery({
    queryKey: KEY(lotId ?? 0),
    queryFn: async () =>
      (await http.get<LotCondition[]>('/lot-conditions', { params: { lotId } })).data,
    enabled: !!lotId
  });
}

export function useCreateLotCondition(lotId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: LotConditionCreate) =>
      (await http.post<LotCondition>('/lot-conditions', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(lotId) })
  });
}

export function useDeleteLotCondition(lotId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => http.delete(`/lot-conditions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(lotId) })
  });
}

import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { animalsApi } from '@/features/animals/api';
import { AnimalForm } from '@/features/animals/components/AnimalForm';

/** Crea o edita un animal segun :id. */
export default function AnimalEditPage() {
  const { id } = useParams<{ id: string }>();
  const editing = !!id && id !== 'new';
  const nav = useNavigate();
  const qc = useQueryClient();
  const existing = useQuery({
    queryKey: ['animal', Number(id)],
    queryFn: () => animalsApi.get(Number(id)),
    enabled: editing
  });

  const m = useMutation({
    mutationFn: (v: Parameters<typeof animalsApi.create>[0]) =>
      editing ? animalsApi.update(Number(id), v) : animalsApi.create(v),
    onSuccess: r => { qc.invalidateQueries({ queryKey: ['animals'] }); nav(`/animals/${r.id}`); }
  });

  if (editing && !existing.data) return <div>...</div>;
  return <AnimalForm initial={existing.data} submitting={m.isPending} onSubmit={async v => { await m.mutateAsync(v); }} />;
}

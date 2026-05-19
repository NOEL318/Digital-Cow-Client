/**
 * Esta pagina muestra el detalle de un rancho con sus lotes, animales y resumen de eventos.
 */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus, Stethoscope, Pencil } from 'lucide-react';
import { ranchApi, useLots } from '@/features/ranches/api';
import { LotFormDialog } from '@/features/ranches/components/LotFormDialog';
import { RanchFormDialog } from '@/features/ranches/components/RanchFormDialog';
import { RanchSummaryCards } from '@/features/ranches/components/RanchSummaryCards';
import { RanchLotsTable } from '@/features/ranches/components/RanchLotsTable';
import { RanchAnimalsTable } from '@/features/ranches/components/RanchAnimalsTable';
import { RanchRecentEvents } from '@/features/ranches/components/RanchRecentEvents';
import { LotConditionsPanel } from '@/features/lot-conditions/LotConditionsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Detalle del rancho: header con datos, resumen, lotes, animales,
 * eventos y un panel por lote para registrar condiciones del corral
 * (lodo, lluvia, plagas, etc.).
 */
export default function RanchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ranchId = Number(id);
  const { t } = useTranslation(['ranches', 'common']);
  const nav = useNavigate();

  const ranch = useQuery({ queryKey: ['ranch', ranchId], queryFn: () => ranchApi.get(ranchId) });
  const lots = useLots(ranchId);

  const [lotOpen, setLotOpen] = useState(false);
  const [ranchEditOpen, setRanchEditOpen] = useState(false);
  const [conditionsLotId, setConditionsLotId] = useState<number | null>(null);

  if (!ranch.data) return <div>{t('common:loading')}</div>;
  const r = ranch.data;
  const mapsUrl = r.latitude != null && r.longitude != null
    ? `https://maps.google.com/?q=${r.latitude},${r.longitude}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{r.name}</h2>
          <div className="text-sm text-muted-foreground flex flex-wrap gap-3">
            {r.location && <span>{r.location}</span>}
            {r.areaHectares != null && <span>{r.areaHectares} {t('ranches:detail.haShort')}</span>}
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
                <MapPin className="h-4 w-4" />{t('ranches:detail.viewOnMap')}
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setLotOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />{t('ranches:lots.new')}
          </Button>
          <Button asChild>
            <Link to={`/animales/nuevo?ranchId=${ranchId}`}>
              <Plus className="h-4 w-4 mr-1" />{t('ranches:detail.newAnimal')}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/panel/salud/visitas-vet?ranchId=${ranchId}`}>
              <Stethoscope className="h-4 w-4 mr-1" />{t('ranches:detail.registerVetVisit')}
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setRanchEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-1" />{t('ranches:detail.editRanch')}
          </Button>
        </div>
      </div>

      <RanchSummaryCards ranchId={ranchId} />

      <Card>
        <CardHeader><CardTitle>{t('ranches:lots.title')}</CardTitle></CardHeader>
        <CardContent>
          <RanchLotsTable ranchId={ranchId} />
          {lots.data && lots.data.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Condiciones del corral:</span>
              {lots.data.map(lot => (
                <button
                  key={lot.id}
                  type="button"
                  onClick={() => setConditionsLotId(prev => prev === lot.id ? null : lot.id)}
                  className={`text-sm px-3 py-1 rounded-full border ${
                    conditionsLotId === lot.id ? 'bg-accent font-semibold' : 'hover:bg-accent'
                  }`}
                >
                  {lot.name}
                </button>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {conditionsLotId ? (
        <Card>
          <CardContent className="pt-4">
            <LotConditionsPanel lotId={conditionsLotId} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader><CardTitle>{t('ranches:detail.recentAnimals')}</CardTitle></CardHeader>
        <CardContent><RanchAnimalsTable ranchId={ranchId} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t('ranches:detail.recentEvents')}</CardTitle></CardHeader>
        <CardContent><RanchRecentEvents ranchId={ranchId} /></CardContent>
      </Card>

      <LotFormDialog open={lotOpen} onClose={() => setLotOpen(false)} ranchId={ranchId} />
      <RanchFormDialog
        open={ranchEditOpen}
        onClose={() => { setRanchEditOpen(false); nav(`/ajustes/ranchos/${ranchId}`, { replace: true }); }}
        ranch={r}
      />
    </div>
  );
}

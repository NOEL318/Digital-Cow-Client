/**
 * Esta pagina lista los controles de plagas registrados por lote o rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreatePestControl, usePestControls } from '@/features/health/pestControls/api';
import { PestControlForm } from '@/features/health/pestControls/components/PestControlForm';
import { usePests } from '@/features/catalog/api/pests';
import { localizedName } from '@/lib/catalog';

/**
 * Pagina de listado y creacion de controles de plagas.
 */
export default function PestControlsPage() {
  const { t } = useTranslation(['health', 'common']);
  const [open, setOpen] = useState(false);
  const list = usePestControls();
  const pests = usePests();
  const create = useCreatePestControl();
  const locale = i18n.language;

  const today = new Date().toISOString().slice(0, 10);

  const pestName = (id: number) => {
    const p = pests.data?.find(x => x.id === id);
    return p ? localizedName(p, locale) : '-';
  };

  const nextApplicationBadge = (date: string | null | undefined) => {
    if (!date) return <span className="text-muted-foreground">-</span>;
    if (date < today) return <Badge tone="danger">{date}</Badge>;
    const soon = new Date(today);
    soon.setDate(soon.getDate() + 7);
    const soonStr = soon.toISOString().slice(0, 10);
    if (date <= soonStr) return <Badge tone="warning">{date}</Badge>;
    return <Badge tone="success">{date}</Badge>;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('health:pest.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('health:pest.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('health:pest.new')}</DialogTitle></DialogHeader>
            <PestControlForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('health:pest.appliedAt')}</TableHead>
            <TableHead>{t('health:pest.pest')}</TableHead>
            <TableHead>{t('health:pest.product')}</TableHead>
            <TableHead>{t('health:pest.nextApplication')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.data?.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.appliedAt}</TableCell>
              <TableCell>{pestName(p.pestId)}</TableCell>
              <TableCell>{p.productUsed}</TableCell>
              <TableCell>{nextApplicationBadge(p.nextApplicationAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

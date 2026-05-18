import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ranchApi } from '@/features/ranches/api';
import { RanchFormDialog } from '@/features/ranches/components/RanchFormDialog';
import { Button } from '@/components/ui/button';

/** Listado de ranchos de la cuenta. */
export default function RanchesPage() {
  const { t } = useTranslation('ranches');
  const { data = [] } = useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('title')}</h2>
        <Button onClick={() => setOpen(true)}>{t('new')}</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left"><th className="p-2">{t('fields.name')}</th><th>{t('fields.location')}</th><th>{t('fields.area')}</th></tr></thead>
        <tbody>
          {data.map(r => (
            <tr key={r.id} className="border-b hover:bg-accent">
              <td className="p-2"><Link to={`/ranches/${r.id}`} className="underline">{r.name}</Link></td>
              <td>{r.location}</td>
              <td>{r.areaHectares ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <RanchFormDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

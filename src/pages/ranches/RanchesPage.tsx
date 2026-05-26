/**
 * Esta pagina lista los ranchos del usuario y permite crear o editar uno.
 */
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ranchApi } from '@/features/ranches/api';
import { RanchFormDialog } from '@/features/ranches/components/RanchFormDialog';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('fields.name')}</TableHead>
            <TableHead>{t('fields.location')}</TableHead>
            <TableHead>{t('fields.area')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(r => (
            <TableRow key={r.id}>
              <TableCell>
                <Link to={`/ranches/${r.id}`} className="underline font-medium">
                  {r.name}
                </Link>
              </TableCell>
              <TableCell>{r.location}</TableCell>
              <TableCell>{r.areaHectares ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RanchFormDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

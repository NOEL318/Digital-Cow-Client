/**
 * Este componente lista registros del modulo health/alerts con paginacion y acciones rapidas.
 */
import { useTranslation } from 'react-i18next';
import type { AlertItem } from '@/features/health/alerts/api';

interface Props {
  title: string;
  items?: AlertItem[] | null;
  emptyKey: string;
}

/** Renderiza una lista compacta de alertas o el placeholder vacio. */
export function AlertsList({ title, items, emptyKey }: Props) {
  const { t } = useTranslation(['alerts']);
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section className="glass-card rounded-2xl p-5 border border-white/60 dark:border-white/10">
      <h3 className="font-semibold mb-2">{title}</h3>
      {safeItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t(emptyKey)}</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {safeItems.map((item, i) => (
            <li key={i} className="flex justify-between border-b last:border-0 py-1">
              <span>{item.animalTag ? `${t('alerts:animal')} ${item.animalTag}` : '-'} - {item.label}</span>
              <span className="text-muted-foreground">{item.date}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

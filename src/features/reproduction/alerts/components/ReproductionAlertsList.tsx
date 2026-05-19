/**
 * Este componente lista registros del modulo reproduction/alerts con paginacion y acciones rapidas.
 */
import { useTranslation } from 'react-i18next';
import type { ReproductionAlertItem } from '../api';

interface Props {
  title: string;
  items: ReproductionAlertItem[];
  emptyKey: string;
}

/** Renderiza una lista compacta de alertas reproductivas o el placeholder vacio. */
export function ReproductionAlertsList({ title, items, emptyKey }: Props) {
  const { t } = useTranslation(['reproductionAlerts']);
  return (
    <section className="border rounded p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t(emptyKey)}</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {items.map((item, i) => (
            <li key={i} className="flex justify-between border-b last:border-0 py-1">
              <span>{item.animalTag ? `${t('reproductionAlerts:animal')} ${item.animalTag}` : '-'} - {item.label}</span>
              <span className="text-muted-foreground">{item.date}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

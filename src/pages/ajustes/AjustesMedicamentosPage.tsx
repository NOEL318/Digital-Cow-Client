/**
 * Esta pagina muestra el catalogo de medicamentos disponibles para tratamientos y vacunaciones.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pill, Plus, ScanLine, Trash2, Edit2, AlertTriangle, Calendar } from 'lucide-react';
import {
  useMedications,
  useCreateMedication,
  useUpdateMedication,
  useDeleteMedication,
  findMedicationByBarcode
} from '@/features/catalog/api/medications';
import type {
  Medication,
  MedicationCategory,
  MedicationUpsertRequest
} from '@/features/catalog/types';
import { BarcodeScanner } from '@/components/ui/barcode-scanner';
import { BigButton } from '@/components/ui/big-button';
import { EmptyState } from '@/components/ui/empty-state';
import { HelpfulField } from '@/components/ui/helpful-field';
import { Badge } from '@/components/ui/badge';

const EMPTY: MedicationUpsertRequest = {
  nameEs: '',
  activeIngredient: '',
  manufacturer: '',
  presentation: '',
  barcode: '',
  expiresAt: '',
  category: 'OTHER',
  defaultDose: '',
  defaultRoute: null,
  withdrawalMilkDays: 0,
  withdrawalMeatDays: 0,
  notes: ''
};

function toRequest(m: Medication): MedicationUpsertRequest & { id?: number } {
  return {
    id: m.id,
    nameEs: m.nameEs,
    activeIngredient: m.activeIngredient ?? '',
    manufacturer: m.manufacturer ?? '',
    presentation: m.presentation ?? '',
    barcode: m.barcode ?? '',
    expiresAt: m.expiresAt ?? '',
    category: m.category,
    defaultDose: m.defaultDose ?? '',
    defaultRoute: m.defaultRoute,
    withdrawalMilkDays: m.withdrawalMilkDays,
    withdrawalMeatDays: m.withdrawalMeatDays,
    notes: m.notes ?? ''
  };
}

/**
 * Estado de la fecha de caducidad: vencido, por vencer, ok.
 */
function expiryStatus(expiresAt: string | null | undefined): 'expired' | 'warning' | 'ok' | 'none' {
  if (!expiresAt) return 'none';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(expiresAt);
  const diff = Math.floor((d.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return 'expired';
  if (diff <= 30) return 'warning';
  return 'ok';
}

/**
 * Pagina del catalogo de medicamentos del tenant. Soporta crear,
 * editar, eliminar y escanear codigos de barras. Cuando un escaneo
 * encuentra un medicamento, se muestra alerta visible si esta
 * vencido o esta a 30 dias o menos de caducar.
 */
export default function AjustesMedicamentosPage() {
  const { t } = useTranslation(['catalog', 'common']);
  const { data, isLoading } = useMedications();
  const create = useCreateMedication();
  const update = useUpdateMedication();
  const del = useDeleteMedication();
  const [editing, setEditing] = useState<(MedicationUpsertRequest & { id?: number }) | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanAlert, setScanAlert] = useState<{ kind: 'expired' | 'warning' | 'notfound'; text: string } | null>(null);

  async function handleScan(code: string) {
    setScannerOpen(false);
    setScanAlert(null);
    const found = await findMedicationByBarcode(code);
    if (!found) {
      setScanAlert({ kind: 'notfound', text: t('catalog:med.scanNotFound', { code }) });
      setEditing({ ...EMPTY, barcode: code });
      return;
    }
    const status = expiryStatus(found.expiresAt);
    if (status === 'expired') {
      setScanAlert({
        kind: 'expired',
        text: t('catalog:med.scanExpired', { name: found.nameEs, date: found.expiresAt })
      });
    } else if (status === 'warning') {
      setScanAlert({
        kind: 'warning',
        text: t('catalog:med.scanWarning', { name: found.nameEs, date: found.expiresAt })
      });
    }
    setEditing(toRequest(found));
  }

  if (editing) {
    return (
      <div>
        {scanAlert ? <ScanAlertBanner alert={scanAlert} onDismiss={() => setScanAlert(null)} /> : null}
        <MedicineForm
          initial={editing}
          onCancel={() => { setEditing(null); setScanAlert(null); }}
          onSave={async values => {
            if (editing.id) {
              await update.mutateAsync({ ...values, id: editing.id });
            } else {
              await create.mutateAsync(values);
            }
            setEditing(null);
            setScanAlert(null);
          }}
          submitting={create.isPending || update.isPending}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" aria-hidden />
          {t('common:nav.ajustesMedicamentos')}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <BigButton
            label={t('catalog:med.scanCode')}
            icon={ScanLine}
            variant="outline"
            onClick={() => setScannerOpen(true)}
          />
          <BigButton
            label={t('catalog:med.addMedication')}
            icon={Plus}
            onClick={() => setEditing({ ...EMPTY })}
          />
        </div>
      </header>

      {scanAlert ? <ScanAlertBanner alert={scanAlert} onDismiss={() => setScanAlert(null)} /> : null}

      {isLoading ? (
        <p>{t('common:loading')}</p>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Pill}
          title={t('catalog:med.emptyTitle')}
          description={t('catalog:med.emptyDesc')}
          ctaLabel={t('catalog:med.emptyCtaLabel')}
          onCta={() => setEditing({ ...EMPTY })}
        />
      ) : (
        <ul className="space-y-2">
          {data.map(m => {
            const status = expiryStatus(m.expiresAt);
            return (
              <li
                key={m.id}
                className={`flex flex-wrap items-center gap-3 rounded-xl border p-4 ${
                  status === 'expired' ? 'border-red-300 bg-red-50 dark:bg-red-950/30'
                  : status === 'warning' ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30'
                  : ''
                }`}
              >
                <Pill className="h-8 w-8 text-primary" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{m.nameEs}</p>
                  <p className="text-sm text-muted-foreground">
                    {[m.activeIngredient, m.presentation, m.manufacturer].filter(Boolean).join(' · ')}
                  </p>
                  {m.barcode ? (
                    <p className="text-xs text-muted-foreground">
                      {t('catalog:med.barcodeLabel')}: {m.barcode}
                    </p>
                  ) : null}
                  {m.expiresAt ? (
                    <p className="text-xs inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden />
                      {status === 'expired' ? (
                        <Badge tone="danger">{t('catalog:med.expired')} {m.expiresAt}</Badge>
                      ) : status === 'warning' ? (
                        <Badge tone="warning">{t('catalog:med.expiresSoon')} {m.expiresAt}</Badge>
                      ) : (
                        <Badge tone="success">{t('catalog:med.expiresSoon')} {m.expiresAt}</Badge>
                      )}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {t('catalog:med.withdrawalMilkLine', { days: m.withdrawalMilkDays })}
                    {' · '}
                    {t('catalog:med.withdrawalMeatLine', { days: m.withdrawalMeatDays })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <BigButton label={t('catalog:med.editBtn')} icon={Edit2} variant="outline" onClick={() => setEditing(toRequest(m))} />
                  <BigButton
                    label={t('catalog:med.deleteBtn')}
                    icon={Trash2}
                    variant="destructive"
                    onClick={async () => {
                      if (window.confirm(t('catalog:med.deleteConfirm', { name: m.nameEs }))) await del.mutateAsync(m.id);
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={handleScan}
        title={t('catalog:med.scannerTitle')}
      />
    </div>
  );
}

function ScanAlertBanner({
  alert, onDismiss
}: { alert: { kind: 'expired' | 'warning' | 'notfound'; text: string }; onDismiss: () => void }) {
  const { t } = useTranslation('catalog');
  const colors = alert.kind === 'expired'
    ? 'border-red-400 bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200'
    : alert.kind === 'warning'
    ? 'border-amber-400 bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
    : 'border-sky-400 bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200';
  return (
    <div role="alert" className={`rounded-xl border p-3 flex items-start gap-2 ${colors}`}>
      <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
      <p className="flex-1 font-medium">{alert.text}</p>
      <button type="button" onClick={onDismiss} className="text-sm underline">{t('med.alertClose')}</button>
    </div>
  );
}

interface MedicineFormProps {
  initial: MedicationUpsertRequest & { id?: number };
  onSave: (values: MedicationUpsertRequest) => Promise<void> | void;
  onCancel: () => void;
  submitting: boolean;
}

/**
 * Form simplificado: nombre + datos básicos + caducidad. Sin código
 * interno ni nombre en inglés (el backend los autogenera).
 */
function MedicineForm({ initial, onSave, onCancel, submitting }: MedicineFormProps) {
  const { t } = useTranslation(['catalog', 'common']);
  const [values, setValues] = useState<MedicationUpsertRequest & { id?: number }>(initial);
  const [scannerOpen, setScannerOpen] = useState(false);

  function set<K extends keyof MedicationUpsertRequest>(k: K, v: MedicationUpsertRequest[K]) {
    setValues(prev => ({ ...prev, [k]: v }));
  }

  const CATEGORIES: { value: MedicationCategory; label: string }[] = [
    { value: 'VACCINE', label: t('catalog:med.categoryVaccine') },
    { value: 'ANTIBIOTIC', label: t('catalog:med.categoryAntibiotic') },
    { value: 'ANTIPARASITIC', label: t('catalog:med.categoryAntiparasitic') },
    { value: 'HORMONE', label: t('catalog:med.categoryHormone') },
    { value: 'VITAMIN', label: t('catalog:med.categoryVitamin') },
    { value: 'ANTIINFLAMMATORY', label: t('catalog:med.categoryAntiinflammatory') },
    { value: 'OTHER', label: t('catalog:med.categoryOther') }
  ];

  const canSave = (values.nameEs ?? '').trim().length > 0;

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">
        {values.id ? t('catalog:med.formEditTitle') : t('catalog:med.formAddTitle')}
      </h1>

      <HelpfulField id="med-name" label={t('catalog:med.fieldName')} required example={t('catalog:med.fieldNameExample')}>
        <input
          id="med-name"
          value={values.nameEs}
          onChange={e => set('nameEs', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-active" label={t('catalog:med.fieldActiveIngredient')} help={t('catalog:med.fieldActiveIngredientHelp')} example={t('catalog:med.fieldActiveIngredientExample')}>
        <input
          id="med-active"
          value={values.activeIngredient ?? ''}
          onChange={e => set('activeIngredient', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-manufacturer" label={t('catalog:med.fieldManufacturer')} help={t('catalog:med.fieldManufacturerHelp')} example={t('catalog:med.fieldManufacturerExample')}>
        <input
          id="med-manufacturer"
          value={values.manufacturer ?? ''}
          onChange={e => set('manufacturer', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-presentation" label={t('catalog:med.fieldPresentation')} help={t('catalog:med.fieldPresentationHelp')} example={t('catalog:med.fieldPresentationExample')}>
        <input
          id="med-presentation"
          value={values.presentation ?? ''}
          onChange={e => set('presentation', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-barcode" label={t('catalog:med.fieldBarcode')} help={t('catalog:med.fieldBarcodeHelp')} example={t('catalog:med.fieldBarcodeExample')}>
        <div className="flex gap-2">
          <input
            id="med-barcode"
            value={values.barcode ?? ''}
            onChange={e => set('barcode', e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 text-base bg-background"
          />
          <BigButton label={t('catalog:med.scanBtn')} icon={ScanLine} variant="outline" onClick={() => setScannerOpen(true)} />
        </div>
      </HelpfulField>

      <HelpfulField id="med-expires" label={t('catalog:med.fieldExpires')} icon={Calendar} help={t('catalog:med.fieldExpiresHelp')}>
        <input
          id="med-expires"
          type="date"
          value={values.expiresAt ?? ''}
          onChange={e => set('expiresAt', e.target.value || null)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-category" label={t('catalog:med.fieldCategory')} help={t('catalog:med.fieldCategoryHelp')}>
        <select
          id="med-category"
          value={values.category ?? 'OTHER'}
          onChange={e => set('category', e.target.value as MedicationCategory)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </HelpfulField>

      <HelpfulField id="med-milk" label={t('catalog:med.fieldWithdrawalMilk')} help={t('catalog:med.fieldWithdrawalMilkHelp')} example={t('catalog:med.fieldWithdrawalMilkExample')}>
        <input
          id="med-milk"
          type="number"
          min={0}
          value={values.withdrawalMilkDays ?? 0}
          onChange={e => set('withdrawalMilkDays', Number(e.target.value))}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-meat" label={t('catalog:med.fieldWithdrawalMeat')} help={t('catalog:med.fieldWithdrawalMeatHelp')} example={t('catalog:med.fieldWithdrawalMeatExample')}>
        <input
          id="med-meat"
          type="number"
          min={0}
          value={values.withdrawalMeatDays ?? 0}
          onChange={e => set('withdrawalMeatDays', Number(e.target.value))}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-notes" label={t('catalog:med.fieldNotes')} help={t('catalog:med.fieldNotesHelp')}>
        <textarea
          id="med-notes"
          rows={3}
          value={values.notes ?? ''}
          onChange={e => set('notes', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <div className="flex justify-between gap-3 pt-4">
        <BigButton label={t('common:actions.cancel')} variant="outline" onClick={onCancel} />
        <BigButton
          label={values.id ? t('catalog:med.saveChanges') : t('catalog:med.createMedication')}
          disabled={!canSave || submitting}
          onClick={() => onSave(values)}
        />
      </div>

      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={code => { set('barcode', code); setScannerOpen(false); }}
        title={t('catalog:med.scannerTitle')}
      />
    </div>
  );
}

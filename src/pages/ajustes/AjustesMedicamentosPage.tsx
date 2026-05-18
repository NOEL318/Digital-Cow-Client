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

const CATEGORIES: { value: MedicationCategory; label: string }[] = [
  { value: 'VACCINE', label: 'Vacuna' },
  { value: 'ANTIBIOTIC', label: 'Antibiotico' },
  { value: 'ANTIPARASITIC', label: 'Antiparasitario' },
  { value: 'HORMONE', label: 'Hormonal' },
  { value: 'VITAMIN', label: 'Vitamina o suplemento' },
  { value: 'ANTIINFLAMMATORY', label: 'Antiinflamatorio' },
  { value: 'OTHER', label: 'Otro' }
];

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
  const { t } = useTranslation('common');
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
      setScanAlert({ kind: 'notfound', text: `Codigo "${code}" no esta en tu catalogo. Agregalo ahora.` });
      setEditing({ ...EMPTY, barcode: code });
      return;
    }
    const status = expiryStatus(found.expiresAt);
    if (status === 'expired') {
      setScanAlert({
        kind: 'expired',
        text: `${found.nameEs} VENCIO el ${found.expiresAt}. No lo uses, busca otro envase.`
      });
    } else if (status === 'warning') {
      setScanAlert({
        kind: 'warning',
        text: `${found.nameEs} caduca el ${found.expiresAt}. Falta poco, usalo pronto.`
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
          {t('nav.ajustesMedicamentos')}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <BigButton
            label="Escanear codigo"
            icon={ScanLine}
            variant="outline"
            onClick={() => setScannerOpen(true)}
          />
          <BigButton
            label="Agregar medicamento"
            icon={Plus}
            onClick={() => setEditing({ ...EMPTY })}
          />
        </div>
      </header>

      {scanAlert ? <ScanAlertBanner alert={scanAlert} onDismiss={() => setScanAlert(null)} /> : null}

      {isLoading ? (
        <p>Cargando...</p>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="Aun no tienes medicamentos guardados"
          description="Agrega los medicamentos que usas en tu rancho. Escanea el codigo de barras para llenar los datos automaticamente."
          ctaLabel="Agregar el primero"
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
                  {m.barcode ? <p className="text-xs text-muted-foreground">Codigo: {m.barcode}</p> : null}
                  {m.expiresAt ? (
                    <p className={`text-xs inline-flex items-center gap-1 ${
                      status === 'expired' ? 'text-red-700 font-semibold'
                      : status === 'warning' ? 'text-amber-700 font-semibold'
                      : 'text-muted-foreground'
                    }`}>
                      <Calendar className="h-3 w-3" aria-hidden />
                      {status === 'expired' ? 'Vencido el ' : 'Caduca el '}{m.expiresAt}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Retiro leche: {m.withdrawalMilkDays} dias · Retiro carne: {m.withdrawalMeatDays} dias
                  </p>
                </div>
                <div className="flex gap-2">
                  <BigButton label="Editar" icon={Edit2} variant="outline" onClick={() => setEditing(toRequest(m))} />
                  <BigButton
                    label="Eliminar"
                    icon={Trash2}
                    variant="destructive"
                    onClick={async () => {
                      if (window.confirm(`Eliminar ${m.nameEs}?`)) await del.mutateAsync(m.id);
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
        title="Escanear codigo del medicamento"
      />
    </div>
  );
}

function ScanAlertBanner({
  alert, onDismiss
}: { alert: { kind: 'expired' | 'warning' | 'notfound'; text: string }; onDismiss: () => void }) {
  const colors = alert.kind === 'expired'
    ? 'border-red-400 bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200'
    : alert.kind === 'warning'
    ? 'border-amber-400 bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
    : 'border-sky-400 bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200';
  return (
    <div role="alert" className={`rounded-xl border p-3 flex items-start gap-2 ${colors}`}>
      <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
      <p className="flex-1 font-medium">{alert.text}</p>
      <button type="button" onClick={onDismiss} className="text-sm underline">Cerrar</button>
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
  const [values, setValues] = useState<MedicationUpsertRequest & { id?: number }>(initial);
  const [scannerOpen, setScannerOpen] = useState(false);

  function set<K extends keyof MedicationUpsertRequest>(k: K, v: MedicationUpsertRequest[K]) {
    setValues(prev => ({ ...prev, [k]: v }));
  }

  const canSave = (values.nameEs ?? '').trim().length > 0;

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">{values.id ? 'Editar medicamento' : 'Agregar medicamento'}</h1>

      <HelpfulField id="med-name" label="Nombre del medicamento" required example="Oxitetraciclina larga acción">
        <input
          id="med-name"
          value={values.nameEs}
          onChange={e => set('nameEs', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-active" label="Principio activo" help="La sustancia que cura o protege." example="Oxitetraciclina">
        <input
          id="med-active"
          value={values.activeIngredient ?? ''}
          onChange={e => set('activeIngredient', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-manufacturer" label="Fabricante" help="La empresa que lo produce." example="Bayer">
        <input
          id="med-manufacturer"
          value={values.manufacturer ?? ''}
          onChange={e => set('manufacturer', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-presentation" label="Presentacion" help="Tamano y forma del envase." example="Frasco inyectable de 100 mililitros">
        <input
          id="med-presentation"
          value={values.presentation ?? ''}
          onChange={e => set('presentation', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-barcode" label="Codigo de barras" help="Lo encuentras en el envase. Puedes escanearlo." example="7501234567890">
        <div className="flex gap-2">
          <input
            id="med-barcode"
            value={values.barcode ?? ''}
            onChange={e => set('barcode', e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 text-base bg-background"
          />
          <BigButton label="Escanear" icon={ScanLine} variant="outline" onClick={() => setScannerOpen(true)} />
        </div>
      </HelpfulField>

      <HelpfulField id="med-expires" label="Fecha de caducidad" icon={Calendar} help="Cuando vence el envase. Te avisamos si lo escaneas vencido.">
        <input
          id="med-expires"
          type="date"
          value={values.expiresAt ?? ''}
          onChange={e => set('expiresAt', e.target.value || null)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-category" label="Categoria" help="Para que sirve el medicamento.">
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

      <HelpfulField id="med-milk" label="Dias de retiro en leche" help="Dias que no se debe vender la leche despues de aplicar." example="3">
        <input
          id="med-milk"
          type="number"
          min={0}
          value={values.withdrawalMilkDays ?? 0}
          onChange={e => set('withdrawalMilkDays', Number(e.target.value))}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-meat" label="Dias de retiro en carne" help="Dias que no se debe vender el animal despues de aplicar." example="14">
        <input
          id="med-meat"
          type="number"
          min={0}
          value={values.withdrawalMeatDays ?? 0}
          onChange={e => set('withdrawalMeatDays', Number(e.target.value))}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <HelpfulField id="med-notes" label="Notas" help="Cualquier detalle util que quieras recordar.">
        <textarea
          id="med-notes"
          rows={3}
          value={values.notes ?? ''}
          onChange={e => set('notes', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-base bg-background"
        />
      </HelpfulField>

      <div className="flex justify-between gap-3 pt-4">
        <BigButton label="Cancelar" variant="outline" onClick={onCancel} />
        <BigButton
          label={values.id ? 'Guardar cambios' : 'Crear medicamento'}
          disabled={!canSave || submitting}
          onClick={() => onSave(values)}
        />
      </div>

      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={code => { set('barcode', code); setScannerOpen(false); }}
        title="Escanear codigo del medicamento"
      />
    </div>
  );
}

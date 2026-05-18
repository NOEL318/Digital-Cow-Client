import { useState, type ChangeEvent } from 'react';
import Papa from 'papaparse';
import { Upload, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BigButton } from '@/components/ui/big-button';

interface CsvImportDialogProps<T> {
  open: boolean;
  title: string;
  /** Columnas esperadas en el CSV; los headers deben coincidir. */
  columnsHelp: string;
  /** Convierte una fila parseada en el payload del backend. Devuelve null si la fila debe saltarse. */
  parseRow: (row: Record<string, string>) => T | string;
  /** Llama al backend con la lista de payloads validos. */
  submit: (items: T[]) => Promise<unknown>;
  onClose: () => void;
}

/**
 * Dialog generico de importacion CSV. El usuario sube un archivo,
 * el componente parsea con PapaParse, muestra cuantas filas validas
 * y cuantas con error, y si todo se ve bien envia el batch al
 * backend. Pensado para que rancheros con planillas de Excel
 * migren datos sin ayuda tecnica.
 */
export function CsvImportDialog<T>({
  open, title, columnsHelp, parseRow, submit, onClose
}: CsvImportDialogProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [errors, setErrors] = useState<{ row: number; reason: string }[]>([]);
  const [busy, setBusy] = useState<'parsing' | 'sending' | null>(null);
  const [done, setDone] = useState(0);

  if (!open) return null;

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy('parsing');
    setErrors([]);
    setItems([]);
    setDone(0);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(result) {
        const validItems: T[] = [];
        const errs: { row: number; reason: string }[] = [];
        result.data.forEach((row, i) => {
          const parsed = parseRow(row);
          if (typeof parsed === 'string') {
            errs.push({ row: i + 2, reason: parsed });
          } else {
            validItems.push(parsed);
          }
        });
        setItems(validItems);
        setErrors(errs);
        setBusy(null);
      }
    });
  }

  async function send() {
    if (items.length === 0) return;
    setBusy('sending');
    try {
      await submit(items);
      setDone(items.length);
    } catch (e) {
      setErrors(prev => [...prev, { row: 0, reason: (e as Error).message }]);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-lg p-5 space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" aria-hidden />
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="p-2 rounded-full hover:bg-accent">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <p className="text-sm text-muted-foreground">{columnsHelp}</p>

        <label className="block">
          <span className="sr-only">Archivo CSV</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </label>

        {busy === 'parsing' ? <p className="text-sm">Leyendo archivo...</p> : null}

        {items.length > 0 ? (
          <div className="rounded-lg border bg-green-50 dark:bg-green-950/30 p-3 text-sm flex gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-700" aria-hidden />
            <span>{items.length} filas listas para importar.</span>
          </div>
        ) : null}

        {errors.length > 0 ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3 text-sm space-y-1 max-h-40 overflow-y-auto">
            <p className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden />
              {errors.length} filas con problema:
            </p>
            <ul className="list-disc pl-5">
              {errors.slice(0, 10).map((e, i) => (
                <li key={i}>{e.row > 0 ? `Fila ${e.row}: ` : ''}{e.reason}</li>
              ))}
              {errors.length > 10 ? <li>...y {errors.length - 10} más</li> : null}
            </ul>
          </div>
        ) : null}

        {done > 0 ? (
          <div className="rounded-lg border bg-green-50 dark:bg-green-950/30 p-3 text-sm flex gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-700" aria-hidden />
            <span>{done} registros importados con éxito.</span>
          </div>
        ) : null}

        <div className="flex justify-between gap-3">
          <BigButton label="Cerrar" variant="outline" onClick={onClose} />
          <BigButton
            label={busy === 'sending' ? 'Enviando...' : 'Importar'}
            onClick={send}
            disabled={items.length === 0 || busy === 'sending' || done > 0}
          />
        </div>
      </div>
    </div>
  );
}

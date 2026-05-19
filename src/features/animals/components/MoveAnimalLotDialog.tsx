/**
 * Este componente es un dialogo modal del modulo animals para una accion especifica.
 */
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Move, X, MapPin, Map as MapIcon } from 'lucide-react';
import { animalsApi } from '@/features/animals/api';
import { RanchPicker, LotPicker } from '@/components/ui/ranch-lot-picker';
import { BigButton } from '@/components/ui/big-button';
import { HelpfulField } from '@/components/ui/helpful-field';

interface MoveAnimalLotDialogProps {
  open: boolean;
  animalId: number;
  internalTag: string;
  currentRanchId: number;
  currentLotId?: number | null;
  onClose: () => void;
  onMoved?: () => void;
}

/**
 * Dialogo para reubicar un animal en otro lote (corral). Permite
 * cambiar de rancho y de lote en una sola operacion; deja vacio si
 * el animal queda "sin lote". Llama al PATCH /animals/{id} que ya
 * acepta ranchId y lotId.
 */
export function MoveAnimalLotDialog({
  open,
  animalId,
  internalTag,
  currentRanchId,
  currentLotId,
  onClose,
  onMoved
}: MoveAnimalLotDialogProps) {
  const [ranchId, setRanchId] = useState<number | null>(currentRanchId);
  const [lotId, setLotId] = useState<number | null>(currentLotId ?? null);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (open) {
      setRanchId(currentRanchId);
      setLotId(currentLotId ?? null);
      setError(null);
    }
  }, [open, currentRanchId, currentLotId]);

  const move = useMutation({
    mutationFn: () => animalsApi.update(animalId, { ranchId: ranchId as number, lotId: lotId as number }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['animal', animalId] });
      qc.invalidateQueries({ queryKey: ['animals'] });
      if (onMoved) onMoved();
      onClose();
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'No pudimos mover el animal. Intenta de nuevo.';
      setError(msg);
    }
  });

  if (!open) return null;

  function handleRanchChange(id: number | null) {
    setRanchId(id);
    // Al cambiar de rancho, el lote anterior ya no es valido.
    setLotId(null);
  }

  function handleSubmit() {
    setError(null);
    if (!ranchId) {
      setError('Elige un rancho para el animal.');
      return;
    }
    if (!lotId) {
      setError('Elige el lote destino.');
      return;
    }
    if (ranchId === currentRanchId && lotId === (currentLotId ?? null)) {
      setError('El animal ya esta en ese lote.');
      return;
    }
    move.mutate();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Mover ${internalTag} de lote`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Move className="h-5 w-5 text-primary" aria-hidden />
            Mover {internalTag} de lote
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full hover:bg-accent"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <p className="text-sm text-muted-foreground">
          Elige a que rancho y a que lote pasa el animal.
        </p>

        <HelpfulField
          id="move-ranch"
          label="Rancho"
          help="Donde quedara el animal."
          icon={MapPin}
          required
        >
          <RanchPicker value={ranchId} onChange={handleRanchChange} />
        </HelpfulField>

        <HelpfulField
          id="move-lot"
          label="Lote destino"
          help="Donde quedara el animal dentro del rancho."
          icon={MapIcon}
          required
        >
          <LotPicker ranchId={ranchId} value={lotId} onChange={setLotId} />
        </HelpfulField>

        {error ? (
          <p role="alert" className="text-sm text-destructive font-medium">
            {error}
          </p>
        ) : null}

        <div className="flex justify-between gap-3 pt-2">
          <BigButton label="Cancelar" variant="outline" onClick={onClose} />
          <BigButton
            label="Guardar cambio"
            icon={Move}
            onClick={handleSubmit}
            disabled={move.isPending}
          />
        </div>
      </div>
    </div>
  );
}

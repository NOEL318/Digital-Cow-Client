/**
 * Esta pagina muestra la ficha imprimible de un animal optimizada para papel A4.
 */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft, Printer, Syringe, Pill, Stethoscope, Scale, Milk,
  Baby, Heart, type LucideIcon
} from 'lucide-react';
import { animalsApi } from '@/features/animals/api';
import { http } from '@/lib/http';
import { breedsApi } from '@/features/breeds/api';
import { ranchApi } from '@/features/ranches/api';
import { useAnimalLactation } from '@/features/agenda/api';
import { useAnimalVaccinations } from '@/features/health/vaccinations/api';
import { useAnimalDiagnoses } from '@/features/health/diagnoses/api';
import { useAnimalTreatments } from '@/features/health/treatments/api';
import { useAnimalWeighings } from '@/features/production/weighings/api';
import { useAnimalMilkings } from '@/features/production/milkings/api';
import { useAnimalCalvings } from '@/features/reproduction/calvings/api';
import { useAnimalServiceEvents } from '@/features/reproduction/services/api';
import { Button } from '@/components/ui/button';

interface Photo { id: number; url: string }

/**
 * Hoja imprimible del animal en formato PDF (via dialogo de impresion
 * del navegador). Layout vertical en A4 portrait, una sola columna
 * para evitar cortes. Cada seccion lleva page-break-inside-avoid
 * para que Hibernate, Hibernate digo el navegador, no parta una
 * seccion entre dos hojas. Auto-dispara el dialogo cuando termina
 * de cargar.
 */
export default function AnimalPrintablePage() {
  const { id } = useParams<{ id: string }>();
  const animalId = Number(id);

  const animal = useQuery({ queryKey: ['animal', animalId], queryFn: () => animalsApi.get(animalId) });
  const photos = useQuery({
    queryKey: ['animal-photos', animalId],
    queryFn: () => http.get<Photo[]>(`/animals/${animalId}/photos`).then(r => r.data)
  });
  const breeds = useQuery({ queryKey: ['breeds'], queryFn: breedsApi.list });
  const ranches = useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });

  const lactation = useAnimalLactation(animalId);
  const vaccinations = useAnimalVaccinations(animalId);
  const diagnoses = useAnimalDiagnoses(animalId);
  const treatments = useAnimalTreatments(animalId);
  const weighings = useAnimalWeighings(animalId);
  const milkings = useAnimalMilkings(animalId);
  const calvings = useAnimalCalvings(animalId);
  const services = useAnimalServiceEvents(animalId);

  const ready = !!animal.data && !animal.isLoading && !photos.isLoading;

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, [ready]);

  if (!animal.data) {
    return <div className="p-8 text-center">Preparando hoja del animal...</div>;
  }

  const a = animal.data;
  const breed = breeds.data?.find(b => b.id === a.breedId);
  const ranch = ranches.data?.find(r => r.id === a.ranchId);
  const coverPhotoUrl = photos.data?.find(p => p.id === a.coverPhotoId)?.url ?? photos.data?.[0]?.url ?? null;
  const detailUrl = `${window.location.origin}/animales/${a.id}`;

  const topVaccinations = (vaccinations.data ?? []).slice(0, 6);
  const topDiagnoses = (diagnoses.data ?? []).slice(0, 4);
  const topTreatments = (treatments.data ?? []).slice(0, 4);
  const topWeighings = (weighings.data ?? []).slice(0, 6);
  const topMilkings = (milkings.data ?? []).slice(0, 6);
  const topCalvings = (calvings.data ?? []).slice(0, 4);
  const topServices = (services.data ?? []).slice(0, 4);

  return (
    <div className="bg-white text-black">
      <PrintStyles />

      <div className="no-print sticky top-0 z-10 bg-background border-b px-4 py-2 flex items-center justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" /> Imprimir o guardar PDF
        </Button>
      </div>

      <article className="print-sheet mx-auto px-6 py-4 print:p-0">
        <header className="border-b-2 border-black pb-2 mb-3">
          <div className="flex items-start gap-3">
            {coverPhotoUrl ? (
              <img src={coverPhotoUrl} alt={a.internalTag} className="w-20 h-20 object-cover rounded border shrink-0" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 border rounded flex items-center justify-center text-2xl font-bold shrink-0">
                {a.internalTag.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold leading-tight break-words">
                {a.internalTag}{a.name ? ` · ${a.name}` : ''}
              </h1>
              <p className="text-xs">
                {a.sex === 'FEMALE' ? 'Hembra' : 'Macho'} · {labelStatus(a.status)} ·{' '}
                {a.purpose === 'BEEF' ? 'Carne' : a.purpose === 'DAIRY' ? 'Leche' : 'Doble propósito'}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                Hoja generada el {new Date().toLocaleDateString()} · Digital Cow
              </p>
            </div>
            <div className="text-center shrink-0">
              <QRCodeSVG value={detailUrl} size={60} />
              <p className="text-[7px] text-gray-600 mt-0.5">Escanea para ver online</p>
            </div>
          </div>
        </header>

        <section className="text-[11px] mb-3 grid grid-cols-2 gap-x-4 gap-y-0 avoid-break">
          <Row label="Marca interna" value={a.internalTag} />
          <Row label="Marca oficial" value={a.officialTag ?? '-'} />
          <Row label="RFID" value={a.rfid ?? '-'} />
          <Row label="Raza" value={breed?.nameEs ?? '-'} />
          <Row label="Nacimiento" value={a.birthDate ?? '-'} />
          <Row label="Rancho" value={ranch?.name ?? '-'} />
          {lactation.data?.lastCalving ? (
            <Row label="Último parto" value={lactation.data.lastCalving} />
          ) : null}
          {lactation.data?.daysInMilk != null && !lactation.data.dry ? (
            <Row label="Días en leche" value={String(lactation.data.daysInMilk)} />
          ) : null}
          {lactation.data?.dry ? <Row label="Estado lactacional" value="Seca" /> : null}
          {lactation.data?.recentAvgLiters != null ? (
            <Row label="Promedio reciente" value={`${lactation.data.recentAvgLiters} litros/día`} />
          ) : null}
        </section>

        {a.notes ? (
          <section className="text-[11px] mb-3 avoid-break">
            <p className="text-gray-600 font-semibold mb-0.5">Notas</p>
            <p className="border-l-2 border-gray-300 pl-2 break-words">{a.notes}</p>
          </section>
        ) : null}

        <Section title="Vacunaciones" icon={Syringe} empty={topVaccinations.length === 0}>
          {topVaccinations.map(v => (
            <li key={v.id} className="flex justify-between gap-2">
              <span>{v.appliedAt}</span>
              <span className="text-right truncate">Vacuna #{v.vaccineId}</span>
            </li>
          ))}
        </Section>

        <Section title="Pesajes" icon={Scale} empty={topWeighings.length === 0}>
          {topWeighings.map(w => (
            <li key={w.id} className="flex justify-between gap-2">
              <span>{w.weighedAt}</span>
              <span className="text-right font-semibold">{w.weightKg} kg</span>
            </li>
          ))}
        </Section>

        <Section title="Ordeños" icon={Milk} empty={topMilkings.length === 0}>
          {topMilkings.map(m => (
            <li key={m.id} className="flex justify-between gap-2">
              <span>{m.milkingDate} · {m.session}</span>
              <span className="text-right font-semibold">{m.liters} litros</span>
            </li>
          ))}
        </Section>

        <Section title="Diagnósticos" icon={Stethoscope} empty={topDiagnoses.length === 0}>
          {topDiagnoses.map(d => (
            <li key={d.id} className="flex justify-between gap-2">
              <span>{d.diagnosedAt}</span>
              <span className="text-right truncate">Enf. #{d.diseaseId}</span>
            </li>
          ))}
        </Section>

        <Section title="Tratamientos" icon={Pill} empty={topTreatments.length === 0}>
          {topTreatments.map(t => (
            <li key={t.id} className="flex justify-between gap-2">
              <span>{t.startedAt}</span>
              <span className="text-right truncate">Med. #{t.medicationId}</span>
            </li>
          ))}
        </Section>

        <Section title="Partos" icon={Baby} empty={topCalvings.length === 0}>
          {topCalvings.map(c => (
            <li key={c.id} className="flex justify-between gap-2">
              <span>{c.calvedAt}</span>
              <span className="text-right truncate">{c.outcome ?? ''}</span>
            </li>
          ))}
        </Section>

        <Section title="Servicios reproductivos" icon={Heart} empty={topServices.length === 0}>
          {topServices.map(s => (
            <li key={s.id} className="flex justify-between gap-2">
              <span>{s.serviceDate}</span>
              <span className="text-right truncate">{s.serviceType ?? ''}</span>
            </li>
          ))}
        </Section>

        <footer className="mt-3 border-t pt-1 text-[9px] text-gray-600 flex justify-between">
          <span>Digital Cow</span>
          <span>Animal #{a.id}</span>
        </footer>
      </article>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 border-b border-gray-200 py-0.5 min-w-0">
      <span className="text-gray-600 shrink-0 min-w-[80px]">{label}</span>
      <span className="font-medium flex-1 truncate" title={value}>{value}</span>
    </div>
  );
}

function Section({
  title, icon: Icon, children, empty
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  empty: boolean;
}) {
  return (
    <section className="mb-2 avoid-break">
      <h2 className="text-xs font-bold border-b border-black flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3" aria-hidden />
        {title}
      </h2>
      {empty ? (
        <p className="text-[10px] text-gray-500 italic">Sin registros.</p>
      ) : (
        <ul className="text-[10px] space-y-0.5">{children}</ul>
      )}
    </section>
  );
}

function labelStatus(s: string): string {
  switch (s) {
    case 'ACTIVE': return 'Activo';
    case 'SOLD': return 'Vendido';
    case 'DEAD': return 'Muerto';
    case 'MISSING': return 'Extraviado';
    case 'TRANSFERRED': return 'Transferido';
    default: return s;
  }
}

function PrintStyles() {
  // CSS imprimible: A4 portrait estricto, margenes pequenos, una
  // sola columna, secciones con break-inside avoid para que no se
  // partan entre paginas.
  return (
    <style>{`
      @media print {
        @page { size: A4 portrait; margin: 10mm; }
        body, html { background: white !important; margin: 0; padding: 0; }
        .no-print { display: none !important; }
        .print-sheet {
          max-width: 190mm;
          padding: 0;
          margin: 0;
          font-size: 10pt;
        }
        nav, .app-header, .app-footer { display: none !important; }
        .avoid-break { break-inside: avoid; page-break-inside: avoid; }
        h1, h2 { page-break-after: avoid; }
        img { max-width: 100% !important; height: auto !important; }
      }
      @media screen {
        .print-sheet {
          max-width: 720px;
          background: white;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          margin: 1rem auto;
        }
      }
    `}</style>
  );
}

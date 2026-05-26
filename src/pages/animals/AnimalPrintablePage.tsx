/**
 * Esta pagina muestra la ficha imprimible de un animal optimizada para papel A4.
 */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('animals');

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
    const timer = setTimeout(() => window.print(), 600);
    return () => clearTimeout(timer);
  }, [ready]);

  if (!animal.data) {
    return <div className="p-8 text-center">{t('detail.preparing')}</div>;
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
          <ArrowLeft className="h-4 w-4 mr-2" /> {t('print.back')}
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" /> {t('print.print')}
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
                {t(`sex.${a.sex}`)} · {t(`status.${a.status}`)} · {t(`purpose.${a.purpose}`)}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                {t('print.generatedOn', { date: new Date().toLocaleDateString() })}
              </p>
            </div>
            <div className="text-center shrink-0">
              <QRCodeSVG value={detailUrl} size={60} />
              <p className="text-[7px] text-gray-600 mt-0.5">{t('share.scanQr')}</p>
            </div>
          </div>
        </header>

        <section className="text-[11px] mb-3 grid grid-cols-2 gap-x-4 gap-y-0 avoid-break">
          <Row label={t('print.rows.internalTag')} value={a.internalTag} />
          <Row label={t('print.rows.officialTag')} value={a.officialTag ?? '-'} />
          <Row label={t('print.rows.rfid')} value={a.rfid ?? '-'} />
          <Row label={t('print.rows.breed')} value={breed?.nameEs ?? '-'} />
          <Row label={t('print.rows.birthDate')} value={a.birthDate ?? '-'} />
          <Row label={t('print.rows.ranch')} value={ranch?.name ?? '-'} />
          {lactation.data?.lastCalving ? (
            <Row label={t('print.rows.lastCalving')} value={lactation.data.lastCalving} />
          ) : null}
          {lactation.data?.daysInMilk != null && !lactation.data.dry ? (
            <Row label={t('print.rows.daysInMilk')} value={String(lactation.data.daysInMilk)} />
          ) : null}
          {lactation.data?.dry ? <Row label={t('print.rows.lacStatus')} value={t('print.rows.dry')} /> : null}
          {lactation.data?.recentAvgLiters != null ? (
            <Row label={t('print.rows.recentAvg')} value={t('print.rows.recentAvgValue', { liters: lactation.data.recentAvgLiters })} />
          ) : null}
        </section>

        {a.notes ? (
          <section className="text-[11px] mb-3 avoid-break">
            <p className="text-gray-600 font-semibold mb-0.5">{t('print.sections.notes')}</p>
            <p className="border-l-2 border-gray-300 pl-2 break-words">{a.notes}</p>
          </section>
        ) : null}

        <Section title={t('print.sections.vaccinations')} icon={Syringe} empty={topVaccinations.length === 0} noRecordsLabel={t('print.noRecords')}>
          {topVaccinations.map(v => (
            <li key={v.id} className="flex justify-between gap-2">
              <span>{v.appliedAt}</span>
              <span className="text-right truncate">#{v.vaccineId}</span>
            </li>
          ))}
        </Section>

        <Section title={t('print.sections.weighings')} icon={Scale} empty={topWeighings.length === 0} noRecordsLabel={t('print.noRecords')}>
          {topWeighings.map(w => (
            <li key={w.id} className="flex justify-between gap-2">
              <span>{w.weighedAt}</span>
              <span className="text-right font-semibold">{w.weightKg} kg</span>
            </li>
          ))}
        </Section>

        <Section title={t('print.sections.milkings')} icon={Milk} empty={topMilkings.length === 0} noRecordsLabel={t('print.noRecords')}>
          {topMilkings.map(m => (
            <li key={m.id} className="flex justify-between gap-2">
              <span>{m.milkingDate} · {m.session}</span>
              <span className="text-right font-semibold">{m.liters} L</span>
            </li>
          ))}
        </Section>

        <Section title={t('print.sections.diagnoses')} icon={Stethoscope} empty={topDiagnoses.length === 0} noRecordsLabel={t('print.noRecords')}>
          {topDiagnoses.map(d => (
            <li key={d.id} className="flex justify-between gap-2">
              <span>{d.diagnosedAt}</span>
              <span className="text-right truncate">#{d.diseaseId}</span>
            </li>
          ))}
        </Section>

        <Section title={t('print.sections.treatments')} icon={Pill} empty={topTreatments.length === 0} noRecordsLabel={t('print.noRecords')}>
          {topTreatments.map(tr => (
            <li key={tr.id} className="flex justify-between gap-2">
              <span>{tr.startedAt}</span>
              <span className="text-right truncate">#{tr.medicationId}</span>
            </li>
          ))}
        </Section>

        <Section title={t('print.sections.calvings')} icon={Baby} empty={topCalvings.length === 0} noRecordsLabel={t('print.noRecords')}>
          {topCalvings.map(c => (
            <li key={c.id} className="flex justify-between gap-2">
              <span>{c.calvedAt}</span>
              <span className="text-right truncate">{c.outcome ?? ''}</span>
            </li>
          ))}
        </Section>

        <Section title={t('print.sections.services')} icon={Heart} empty={topServices.length === 0} noRecordsLabel={t('print.noRecords')}>
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
  title, icon: Icon, children, empty, noRecordsLabel
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  empty: boolean;
  noRecordsLabel: string;
}) {
  return (
    <section className="mb-2 avoid-break">
      <h2 className="text-xs font-bold border-b border-black flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3" aria-hidden />
        {title}
      </h2>
      {empty ? (
        <p className="text-[10px] text-gray-500 italic">{noRecordsLabel}</p>
      ) : (
        <ul className="text-[10px] space-y-0.5">{children}</ul>
      )}
    </section>
  );
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

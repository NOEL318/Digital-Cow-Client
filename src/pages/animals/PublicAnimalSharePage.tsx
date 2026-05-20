/**
 * Pagina publica de solo lectura para compartir un animal por WhatsApp.
 * No requiere autenticacion; entrega solo estadisticas de manejo
 * (peso, vacunas, ordeño) y datos de identificacion. No expone
 * acciones, ranchos, lotes, notas ni informacion financiera.
 */
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Calendar, Milk, Scale, Syringe } from 'lucide-react';
import {
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { fetchPublicAnimalShare, type PublicAnimalShareResponse } from '@/features/animals/share/api';
import { AnimalAvatar } from '@/components/ui/animal-avatar';

export default function PublicAnimalSharePage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation(['common', 'animals']);

  const q = useQuery({
    queryKey: ['public', 'animal-share', token],
    queryFn: () => fetchPublicAnimalShare(token!),
    enabled: !!token,
    retry: 0
  });

  if (q.isLoading) {
    return <PageShell><p className="text-muted-foreground">{t('common:loading')}</p></PageShell>;
  }
  if (q.isError || !q.data) {
    return (
      <PageShell>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Enlace no valido o expirado</p>
          <p className="text-sm text-muted-foreground">
            Pidele al dueño del rancho que te genere un nuevo enlace.
          </p>
        </div>
      </PageShell>
    );
  }

  const a = q.data;
  return (
    <PageShell>
      <article className="space-y-6">
        <header className="space-y-4 text-center">
          {a.coverPhotoUrl ? (
            <img
              src={a.coverPhotoUrl}
              alt={a.name ? `${a.name} (${a.internalTag})` : a.internalTag}
              className="w-40 h-40 mx-auto rounded-full object-cover ring-4 ring-primary/30 shadow-md"
            />
          ) : (
            <div className="w-40 h-40 mx-auto flex items-center justify-center">
              <AnimalAvatar
                photoUrl={null}
                internalTag={a.internalTag}
                name={a.name}
                size={160}
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{a.internalTag}</h1>
            {a.name ? <p className="text-lg text-muted-foreground">{a.name}</p> : null}
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Chip label={a.sex === 'FEMALE' ? 'Hembra' : 'Macho'} />
            <Chip label={a.purpose === 'DAIRY' ? 'Leche' : a.purpose === 'BEEF' ? 'Carne' : 'Doble propósito'} />
            {a.breedName ? <Chip label={a.breedName} /> : null}
            <Chip label={statusLabel(a.status)} />
          </div>
        </header>

        <IdentitySection animal={a} />
        <WeighingsSection animal={a} />
        <VaccinationsSection animal={a} />
        <MilkingsSection animal={a} />

        <footer className="text-center text-xs text-muted-foreground pt-8 border-t">
          Información compartida desde Digital Cow. Solo lectura.
        </footer>
      </article>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-foreground/80 font-medium">
      {label}
    </span>
  );
}

function statusLabel(s: string): string {
  switch (s) {
    case 'ACTIVE': return 'Activo';
    case 'SOLD': return 'Vendido';
    case 'DEAD': return 'Fallecido';
    case 'MISSING': return 'Perdido';
    case 'TRANSFERRED': return 'Transferido';
    default: return s;
  }
}

function IdentitySection({ animal: a }: { animal: PublicAnimalShareResponse }) {
  return (
    <section className="rounded-xl border bg-card p-4 space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Activity className="h-5 w-5 text-primary" aria-hidden /> Identificación
      </h2>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <Field label="Nacimiento" value={a.birthDate ? `${a.birthDate}${a.birthDateEstimated ? ' (estimada)' : ''}` : '—'} />
        <Field label="Edad" value={a.ageMonths != null ? `${a.ageMonths} meses` : '—'} />
        {a.lastCalving ? <Field label="Último parto" value={a.lastCalving} /> : null}
        {a.daysInMilk != null ? <Field label="Días en leche" value={`${a.daysInMilk}`} /> : null}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </>
  );
}

function WeighingsSection({ animal: a }: { animal: PublicAnimalShareResponse }) {
  if (a.weighings.length === 0) return null;
  const last = a.weighings[a.weighings.length - 1];
  const chartData = a.weighings.map(w => ({ date: w.weighedAt, kg: Number(w.weightKg) }));
  return (
    <section className="rounded-xl border bg-card p-4 space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Scale className="h-5 w-5 text-primary" aria-hidden /> Pesajes
      </h2>
      <p className="text-sm">
        Último peso: <strong>{last.weightKg} kilogramos</strong> · {last.weighedAt}
      </p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="kg" stroke="hsl(var(--primary))" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function VaccinationsSection({ animal: a }: { animal: PublicAnimalShareResponse }) {
  if (a.vaccinations.length === 0) return null;
  return (
    <section className="rounded-xl border bg-card p-4 space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Syringe className="h-5 w-5 text-primary" aria-hidden /> Vacunas aplicadas
      </h2>
      <ul className="divide-y">
        {a.vaccinations.slice().reverse().map((v, i) => (
          <li key={i} className="py-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" aria-hidden /> {v.appliedAt}
            </span>
            <span className="font-medium text-right">{v.vaccineName ?? 'Vacuna'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MilkingsSection({ animal: a }: { animal: PublicAnimalShareResponse }) {
  if (a.milkings.length === 0) return null;
  const totalLiters = a.milkings.reduce((acc, m) => acc + Number(m.liters), 0);
  const avg = totalLiters / a.milkings.length;
  const chartData = a.milkings.map(m => ({ date: m.milkingDate, litros: Number(m.liters) }));
  return (
    <section className="rounded-xl border bg-card p-4 space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Milk className="h-5 w-5 text-primary" aria-hidden /> Producción de leche
      </h2>
      <p className="text-sm text-muted-foreground">
        Promedio reciente: <strong>{avg.toFixed(1)} litros/día</strong> en {a.milkings.length} registros
      </p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="litros" stroke="hsl(var(--primary))" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

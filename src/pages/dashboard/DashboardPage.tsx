import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { dashboardApi } from '@/features/dashboard/api';
import { useDashboardHealth } from '@/features/health/dashboard/api';
import { useDashboardReproduction } from '@/features/reproduction/dashboard/api';
import { useDashboardProduction } from '@/features/production/dashboard/api';
import { useDashboardFinance } from '@/features/finance/dashboard/api';
import i18n from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const COLORS = ['#0f766e', '#0369a1', '#a16207', '#7e22ce', '#be185d', '#374151'];

/** Tablero principal. */
export default function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'health', 'alerts', 'reproduction', 'production', 'finance']);
  const locale = i18n.language;
  const q = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.summary });
  const dashboardHealth = useDashboardHealth();
  const dashboardReproduction = useDashboardReproduction();
  const dashboardProduction = useDashboardProduction();
  const dashboardFinance = useDashboardFinance();

  if (q.isLoading) return <div className="grid md:grid-cols-3 gap-3">{[...Array(6)].map((_, i) => <Card key={i} className="h-24 animate-pulse" />)}</div>;
  if (!q.data || q.data.totals.totalAnimals === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-semibold">{t('empty.title')}</h2>
        <Button asChild><Link to="/animals/new">{t('empty.cta')}</Link></Button>
      </div>
    );
  }
  const d = q.data;

  const sexData = Object.entries(d.bySex).map(([k, v]) => ({ name: k, value: v }));
  const purposeData = Object.entries(d.byPurpose).map(([k, v]) => ({ name: k, value: v }));
  const breedData = d.byBreed.map(b => ({ name: b.breedCode, value: b.count })).filter(x => x.value > 0);
  const ranchData = d.byRanch.map(r => ({ name: r.ranchName, value: r.count }));
  const lineData = d.recentAdditions.labels.map((l, i) => ({ date: l, count: d.recentAdditions.counts[i] }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('totals.total')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{d.totals.totalAnimals}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('totals.active')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{d.totals.activeAnimals}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('totals.sold')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{d.totals.soldThisYear}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('totals.dead')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{d.totals.deadThisYear}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('totals.ranches')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{d.totals.ranches}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('totals.lots')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{d.totals.lots}</CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle>{t('charts.byBreed')}</CardTitle></CardHeader><CardContent style={{ height: 260 }}>
          <ResponsiveContainer><PieChart><Tooltip />
            <Pie data={breedData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={90}>
              {breedData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart></ResponsiveContainer>
        </CardContent></Card>

        <Card><CardHeader><CardTitle>{t('charts.byPurpose')}</CardTitle></CardHeader><CardContent style={{ height: 260 }}>
          <ResponsiveContainer><PieChart><Tooltip />
            <Pie data={purposeData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={90}>
              {purposeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart></ResponsiveContainer>
        </CardContent></Card>

        <Card><CardHeader><CardTitle>{t('charts.byRanch')}</CardTitle></CardHeader><CardContent style={{ height: 260 }}>
          <ResponsiveContainer><BarChart data={ranchData} layout="vertical">
            <XAxis type="number" /><YAxis dataKey="name" type="category" width={100} /><Tooltip />
            <Bar dataKey="value" fill="#0f766e" />
          </BarChart></ResponsiveContainer>
        </CardContent></Card>

        <Card><CardHeader><CardTitle>{t('charts.recent')}</CardTitle></CardHeader><CardContent style={{ height: 260 }}>
          <ResponsiveContainer><LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip />
            <Line type="monotone" dataKey="count" stroke="#0369a1" />
          </LineChart></ResponsiveContainer>
        </CardContent></Card>

        <Card className="md:col-span-2"><CardHeader><CardTitle>By sex</CardTitle></CardHeader><CardContent>
          {sexData.map(s => <div key={s.name}>{s.name}: {s.value}</div>)}
        </CardContent></Card>
      </div>

      <h2 className="text-xl font-semibold mt-8">{t('health:nav.section')}</h2>
      {dashboardHealth.data && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('alerts:upcoming7d')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardHealth.data.upcomingVaccinations7d}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('alerts:upcoming30d')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardHealth.data.upcomingVaccinations30d}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('health:diagnosis.title')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardHealth.data.activeDiagnoses}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('health:treatment.title')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardHealth.data.treatmentsActiveCount}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('dashboard:vetSpendMonth')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardHealth.data.monthVetSpend}</CardContent></Card>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8">{t('reproduction:dashboard.section')}</h2>
      {dashboardReproduction.data && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('reproduction:dashboard.pregnantConfirmed')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardReproduction.data.pregnantConfirmed}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('reproduction:dashboard.upcomingCalvings21d')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardReproduction.data.upcomingCalvings21d}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('reproduction:dashboard.openCows')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardReproduction.data.openCows}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('reproduction:dashboard.avgDaysOpen')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardReproduction.data.avgDaysOpen != null ? dashboardReproduction.data.avgDaysOpen.toFixed(1) : '-'}</CardContent></Card>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8">{t('production:dashboard.section')}</h2>
      {dashboardProduction.data && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('production:dashboard.todayMilk')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{Number(dashboardProduction.data.todayMilkLiters).toFixed(2)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('production:dashboard.mtdMilk')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{Number(dashboardProduction.data.mtdMilkLiters).toFixed(2)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('production:dashboard.avgAdgMonth')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardProduction.data.avgAdgKgDayThisMonth != null ? Number(dashboardProduction.data.avgAdgKgDayThisMonth).toFixed(2) : '-'}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('production:dashboard.activeMilkingCows')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{dashboardProduction.data.activeMilkingCows}</CardContent></Card>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8">{t('finance:dashboard.section')}</h2>
      {dashboardFinance.data && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('finance:dashboard.mtdIncome')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{Number(dashboardFinance.data.mtdIncome).toFixed(2)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('finance:dashboard.mtdExpense')}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{Number(dashboardFinance.data.mtdExpense).toFixed(2)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('finance:dashboard.mtdMargin')}</CardTitle></CardHeader><CardContent className={`text-2xl font-bold ${Number(dashboardFinance.data.mtdMargin) >= 0 ? 'text-green-700' : 'text-red-700'}`}>{Number(dashboardFinance.data.mtdMargin).toFixed(2)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('finance:dashboard.ytdMargin')}</CardTitle></CardHeader><CardContent className={`text-2xl font-bold ${Number(dashboardFinance.data.ytdMargin) >= 0 ? 'text-green-700' : 'text-red-700'}`}>{Number(dashboardFinance.data.ytdMargin).toFixed(2)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">{t('finance:dashboard.topExpenseCategory')}</CardTitle></CardHeader><CardContent className="text-base font-semibold">
            {dashboardFinance.data.topExpenseCategoriesMonth.length > 0
              ? (() => {
                  const top = dashboardFinance.data.topExpenseCategoriesMonth[0];
                  return `${locale.startsWith('en') ? top.nameEn : top.nameEs} (${Number(top.total).toFixed(2)})`;
                })()
              : '-'}
          </CardContent></Card>
        </div>
      )}
    </div>
  );
}

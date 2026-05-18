import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PnlReportPage from './PnlReportPage';
import InventoryReportPage from './InventoryReportPage';
import SalesHistoryPage from './SalesHistoryPage';
import HealthSummaryPage from './HealthSummaryPage';

/**
 * Placeholder de la tab "animal". El reporte por animal requiere un id en URL,
 * por lo que desde este panel solo se muestra un mensaje guiando al usuario.
 * Para abrir el reporte de un animal concreto se usa /reports/animal/:id.
 */
function AnimalReportPlaceholder() {
  return (
    <div className="rounded border p-6 text-sm text-muted-foreground">
      Selecciona un animal desde la lista de Animales y abre su reporte para verlo aqui.
    </div>
  );
}

/**
 * Panel unificado de Reportes. Tabs internos en lugar de N rutas separadas.
 * La tab activa se sincroniza con ?tab= en la URL para deep-link y back/forward.
 * La tab "animal" muestra un placeholder porque el reporte por animal requiere
 * un id en URL (se accede via /reports/animal/:id).
 */
export default function ReportsPanelPage() {
  const { t } = useTranslation(['reports']);
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'pnl';
  const setTab = (v: string) => setParams((p) => { p.set('tab', v); return p; }, { replace: true });

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('reports:nav.section')}</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="pnl">{t('reports:nav.pnl')}</TabsTrigger>
          <TabsTrigger value="inventory">{t('reports:nav.inventory')}</TabsTrigger>
          <TabsTrigger value="animal">{t('reports:nav.animal')}</TabsTrigger>
          <TabsTrigger value="sales-history">{t('reports:nav.salesHistory')}</TabsTrigger>
          <TabsTrigger value="health-summary">{t('reports:nav.healthSummary')}</TabsTrigger>
        </TabsList>
        <TabsContent value="pnl"><PnlReportPage /></TabsContent>
        <TabsContent value="inventory"><InventoryReportPage /></TabsContent>
        <TabsContent value="animal"><AnimalReportPlaceholder /></TabsContent>
        <TabsContent value="sales-history"><SalesHistoryPage /></TabsContent>
        <TabsContent value="health-summary"><HealthSummaryPage /></TabsContent>
      </Tabs>
    </div>
  );
}

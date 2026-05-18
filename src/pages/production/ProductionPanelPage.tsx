import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import WeighingsPage from './WeighingsPage';
import MilkingsPage from './MilkingsPage';
import MilkSamplesPage from './MilkSamplesPage';
import BulkTankPage from './BulkTankPage';
import SlaughterPage from './SlaughterPage';
import GrowthCurvePage from './GrowthCurvePage';
import LactationCurvePage from './LactationCurvePage';
import ProductionKpisPage from './ProductionKpisPage';

/**
 * Panel unificado de Produccion. Tabs internos en lugar de N rutas separadas.
 * La tab activa se sincroniza con ?tab= en la URL para deep-link y back/forward.
 */
export default function ProductionPanelPage() {
  const { t } = useTranslation(['production']);
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'weighings';
  const setTab = (v: string) => setParams((p) => { p.set('tab', v); return p; }, { replace: true });

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('production:nav.section')}</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="weighings">{t('production:nav.weighings')}</TabsTrigger>
          <TabsTrigger value="milkings">{t('production:nav.milkings')}</TabsTrigger>
          <TabsTrigger value="milk-samples">{t('production:nav.milkSamples')}</TabsTrigger>
          <TabsTrigger value="bulk-tank">{t('production:nav.bulkTank')}</TabsTrigger>
          <TabsTrigger value="slaughter">{t('production:nav.slaughter')}</TabsTrigger>
          <TabsTrigger value="growth-curve">{t('production:nav.growthCurve')}</TabsTrigger>
          <TabsTrigger value="lactation-curve">{t('production:nav.lactationCurve')}</TabsTrigger>
          <TabsTrigger value="kpis">{t('production:nav.kpis')}</TabsTrigger>
        </TabsList>
        <TabsContent value="weighings"><WeighingsPage /></TabsContent>
        <TabsContent value="milkings"><MilkingsPage /></TabsContent>
        <TabsContent value="milk-samples"><MilkSamplesPage /></TabsContent>
        <TabsContent value="bulk-tank"><BulkTankPage /></TabsContent>
        <TabsContent value="slaughter"><SlaughterPage /></TabsContent>
        <TabsContent value="growth-curve"><GrowthCurvePage /></TabsContent>
        <TabsContent value="lactation-curve"><LactationCurvePage /></TabsContent>
        <TabsContent value="kpis"><ProductionKpisPage /></TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Esta pagina agrupa las pestanas del panel reproductivo del rancho.
 */
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReproductionOverviewPage from './ReproductionOverviewPage';
import BullsPage from './BullsPage';
import SemenPage from './SemenPage';
import HeatsPage from './HeatsPage';
import ServicesPage from './ServicesPage';
import PregnancyChecksPage from './PregnancyChecksPage';
import CalvingsPage from './CalvingsPage';
import AbortionsPage from './AbortionsPage';
import WeaningsPage from './WeaningsPage';
import DryOffsPage from './DryOffsPage';
import ReproductionKpisPage from './ReproductionKpisPage';

/**
 * Panel unificado de Reproduccion. Tabs internos en lugar de N rutas separadas.
 * La tab activa se sincroniza con ?tab= en la URL para deep-link y back/forward.
 */
export default function ReproductionPanelPage() {
  const { t } = useTranslation(['reproduction']);
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'overview';
  const setTab = (v: string) => setParams((p) => { p.set('tab', v); return p; }, { replace: true });

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('reproduction:nav.section')}</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview">{t('reproduction:nav.overview')}</TabsTrigger>
          <TabsTrigger value="bulls">{t('reproduction:nav.bulls')}</TabsTrigger>
          <TabsTrigger value="semen">{t('reproduction:nav.semen')}</TabsTrigger>
          <TabsTrigger value="heats">{t('reproduction:nav.heats')}</TabsTrigger>
          <TabsTrigger value="services">{t('reproduction:nav.services')}</TabsTrigger>
          <TabsTrigger value="pregnancy-checks">{t('reproduction:nav.pregnancyChecks')}</TabsTrigger>
          <TabsTrigger value="calvings">{t('reproduction:nav.calvings')}</TabsTrigger>
          <TabsTrigger value="abortions">{t('reproduction:nav.abortions')}</TabsTrigger>
          <TabsTrigger value="weanings">{t('reproduction:nav.weanings')}</TabsTrigger>
          <TabsTrigger value="dry-offs">{t('reproduction:nav.dryOffs')}</TabsTrigger>
          <TabsTrigger value="kpis">{t('reproduction:nav.kpis')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><ReproductionOverviewPage /></TabsContent>
        <TabsContent value="bulls"><BullsPage /></TabsContent>
        <TabsContent value="semen"><SemenPage /></TabsContent>
        <TabsContent value="heats"><HeatsPage /></TabsContent>
        <TabsContent value="services"><ServicesPage /></TabsContent>
        <TabsContent value="pregnancy-checks"><PregnancyChecksPage /></TabsContent>
        <TabsContent value="calvings"><CalvingsPage /></TabsContent>
        <TabsContent value="abortions"><AbortionsPage /></TabsContent>
        <TabsContent value="weanings"><WeaningsPage /></TabsContent>
        <TabsContent value="dry-offs"><DryOffsPage /></TabsContent>
        <TabsContent value="kpis"><ReproductionKpisPage /></TabsContent>
      </Tabs>
    </div>
  );
}

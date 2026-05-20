/**
 * Este archivo declara el router principal de la aplicacion.
 * Mapea cada ruta publica y protegida hacia su pagina y mantiene redirects de rutas legadas.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import AcceptInvitationPage from '@/pages/auth/AcceptInvitationPage';
import AppLayout from '@/pages/AppLayout';
import ProfileSettingsPage from '@/pages/settings/ProfileSettingsPage';
import AccountSettingsPage from '@/pages/settings/AccountSettingsPage';
import RanchesPage from '@/pages/ranches/RanchesPage';
import RanchDetailPage from '@/pages/ranches/RanchDetailPage';
import TeamPage from '@/pages/team/TeamPage';
import AnimalsListPage from '@/pages/animals/AnimalsListPage';
import AnimalDetailPage from '@/pages/animals/AnimalDetailPage';
import AnimalEditPage from '@/pages/animals/AnimalEditPage';
import AnimalPrintablePage from '@/pages/animals/AnimalPrintablePage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminAccountsPage from '@/pages/admin/AdminAccountsPage';
import PublicAnimalSharePage from '@/pages/animals/PublicAnimalSharePage';
import HealthPanelPage from '@/pages/health/HealthPanelPage';
import HealthPlanDetailPage from '@/pages/health/HealthPlanDetailPage';
import VaccinationsPage from '@/pages/health/VaccinationsPage';
import DiagnosesPage from '@/pages/health/DiagnosesPage';
import TreatmentsPage from '@/pages/health/TreatmentsPage';
import PestControlsPage from '@/pages/health/PestControlsPage';
import VetVisitsPage from '@/pages/health/VetVisitsPage';
import HealthPlansPage from '@/pages/health/HealthPlansPage';
import ReproductionPanelPage from '@/pages/reproduction/ReproductionPanelPage';
import ProductionPanelPage from '@/pages/production/ProductionPanelPage';
import FeedingPanelPage from '@/pages/feeding/FeedingPanelPage';
import FeedingPlanDetailPage from '@/pages/feeding/FeedingPlanDetailPage';
import FeedItemsPage from '@/pages/feeding/FeedItemsPage';
import FeedingPlansPage from '@/pages/feeding/FeedingPlansPage';
import FeedingRecordsPage from '@/pages/feeding/FeedingRecordsPage';
import FeedingCostSummaryPage from '@/pages/feeding/FeedingCostSummaryPage';
import FinancePanelPage from '@/pages/finance/FinancePanelPage';
import ExpensesPage from '@/pages/finance/ExpensesPage';
import IncomesPage from '@/pages/finance/IncomesPage';
import AnimalSalesPage from '@/pages/finance/AnimalSalesPage';
import MilkSalesPage from '@/pages/finance/MilkSalesPage';
import CategoriesPage from '@/pages/finance/CategoriesPage';
import ReportsPanelPage from '@/pages/reports/ReportsPanelPage';
import AnimalReportPage from '@/pages/reports/AnimalReportPage';
import InicioPage from '@/pages/inicio/InicioPage';
import PanelIndexPage from '@/pages/panel/PanelIndexPage';
import { VacunarFlow } from '@/features/wizard/VacunarFlow';
import { PesarFlow } from '@/features/wizard/PesarFlow';
import { OrdenarFlow } from '@/features/wizard/OrdenarFlow';
import { AlimentarAnimalFlow } from '@/features/wizard/AlimentarAnimalFlow';
import { GastarFlow } from '@/features/wizard/GastarFlow';
import { RecibirDineroFlow } from '@/features/wizard/RecibirDineroFlow';
import { ComprarAnimalFlow } from '@/features/wizard/ComprarAnimalFlow';
import { DiagnostiqueFlow } from '@/features/wizard/DiagnostiqueFlow';
import { TratarFlow } from '@/features/wizard/TratarFlow';
import { CeloFlow } from '@/features/wizard/CeloFlow';
import { ServirFlow } from '@/features/wizard/ServirFlow';
import { PrenezFlow } from '@/features/wizard/PrenezFlow';
import { PartoFlow } from '@/features/wizard/PartoFlow';
import { SecarFlow } from '@/features/wizard/SecarFlow';
import { DestetarFlow } from '@/features/wizard/DestetarFlow';
import { AbortoFlow } from '@/features/wizard/AbortoFlow';
import AjustesIndexPage from '@/pages/ajustes/AjustesIndexPage';
import AjustesIdiomaTemaPage from '@/pages/ajustes/AjustesIdiomaTemaPage';
import AjustesMedicamentosPage from '@/pages/ajustes/AjustesMedicamentosPage';
import { ProtectedRoute } from '@/components/protected-route';
import { AnimalIdRedirect } from './AnimalIdRedirect';

/**
 * Router top-level. Fase 6: shell de cinco destinos
 * (Inicio, Animales, Hacer una nota, Panel, Ajustes) mas
 * compatibilidad con rutas viejas via redirects.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/accept-invitation" element={<AcceptInvitationPage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/accounts" element={<AdminAccountsPage />} />

        <Route path="/compartir/animal/:token" element={<PublicAnimalSharePage />} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/inicio" element={<InicioPage />} />

          <Route path="/animales" element={<AnimalsListPage />} />
          <Route path="/animales/nuevo" element={<ComprarAnimalFlow />} />
          <Route path="/animales/nuevo-formulario" element={<AnimalEditPage />} />
          <Route path="/animales/:id" element={<AnimalDetailPage />} />
          <Route path="/animales/:id/editar" element={<AnimalEditPage />} />
          <Route path="/animales/:id/imprimir" element={<AnimalPrintablePage />} />

          <Route path="/hacer-nota" element={<Navigate to="/inicio" replace />} />
          <Route path="/hacer-nota/vacune" element={<VacunarFlow />} />
          <Route path="/hacer-nota/pese" element={<PesarFlow />} />
          <Route path="/hacer-nota/ordene" element={<OrdenarFlow />} />
          <Route path="/hacer-nota/alimentar" element={<AlimentarAnimalFlow />} />
          <Route path="/hacer-nota/gaste" element={<GastarFlow />} />
          <Route path="/hacer-nota/recibi" element={<RecibirDineroFlow />} />
          <Route path="/hacer-nota/diagnostique" element={<DiagnostiqueFlow />} />
          <Route path="/hacer-nota/trate" element={<TratarFlow />} />
          <Route path="/hacer-nota/celo" element={<CeloFlow />} />
          <Route path="/hacer-nota/servi" element={<ServirFlow />} />
          <Route path="/hacer-nota/preñez" element={<PrenezFlow />} />
          <Route path="/hacer-nota/parto" element={<PartoFlow />} />
          <Route path="/hacer-nota/seque" element={<SecarFlow />} />
          <Route path="/hacer-nota/destete" element={<DestetarFlow />} />
          <Route path="/hacer-nota/aborto" element={<AbortoFlow />} />

          <Route path="/panel" element={<PanelIndexPage />} />
          <Route path="/panel/salud" element={<HealthPanelPage />} />
          <Route path="/panel/salud/vacunaciones" element={<VaccinationsPage />} />
          <Route path="/panel/salud/diagnosticos" element={<DiagnosesPage />} />
          <Route path="/panel/salud/tratamientos" element={<TreatmentsPage />} />
          <Route path="/panel/salud/plagas" element={<PestControlsPage />} />
          <Route path="/panel/salud/visitas-vet" element={<VetVisitsPage />} />
          <Route path="/panel/salud/planes" element={<HealthPlansPage />} />
          <Route path="/panel/salud/planes/:id" element={<HealthPlanDetailPage />} />
          <Route path="/panel/alimentacion" element={<FeedingPanelPage />} />
          <Route path="/panel/alimentacion/items" element={<FeedItemsPage />} />
          <Route path="/panel/alimentacion/planes" element={<FeedingPlansPage />} />
          <Route path="/panel/alimentacion/registros" element={<FeedingRecordsPage />} />
          <Route path="/panel/alimentacion/costo" element={<FeedingCostSummaryPage />} />
          <Route path="/panel/alimentacion/planes/:id" element={<FeedingPlanDetailPage />} />
          <Route path="/panel/dinero" element={<FinancePanelPage />} />
          <Route path="/panel/dinero/gastos" element={<ExpensesPage />} />
          <Route path="/panel/dinero/ingresos" element={<IncomesPage />} />
          <Route path="/panel/dinero/ventas-animales" element={<AnimalSalesPage />} />
          <Route path="/panel/dinero/ventas-leche" element={<MilkSalesPage />} />
          <Route path="/panel/dinero/categorias" element={<CategoriesPage />} />
          <Route path="/panel/reproduccion" element={<ReproductionPanelPage />} />
          <Route path="/panel/produccion" element={<ProductionPanelPage />} />
          <Route path="/panel/reportes" element={<ReportsPanelPage />} />
          <Route path="/panel/reportes/animal/:id" element={<AnimalReportPage />} />

          <Route path="/ajustes" element={<AjustesIndexPage />} />
          <Route path="/ajustes/perfil" element={<ProfileSettingsPage />} />
          <Route path="/ajustes/cuenta" element={<AccountSettingsPage />} />
          <Route path="/ajustes/ranchos" element={<RanchesPage />} />
          <Route path="/ajustes/ranchos/:id" element={<RanchDetailPage />} />
          <Route path="/ajustes/equipo" element={<TeamPage />} />
          <Route path="/ajustes/medicamentos" element={<AjustesMedicamentosPage />} />
          <Route path="/ajustes/idioma-tema" element={<AjustesIdiomaTemaPage />} />

          <Route path="/dashboard" element={<Navigate to="/inicio" replace />} />
          <Route path="/animals" element={<Navigate to="/animales" replace />} />
          <Route path="/animals/new" element={<Navigate to="/animales/nuevo" replace />} />
          <Route path="/animals/:id" element={<AnimalIdRedirect to="/animales/:id" />} />
          <Route path="/animals/:id/edit" element={<AnimalIdRedirect to="/animales/:id/editar" />} />
          <Route path="/ranches" element={<Navigate to="/ajustes/ranchos" replace />} />
          <Route path="/ranches/:id" element={<RanchDetailPage />} />
          <Route path="/team" element={<Navigate to="/ajustes/equipo" replace />} />
          <Route path="/settings/profile" element={<Navigate to="/ajustes/perfil" replace />} />
          <Route path="/settings/account" element={<Navigate to="/ajustes/cuenta" replace />} />

          <Route path="/health" element={<Navigate to="/panel/salud" replace />} />
          <Route path="/health/vaccinations" element={<Navigate to="/panel/salud?tab=vaccinations" replace />} />
          <Route path="/health/diagnoses" element={<Navigate to="/panel/salud?tab=diagnoses" replace />} />
          <Route path="/health/treatments" element={<Navigate to="/panel/salud?tab=treatments" replace />} />
          <Route path="/health/pest-controls" element={<Navigate to="/panel/salud?tab=pest-controls" replace />} />
          <Route path="/health/vet-visits" element={<Navigate to="/panel/salud?tab=vet-visits" replace />} />
          <Route path="/health/plans" element={<Navigate to="/panel/salud?tab=plans" replace />} />
          <Route path="/health/plans/:id" element={<HealthPlanDetailPage />} />

          <Route path="/reproduction" element={<Navigate to="/panel/reproduccion" replace />} />
          <Route path="/reproduction/bulls" element={<Navigate to="/panel/reproduccion?tab=bulls" replace />} />
          <Route path="/reproduction/semen" element={<Navigate to="/panel/reproduccion?tab=semen" replace />} />
          <Route path="/reproduction/heats" element={<Navigate to="/panel/reproduccion?tab=heats" replace />} />
          <Route path="/reproduction/services" element={<Navigate to="/panel/reproduccion?tab=services" replace />} />
          <Route path="/reproduction/pregnancy-checks" element={<Navigate to="/panel/reproduccion?tab=pregnancy-checks" replace />} />
          <Route path="/reproduction/calvings" element={<Navigate to="/panel/reproduccion?tab=calvings" replace />} />
          <Route path="/reproduction/abortions" element={<Navigate to="/panel/reproduccion?tab=abortions" replace />} />
          <Route path="/reproduction/weanings" element={<Navigate to="/panel/reproduccion?tab=weanings" replace />} />
          <Route path="/reproduction/dry-offs" element={<Navigate to="/panel/reproduccion?tab=dry-offs" replace />} />
          <Route path="/reproduction/kpis" element={<Navigate to="/panel/reproduccion?tab=kpis" replace />} />

          <Route path="/production" element={<Navigate to="/panel/produccion" replace />} />
          <Route path="/production/weighings" element={<Navigate to="/panel/produccion?tab=weighings" replace />} />
          <Route path="/production/milkings" element={<Navigate to="/panel/produccion?tab=milkings" replace />} />
          <Route path="/production/milk-samples" element={<Navigate to="/panel/produccion?tab=milk-samples" replace />} />
          <Route path="/production/bulk-tank" element={<Navigate to="/panel/produccion?tab=bulk-tank" replace />} />
          <Route path="/production/slaughter" element={<Navigate to="/panel/produccion?tab=slaughter" replace />} />
          <Route path="/production/growth-curve" element={<Navigate to="/panel/produccion?tab=growth-curve" replace />} />
          <Route path="/production/lactation-curve" element={<Navigate to="/panel/produccion?tab=lactation-curve" replace />} />
          <Route path="/production/kpis" element={<Navigate to="/panel/produccion?tab=kpis" replace />} />

          <Route path="/feeding" element={<Navigate to="/panel/alimentacion" replace />} />
          <Route path="/feeding/items" element={<Navigate to="/panel/alimentacion?tab=items" replace />} />
          <Route path="/feeding/plans" element={<Navigate to="/panel/alimentacion?tab=plans" replace />} />
          <Route path="/feeding/plans/:id" element={<FeedingPlanDetailPage />} />
          <Route path="/feeding/records" element={<Navigate to="/panel/alimentacion?tab=records" replace />} />
          <Route path="/feeding/cost-summary" element={<Navigate to="/panel/alimentacion?tab=cost-summary" replace />} />

          <Route path="/finance" element={<Navigate to="/panel/dinero" replace />} />
          <Route path="/finances" element={<Navigate to="/panel/dinero" replace />} />
          <Route path="/finances/expenses" element={<Navigate to="/panel/dinero?tab=expenses" replace />} />
          <Route path="/finances/incomes" element={<Navigate to="/panel/dinero?tab=incomes" replace />} />
          <Route path="/finances/animal-sales" element={<Navigate to="/panel/dinero?tab=animal-sales" replace />} />
          <Route path="/finances/milk-sales" element={<Navigate to="/panel/dinero?tab=milk-sales" replace />} />
          <Route path="/finances/categories" element={<Navigate to="/panel/dinero?tab=categories" replace />} />

          <Route path="/reports" element={<Navigate to="/panel/reportes" replace />} />
          <Route path="/reports/pnl" element={<Navigate to="/panel/reportes?tab=pnl" replace />} />
          <Route path="/reports/inventory" element={<Navigate to="/panel/reportes?tab=inventory" replace />} />
          <Route path="/reports/animal/:id" element={<AnimalReportPage />} />
          <Route path="/reports/sales-history" element={<Navigate to="/panel/reportes?tab=sales-history" replace />} />
          <Route path="/reports/health-summary" element={<Navigate to="/panel/reportes?tab=health-summary" replace />} />
        </Route>

        <Route path="*" element={<div className="p-8">404</div>} />
      </Routes>
    </BrowserRouter>
  );
}

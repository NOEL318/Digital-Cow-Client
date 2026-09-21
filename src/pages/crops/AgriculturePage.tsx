/**
 * Página de Agricultura: Siembras, Cosechas, Cultivos y Rendimientos.
 * Diseño rápido, visual con glassmorphism, chips de estado y sin texto de relleno.
 */
import { useState } from 'react';
import {
  Sprout, Wheat, Calendar, TrendingUp, Plus, DollarSign,
  Layers, CheckCircle2, Clock, Sparkles, Scale, BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  useCrops, usePlantings, useHarvests, useAgronomyKpis,
  agricultureApi, type CreatePlantingPayload, type CreateHarvestPayload
} from '@/features/crops/api';
import { useLands } from '@/features/lands/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/ui/empty-state';
import { useQueryClient } from '@tanstack/react-query';

export default function AgriculturePage() {
  const [activeTab, setActiveTab] = useState<'plantings' | 'harvests' | 'crops'>('plantings');
  const [plantingModalOpen, setPlantingModalOpen] = useState(false);
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [selectedPlantingId, setSelectedPlantingId] = useState<number | undefined>();

  const queryClient = useQueryClient();
  const { data: kpis } = useAgronomyKpis();
  const { data: plantings = [] } = usePlantings();
  const { data: harvests = [] } = useHarvests();
  const { data: crops = [] } = useCrops();

  const avgYield = harvests.length > 0
    ? Number((harvests.reduce((sum, h) => sum + (h.yieldPerHa || 0), 0) / harvests.length).toFixed(2))
    : 0;

  const handleOpenHarvest = (plantingId?: number) => {
    setSelectedPlantingId(plantingId);
    setHarvestModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header con colores de sección (Verde Esmeralda) y Glassmorphism */}
      <div className="glass-panel p-6 border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/30">
            <Sprout className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Agricultura & Siembras</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300/40">
                Ciclo Productivo
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Control agronómico de cultivos, fechas, insumos y toneladas cosechadas.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setPlantingModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Siembra
          </Button>
          <Button
            onClick={() => handleOpenHarvest()}
            variant="outline"
            className="border-emerald-600/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-2"
          >
            <Wheat className="h-4 w-4" />
            Registrar Cosecha
          </Button>
        </div>
      </div>

      {/* KPI Stats Rápidos con Datos 100% Reales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 border-l-4 border-l-emerald-600 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{kpis?.activeCropsHectares ?? 0} <span className="text-xs font-normal text-muted-foreground">ha</span></div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Siembras Activas</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-emerald-600 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{kpis?.totalTonsHarvested ?? 0} <span className="text-xs font-normal text-muted-foreground">Ton</span></div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Cosecha Total</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-emerald-600 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">${(kpis?.totalCropRevenue ?? 0).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Ingreso Cosechas</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-emerald-600 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{avgYield} <span className="text-xs font-normal text-muted-foreground">t/ha</span></div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Rendimiento Promedio</div>
          </div>
        </div>
      </div>

      {/* Gráfica Estadística de Rendimiento y Siembras */}
      <div className="glass-panel p-6 border-border/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Rendimiento Agronómico & Producción
            </h2>
            <p className="text-xs text-muted-foreground">Toneladas cosechadas y hectáreas cultivadas por variedad.</p>
          </div>
        </div>

        {harvests.length > 0 || plantings.length > 0 ? (
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={crops.map(c => {
                  const hTons = harvests.filter(h => h.cropName.toLowerCase().includes(c.name.toLowerCase())).reduce((s, h) => s + (h.totalYieldTons || 0), 0);
                  const pHa = plantings.filter(p => p.cropName.toLowerCase().includes(c.name.toLowerCase())).reduce((s, p) => s + (p.areaHectares || 0), 0);
                  return { name: c.name.split(' ')[0], cosechadasTon: hTons, sembradasHa: pHa };
                })}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="cosechadasTon" name="Toneladas Cosechadas" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sembradasHa" name="Hectáreas Sembradas" fill="#65a30d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-6 text-center bg-card/40 rounded-xl border border-dashed border-border/80">
            <Sprout className="h-7 w-7 text-emerald-600 mx-auto mb-1.5 opacity-50" />
            <p className="text-xs font-semibold text-foreground">Sin registros agrícolas aún</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Las gráficas de producción y rendimiento por hectárea se mostrarán conforme registres tus siembras.</p>
          </div>
        )}
      </div>

      {/* Selector de Pestañas Rápidas */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <button
          onClick={() => setActiveTab('plantings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'plantings'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Sprout className="h-4 w-4" />
          Siembras en Curso ({plantings.filter(p => p.status !== 'HARVESTED').length})
        </button>
        <button
          onClick={() => setActiveTab('harvests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'harvests'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Wheat className="h-4 w-4" />
          Historial de Cosechas ({harvests.length})
        </button>
        <button
          onClick={() => setActiveTab('crops')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'crops'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Catálogo de Cultivos ({crops.length})
        </button>
      </div>

      {/* Contenido Pestaña: Siembras */}
      {activeTab === 'plantings' && (
        <div className="space-y-4">
          {plantings.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <EmptyState
                icon={Sprout}
                title="No hay siembras registradas"
                description="Registra tu primera siembra para llevar control de fechas, insumos y cálculo automático de rendimiento en cosecha."
                ctaLabel="Nueva Siembra"
                onCta={() => setPlantingModalOpen(true)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantings.map(p => {
                const isHarvested = p.status === 'HARVESTED';
                return (
                  <div
                    key={p.id}
                    className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between border-t-4 ${
                      isHarvested ? 'border-t-muted opacity-80' : 'border-t-emerald-600'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {p.cropName}
                          </span>
                          <h3 className="font-bold text-lg mt-1 text-foreground leading-snug">{p.variety}</h3>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          p.status === 'FLOWERING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          p.status === 'MATURATION' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          p.status === 'HARVESTED' ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                          'bg-sky-100 text-sky-800 border border-sky-300'
                        }`}>
                          {p.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-emerald-600" />
                          <span><strong>{p.areaHectares} ha</strong> sembradas</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Siembra: {p.plantingDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Cosecha est: {p.expectedHarvestDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Inversión: <strong>${p.totalInvestment.toLocaleString()}</strong></span>
                        </div>
                      </div>

                      {/* Barra de progreso de maduración / etapa */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Avance del Ciclo</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">{p.progressPercentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, p.progressPercentage)}%` }}
                          />
                        </div>
                      </div>

                      {p.notes && (
                        <p className="text-xs text-muted-foreground italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-border/50">
                          {p.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      {!isHarvested ? (
                        <Button
                          size="sm"
                          onClick={() => handleOpenHarvest(p.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs gap-1.5"
                        >
                          <Wheat className="h-3.5 w-3.5" />
                          Registrar Cosecha
                        </Button>
                      ) : (
                        <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Cosecha completada ({p.actualHarvestDate})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Contenido Pestaña: Cosechas */}
      {activeTab === 'harvests' && (
        <div className="space-y-3">
          {harvests.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <EmptyState
                icon={Wheat}
                title="No hay cosechas registradas"
                description="Registra una cosecha de grano o forraje para calcular automáticamente tu rendimiento en t/ha e ingresos."
                ctaLabel="Registrar Cosecha"
                onCta={() => handleOpenHarvest()}
              />
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Cultivo</th>
                      <th className="px-4 py-3">Superficie</th>
                      <th className="px-4 py-3">Rendimiento (t/ha)</th>
                      <th className="px-4 py-3">Total Toneladas</th>
                      <th className="px-4 py-3">Humedad %</th>
                      <th className="px-4 py-3">Destino</th>
                      <th className="px-4 py-3 text-right">Ingreso Bruto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {harvests.map(h => (
                      <tr key={h.id} className="hover:bg-accent/40 transition-colors">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{h.harvestDate}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-800 dark:text-emerald-300">
                          {h.cropName}
                          {h.notes && <span className="block text-xs font-normal text-muted-foreground">{h.notes}</span>}
                        </td>
                        <td className="px-4 py-3">{h.areaHectares} ha</td>
                        <td className="px-4 py-3 font-bold text-foreground">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                            {h.yieldPerHa} t/ha
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold">{h.totalYieldTons} ton</td>
                        <td className="px-4 py-3 text-muted-foreground">{h.moisturePercentage ? `${h.moisturePercentage}%` : '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            h.destination === 'SILO' ? 'bg-blue-100 text-blue-800' :
                            h.destination === 'DIRECT_SALE' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {h.destination === 'SILO' ? 'Almacenado Silo' :
                             h.destination === 'DIRECT_SALE' ? 'Venta Directa' :
                             h.destination === 'BALES' ? 'Pacas / Heno' : 'Autoconsumo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-black text-emerald-700 dark:text-emerald-400">
                          {h.totalRevenue ? `$${h.totalRevenue.toLocaleString()}` : '$0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenido Pestaña: Catálogo de Cultivos */}
      {activeTab === 'crops' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map(c => (
            <div key={c.id} className="glass-card p-5 space-y-3 border-l-4 border-l-emerald-500">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-lg text-foreground">{c.name}</h4>
                  {c.scientificName && <p className="text-xs italic text-muted-foreground">{c.scientificName}</p>}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {c.category}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border/40">
                <div>
                  <div className="text-lg font-black text-foreground">{c.standardCycleDays} d</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Ciclo</div>
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">{c.expectedYieldTonsPerHa}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">t/ha Esp.</div>
                </div>
                <div>
                  <div className="text-lg font-black text-foreground">{c.recommendedSeedingRateKgHa}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">kg/ha Sem.</div>
                </div>
              </div>

              {c.notes && <p className="text-xs text-muted-foreground">{c.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Nueva Siembra */}
      <NewPlantingModal
        open={plantingModalOpen}
        onClose={() => setPlantingModalOpen(false)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['plantings'] })}
      />

      {/* MODAL: Registrar Cosecha */}
      <NewHarvestModal
        open={harvestModalOpen}
        plantingId={selectedPlantingId}
        onClose={() => setHarvestModalOpen(false)}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['harvests'] });
          queryClient.invalidateQueries({ queryKey: ['plantings'] });
          queryClient.invalidateQueries({ queryKey: ['agronomyKpis'] });
        }}
      />
    </div>
  );
}

// Subcomponente Modal de Nueva Siembra
function NewPlantingModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const { data: crops = [] } = useCrops();
  const { data: lands = [] } = useLands();

  const [formData, setFormData] = useState<CreatePlantingPayload>({
    ranchId: 1,
    landId: 3,
    cropId: 1,
    cropName: 'Maíz Blanco Grano',
    variety: '',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    areaHectares: 10,
    seedingRateKgHa: 22,
    seedCost: 20000,
    fertilizerCost: 35000,
    agrochemicalCost: 8000,
    laborCost: 12000,
    machineryCost: 10000,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await agricultureApi.createPlanting(formData);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg glass-card border border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Sprout className="h-5 w-5" /> Nueva Siembra de Cultivo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Cultivo</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.cropId}
                onChange={e => {
                  const cid = Number(e.target.value);
                  const sel = crops.find(c => c.id === cid);
                  setFormData(prev => ({
                    ...prev,
                    cropId: cid,
                    cropName: sel ? sel.name : prev.cropName,
                    seedingRateKgHa: sel ? sel.recommendedSeedingRateKgHa : prev.seedingRateKgHa
                  }));
                }}
              >
                {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Variedad / Híbrido</Label>
              <Input
                placeholder="Ej. DK-390, Pioneer..."
                required
                value={formData.variety}
                onChange={e => setFormData(p => ({ ...p, variety: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Terreno / Parcela</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.landId}
                onChange={e => setFormData(p => ({ ...p, landId: Number(e.target.value) }))}
              >
                {lands.map(l => <option key={l.id} value={l.id}>{l.name} ({l.areaHectares} ha)</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Superficie Sembrada (ha)</Label>
              <Input
                type="number"
                step="0.1"
                required
                value={formData.areaHectares}
                onChange={e => setFormData(p => ({ ...p, areaHectares: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Fecha Siembra</Label>
              <Input
                type="date"
                required
                value={formData.plantingDate}
                onChange={e => setFormData(p => ({ ...p, plantingDate: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Fecha Estimada Cosecha</Label>
              <Input
                type="date"
                required
                value={formData.expectedHarvestDate}
                onChange={e => setFormData(p => ({ ...p, expectedHarvestDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div>
              <Label className="text-[11px]">Semillas ($)</Label>
              <Input
                type="number"
                value={formData.seedCost}
                onChange={e => setFormData(p => ({ ...p, seedCost: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-[11px]">Fertilizante ($)</Label>
              <Input
                type="number"
                value={formData.fertilizerCost}
                onChange={e => setFormData(p => ({ ...p, fertilizerCost: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-[11px]">Labor/Maq ($)</Label>
              <Input
                type="number"
                value={formData.machineryCost}
                onChange={e => setFormData(p => ({ ...p, machineryCost: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Notas de Campo</Label>
            <Input
              placeholder="Riego, preparación de suelo, densidad..."
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Guardar Siembra</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Subcomponente Modal de Cosecha
function NewHarvestModal({ open, plantingId, onClose, onSaved }: { open: boolean; plantingId?: number; onClose: () => void; onSaved: () => void }) {
  const { data: plantings = [] } = usePlantings();
  const selectedPlanting = plantings.find(p => p.id === plantingId) || plantings[0];

  const [formData, setFormData] = useState<CreateHarvestPayload>({
    ranchId: 1,
    plantingId: plantingId,
    landId: selectedPlanting ? selectedPlanting.landId : 3,
    cropName: selectedPlanting ? selectedPlanting.cropName : 'Maíz Blanco',
    harvestDate: new Date().toISOString().split('T')[0],
    areaHectares: selectedPlanting ? selectedPlanting.areaHectares : 10,
    totalYieldTons: 45,
    moisturePercentage: 14.5,
    grainQuality: 'PREMIUM',
    destination: 'SILO',
    salePricePerTon: 5200,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await agricultureApi.createHarvest(formData);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg glass-card border border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Wheat className="h-5 w-5" /> Registrar Cosecha y Rendimiento
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Siembra de Origen</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.plantingId}
                onChange={e => {
                  const pid = Number(e.target.value);
                  const p = plantings.find(x => x.id === pid);
                  if (p) {
                    setFormData(prev => ({
                      ...prev,
                      plantingId: pid,
                      cropName: p.cropName,
                      landId: p.landId,
                      areaHectares: p.areaHectares
                    }));
                  }
                }}
              >
                {plantings.map(p => (
                  <option key={p.id} value={p.id}>{p.cropName} - {p.variety} ({p.areaHectares} ha)</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Fecha Cosecha</Label>
              <Input
                type="date"
                required
                value={formData.harvestDate}
                onChange={e => setFormData(p => ({ ...p, harvestDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Superficie (ha)</Label>
              <Input
                type="number"
                step="0.1"
                required
                value={formData.areaHectares}
                onChange={e => setFormData(p => ({ ...p, areaHectares: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Total Toneladas</Label>
              <Input
                type="number"
                step="0.1"
                required
                value={formData.totalYieldTons}
                onChange={e => setFormData(p => ({ ...p, totalYieldTons: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Humedad %</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.moisturePercentage}
                onChange={e => setFormData(p => ({ ...p, moisturePercentage: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Destino del Producto</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.destination}
                onChange={e => setFormData(p => ({ ...p, destination: e.target.value as any }))}
              >
                <option value="SILO">Almacén Silo Propio (Autoconsumo Ganado)</option>
                <option value="DIRECT_SALE">Venta Directa a Comprador/Molino</option>
                <option value="FEEDLOT">Corral de Engorda Inmediato</option>
                <option value="BALES">Empacado en Pacas de Heno</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Precio Venta por Tonelada ($)</Label>
              <Input
                type="number"
                value={formData.salePricePerTon}
                onChange={e => setFormData(p => ({ ...p, salePricePerTon: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Observaciones</Label>
            <Input
              placeholder="Calidad de grano, silo bunker número, transporte..."
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Registrar Cosecha</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

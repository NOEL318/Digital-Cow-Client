/**
 * Página de Maquinaria, Equipos y Mantenimiento Mecánico.
 * Diseño rápido, visual con glassmorphism, chips de alerta de horómetro y colores cálidos (ámbar/naranja).
 */
import { useState } from 'react';
import {
  Wrench, Truck, Fuel, Gauge, Plus,
  CheckCircle2, User, ShieldAlert, BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  useMachineryList, useMachineryMaintenances, useFuelLogs,
  machineryApi, type CreateMachineryPayload, type CreateMaintenancePayload, type CreateFuelLogPayload
} from '@/features/machinery/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/ui/empty-state';
import { useQueryClient } from '@tanstack/react-query';

export default function MachineryPage() {
  const [activeTab, setActiveTab] = useState<'fleet' | 'maintenances' | 'fuel'>('fleet');
  const [newMachineryOpen, setNewMachineryOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [fuelOpen, setFuelOpen] = useState(false);
  const [selectedMachineryId, setSelectedMachineryId] = useState<number | undefined>();

  const queryClient = useQueryClient();
  const { data: machinery = [] } = useMachineryList();
  const { data: maintenances = [] } = useMachineryMaintenances();
  const { data: fuelLogs = [] } = useFuelLogs();

  const handleOpenMaintenance = (machineryId?: number) => {
    setSelectedMachineryId(machineryId);
    setMaintenanceOpen(true);
  };

  const handleOpenFuel = (machineryId?: number) => {
    setSelectedMachineryId(machineryId);
    setFuelOpen(true);
  };

  const operationalCount = machinery.filter(m => m.status === 'OPERATIONAL').length;
  const maintenancePendingCount = machinery.filter(m => m.currentHoursMeter >= m.nextServiceHours - 50).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header con colores de sección (Ámbar Industrial) y Glassmorphism */}
      <div className="glass-panel p-6 border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-lg shadow-amber-600/30">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Maquinaria & Equipos</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300/40">
                Flota y Taller
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Control de horómetros, servicios preventivos, consumo diesel y costo de refacciones.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setNewMachineryOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md shadow-amber-600/20 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Equipo
          </Button>
          <Button
            onClick={() => handleOpenMaintenance()}
            variant="outline"
            className="border-amber-600/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 gap-2"
          >
            <Wrench className="h-4 w-4" />
            Registrar Mantenimiento
          </Button>
          <Button
            onClick={() => handleOpenFuel()}
            variant="outline"
            className="border-amber-600/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 gap-2"
          >
            <Fuel className="h-4 w-4" />
            Cargar Diesel
          </Button>
        </div>
      </div>

      {/* KPI Stats Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 border-l-4 border-l-amber-600 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{machinery.length}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Flota Total</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-emerald-600 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{operationalCount}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Operativos</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-red-600 flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 text-red-600 rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-red-600">{maintenancePendingCount}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Servicio Próximo (&lt;50h)</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-amber-600 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
            <Fuel className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">
              {fuelLogs.reduce((sum, f) => sum + (f.liters || 0), 0)} <span className="text-xs font-normal text-muted-foreground">L</span>
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Diesel Este Mes</div>
          </div>
        </div>
      </div>

      {/* Gráfica Estadística de Horómetros y Diésel */}
      <div className="glass-panel p-6 border-border/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5 text-amber-600" />
              Horómetros y Consumo Operativo de la Flota
            </h2>
            <p className="text-xs text-muted-foreground">Horas acumuladas y litros de combustible consumidos por equipo.</p>
          </div>
        </div>

        {machinery.length > 0 ? (
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={machinery.map(m => {
                  const mFuel = fuelLogs.filter(f => f.machineryId === m.id).reduce((s, f) => s + (f.liters || 0), 0);
                  return {
                    name: m.name.split(' ')[0] + ' ' + (m.name.split(' ')[1] || ''),
                    horometro: m.currentHoursMeter,
                    dieselLitros: mFuel
                  };
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
                <Bar dataKey="horometro" name="Horas de Trabajo (Horómetro)" fill="#d97706" radius={[6, 6, 0, 0]} />
                <Bar dataKey="dieselLitros" name="Diésel Acumulado (Litros)" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-6 text-center bg-card/40 rounded-xl border border-dashed border-border/80">
            <Truck className="h-7 w-7 text-amber-600 mx-auto mb-1.5 opacity-50" />
            <p className="text-xs font-semibold text-foreground">Sin maquinaria registrada</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Registra tus tractores e implementos para llevar seguimiento del horómetro y mantenimientos.</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'fleet'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Truck className="h-4 w-4" />
          Equipos ({machinery.length})
        </button>
        <button
          onClick={() => setActiveTab('maintenances')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'maintenances'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Wrench className="h-4 w-4" />
          Mantenimientos ({maintenances.length})
        </button>
        <button
          onClick={() => setActiveTab('fuel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'fuel'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Fuel className="h-4 w-4" />
          Cargas de Combustible ({fuelLogs.length})
        </button>
      </div>

      {/* Tab: Equipos */}
      {activeTab === 'fleet' && (
        <div>
          {machinery.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <EmptyState
                icon={Truck}
                title="No hay maquinaria registrada"
                description="Registra tus tractores, camiones, picadoras e implementos para llevar control de mantenimientos y horómetros."
                ctaLabel="Nuevo Equipo"
                onCta={() => setNewMachineryOpen(true)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {machinery.map(m => {
                const isNearService = m.nextServiceHours > 0 && m.currentHoursMeter >= m.nextServiceHours - 50;
                const hoursRemaining = Math.max(0, m.nextServiceHours - m.currentHoursMeter);

                return (
                  <div
                    key={m.id}
                    className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between border-t-4 ${
                      m.status === 'IN_MAINTENANCE' ? 'border-t-red-600' :
                      isNearService ? 'border-t-amber-500' : 'border-t-emerald-600'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {m.type}
                          </span>
                          <h3 className="font-bold text-lg mt-1 text-foreground leading-snug">{m.name}</h3>
                          <p className="text-xs text-muted-foreground">{m.brand} • {m.model} ({m.year})</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          m.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          m.status === 'IN_MAINTENANCE' ? 'bg-red-100 text-red-800 border border-red-300' :
                          'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}>
                          {m.status === 'OPERATIONAL' ? 'Operativo' : 'En Taller'}
                        </span>
                      </div>

                      {/* Horómetro e indicador de servicio */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border/50 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-foreground">
                            <Gauge className="h-4 w-4 text-amber-600" />
                            <span>{m.currentHoursMeter.toLocaleString()} hrs</span>
                          </div>
                          <span className="text-muted-foreground text-[11px]">
                            Próx: {m.nextServiceHours} hrs
                          </span>
                        </div>

                        {m.nextServiceHours > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">Vida útil de servicio</span>
                              <span className={isNearService ? 'text-amber-600 font-bold' : 'text-foreground'}>
                                {hoursRemaining} hrs restantes
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isNearService ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (m.currentHoursMeter / (m.nextServiceHours || 1)) * 100
                                  )}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                          <Fuel className="h-3.5 w-3.5 text-amber-600" />
                          <span>{m.fuelType}</span>
                        </div>
                        {m.assignedOperator && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-amber-600" />
                            <span className="truncate">{m.assignedOperator}</span>
                          </div>
                        )}
                      </div>

                      {m.notes && (
                        <p className="text-xs text-muted-foreground italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-border/50">
                          {m.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-3 border-t border-border/60 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenMaintenance(m.id)}
                        className="flex-1 text-xs gap-1 hover:border-amber-500 hover:text-amber-600"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        Servicio
                      </Button>
                      {m.fuelType === 'DIESEL' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenFuel(m.id)}
                          className="flex-1 text-xs gap-1 hover:border-amber-500 hover:text-amber-600"
                        >
                          <Fuel className="h-3.5 w-3.5" />
                          Combustible
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Mantenimientos */}
      {activeTab === 'maintenances' && (
        <div>
          {maintenances.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <EmptyState
                icon={Wrench}
                title="No hay mantenimientos registrados"
                description="Lleva registro de servicios preventivos, cambios de aceite y reparaciones de taller para extender la vida útil de tus equipos."
                ctaLabel="Registrar Servicio"
                onCta={() => handleOpenMaintenance()}
              />
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Equipo</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Horómetro</th>
                      <th className="px-4 py-3">Descripción y Piezas</th>
                      <th className="px-4 py-3">Realizado Por</th>
                      <th className="px-4 py-3 text-right">Costo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {maintenances.map(m => {
                      const eq = machinery.find(x => x.id === m.machineryId);
                      return (
                        <tr key={m.id} className="hover:bg-accent/40 transition-colors">
                          <td className="px-4 py-3 font-medium whitespace-nowrap">{m.maintenanceDate}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">{eq?.name ?? `Equipo #${m.machineryId}`}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              m.type === 'PREVENTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {m.type === 'PREVENTIVE' ? 'Preventivo' : 'Correctivo'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono">{m.hoursMeter} hrs</td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground">{m.description}</p>
                            {m.partsReplaced && <p className="text-xs text-muted-foreground">Repuestos: {m.partsReplaced}</p>}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{m.performedBy}</td>
                          <td className="px-4 py-3 text-right font-black text-amber-700 dark:text-amber-400">
                            ${m.cost.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Combustible */}
      {activeTab === 'fuel' && (
        <div>
          {fuelLogs.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <EmptyState
                icon={Fuel}
                title="No hay cargas de combustible registradas"
                description="Registra consumos de diésel o gasolina por equipo para calcular costos por hora de trabajo."
                ctaLabel="Cargar Diésel"
                onCta={() => handleOpenFuel()}
              />
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Equipo</th>
                      <th className="px-4 py-3">Litros</th>
                      <th className="px-4 py-3">Precio / Litro</th>
                      <th className="px-4 py-3">Horómetro</th>
                      <th className="px-4 py-3">Notas</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {fuelLogs.map(f => {
                      const eq = machinery.find(x => x.id === f.machineryId);
                      return (
                        <tr key={f.id} className="hover:bg-accent/40 transition-colors">
                          <td className="px-4 py-3 font-medium whitespace-nowrap">{f.loggedAt}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">{eq?.name ?? `Equipo #${f.machineryId}`}</td>
                          <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-400">{f.liters} L</td>
                          <td className="px-4 py-3 text-muted-foreground">${f.costPerLiter.toFixed(2)}</td>
                          <td className="px-4 py-3 font-mono">{f.hoursMeter} hrs</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{f.notes ?? '-'}</td>
                          <td className="px-4 py-3 text-right font-black text-foreground">
                            ${f.totalCost.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Nuevo Equipo */}
      <NewMachineryModal
        open={newMachineryOpen}
        onClose={() => setNewMachineryOpen(false)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['machinery'] })}
      />

      {/* MODAL: Registrar Mantenimiento */}
      <NewMaintenanceModal
        open={maintenanceOpen}
        machineryId={selectedMachineryId}
        onClose={() => setMaintenanceOpen(false)}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['machinery'] });
          queryClient.invalidateQueries({ queryKey: ['machineryMaintenances'] });
        }}
      />

      {/* MODAL: Cargar Combustible */}
      <NewFuelModal
        open={fuelOpen}
        machineryId={selectedMachineryId}
        onClose={() => setFuelOpen(false)}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['machinery'] });
          queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
        }}
      />
    </div>
  );
}

function NewMachineryModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [formData, setFormData] = useState<CreateMachineryPayload>({
    ranchId: 1,
    name: '',
    type: 'TRACTOR',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    currentHoursMeter: 0,
    nextServiceHours: 250,
    fuelType: 'DIESEL',
    assignedOperator: '',
    purchasePrice: 0,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await machineryApi.create(formData);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg glass-card border border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Truck className="h-5 w-5" /> Registrar Maquinaria / Equipo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Nombre del Equipo</Label>
              <Input
                placeholder="Ej. Tractor John Deere 6125M"
                required
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Tipo</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.type}
                onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
              >
                <option value="TRACTOR">Tractor Agrícola</option>
                <option value="HARVESTER">Cosechadora / Picadora</option>
                <option value="PLANTER">Sembradora</option>
                <option value="SPRAYER">Aspersora / Fumigadora</option>
                <option value="TRAILER">Remolque / Tolva</option>
                <option value="IRRIGATION">Bomba / Sistema de Riego</option>
                <option value="FEED_MIXER">Vagón Mezclador TMR</option>
                <option value="SCALE">Báscula Ganadera</option>
                <option value="TOOL">Herramienta / Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Marca</Label>
              <Input
                placeholder="John Deere, New Holland..."
                required
                value={formData.brand}
                onChange={e => setFormData(p => ({ ...p, brand: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Modelo</Label>
              <Input
                placeholder="6125M, MF504..."
                required
                value={formData.model}
                onChange={e => setFormData(p => ({ ...p, model: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Año</Label>
              <Input
                type="number"
                value={formData.year}
                onChange={e => setFormData(p => ({ ...p, year: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Horómetro Actual</Label>
              <Input
                type="number"
                value={formData.currentHoursMeter}
                onChange={e => setFormData(p => ({ ...p, currentHoursMeter: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Próximo Servicio (hrs)</Label>
              <Input
                type="number"
                value={formData.nextServiceHours}
                onChange={e => setFormData(p => ({ ...p, nextServiceHours: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Combustible</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.fuelType}
                onChange={e => setFormData(p => ({ ...p, fuelType: e.target.value as any }))}
              >
                <option value="DIESEL">Diesel</option>
                <option value="GASOLINE">Gasolina</option>
                <option value="ELECTRIC">Eléctrico</option>
                <option value="NONE">Sin Motor / Toma Fuerza</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Operador Asignado</Label>
            <Input
              placeholder="Nombre del tractorista u operador"
              value={formData.assignedOperator}
              onChange={e => setFormData(p => ({ ...p, assignedOperator: e.target.value }))}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">Guardar Equipo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewMaintenanceModal({ open, machineryId, onClose, onSaved }: { open: boolean; machineryId?: number; onClose: () => void; onSaved: () => void }) {
  const { data: machinery = [] } = useMachineryList();
  const selectedMach = machinery.find(m => m.id === machineryId) || machinery[0];

  const [formData, setFormData] = useState<CreateMaintenancePayload>({
    machineryId: selectedMach ? selectedMach.id : 1,
    maintenanceDate: new Date().toISOString().split('T')[0],
    type: 'PREVENTIVE',
    hoursMeter: selectedMach ? selectedMach.currentHoursMeter : 1000,
    description: '',
    cost: 5000,
    performedBy: '',
    partsReplaced: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await machineryApi.createMaintenance(formData.machineryId, formData);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg glass-card border border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Wrench className="h-5 w-5" /> Registrar Mantenimiento
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Equipo</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.machineryId}
                onChange={e => {
                  const mid = Number(e.target.value);
                  const m = machinery.find(x => x.id === mid);
                  setFormData(p => ({
                    ...p,
                    machineryId: mid,
                    hoursMeter: m ? m.currentHoursMeter : p.hoursMeter
                  }));
                }}
              >
                {machinery.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Fecha Servicio</Label>
              <Input
                type="date"
                required
                value={formData.maintenanceDate}
                onChange={e => setFormData(p => ({ ...p, maintenanceDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Tipo</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.type}
                onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
              >
                <option value="PREVENTIVE">Preventivo (Aceite/Filtros)</option>
                <option value="CORRECTIVE">Correctivo (Reparación)</option>
                <option value="OVERHAUL">Ajuste Mayor</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Horómetro Actual</Label>
              <Input
                type="number"
                required
                value={formData.hoursMeter}
                onChange={e => setFormData(p => ({ ...p, hoursMeter: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Costo Total ($)</Label>
              <Input
                type="number"
                required
                value={formData.cost}
                onChange={e => setFormData(p => ({ ...p, cost: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Descripción del Servicio</Label>
            <Input
              placeholder="Ej. Cambio de aceite motor 15W40, filtro diesel y engrase"
              required
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Repuestos Reemplazados</Label>
              <Input
                placeholder="Filtros, bandas, cuchillas..."
                value={formData.partsReplaced}
                onChange={e => setFormData(p => ({ ...p, partsReplaced: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Mecánico / Taller</Label>
              <Input
                placeholder="Taller interno o agencia"
                value={formData.performedBy}
                onChange={e => setFormData(p => ({ ...p, performedBy: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">Guardar Servicio</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewFuelModal({ open, machineryId, onClose, onSaved }: { open: boolean; machineryId?: number; onClose: () => void; onSaved: () => void }) {
  const { data: machinery = [] } = useMachineryList();
  const dieselMachines = machinery.filter(m => m.fuelType === 'DIESEL');
  const selectedMach = dieselMachines.find(m => m.id === machineryId) || dieselMachines[0] || machinery[0];

  const [formData, setFormData] = useState<CreateFuelLogPayload>({
    machineryId: selectedMach ? selectedMach.id : 1,
    loggedAt: new Date().toISOString().split('T')[0],
    liters: 120,
    costPerLiter: 24.50,
    hoursMeter: selectedMach ? selectedMach.currentHoursMeter : 1000,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await machineryApi.createFuelLog(formData.machineryId, formData);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md glass-card border border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Fuel className="h-5 w-5" /> Registrar Carga de Combustible
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className="text-xs">Equipo</Label>
            <select
              className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
              value={formData.machineryId}
              onChange={e => {
                const mid = Number(e.target.value);
                const m = machinery.find(x => x.id === mid);
                setFormData(p => ({
                  ...p,
                  machineryId: mid,
                  hoursMeter: m ? m.currentHoursMeter : p.hoursMeter
                }));
              }}
            >
              {dieselMachines.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Fecha Carga</Label>
              <Input
                type="date"
                required
                value={formData.loggedAt}
                onChange={e => setFormData(p => ({ ...p, loggedAt: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Horómetro Actual</Label>
              <Input
                type="number"
                required
                value={formData.hoursMeter}
                onChange={e => setFormData(p => ({ ...p, hoursMeter: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Litros Cargados</Label>
              <Input
                type="number"
                step="0.1"
                required
                value={formData.liters}
                onChange={e => setFormData(p => ({ ...p, liters: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Precio / Litro ($)</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.costPerLiter}
                onChange={e => setFormData(p => ({ ...p, costPerLiter: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Notas / Labor Realizada</Label>
            <Input
              placeholder="Ej. Carga para arado en Parcela San Francisco"
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg flex justify-between items-center text-sm font-bold">
            <span>Costo Total:</span>
            <span className="text-amber-700 dark:text-amber-400">
              ${(formData.liters * formData.costPerLiter).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">Guardar Carga</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

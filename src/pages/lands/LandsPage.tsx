/**
 * Gestor Integral de Terrenos, Ranchos, Potreros de Pastoreo y Corrales.
 * Permite rotación rápida con 1 clic (Pastoreo Rotacional Voisin), monitoreo de pasturas,
 * capacidad de carga UGM y asignación de parcelas agrícolas y corrales de engorda.
 */
import { useState } from 'react';
import {
  Layers, Fence, RotateCw, Plus,
  Sprout, Beef, Droplets, Sun, BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLands, landsApi, type CreateLandPayload } from '@/features/lands/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/ui/empty-state';
import { useQueryClient } from '@tanstack/react-query';
import type { ServerlessLand } from '@/serverless/types';

export default function LandsPage() {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [newLandOpen, setNewLandOpen] = useState(false);
  const [rotatingId, setRotatingId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { data: lands = [] } = useLands();

  const filteredLands = selectedType === 'ALL'
    ? lands
    : lands.filter(l => l.type === selectedType);

  const totalHa = lands.reduce((s, l) => s + (l.areaHectares || 0), 0);
  const pastures = lands.filter(l => l.type === 'PASTURE');
  const pasturesActive = pastures.filter(l => l.status === 'ACTIVE').length;
  const pasturesResting = pastures.filter(l => l.status === 'RESTING').length;
  const agriculturalPlots = lands.filter(l => l.type === 'AGRICULTURAL').length;
  const feedlots = lands.filter(l => l.type === 'FEEDLOT').length;

  const handleRotate = async (land: ServerlessLand) => {
    try {
      setRotatingId(land.id);
      await landsApi.rotate(land.id);
      await queryClient.invalidateQueries({ queryKey: ['lands'] });
    } catch (err) {
      console.error(err);
    } finally {
      setRotatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header con colores de sección (Lima / Tierra / Verde) y Glassmorphism */}
      <div className="glass-panel p-6 border-lime-500/20 bg-gradient-to-r from-lime-500/10 via-emerald-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-lime-600 text-white rounded-2xl shadow-lg shadow-lime-600/30">
            <Fence className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Terrenos, Potreros & Corrales</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 font-semibold border border-lime-300/40">
                Manejo Territorial
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Rotación de pastoreo Voisin, capacidad de carga UGM/ha, parcelas de cultivo y corrales.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setNewLandOpen(true)}
            className="bg-lime-600 hover:bg-lime-700 text-white font-semibold shadow-md shadow-lime-600/20 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Terreno
          </Button>
        </div>
      </div>

      {/* KPI Stats Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 border-l-4 border-l-lime-600 flex items-center gap-3">
          <div className="p-2.5 bg-lime-500/10 text-lime-600 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{totalHa.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">ha</span></div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Superficie Total</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-emerald-600 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <RotateCw className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">
              {pasturesActive} <span className="text-sm font-normal text-muted-foreground">activos</span> / {pasturesResting} <span className="text-sm font-normal text-muted-foreground">descanso</span>
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Rotación Potreros</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-sky-600 flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-600 rounded-xl">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{agriculturalPlots}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Parcelas Agrícolas</div>
          </div>
        </div>

        <div className="glass-card p-4 border-l-4 border-l-amber-600 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
            <Beef className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{feedlots}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Corrales de Manejo</div>
          </div>
        </div>
      </div>

      {/* Gráfica de Capacidad Territorial & Aforo UGM */}
      {lands.length > 0 && (
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-lime-600" />
              <h3 className="font-bold text-base text-foreground">Distribución Territorial y Capacidad de Carga (UGM)</h3>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{lands.length} terrenos registrados</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lands.map(l => ({ name: l.name, ha: l.areaHectares || 0, ugm: l.carryingCapacityUGM || 0 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="ha" name="Superficie (ha)" fill="#65a30d" radius={[6, 6, 0, 0]} />
                <Bar dataKey="ugm" name="Capacidad (UGM)" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Selector de Filtro de Terrenos */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-2">
        <button
          onClick={() => setSelectedType('ALL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            selectedType === 'ALL'
              ? 'bg-lime-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Layers className="h-4 w-4" />
          Todos ({lands.length})
        </button>
        <button
          onClick={() => setSelectedType('PASTURE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            selectedType === 'PASTURE'
              ? 'bg-lime-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <RotateCw className="h-4 w-4" />
          Potreros de Pastoreo ({pastures.length})
        </button>
        <button
          onClick={() => setSelectedType('AGRICULTURAL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            selectedType === 'AGRICULTURAL'
              ? 'bg-lime-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Sprout className="h-4 w-4" />
          Parcelas de Siembra ({agriculturalPlots})
        </button>
        <button
          onClick={() => setSelectedType('FEEDLOT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            selectedType === 'FEEDLOT'
              ? 'bg-lime-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Beef className="h-4 w-4" />
          Corrales de Engorda ({feedlots})
        </button>
      </div>

      {/* Grid de Terrenos o Estado Vacío */}
      {filteredLands.length === 0 ? (
        <EmptyState
          icon={Fence}
          title="No hay terrenos registrados en esta categoría"
          description="Registra potreros para pastoreo Voisin, parcelas agrícolas para siembra o corrales de engorda para comenzar la gestión de tus tierras."
          ctaLabel="Registrar Primer Terreno"
          onCta={() => setNewLandOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLands.map(l => {
            const isPasture = l.type === 'PASTURE';
            const isAgri = l.type === 'AGRICULTURAL';
            const isFeedlot = l.type === 'FEEDLOT';

            const isActivePasture = isPasture && l.status === 'ACTIVE';
            const isRestingPasture = isPasture && l.status === 'RESTING';

            return (
              <div
                key={l.id}
                className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between border-t-4 ${
                  isActivePasture ? 'border-t-emerald-600' :
                  isRestingPasture ? 'border-t-lime-500' :
                  isAgri ? 'border-t-sky-500' : 'border-t-amber-500'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground border border-border">
                        {isPasture ? 'Potrero' : isAgri ? 'Parcela Agrícola' : 'Corral'}
                      </span>
                      <h3 className="font-bold text-lg mt-1 text-foreground leading-snug">{l.name}</h3>
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      l.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      l.status === 'RESTING' ? 'bg-lime-100 text-lime-800 border border-lime-300' :
                      l.status === 'OCCUPIED' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}>
                      {l.status === 'ACTIVE' ? (isPasture ? 'En Pastoreo' : 'Activo') :
                       l.status === 'RESTING' ? 'En Descanso' :
                       l.status === 'OCCUPIED' ? 'Ocupado' : l.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-lime-600" />
                      <span><strong>{l.areaHectares} ha</strong></span>
                    </div>
                    {l.soilType && (
                      <div className="flex items-center gap-1.5">
                        <Sun className="h-3.5 w-3.5 text-lime-600" />
                        <span>Suelo: {l.soilType}</span>
                      </div>
                    )}
                    {l.irrigationType && (
                      <div className="flex items-center gap-1.5">
                        <Droplets className="h-3.5 w-3.5 text-sky-600" />
                        <span>Riego: {l.irrigationType}</span>
                      </div>
                    )}
                  </div>

                  {/* Info específica de Potrero: Pasto, Días y Capacidad */}
                  {isPasture && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border/50 space-y-2">
                      <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span>Pasto: {l.pastureGrassType || 'Brachiaria / Estrella'}</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                          {l.currentAnimalCount ?? 0} cabezas
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/40">
                        <div>
                          <span className="text-muted-foreground block">Días en uso:</span>
                          <strong className="text-foreground">{l.daysInUse ?? 0} días</strong>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Días descanso:</span>
                          <strong className="text-lime-700 dark:text-lime-400">{l.daysInRest ?? 0} días</strong>
                        </div>
                      </div>

                      {l.carryingCapacityUGM && (
                        <div className="text-[11px] text-muted-foreground">
                          Capacidad sustentable: <strong>{l.carryingCapacityUGM} UGM</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Info específica de Parcela Agrícola */}
                  {isAgri && (
                    <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 rounded-xl border border-sky-200/50 dark:border-sky-800/40 space-y-1">
                      <span className="text-xs text-sky-800 dark:text-sky-300 font-semibold block">Cultivo en Terreno:</span>
                      <p className="text-sm font-bold text-foreground">{l.currentCrop || 'Sin siembra activa (Descanso)'}</p>
                    </div>
                  )}

                  {/* Info específica de Corral de Engorda */}
                  {isFeedlot && (
                    <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/40 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-foreground">Ocupación Corral:</span>
                        <span className="text-amber-800 dark:text-amber-300">
                          {l.currentAnimalCount ?? 0} / {l.carryingCapacityUGM ?? 30} cabezas
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (((l.currentAnimalCount ?? 0) / (l.carryingCapacityUGM || 30)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {l.notes && (
                    <p className="text-xs text-muted-foreground italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-border/50">
                      {l.notes}
                    </p>
                  )}
                </div>

                {/* Botón de Acción Rápida: Rotación en 1 clic */}
                <div className="pt-4 mt-3 border-t border-border/60">
                  {isPasture ? (
                    <Button
                      size="sm"
                      onClick={() => handleRotate(l)}
                      disabled={rotatingId === l.id}
                      className={`w-full text-xs font-semibold gap-1.5 ${
                        l.status === 'ACTIVE'
                          ? 'bg-lime-600 hover:bg-lime-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <RotateCw className={`h-3.5 w-3.5 ${rotatingId === l.id ? 'animate-spin' : ''}`} />
                      {l.status === 'ACTIVE' ? 'Pasar a Descanso Foliar' : 'Mover Ganado Aquí (Activar)'}
                    </Button>
                  ) : isAgri ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs gap-1 border-sky-400/50 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                      asChild
                    >
                      <a href="/agricultura">
                        <Sprout className="h-3.5 w-3.5" />
                        Ver Siembras
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs gap-1 border-amber-400/50 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      asChild
                    >
                      <a href="/animales">
                        <Beef className="h-3.5 w-3.5" />
                        Ver Animales
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Nuevo Terreno */}
      <NewLandModal
        open={newLandOpen}
        onClose={() => setNewLandOpen(false)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['lands'] })}
      />
    </div>
  );
}

function NewLandModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [formData, setFormData] = useState<CreateLandPayload>({
    ranchId: 1,
    name: '',
    type: 'PASTURE',
    areaHectares: 10,
    soilType: 'LOAM',
    irrigationType: 'RAIN_FED',
    pastureGrassType: 'Brachiaria Brizantha',
    carryingCapacityUGM: 15,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await landsApi.create(formData);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg glass-card border border-lime-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lime-800 dark:text-lime-300">
            <Fence className="h-5 w-5" /> Registrar Terreno / Potrero / Parcela
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Nombre del Terreno</Label>
              <Input
                placeholder="Ej. Potrero El Roble, Parcela 2..."
                required
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Tipo de Terreno</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.type}
                onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
              >
                <option value="PASTURE">Potrero de Pastoreo</option>
                <option value="AGRICULTURAL">Parcela Agrícola</option>
                <option value="FEEDLOT">Corral de Engorda / Feedlot</option>
                <option value="INFRASTRUCTURE">Instalaciones / Patio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
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
              <Label className="text-xs">Tipo de Suelo</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.soilType || 'LOAM'}
                onChange={e => setFormData(p => ({ ...p, soilType: e.target.value as any }))}
              >
                <option value="LOAM">Franco (Equilibrado)</option>
                <option value="CLAY">Arcilloso (Pesado)</option>
                <option value="SANDY">Arenoso (Ligero)</option>
                <option value="SILT">Limoso</option>
                <option value="ORGANIC">Orgánico</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Riego</Label>
              <select
                className="w-full mt-1 border rounded-lg p-2 text-sm bg-background"
                value={formData.irrigationType || 'RAIN_FED'}
                onChange={e => setFormData(p => ({ ...p, irrigationType: e.target.value as any }))}
              >
                <option value="RAIN_FED">Temporal / Secano</option>
                <option value="DRIP">Goteo Tecnificado</option>
                <option value="SPRINKLER">Aspersión</option>
                <option value="FLOOD">Gravedad / Inundación</option>
                <option value="NONE">Sin Riego</option>
              </select>
            </div>
          </div>

          {formData.type === 'PASTURE' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Especie de Pasto Dominante</Label>
                <Input
                  placeholder="Brachiaria, Estrella, Mombaza..."
                  value={formData.pastureGrassType}
                  onChange={e => setFormData(p => ({ ...p, pastureGrassType: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs">Capacidad Sustentable (UGM)</Label>
                <Input
                  type="number"
                  value={formData.carryingCapacityUGM}
                  onChange={e => setFormData(p => ({ ...p, carryingCapacityUGM: Number(e.target.value) }))}
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs">Observaciones</Label>
            <Input
              placeholder="Pendiente, cercado eléctrico, aguajes..."
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-lime-600 hover:bg-lime-700 text-white">Guardar Terreno</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

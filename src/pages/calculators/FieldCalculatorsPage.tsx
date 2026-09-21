/**
 * Calculadoras de Campo y Zootecnia / Agronomía Práctica.
 * Herramientas de cálculo instantáneo para toma de decisiones agronómicas y zootécnicas en campo:
 * GMD, Carga Animal Voisin (UGM/ha), Densidad de Siembra, Rentabilidad t/ha y Conversión Alimenticia.
 */
import { useState } from 'react';
import {
  Calculator, Scale, RotateCw, Sprout, TrendingUp, Beef
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FieldCalculatorsPage() {
  const [calculator, setCalculator] = useState<'gmd' | 'voisin' | 'seeding' | 'roi' | 'fcr'>('gmd');

  // Estado Calculadora 1: GMD
  const [initialWeight, setInitialWeight] = useState<number>(310);
  const [finalWeight, setFinalWeight] = useState<number>(395);
  const [daysElapsed, setDaysElapsed] = useState<number>(75);
  const [targetWeight, setTargetWeight] = useState<number>(480);

  // Cálculos GMD
  const weightGain = Math.max(0, finalWeight - initialWeight);
  const gmd = daysElapsed > 0 ? Number((weightGain / daysElapsed).toFixed(3)) : 0;
  const remainingWeight = Math.max(0, targetWeight - finalWeight);
  const daysToTarget = gmd > 0 ? Math.ceil(remainingWeight / gmd) : 0;

  // Estado Calculadora 2: Pastoreo Voisin / Carga UGM
  const [paddockHectares, setPaddockHectares] = useState<number>(15);
  const [forageYieldKgM2, setForageYieldKgM2] = useState<number>(1.8); // 1.8 kg pasto verde / m2
  const [dryMatterPercent, setDryMatterPercent] = useState<number>(22); // 22% MS
  const [daysOccupation, setDaysOccupation] = useState<number>(3); // 3 días en el potrero
  const [daysRest, setDaysRest] = useState<number>(30); // 30 días descanso

  // Cálculos Voisin
  const totalM2 = paddockHectares * 10000;
  const greenForageTotalKg = totalM2 * forageYieldKgM2;
  const dryMatterTotalKg = greenForageTotalKg * (dryMatterPercent / 100);
  const dailyUgmIntakeKg = 12; // 1 UGM consume aprox 12 kg de materia seca al día (aprox 2.5-3% de su peso)
  const pastureAvailablePerDay = daysOccupation > 0 ? dryMatterTotalKg / daysOccupation : 0;
  const carryingCapacityUGM = Math.floor(pastureAvailablePerDay / dailyUgmIntakeKg);
  const requiredPaddocksCircuit = Math.ceil(daysRest / daysOccupation) + 1;

  // Estado Calculadora 3: Densidad de Siembra & Fertilizantes
  const [rowSpacingCm, setRowSpacingCm] = useState<number>(75); // 75 cm entre surcos
  const [seedsPerMeter, setSeedsPerMeter] = useState<number>(5.5); // 5.5 semillas por metro lineal
  const [germinationPercent, setGerminationPercent] = useState<number>(92);
  const [thousandSeedWeightGrams, setThousandSeedWeightGrams] = useState<number>(320); // 320g / 1000 semillas
  const [targetNitrogenKgHa, setTargetNitrogenKgHa] = useState<number>(180); // 180 kg N/ha

  // Cálculos Siembra
  const metersOfRowPerHa = rowSpacingCm > 0 ? 10000 / (rowSpacingCm / 100) : 0;
  const theoreticalSeedsHa = metersOfRowPerHa * seedsPerMeter;
  const expectedPlantsHa = Math.floor(theoreticalSeedsHa * (germinationPercent / 100));
  const seedKgPerHa = Number(((theoreticalSeedsHa / 1000) * (thousandSeedWeightGrams / 1000)).toFixed(2));
  // Urea es 46% N -> cada bulto de 50 kg aporta 23 kg de N puro
  const ureaBags50kgNeeded = Math.ceil(targetNitrogenKgHa / 23);

  // Estado Calculadora 4: Rentabilidad y Margen Agrícola
  const [cropHa, setCropHa] = useState<number>(12);
  const [expectedYieldTonsHa, setExpectedYieldTonsHa] = useState<number>(9.5);
  const [pricePerTon, setPricePerTon] = useState<number>(5200);
  const [costPerHa, setCostPerHa] = useState<number>(24500);

  // Cálculos Rentabilidad
  const totalTons = cropHa * expectedYieldTonsHa;
  const totalRevenue = totalTons * pricePerTon;
  const totalCost = cropHa * costPerHa;
  const netProfit = totalRevenue - totalCost;
  const profitPerHa = cropHa > 0 ? netProfit / cropHa : 0;
  const breakEvenYieldTonsHa = pricePerTon > 0 ? Number((costPerHa / pricePerTon).toFixed(2)) : 0;
  const cropRoiPercent = totalCost > 0 ? Number(((netProfit / totalCost) * 100).toFixed(1)) : 0;

  // Estado Calculadora 5: FCR (Conversión Alimenticia)
  const [totalFeedConsumedKg, setTotalFeedConsumedKg] = useState<number>(4500);
  const [totalWeightGainedLotKg, setTotalWeightGainedLotKg] = useState<number>(750);
  const [feedCostPerKg, setFeedCostPerKg] = useState<number>(6.50);

  // Cálculos FCR
  const fcrRatio = totalWeightGainedLotKg > 0 ? Number((totalFeedConsumedKg / totalWeightGainedLotKg).toFixed(2)) : 0;
  const feedCostPerKgGain = Number((fcrRatio * feedCostPerKg).toFixed(2));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header con colores de sección (Teal / Ciencia / Precisión) */}
      <div className="glass-panel p-6 border-teal-500/20 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/30">
            <Calculator className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Calculadoras de Campo & Rendimiento</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold border border-teal-300/40">
                Zootecnia & Agronomía
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Cálculo de Ganancia Diaria de Peso (GMD), Carga Animal UGM, densidad de siembra y márgenes.</p>
          </div>
        </div>
      </div>

      {/* Selector de Calculadoras Rápidas */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        <button
          onClick={() => setCalculator('gmd')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            calculator === 'gmd'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Scale className="h-4 w-4" />
          1. Ganancia Media Diaria (GMD)
        </button>
        <button
          onClick={() => setCalculator('voisin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            calculator === 'voisin'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <RotateCw className="h-4 w-4" />
          2. Carga Animal & Pastoreo Voisin
        </button>
        <button
          onClick={() => setCalculator('seeding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            calculator === 'seeding'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Sprout className="h-4 w-4" />
          3. Densidad de Siembra & Abono
        </button>
        <button
          onClick={() => setCalculator('roi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            calculator === 'roi'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          4. Rentabilidad Agrícola (t/ha)
        </button>
        <button
          onClick={() => setCalculator('fcr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            calculator === 'fcr'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Beef className="h-4 w-4" />
          5. Conversión Alimenticia (FCR)
        </button>
      </div>

      {/* CALCULADORA 1: GMD */}
      {calculator === 'gmd' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Scale className="h-5 w-5 text-teal-600" />
              Parámetros de Pesaje y Ganancia de Carne
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Peso Inicial (kg)</Label>
                <Input
                  type="number"
                  value={initialWeight}
                  onChange={e => setInitialWeight(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Peso Actual / Final (kg)</Label>
                <Input
                  type="number"
                  value={finalWeight}
                  onChange={e => setFinalWeight(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Días Transcurridos Entre Pesajes</Label>
                <Input
                  type="number"
                  value={daysElapsed}
                  onChange={e => setDaysElapsed(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Peso Meta de Venta / Faena (kg)</Label>
                <Input
                  type="number"
                  value={targetWeight}
                  onChange={e => setTargetWeight(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground">
              <strong>Fórmula de Zootecnia:</strong> GMD = (Peso Final - Peso Inicial) / Días transcurridos.
              Para engorda estabulada en corral se busca &gt; 1.1 kg/día; en pastoreo rotacional con suplementación 0.7 - 0.95 kg/día.
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-teal-600 bg-teal-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-teal-700 dark:text-teal-400">Resultado Zootécnico</span>
              <div>
                <div className="text-4xl font-black text-foreground">{gmd} <span className="text-lg font-bold text-muted-foreground">kg/día</span></div>
                <p className="text-xs font-semibold mt-1">
                  {gmd >= 1.2 ? '🟢 Desempeño Excelente (Alta Eficiencia)' :
                   gmd >= 0.8 ? '🔵 Desempeño Bueno (Ganancia Sostenida)' :
                   gmd >= 0.5 ? '🟡 Desempeño Moderado (Revisar Ración)' : '🔴 Desempeño Crítico (Deficiencia Nutricional)'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kilos ganados en periodo:</span>
                  <strong>+{weightGain} kg</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kilos faltantes para venta:</span>
                  <strong>{remainingWeight} kg</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Días estimados para meta:</span>
                  <strong className="text-teal-700 dark:text-teal-400 font-bold">{daysToTarget} días</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 2: Pastoreo Voisin / Carga UGM */}
      {calculator === 'voisin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <RotateCw className="h-5 w-5 text-teal-600" />
              Parámetros de Pastura y Aforo de Potrero
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Superficie del Potrero (Hectáreas)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={paddockHectares}
                  onChange={e => setPaddockHectares(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Aforo de Forraje Verde (kg/m² de pasto)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={forageYieldKgM2}
                  onChange={e => setForageYieldKgM2(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">% Materia Seca del Pasto (MS %)</Label>
                <Input
                  type="number"
                  value={dryMatterPercent}
                  onChange={e => setDryMatterPercent(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Días de Ocupación por Pastoreo</Label>
                <Input
                  type="number"
                  value={daysOccupation}
                  onChange={e => setDaysOccupation(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Días de Descanso Foliar Óptimo</Label>
                <Input
                  type="number"
                  value={daysRest}
                  onChange={e => setDaysRest(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground">
              <strong>Leyes del Pastoreo Voisin:</strong> 1 UGM = Vaca adulta de 450 kg consumiendo aprox 12 kg de Materia Seca/día.
              El descanso óptimo permite que el pasto alcance su "Punto Óptimo de Reposo" acumulando reservas radiculares.
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-lime-600 bg-lime-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-lime-800 dark:text-lime-300">Carga Sustentable</span>
              <div>
                <div className="text-4xl font-black text-foreground">{carryingCapacityUGM} <span className="text-lg font-bold text-muted-foreground">UGM</span></div>
                <p className="text-xs text-muted-foreground mt-1">Capacidad instantánea para pastoreo de {daysOccupation} días</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Forraje verde disponible:</span>
                  <strong>{(greenForageTotalKg / 1000).toFixed(1)} toneladas</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Materia seca útil:</span>
                  <strong>{(dryMatterTotalKg / 1000).toFixed(1)} toneladas MS</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Potreros requeridos en circuito:</span>
                  <strong className="text-lime-700 dark:text-lime-400 font-bold">{requiredPaddocksCircuit} potreros</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 3: Densidad de Siembra & Abono */}
      {calculator === 'seeding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Sprout className="h-5 w-5 text-teal-600" />
              Parámetros Agronómicos de Siembra y Fertilización
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Distancia Entre Surcos (cm)</Label>
                <Input
                  type="number"
                  value={rowSpacingCm}
                  onChange={e => setRowSpacingCm(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Semillas por Metro Lineal</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={seedsPerMeter}
                  onChange={e => setSeedsPerMeter(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">% Germinación de la Semilla</Label>
                <Input
                  type="number"
                  value={germinationPercent}
                  onChange={e => setGerminationPercent(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Peso de Mil Semillas (gramos)</Label>
                <Input
                  type="number"
                  value={thousandSeedWeightGrams}
                  onChange={e => setThousandSeedWeightGrams(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Meta de Nitrógeno Puro (kg N / ha)</Label>
                <Input
                  type="number"
                  value={targetNitrogenKgHa}
                  onChange={e => setTargetNitrogenKgHa(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-sky-600 bg-sky-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-800 dark:text-sky-300">Población por Hectárea</span>
              <div>
                <div className="text-3xl font-black text-foreground">{expectedPlantsHa.toLocaleString()} <span className="text-sm font-bold text-muted-foreground">plantas/ha</span></div>
                <p className="text-xs text-muted-foreground mt-1">Densidad efectiva estimada al naciente</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Semilla requerida / ha:</span>
                  <strong>{seedKgPerHa} kg/ha</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bultos Urea 46% (50kg):</span>
                  <strong className="text-sky-700 dark:text-sky-400 font-bold">{ureaBags50kgNeeded} bultos/ha</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 4: Rentabilidad Agrícola */}
      {calculator === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Márgenes y Rendimiento de Cultivo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Superficie Total (Hectáreas)</Label>
                <Input
                  type="number"
                  value={cropHa}
                  onChange={e => setCropHa(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Rendimiento Proyectado (t/ha)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={expectedYieldTonsHa}
                  onChange={e => setExpectedYieldTonsHa(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Precio de Venta por Tonelada ($)</Label>
                <Input
                  type="number"
                  value={pricePerTon}
                  onChange={e => setPricePerTon(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Costo Total de Producción por Hectárea ($)</Label>
                <Input
                  type="number"
                  value={costPerHa}
                  onChange={e => setCostPerHa(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-emerald-600 bg-emerald-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300">Utilidad Neta</span>
              <div>
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">${netProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Margen total de cosecha en {cropHa} ha</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ganancia neta / hectárea:</span>
                  <strong>${profitPerHa.toLocaleString(undefined, { maximumFractionDigits: 0 })}/ha</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Punto de equilibrio:</span>
                  <strong>{breakEvenYieldTonsHa} t/ha</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retorno de inversión (ROI):</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-bold">+{cropRoiPercent}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 5: FCR */}
      {calculator === 'fcr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Beef className="h-5 w-5 text-teal-600" />
              Conversión de Alimento a Carne (Feed Conversion Ratio)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Total de Ración Consumida por el Lote (kg)</Label>
                <Input
                  type="number"
                  value={totalFeedConsumedKg}
                  onChange={e => setTotalFeedConsumedKg(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Total de Peso Vivo Ganado (kg)</Label>
                <Input
                  type="number"
                  value={totalWeightGainedLotKg}
                  onChange={e => setTotalWeightGainedLotKg(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Costo Promedio del Alimento ($/kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={feedCostPerKg}
                  onChange={e => setFeedCostPerKg(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-amber-600 bg-amber-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-800 dark:text-amber-300">Índice de Conversión (FCR)</span>
              <div>
                <div className="text-4xl font-black text-foreground">{fcrRatio} <span className="text-lg font-bold text-muted-foreground">: 1</span></div>
                <p className="text-xs text-muted-foreground mt-1">{fcrRatio} kg de comida para ganar 1 kg de carne</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo por kilo ganado:</span>
                  <strong className="text-amber-700 dark:text-amber-400 font-bold">${feedCostPerKgGain} / kg carne</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

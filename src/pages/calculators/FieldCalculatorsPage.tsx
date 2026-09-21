/**
 * Calculadoras de Campo, Zootecnia y Agronomía de Precisión.
 * Herramientas de cálculo instantáneo en terreno sin scroll horizontal:
 * GMD, Carga Voisin UGM, Densidad de Siembra, Rentabilidad t/ha, FCR,
 * Dosis & Retiro de Fármacos, Peso por Cinta Barométrica, Silo Bunker e Intervalo Entre Partos.
 */
import { useState } from 'react';
import {
  Calculator, Scale, RotateCw, Sprout, TrendingUp, Beef,
  Syringe, Ruler, Warehouse, CalendarClock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CalculatorTab =
  | 'gmd'
  | 'voisin'
  | 'seeding'
  | 'roi'
  | 'fcr'
  | 'dosage'
  | 'weight_tape'
  | 'silo'
  | 'calving_interval';

export default function FieldCalculatorsPage() {
  const [calculator, setCalculator] = useState<CalculatorTab>('gmd');

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
  const [forageYieldKgM2, setForageYieldKgM2] = useState<number>(1.8);
  const [dryMatterPercent, setDryMatterPercent] = useState<number>(22);
  const [daysOccupation, setDaysOccupation] = useState<number>(3);
  const [daysRest, setDaysRest] = useState<number>(30);

  // Cálculos Voisin
  const totalM2 = paddockHectares * 10000;
  const greenForageTotalKg = totalM2 * forageYieldKgM2;
  const dryMatterTotalKg = greenForageTotalKg * (dryMatterPercent / 100);
  const dailyUgmIntakeKg = 12;
  const pastureAvailablePerDay = daysOccupation > 0 ? dryMatterTotalKg / daysOccupation : 0;
  const carryingCapacityUGM = Math.floor(pastureAvailablePerDay / dailyUgmIntakeKg);
  const requiredPaddocksCircuit = Math.ceil(daysRest / daysOccupation) + 1;

  // Estado Calculadora 3: Densidad de Siembra & Fertilizantes
  const [rowSpacingCm, setRowSpacingCm] = useState<number>(75);
  const [seedsPerMeter, setSeedsPerMeter] = useState<number>(5.5);
  const [germinationPercent, setGerminationPercent] = useState<number>(92);
  const [thousandSeedWeightGrams, setThousandSeedWeightGrams] = useState<number>(320);
  const [targetNitrogenKgHa, setTargetNitrogenKgHa] = useState<number>(180);

  // Cálculos Siembra
  const metersOfRowPerHa = rowSpacingCm > 0 ? 10000 / (rowSpacingCm / 100) : 0;
  const theoreticalSeedsHa = metersOfRowPerHa * seedsPerMeter;
  const expectedPlantsHa = Math.floor(theoreticalSeedsHa * (germinationPercent / 100));
  const seedKgPerHa = Number(((theoreticalSeedsHa / 1000) * (thousandSeedWeightGrams / 1000)).toFixed(2));
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

  // Estado Calculadora 6: Dosis Veterinaria & Retiro
  const [dosageAnimalWeight, setDosageAnimalWeight] = useState<number>(450);
  const [doseMgPerKg, setDoseMgPerKg] = useState<number>(10);
  const [drugConcentrationMgMl, setDrugConcentrationMgMl] = useState<number>(200);
  const [withdrawalMilkDays, setWithdrawalMilkDays] = useState<number>(4);
  const [withdrawalMeatDays, setWithdrawalMeatDays] = useState<number>(28);

  // Cálculos Dosis
  const totalMgRequired = dosageAnimalWeight * doseMgPerKg;
  const volumeToInjectMl = drugConcentrationMgMl > 0 ? Number((totalMgRequired / drugConcentrationMgMl).toFixed(1)) : 0;
  const maxVolumePerSite = 15;
  const injectionSitesNeeded = volumeToInjectMl > maxVolumePerSite ? Math.ceil(volumeToInjectMl / maxVolumePerSite) : 1;

  // Estado Calculadora 7: Estimación de Peso por Cinta Barométrica
  const [heartGirthCm, setHeartGirthCm] = useState<number>(182);
  const [bodyLengthCm, setBodyLengthCm] = useState<number>(148);
  const [cattleBiotype, setCattleBiotype] = useState<'BEEF' | 'DAIRY'>('BEEF');

  // Cálculos Peso Cinta (Fórmula Quetelet/Crevat: Peso = (PT² * LC) / Factor)
  const biotypeConstant = cattleBiotype === 'BEEF' ? 11880 : 11950;
  const estimatedWeightKg = heartGirthCm > 0 && bodyLengthCm > 0
    ? Math.round((Math.pow(heartGirthCm, 2) * bodyLengthCm) / biotypeConstant)
    : 0;

  // Estado Calculadora 8: Silo Bunker & Capacidad Forrajera
  const [siloLengthM, setSiloLengthM] = useState<number>(25);
  const [siloTopWidthM, setSiloTopWidthM] = useState<number>(7);
  const [siloBottomWidthM, setSiloBottomWidthM] = useState<number>(5);
  const [siloHeightM, setSiloHeightM] = useState<number>(3);
  const [siloDensityKgM3, setSiloDensityKgM3] = useState<number>(650);
  const [animalsToFeed, setAnimalsToFeed] = useState<number>(35);
  const [dailyRationKgHead, setDailyRationKgHead] = useState<number>(22);

  // Cálculos Silo
  const averageWidthM = (siloTopWidthM + siloBottomWidthM) / 2;
  const siloVolumeM3 = siloLengthM * averageWidthM * siloHeightM;
  const totalSilageKg = siloVolumeM3 * siloDensityKgM3;
  const totalSilageTons = Number((totalSilageKg / 1000).toFixed(1));
  const dailyHerdConsumptionKg = animalsToFeed * dailyRationKgHead;
  const daysOfFeedAvailable = dailyHerdConsumptionKg > 0 ? Math.floor(totalSilageKg / dailyHerdConsumptionKg) : 0;

  // Estado Calculadora 9: Intervalo Entre Partos (IEP) & Días Abiertos
  const [voluntaryWaitPeriodDays, setVoluntaryWaitPeriodDays] = useState<number>(50);
  const [daysToConception, setDaysToConception] = useState<number>(95);
  const [gestationLengthDays] = useState<number>(283);
  const [costPerOpenDay] = useState<number>(85); // MXN por día abierto extra (>90 días)

  // Cálculos IEP
  const projectedIepDays = daysToConception + gestationLengthDays;
  const projectedIepMonths = Number((projectedIepDays / 30.4).toFixed(1));
  const excessOpenDays = Math.max(0, daysToConception - 90);
  const financialLossExcessOpen = excessOpenDays * costPerOpenDay;
  const reproductiveEfficiency = projectedIepDays > 0 ? Math.min(100, Math.round((365 / projectedIepDays) * 100)) : 0;

  const CALCULATOR_ITEMS: Array<{ id: CalculatorTab; label: string; sub: string; icon: typeof Calculator }> = [
    { id: 'gmd', label: '1. Ganancia Diaria (GMD)', sub: 'Peso vivo y días a meta', icon: Scale },
    { id: 'voisin', label: '2. Pastoreo Voisin (UGM)', sub: 'Carga animal y rotación', icon: RotateCw },
    { id: 'seeding', label: '3. Siembra & Abono', sub: 'Plantas/ha y urea', icon: Sprout },
    { id: 'roi', label: '4. Rentabilidad (t/ha)', sub: 'Margen neto y punto eq.', icon: TrendingUp },
    { id: 'fcr', label: '5. Conversión FCR', sub: 'Alimento vs Carne', icon: Beef },
    { id: 'dosage', label: '6. Dosis & Retiro Fármaco', sub: 'mL a inyectar y leche/carne', icon: Syringe },
    { id: 'weight_tape', label: '7. Cinta Barométrica', sub: 'Pesar sin báscula', icon: Ruler },
    { id: 'silo', label: '8. Silo Bunker & Toneladas', sub: 'Capacidad y días de ración', icon: Warehouse },
    { id: 'calving_interval', label: '9. Intervalo Partos (IEP)', sub: 'Días abiertos y eficiencia', icon: CalendarClock }
  ];

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
                9 Módulos Zootécnicos & Agrícolas
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Cálculos instantáneos en terreno: pesos, dosificaciones, silos, cargas UGM, márgenes y reproducción.</p>
          </div>
        </div>
      </div>

      {/* Selector de Calculadoras Rápidas en Cuadrícula Responsiva (SIN SCROLL HORIZONTAL) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
        {CALCULATOR_ITEMS.map(item => {
          const Icon = item.icon;
          const active = calculator === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCalculator(item.id)}
              className={`p-3 rounded-2xl text-left transition-all border flex items-start gap-3 ${
                active
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 border-teal-600'
                  : 'bg-card/70 hover:bg-accent border-border text-card-foreground'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">{item.label}</span>
                <span className={`text-[11px] block truncate mt-0.5 ${active ? 'text-teal-100' : 'text-muted-foreground'}`}>
                  {item.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* CALCULADORA 1: GMD */}
      {calculator === 'gmd' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Scale className="h-5 w-5 text-teal-600" />
              Ganancia Media Diaria (GMD) y Proyección a Mercado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Peso Inicial del Periodo (kg)</Label>
                <Input
                  type="number"
                  value={initialWeight}
                  onChange={e => setInitialWeight(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Peso Actual / Reciente (kg)</Label>
                <Input
                  type="number"
                  value={finalWeight}
                  onChange={e => setFinalWeight(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Días Transcurridos entre Pesajes</Label>
                <Input
                  type="number"
                  value={daysElapsed}
                  onChange={e => setDaysElapsed(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Peso Objetivo para Venta (kg)</Label>
                <Input
                  type="number"
                  value={targetWeight}
                  onChange={e => setTargetWeight(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-teal-600 bg-teal-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-teal-800 dark:text-teal-300">Rendimiento Ponderal</span>
              <div>
                <div className="text-4xl font-black text-foreground">{gmd} <span className="text-lg font-bold text-muted-foreground">kg / día</span></div>
                <p className="text-xs text-muted-foreground mt-1">Ganancia media diaria durante los {daysElapsed} días</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Peso total ganado:</span>
                  <strong>+{weightGain} kg</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kilos faltantes para meta:</span>
                  <strong>{remainingWeight} kg</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Días estimados para salida:</span>
                  <strong className="text-teal-700 dark:text-teal-400 font-bold">{daysToTarget} días</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 2: VOISIN */}
      {calculator === 'voisin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <RotateCw className="h-5 w-5 text-lime-600" />
              Capacidad de Carga Animal & Pastoreo Racional Voisin (PRV)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Superficie Total del Potrero (Hectáreas)</Label>
                <Input
                  type="number"
                  value={paddockHectares}
                  onChange={e => setPaddockHectares(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Rendimiento Forrajero Verde (kg/m²)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={forageYieldKgM2}
                  onChange={e => setForageYieldKgM2(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">% Materia Seca (MS) Estimada (típico 18-25%)</Label>
                <Input
                  type="number"
                  value={dryMatterPercent}
                  onChange={e => setDryMatterPercent(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Días de Ocupación por Parcela (1 a 3 máx)</Label>
                <Input
                  type="number"
                  value={daysOccupation}
                  onChange={e => setDaysOccupation(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Días de Descanso Óptimo Requeridos (según época)</Label>
                <Input
                  type="number"
                  value={daysRest}
                  onChange={e => setDaysRest(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-lime-600 bg-lime-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-lime-800 dark:text-lime-300">Capacidad Instantánea</span>
              <div>
                <div className="text-4xl font-black text-foreground">{carryingCapacityUGM} <span className="text-lg font-bold text-muted-foreground">UGM</span></div>
                <p className="text-xs text-muted-foreground mt-1">Unidades Gran Ganado (450 kg) que soporta el potrero</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Materia seca disponible:</span>
                  <strong>{Math.round(dryMatterTotalKg).toLocaleString()} kg MS</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Parcelas mínimas en circuito:</span>
                  <strong className="text-lime-700 dark:text-lime-400 font-bold">{requiredPaddocksCircuit} potreros</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 3: SIEMBRA */}
      {calculator === 'seeding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Sprout className="h-5 w-5 text-emerald-600" />
              Densidad de Siembra & Requerimiento de Nitrógeno
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Distancia entre Surcos (cm)</Label>
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
                <Label className="text-xs">Peso de Mil Semillas (PMS en gramos)</Label>
                <Input
                  type="number"
                  value={thousandSeedWeightGrams}
                  onChange={e => setThousandSeedWeightGrams(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Meta de Nitrógeno Puro a Aportar (kg N / ha)</Label>
                <Input
                  type="number"
                  value={targetNitrogenKgHa}
                  onChange={e => setTargetNitrogenKgHa(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-emerald-600 bg-emerald-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300">Población Proyectada</span>
              <div>
                <div className="text-3xl font-black text-foreground">{expectedPlantsHa.toLocaleString()} <span className="text-sm font-bold text-muted-foreground">plantas/ha</span></div>
                <p className="text-xs text-muted-foreground mt-1">Densidad efectiva al {germinationPercent}% germinación</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kilos de semilla necesarios:</span>
                  <strong>{seedKgPerHa} kg/ha</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bultos de Urea 46% (50kg):</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{ureaBags50kgNeeded} bultos/ha</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 4: RENTABILIDAD */}
      {calculator === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Margen Bruto y Retorno de Inversión Agrícola (ROI)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Superficie Sembrada (Hectáreas)</Label>
                <Input
                  type="number"
                  value={cropHa}
                  onChange={e => setCropHa(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Rendimiento Esperado (t/ha)</Label>
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
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300">Resultado Económico</span>
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

      {/* CALCULADORA 6: DOSIS & RETIRO */}
      {calculator === 'dosage' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Syringe className="h-5 w-5 text-purple-600" />
              Dosificación Veterinaria & Período de Retiro Clínico
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Peso del Animal (kg)</Label>
                <Input
                  type="number"
                  value={dosageAnimalWeight}
                  onChange={e => setDosageAnimalWeight(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Dosis Recomendada por el Fabricante (mg / kg)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={doseMgPerKg}
                  onChange={e => setDoseMgPerKg(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Concentración del Fármaco (mg / mL)</Label>
                <Input
                  type="number"
                  value={drugConcentrationMgMl}
                  onChange={e => setDrugConcentrationMgMl(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Días de Retiro en Leche (0 si no aplica)</Label>
                <Input
                  type="number"
                  value={withdrawalMilkDays}
                  onChange={e => setWithdrawalMilkDays(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Días de Retiro en Carne / Faena</Label>
                <Input
                  type="number"
                  value={withdrawalMeatDays}
                  onChange={e => setWithdrawalMeatDays(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-purple-600 bg-purple-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-800 dark:text-purple-300">Volumen a Administrar</span>
              <div>
                <div className="text-4xl font-black text-purple-700 dark:text-purple-300">{volumeToInjectMl} <span className="text-lg font-bold text-muted-foreground">mL</span></div>
                <p className="text-xs text-muted-foreground mt-1">Dosis total: {totalMgRequired.toLocaleString()} mg de principio activo</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Puntos de inyección (máx 15 mL/sitio):</span>
                  <strong>{injectionSitesNeeded} punto(s)</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Período de retiro en leche:</span>
                  <strong className="text-red-600 font-bold">{withdrawalMilkDays} días</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Período de retiro en carne:</span>
                  <strong className="text-red-600 font-bold">{withdrawalMeatDays} días</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 7: CINTA BAROMÉTRICA */}
      {calculator === 'weight_tape' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Ruler className="h-5 w-5 text-blue-600" />
              Estimación de Peso Vivo por Cinta Barométrica (Sin Báscula)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Perímetro Torácico (PT en cm detrás de paletas)</Label>
                <Input
                  type="number"
                  value={heartGirthCm}
                  onChange={e => setHeartGirthCm(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Largo Corporal (LC en cm del hombro al isquion)</Label>
                <Input
                  type="number"
                  value={bodyLengthCm}
                  onChange={e => setBodyLengthCm(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Biotipo del Animal</Label>
                <select
                  value={cattleBiotype}
                  onChange={e => setCattleBiotype(e.target.value as 'BEEF' | 'DAIRY')}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="BEEF">Ganado de Carne / Doble Propósito (Cárnico)</option>
                  <option value="DAIRY">Ganado Lechero Especializado (Holstein/Jersey)</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Basado en la fórmula zootécnica de Quetelet-Crevat adaptada al trópico: <code className="font-mono text-foreground font-semibold">Peso = (PT² × LC) / K</code> con precisión zootécnica promedio de ±4%.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-blue-600 bg-blue-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-800 dark:text-blue-300">Peso Vivo Estimado</span>
              <div>
                <div className="text-4xl font-black text-blue-700 dark:text-blue-400">{estimatedWeightKg} <span className="text-lg font-bold text-muted-foreground">kg</span></div>
                <p className="text-xs text-muted-foreground mt-1">Rango estimado: {Math.round(estimatedWeightKg * 0.96)} a {Math.round(estimatedWeightKg * 1.04)} kg</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Perímetro Torácico:</span>
                  <strong>{heartGirthCm} cm</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Largo Corporal:</span>
                  <strong>{bodyLengthCm} cm</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 8: SILO BUNKER */}
      {calculator === 'silo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Warehouse className="h-5 w-5 text-amber-600" />
              Capacidad de Silo Bunker / Trinchera & Días de Reserva
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Largo del Silo (metros)</Label>
                <Input
                  type="number"
                  value={siloLengthM}
                  onChange={e => setSiloLengthM(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Altura Promedio del Ensilado (metros)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={siloHeightM}
                  onChange={e => setSiloHeightM(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Ancho Superior (metros)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={siloTopWidthM}
                  onChange={e => setSiloTopWidthM(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Ancho Inferior / Base (metros)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={siloBottomWidthM}
                  onChange={e => setSiloBottomWidthM(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Densidad de Compactación (kg/m³, típicamente 600-700)</Label>
                <Input
                  type="number"
                  value={siloDensityKgM3}
                  onChange={e => setSiloDensityKgM3(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Animales a Alimentar (cabezas)</Label>
                <Input
                  type="number"
                  value={animalsToFeed}
                  onChange={e => setAnimalsToFeed(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Ración Diaria por Animal (kg silo fresco / cabeza / día)</Label>
                <Input
                  type="number"
                  value={dailyRationKgHead}
                  onChange={e => setDailyRationKgHead(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-amber-600 bg-amber-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-800 dark:text-amber-300">Capacidad Total Forrajera</span>
              <div>
                <div className="text-4xl font-black text-foreground">{totalSilageTons} <span className="text-lg font-bold text-muted-foreground">Toneladas</span></div>
                <p className="text-xs text-muted-foreground mt-1">Volumen: {Math.round(siloVolumeM3)} m³ de forraje ensilado</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Consumo diario del hato:</span>
                  <strong>{dailyHerdConsumptionKg.toLocaleString()} kg / día</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Días de alimento asegurados:</span>
                  <strong className="text-amber-700 dark:text-amber-400 font-bold text-base">{daysOfFeedAvailable} días</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 9: INTERVALO ENTRE PARTOS */}
      {calculator === 'calving_interval' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <CalendarClock className="h-5 w-5 text-pink-600" />
              Intervalo Entre Partos (IEP) & Días Abiertos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Periodo Voluntario de Espera - PVE (Días)</Label>
                <Input
                  type="number"
                  value={voluntaryWaitPeriodDays}
                  onChange={e => setVoluntaryWaitPeriodDays(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Días Abiertos a la Concepción Confirmada (Días)</Label>
                <Input
                  type="number"
                  value={daysToConception}
                  onChange={e => setDaysToConception(Number(e.target.value))}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              El objetivo en ganado lechero y de carne es lograr 1 cría por vaca al año (IEP de 12 a 13 meses). Cada día abierto más allá de los 90 días genera pérdidas por retraso de lactancia y sobrecostos de mantenimiento.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-pink-600 bg-pink-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-pink-800 dark:text-pink-300">IEP Proyectado</span>
              <div>
                <div className="text-4xl font-black text-foreground">{projectedIepMonths} <span className="text-lg font-bold text-muted-foreground">meses</span></div>
                <p className="text-xs text-muted-foreground mt-1">{projectedIepDays} días totales entre partos</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Eficiencia reproductiva:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{reproductiveEfficiency}%</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Días abiertos en exceso:</span>
                  <strong className={excessOpenDays > 0 ? 'text-amber-600' : 'text-foreground'}>{excessOpenDays} días</strong>
                </div>
                {excessOpenDays > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Costo oportunidad estimado:</span>
                    <strong className="text-red-600 font-bold">${financialLossExcessOpen.toLocaleString()}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

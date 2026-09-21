/**
 * Pruebas unitarias y de integración para los nuevos módulos:
 * Agricultura, Cosechas, Maquinaria, Terrenos, Insumos y Comercio Agropecuario.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { serverlessRouter } from '../router';
import { db } from '../db';

describe('Módulos de Agricultura, Maquinaria, Terrenos y Comercio', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  it('lista cultivos precargados e inserta una nueva siembra', async () => {
    const cropsRes = await serverlessRouter.handle('GET', '/crops');
    expect(cropsRes.status).toBe(200);
    expect(cropsRes.data.length).toBeGreaterThanOrEqual(4);

    const plantingRes = await serverlessRouter.handle(
      'POST',
      '/plantings',
      {},
      {
        ranchId: 1,
        landId: 3,
        cropId: 1,
        cropName: 'Maíz Blanco Grano',
        variety: 'Pioneer P3992',
        plantingDate: '2026-09-01',
        expectedHarvestDate: '2027-01-15',
        areaHectares: 15.0,
        seedingRateKgHa: 24.0,
        seedCost: 32000,
        fertilizerCost: 50000,
        agrochemicalCost: 10000,
        laborCost: 15000,
        machineryCost: 14000
      }
    );

    expect(plantingRes.status).toBe(201);
    expect(plantingRes.data.variety).toBe('Pioneer P3992');
    expect(plantingRes.data.totalInvestment).toBe(121000);
  });

  it('registra una cosecha con cálculo automático de rendimiento t/ha e ingreso', async () => {
    const harvestRes = await serverlessRouter.handle(
      'POST',
      '/harvests',
      {},
      {
        ranchId: 1,
        plantingId: 1,
        landId: 3,
        cropName: 'Maíz Blanco',
        harvestDate: '2026-09-20',
        areaHectares: 10.0,
        totalYieldTons: 92.5,
        moisturePercentage: 14.0,
        grainQuality: 'PREMIUM',
        destination: 'DIRECT_SALE',
        salePricePerTon: 5300
      }
    );

    expect(harvestRes.status).toBe(201);
    expect(harvestRes.data.yieldPerHa).toBe(9.25);
    expect(harvestRes.data.totalRevenue).toBe(92.5 * 5300);

    // Verificar que la siembra se marcó como cosechada
    const planting = db.getById('plantings', 1);
    expect(planting?.status).toBe('HARVESTED');
    expect(planting?.progressPercentage).toBe(100);
  });

  it('gestiona maquinaria, registra mantenimiento preventivo y actualiza horómetro', async () => {
    const listRes = await serverlessRouter.handle('GET', '/machinery');
    expect(listRes.status).toBe(200);
    expect(listRes.data.length).toBeGreaterThanOrEqual(4);

    const tractor = listRes.data[0];

    // Registrar servicio preventivo
    const maintRes = await serverlessRouter.handle(
      'POST',
      `/machinery/${tractor.id}/maintenances`,
      {},
      {
        maintenanceDate: '2026-09-20',
        type: 'PREVENTIVE',
        hoursMeter: tractor.currentHoursMeter + 10,
        description: 'Cambio de aceite hidráulico y filtros',
        cost: 6500,
        performedBy: 'Taller Central'
      }
    );

    expect(maintRes.status).toBe(201);

    // Verificar que el horómetro del tractor y el próximo servicio se actualizaron
    const updatedTractor = db.getById('machinery', tractor.id);
    expect(updatedTractor?.nextServiceHours).toBe(tractor.currentHoursMeter + 10 + 250);
  });

  it('registra carga de combustible diesel y actualiza horómetro de equipo', async () => {
    const fuelRes = await serverlessRouter.handle(
      'POST',
      '/machinery/1/fuel',
      {},
      {
        loggedAt: '2026-09-20',
        liters: 150,
        costPerLiter: 24.50,
        hoursMeter: 2460,
        notes: 'Diesel para deshierbe'
      }
    );

    expect(fuelRes.status).toBe(201);
    expect(fuelRes.data.totalCost).toBe(150 * 24.50);

    const tractor = db.getById('machinery', 1);
    expect(tractor?.currentHoursMeter).toBe(2460);
  });

  it('permite rotar potreros de pastoreo Voisin con un solo clic', async () => {
    const potrero = db.getById('lands', 1);
    expect(potrero).toBeDefined();
    const initialStatus = potrero?.status;

    const rotateRes = await serverlessRouter.handle(
      'POST',
      '/lands/1/rotate',
      {},
      { animalCount: 20 }
    );

    expect(rotateRes.status).toBe(200);
    expect(rotateRes.data.status).toBe(initialStatus === 'ACTIVE' ? 'RESTING' : 'ACTIVE');
  });

  it('administra inventario de bodega y registra salidas de insumos', async () => {
    const supply = db.getById('supplies', 2); // Urea
    expect(supply).toBeDefined();
    const initialStock = supply!.currentStock;

    const moveRes = await serverlessRouter.handle(
      'POST',
      `/supplies/${supply!.id}/movements`,
      {},
      {
        movementDate: '2026-09-20',
        type: 'USAGE_CROP',
        quantity: 5,
        unitCost: 850,
        notes: 'Aplicación en maíz'
      }
    );

    expect(moveRes.status).toBe(201);
    const updatedSupply = db.getById('supplies', supply!.id);
    expect(updatedSupply?.currentStock).toBe(initialStock - 5);
  });

  it('registra transacciones de comercio agropecuario y calcula KPIs consolidados', async () => {
    const tradeRes = await serverlessRouter.handle(
      'POST',
      '/trades',
      {},
      {
        ranchId: 1,
        type: 'SALE_LIVESTOCK',
        tradeDate: '2026-09-20',
        entityName: 'Frigorífico Regional',
        description: 'Venta de 15 toretes engordados en corral',
        quantity: 7200,
        unit: 'KG_LIVE',
        unitPrice: 55.00,
        totalAmount: 396000,
        paymentStatus: 'PAID'
      }
    );

    expect(tradeRes.status).toBe(201);

    const kpisRes = await serverlessRouter.handle('GET', '/agronomy/kpis');

    expect(kpisRes.status).toBe(200);
    expect(kpisRes.data.activeCropsHectares).toBeGreaterThan(0);
    expect(kpisRes.data.totalLivestockSales).toBeGreaterThanOrEqual(396000);
    expect(kpisRes.data.machineryCount).toBeGreaterThan(0);
  });
});

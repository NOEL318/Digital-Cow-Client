import { describe, it, expect, beforeEach } from 'vitest';
import { serverlessRouter } from '../router';
import { db } from '../db';

describe('Serverless Router', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  describe('Auth', () => {
    it('handles login for existing and new users', async () => {
      const res = await serverlessRouter.handle('POST', '/auth/login', {}, { email: 'admin@digitalcow.local', password: 'secret' });
      expect(res.status).toBe(200);
      expect(res.data.accessToken).toBeDefined();
      expect(res.data.refreshToken).toBeDefined();
    });

    it('returns current user with me endpoint', async () => {
      const res = await serverlessRouter.handle('GET', '/auth/me');
      expect(res.status).toBe(200);
      expect(res.data.email).toBe('admin@digitalcow.local');
      expect(res.data.role).toBe('OWNER');
    });

    it('registers a new account and user', async () => {
      const res = await serverlessRouter.handle('POST', '/auth/register', {}, {
        accountName: 'Rancho Nuevo',
        fullName: 'Juan Perez',
        email: 'juan@test.com',
        password: 'password123',
        locale: 'es'
      });
      expect(res.status).toBe(200);
      expect(res.data.accessToken).toBeDefined();
    });
  });

  describe('Animals', () => {
    it('lists animals with pagination and filtering', async () => {
      db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-001',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      const res = await serverlessRouter.handle('GET', '/animals', { page: 0, size: 5, sex: 'FEMALE' });
      expect(res.status).toBe(200);
      expect(res.data.content.length).toBeLessThanOrEqual(5);
      expect(res.data.totalElements).toBeGreaterThan(0);
      for (const a of res.data.content) {
        expect(a.sex).toBe('FEMALE');
      }
    });

    it('creates an animal with purchase atomically', async () => {
      const initialExpenses = db.getAll('expenses').length;
      const res = await serverlessRouter.handle('POST', '/animals/with-purchase', {}, {
        animal: {
          ranchId: 1,
          internalTag: 'COMPRA-01',
          name: 'Vaca Comprada',
          sex: 'FEMALE',
          breedId: 1,
          purpose: 'DAIRY'
        },
        purchasePrice: 25000,
        seller: 'Ganadería La Luz',
        purchasedAt: '2026-09-20'
      });

      expect(res.status).toBe(201);
      expect(res.data.animal.internalTag).toBe('COMPRA-01');
      expect(res.data.expense).not.toBeNull();
      expect(res.data.expense.amount).toBe(25000);
      expect(db.getAll('expenses').length).toBe(initialExpenses + 1);
    });

    it('returns badges for animals', async () => {
      db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-001',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      const res = await serverlessRouter.handle('GET', '/animals/badges');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it('returns animal lactation status', async () => {
      const animal = db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-001',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      const res = await serverlessRouter.handle('GET', `/animals/${animal.id}/lactation`);
      expect(res.status).toBe(200);
      expect(res.data.animalId).toBe(animal.id);
      expect(res.data.daysInMilk).toBeDefined();
    });
  });

  describe('Health and Production', () => {
    it('creates individual and bulk vaccinations', async () => {
      const animal = db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-001',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      const resSingle = await serverlessRouter.handle('POST', '/health/vaccinations', {}, {
        animalId: animal.id,
        vaccineId: 1,
        appliedAt: '2026-09-20',
        doseMl: 2.0
      });
      expect(resSingle.status).toBe(201);
      expect(resSingle.data.animalId).toBe(animal.id);

      const resBulk = await serverlessRouter.handle('POST', '/health/vaccinations/bulk', {}, {
        lotId: 1,
        vaccineId: 2,
        appliedAt: '2026-09-20',
        costPerHead: 50
      });
      expect(resBulk.status).toBe(201);
      expect(Array.isArray(resBulk.data)).toBe(true);
    });

    it('records weighings and milkings', async () => {
      const animal = db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-001',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      const resW = await serverlessRouter.handle('POST', '/production/weighings', {}, {
        animalId: animal.id,
        weighedAt: '2026-09-20',
        weightKg: 620
      });
      expect(resW.status).toBe(201);
      expect(resW.data.weightKg).toBe(620);

      const resM = await serverlessRouter.handle('POST', '/production/milkings', {}, {
        animalId: animal.id,
        milkedAt: '2026-09-20T06:00:00.000Z',
        liters: 19.5,
        shift: 'MORNING'
      });
      expect(resM.status).toBe(201);
      expect(resM.data.liters).toBe(19.5);
    });
  });

  describe('Dashboard and Reports', () => {
    it('calculates dashboard summary accurately', async () => {
      db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-001',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      const res = await serverlessRouter.handle('GET', '/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.data.totals.totalAnimals).toBeGreaterThan(0);
      expect(res.data.totals.ranches).toBeGreaterThanOrEqual(1);
      expect(res.data.bySex).toBeDefined();
      expect(res.data.byBreed.length).toBeGreaterThan(0);
    });

    it('returns agenda items for today', async () => {
      const animal = db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-002',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      db.insert('treatments', {
        accountId: 1,
        animalId: animal.id,
        startedAt: '2026-09-20',
        notes: 'Curación pezuña',
        createdByUserId: 1
      });

      const res = await serverlessRouter.handle('GET', '/agenda/today');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it('returns inventory report', async () => {
      db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-001',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      const res = await serverlessRouter.handle('GET', '/reports/inventory');
      expect(res.status).toBe(200);
      expect(res.data.totalAnimals).toBeGreaterThan(0);
      expect(res.data.rows.length).toBeGreaterThan(0);
      expect(res.data.rows[0].internalTag).toBeDefined();
    });

    it('returns chronological animal life history report', async () => {
      const animal = db.insert('animals', {
        accountId: 1,
        ranchId: 1,
        internalTag: 'COW-001',
        sex: 'FEMALE',
        breedId: 1,
        purpose: 'DAIRY',
        status: 'ACTIVE'
      });
      db.insert('vaccinations', {
        accountId: 1,
        animalId: animal.id,
        vaccineId: 1,
        appliedAt: '2026-09-10',
        doseMl: 2.0,
        administeredByUserId: 1
      });
      db.insert('weighings', {
        accountId: 1,
        animalId: animal.id,
        weighedAt: '2026-09-12',
        weightKg: 550,
        recordedByUserId: 1
      });
      db.insert('milkings', {
        accountId: 1,
        animalId: animal.id,
        milkedAt: '2026-09-15',
        liters: 18.0,
        shift: 'MORNING'
      });

      const res = await serverlessRouter.handle('GET', `/reports/animal/${animal.id}`);
      expect(res.status).toBe(200);
      expect(res.data.animal.internalTag).toBe('COW-001');
      expect(res.data.vaccinations.length).toBeGreaterThan(0);
      expect(res.data.weighings.length).toBeGreaterThan(0);
      expect(res.data.milkings.length).toBeGreaterThan(0);
    });
  });
});

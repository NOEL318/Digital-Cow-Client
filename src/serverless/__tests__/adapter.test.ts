import { describe, it, expect, beforeEach } from 'vitest';
import { http } from '@/lib/http';
import { db } from '../db';
import { animalsApi } from '@/features/animals/api';
import { dashboardApi } from '@/features/dashboard/api';
import { breedsApi } from '@/features/breeds/api';

describe('Serverless Axios Adapter Integration', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  it('performs HTTP GET through animalsApi', async () => {
    db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'ADAPT-01',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE'
    });

    const page = await animalsApi.list({});
    expect(page).toBeDefined();
    expect(page.content.length).toBeGreaterThan(0);
    expect(page.totalElements).toBeGreaterThanOrEqual(1);
  });

  it('performs HTTP GET for a single animal', async () => {
    const created = db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'COW-001',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE'
    });

    const animal = await animalsApi.get(created.id);
    expect(animal).toBeDefined();
    expect(animal.id).toBe(created.id);
    expect(animal.internalTag).toBe('COW-001');
  });

  it('performs HTTP POST to create an animal', async () => {
    const created = await animalsApi.create({
      ranchId: 1,
      internalTag: 'NUEVA-01',
      name: 'Vaca Creada',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE',
      birthDateEstimated: false
    });
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.internalTag).toBe('NUEVA-01');

    const fetched = await animalsApi.get(created.id);
    expect(fetched.name).toBe('Vaca Creada');
  });

  it('performs HTTP PATCH to update an animal', async () => {
    const created = db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'PATCH-01',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE'
    });

    const updated = await animalsApi.update(created.id, { notes: 'Nota actualizada via http' });
    expect(updated.notes).toBe('Nota actualizada via http');
  });

  it('performs HTTP DELETE to remove an animal', async () => {
    const created = db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'DEL-01',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE'
    });

    await animalsApi.remove(created.id);
    const page = await animalsApi.list({});
    expect(page.content.find(a => a.id === created.id)).toBeUndefined();
  });

  it('fetches dashboard summary via dashboardApi', async () => {
    db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'DASH-01',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE'
    });

    const summary = await dashboardApi.summary();
    expect(summary).toBeDefined();
    expect(summary.totals.totalAnimals).toBeGreaterThan(0);
    expect(summary.byBreed.length).toBeGreaterThan(0);
  });

  it('fetches breeds catalog via breedsApi', async () => {
    const breeds = await breedsApi.list();
    expect(breeds.length).toBe(17);
    expect(breeds[0].code).toBe('HOLSTEIN');
  });

  it('fetches directly with http.get', async () => {
    const animal = db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'AGENDA-01',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE'
    });
    db.insert('treatments', {
      accountId: 1,
      animalId: animal.id,
      startedAt: '2026-09-20',
      notes: 'Tratamiento test'
    });

    const { data } = await http.get('/agenda/today');
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});

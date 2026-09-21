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
    const page = await animalsApi.list({});
    expect(page).toBeDefined();
    expect(page.content.length).toBeGreaterThan(0);
    expect(page.totalElements).toBeGreaterThanOrEqual(8);
  });

  it('performs HTTP GET for a single animal', async () => {
    const animal = await animalsApi.get(1);
    expect(animal).toBeDefined();
    expect(animal.id).toBe(1);
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
    const updated = await animalsApi.update(1, { notes: 'Nota actualizada via http' });
    expect(updated.notes).toBe('Nota actualizada via http');
  });

  it('performs HTTP DELETE to remove an animal', async () => {
    await animalsApi.remove(1);
    const page = await animalsApi.list({});
    expect(page.content.find(a => a.id === 1)).toBeUndefined();
  });

  it('fetches dashboard summary via dashboardApi', async () => {
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
    const { data } = await http.get('/agenda/today');
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});

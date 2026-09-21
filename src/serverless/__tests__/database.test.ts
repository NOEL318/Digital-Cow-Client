import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db';

describe('Serverless LocalDatabase', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  it('initializes with clean user state and full catalogs', () => {
    const animals = db.getAll('animals');
    expect(animals.length).toBe(0); // Clean initial user state

    const ranches = db.getAll('ranches');
    expect(ranches.length).toBeGreaterThanOrEqual(1);

    const breeds = db.getAll('breeds');
    expect(breeds.length).toBe(17);

    const vaccines = db.getAll('vaccines');
    expect(vaccines.length).toBe(9);
  });

  it('inserts and retrieves an animal', () => {
    const created = db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'TEST-999',
      name: 'Vaca Test',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE',
      createdByUserId: 1
    });

    expect(created.id).toBeDefined();
    expect(created.internalTag).toBe('TEST-999');

    const fetched = db.getById('animals', created.id);
    expect(fetched).not.toBeNull();
    expect(fetched.name).toBe('Vaca Test');
  });

  it('updates an animal', () => {
    const created = db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'TEST-UPD',
      name: 'Mariposa Original',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE',
      createdByUserId: 1
    });

    const updated = db.update('animals', created.id, { name: 'Mariposa Modificada' });
    expect(updated).not.toBeNull();
    expect(updated.name).toBe('Mariposa Modificada');

    const fetched = db.getById('animals', created.id);
    expect(fetched.name).toBe('Mariposa Modificada');
  });

  it('deletes an animal', () => {
    const created = db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'TEST-DEL',
      name: 'Para Eliminar',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE',
      createdByUserId: 1
    });

    const initialCount = db.getAll('animals').length;
    const ok = db.delete('animals', created.id);
    expect(ok).toBe(true);

    const afterCount = db.getAll('animals').length;
    expect(afterCount).toBe(initialCount - 1);
    expect(db.getById('animals', created.id)).toBeNull();
  });

  it('resets to seed data properly', () => {
    db.insert('animals', {
      accountId: 1,
      ranchId: 1,
      internalTag: 'TEMP-01',
      sex: 'FEMALE',
      breedId: 1,
      purpose: 'DAIRY',
      status: 'ACTIVE',
      createdByUserId: 1
    });
    db.resetToSeed();
    expect(db.filter('animals', a => a.internalTag === 'TEMP-01')).toHaveLength(0);
  });
});

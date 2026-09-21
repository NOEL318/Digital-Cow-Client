/**
 * Motor de persistencia en localStorage para la base de datos frontend de Digital Cow.
 * Mantiene un estado reactivo en memoria que sincroniza inmediatamente a localStorage.
 */
import type { ServerlessDatabase } from './types';
import { INITIAL_SEED_DATA } from './seedData';

const STORAGE_KEY = 'digitalcow_db_v3';

class LocalDatabase {
  private data: ServerlessDatabase;

  constructor() {
    this.data = this.load();
  }

  /** Carga la base de datos de localStorage o usa seedData si no existe */
  private load(): ServerlessDatabase {
    if (typeof window === 'undefined' || !window.localStorage) {
      return JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seed = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || parsed.version !== INITIAL_SEED_DATA.version) {
        const seed = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      // Combina con el seed por si hay tablas nuevas agregadas
      return {
        ...INITIAL_SEED_DATA,
        ...parsed
      };
    } catch {
      return JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    }
  }

  /** Guarda el estado actual en localStorage */
  private persist(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (err) {
        console.warn('[DigitalCow DB] Error persisting to localStorage:', err);
      }
    }
  }

  /** Restablece la base de datos a los datos iniciales */
  public resetToSeed(): ServerlessDatabase {
    this.data = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.persist();
    return this.data;
  }

  /** Obtiene la base de datos completa */
  public getSnapshot(): ServerlessDatabase {
    return this.data;
  }

  /** Obtiene todos los elementos de una coleccion */
  public getAll<K extends keyof Omit<ServerlessDatabase, 'version'>>(collection: K): ServerlessDatabase[K] {
    const list = this.data[collection] as any[];
    return (list ?? []) as ServerlessDatabase[K];
  }

  /** Busca un elemento por ID */
  public getById<K extends keyof Omit<ServerlessDatabase, 'version'>>(collection: K, id: number): any | null {
    const list = this.data[collection] as Array<{ id: number }>;
    return list.find(item => item.id === id) ?? null;
  }

  /** Inserta un elemento en una coleccion generando ID unico */
  public insert<K extends keyof Omit<ServerlessDatabase, 'version'>>(collection: K, item: any): any {
    const list = this.data[collection] as any[];
    const maxId = list.reduce((max, cur) => (cur.id && cur.id > max ? cur.id : max), 0);
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      id: item.id || maxId + 1,
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now
    };
    list.push(newItem);
    this.persist();
    return newItem;
  }

  /** Actualiza un elemento por ID */
  public update<K extends keyof Omit<ServerlessDatabase, 'version'>>(collection: K, id: number, patch: any): any | null {
    const list = this.data[collection] as any[];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const updated = {
      ...list[index],
      ...patch,
      id, // Preserve ID
      updatedAt: now
    };
    list[index] = updated;
    this.persist();
    return updated;
  }

  /** Elimina un elemento por ID */
  public delete<K extends keyof Omit<ServerlessDatabase, 'version'>>(collection: K, id: number): boolean {
    const list = this.data[collection] as any[];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    this.persist();
    return true;
  }

  /** Filtra una coleccion por predicado */
  public filter<K extends keyof Omit<ServerlessDatabase, 'version'>>(
    collection: K,
    predicate: (item: any) => boolean
  ): any[] {
    const list = this.data[collection] as any[];
    return (list ?? []).filter(predicate);
  }
}

export const db = new LocalDatabase();

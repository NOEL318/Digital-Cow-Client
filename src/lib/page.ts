/**
 * Helpers para normalizar respuestas paginadas de Spring Data.
 *
 * El backend usa `Page<T>` que se serializa como
 * `{ content: T[], totalElements, totalPages, number, size, ... }`.
 * Algunos endpoints devuelven `List<T>` directo. Estos helpers aceptan
 * ambos shapes para evitar romper la UI si el contrato cambia.
 */

/** Forma minima de un Spring Data Page<T>. */
export interface SpringPage<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
}

/**
 * Devuelve el array de elementos de una respuesta que puede ser
 * un array directo, un Page<T>, o undefined/null.
 */
export function toArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && Array.isArray((data as SpringPage<T>).content)) {
    return (data as SpringPage<T>).content;
  }
  return [];
}

/** Total de elementos. Para Page usa totalElements; para array usa length. */
export function toTotal(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === 'object') {
    const p = data as SpringPage<unknown>;
    if (typeof p.totalElements === 'number') return p.totalElements;
    if (Array.isArray(p.content)) return p.content.length;
  }
  return 0;
}

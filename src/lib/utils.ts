/**
 * Este archivo contiene utilidades pequenas reutilizables
 * para combinar clases de Tailwind sin conflictos.
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combina class names con tailwind-merge para resolver conflictos. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

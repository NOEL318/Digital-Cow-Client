/**
 * Este archivo centraliza los colores por sexo del animal para usarlos de forma
 * consistente en toda la app: hembra = rosa, macho = grafito (negro suave).
 */
import type { Sex } from './types';

export interface SexStyle {
  /** Clases para un badge (fondo + texto), claro y oscuro. */
  badge: string;
  /** Color de texto solido para acentos. */
  text: string;
  /** Anillo/borde de acento (p.ej. ring-2 en la foto). */
  ring: string;
  /** Borde de acento. */
  border: string;
  /** Fondo suave para encabezados/cards. */
  soft: string;
}

const FEMALE: SexStyle = {
  badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200',
  text: 'text-pink-600 dark:text-pink-300',
  ring: 'ring-pink-400 dark:ring-pink-500',
  border: 'border-pink-300 dark:border-pink-700',
  soft: 'bg-pink-50 dark:bg-pink-950/30'
};

const MALE: SexStyle = {
  badge: 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
  text: 'text-slate-800 dark:text-slate-200',
  ring: 'ring-slate-700 dark:ring-slate-300',
  border: 'border-slate-400 dark:border-slate-600',
  soft: 'bg-slate-100 dark:bg-slate-800/50'
};

/** Devuelve las clases de color para el sexo dado. */
export function sexStyle(sex: Sex): SexStyle {
  return sex === 'FEMALE' ? FEMALE : MALE;
}

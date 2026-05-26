/**
 * Este archivo inicializa i18next con backend HTTP y deteccion de idioma,
 * y expone helpers para normalizar las claves de error que vienen del backend.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    ns: ['common', 'auth', 'animals', 'dashboard', 'team', 'ranches', 'errors', 'health', 'catalog', 'alerts', 'reproduction', 'reproductionAlerts', 'production', 'feeding', 'finance', 'reports', 'wizard'],
    defaultNS: 'common',
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
    interpolation: { escapeValue: false }
  });

/**
 * Normaliza una clave de error i18n. El backend manda las claves con
 * notacion de punto incluyendo el namespace ("errors.auth.invalidCredentials"),
 * pero i18next espera el namespace separado por dos puntos
 * ("errors:auth.invalidCredentials"). Devuelve la clave tal cual si
 * ya viene en formato i18next.
 */
export function toI18nKey(raw: string): string {
  if (!raw) return raw;
  if (raw.includes(':')) return raw;
  const idx = raw.indexOf('.');
  return idx === -1 ? raw : `${raw.slice(0, idx)}:${raw.slice(idx + 1)}`;
}

export default i18n;

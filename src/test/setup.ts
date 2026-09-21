import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import authEs from '../../public/locales/es/auth.json';
import animalsEs from '../../public/locales/es/animals.json';
import commonEs from '../../public/locales/es/common.json';
import errorsEs from '../../public/locales/es/errors.json';
import dashboardEs from '../../public/locales/es/dashboard.json';

import authEn from '../../public/locales/en/auth.json';
import animalsEn from '../../public/locales/en/animals.json';
import commonEn from '../../public/locales/en/common.json';
import errorsEn from '../../public/locales/en/errors.json';
import dashboardEn from '../../public/locales/en/dashboard.json';

// Polyfill de localStorage para Node/JSDOM
if (typeof window !== 'undefined') {
  let store: Record<string, string> = {};
  const mockStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (idx: number) => Object.keys(store)[idx] ?? null,
    get length() {
      return Object.keys(store).length;
    }
  };
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    configurable: true,
    writable: true
  });
}

void i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'es',
  resources: {
    es: {
      auth: authEs,
      animals: animalsEs,
      common: commonEs,
      errors: errorsEs,
      dashboard: dashboardEs
    },
    en: {
      auth: authEn,
      animals: animalsEn,
      common: commonEn,
      errors: errorsEn,
      dashboard: dashboardEn
    }
  },
  interpolation: { escapeValue: false }
});

afterEach(() => cleanup());

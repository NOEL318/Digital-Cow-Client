/**
 * Este archivo configura el cliente axios compartido con
 * autenticacion automatica, refresh de tokens y cola offline para mutaciones.
 */
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { AuthStorage } from './auth-storage';
import { enqueue } from './offline-queue';

/** Cliente axios compartido. */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  timeout: 15000
});

// Request: anexa Authorization si hay token.
// El header ngrok-skip-browser-warning evita la pagina HTML interstitial que
// muestra ngrok free a peticiones de navegador (harmless si la URL no es ngrok).
http.interceptors.request.use(config => {
  const token = AuthStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['ngrok-skip-browser-warning'] = 'true';
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccess(): Promise<string | null> {
  const refresh = AuthStorage.getRefresh();
  if (!refresh) return null;
  try {
    const { data } = await axios.post(`${http.defaults.baseURL}/auth/refresh`, { refreshToken: refresh });
    AuthStorage.setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    AuthStorage.clear();
    return null;
  }
}

const MUTATING = new Set(['post', 'put', 'patch', 'delete']);

// Endpoints que validan credenciales o tokens: un 401 aqui significa
// "credenciales o token invalidos", NO "sesion expirada". No deben
// disparar refresh ni redirect, porque eso recarga la pagina y oculta
// el mensaje de error al usuario.
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/verify-email',
  '/auth/request-password-reset',
  '/auth/reset-password',
  '/admin/login'
];

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some(p => url.includes(p));
}

// Response: si 401 intenta refresh; si error de red en un POST/PATCH/DELETE,
// encola la operacion para reintentarse cuando vuelva la conexion.
http.interceptors.response.use(
  r => r,
  async (err: AxiosError) => {
    const original = err.config as AxiosRequestConfig & { _retried?: boolean; _queued?: boolean };

    // Caso 401: intentar refresh, excepto en endpoints de auth donde
    // el 401 es informativo (credenciales malas) y debe llegar al
    // formulario para mostrarse como toast.
    if (
      err.response?.status === 401
      && !original?._retried
      && !isAuthEndpoint(original?.url)
    ) {
      original._retried = true;
      if (!refreshing) refreshing = refreshAccess().finally(() => { refreshing = null; });
      const token = await refreshing;
      if (token) {
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
        return http.request(original);
      }
      AuthStorage.clear();
      // En lugar de hard reload se emite un evento personalizado para que el
      // componente raiz pueda navegar con react-router y conservar el estado
      // de toasts y query cache. Si nadie escucha el evento se hace un fallback
      // suave que solo cambia la URL si todavia no estamos en login.
      if (!window.location.pathname.endsWith('/login')) {
        const handled = window.dispatchEvent(new CustomEvent('auth:expired'));
        if (handled) {
          // El listener cuidara la navegacion via react-router.
        } else {
          window.location.assign('/login');
        }
      }
    }

    // Caso red caída en mutacion: encolar para reintentar luego.
    const isNetwork = err.response == null && err.code !== 'ERR_CANCELED';
    const method = (original?.method ?? '').toLowerCase();
    const baseURL = http.defaults.baseURL ?? '';
    if (isNetwork && original && !original._queued && MUTATING.has(method)) {
      original._queued = true;
      const fullUrl = original.url ?? '';
      const relative = fullUrl.startsWith('http')
        ? fullUrl.replace(baseURL, '')
        : fullUrl;
      enqueue({
        method: method.toUpperCase() as 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        url: relative,
        data: original.data
      });
    }
    return Promise.reject(err);
  }
);

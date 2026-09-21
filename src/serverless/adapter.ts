/**
 * Adaptador Axios para el motor serverless de Digital Cow.
 * Intercepta todas las llamadas realizadas via Axios / http y las canaliza
 * directamente al router y base de datos local en el navegador.
 */
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { serverlessRouter } from './router';

export async function serverlessAdapter(config: AxiosRequestConfig): Promise<AxiosResponse> {
  const method = (config.method || 'GET').toUpperCase();
  const rawUrl = config.url || '/';
  const query = config.params || {};

  let data = config.data;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      // Dejar como string si no es JSON
    }
  }

  // Pequeña latencia en navegador para una experiencia realista (0ms en vitest/node)
  const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
  if (!isTest) {
    await new Promise(res => setTimeout(res, 15));
  }

  const result = await serverlessRouter.handle(method, rawUrl, query, data, (config.headers as any) || {});

  if (result.status >= 200 && result.status < 300) {
    return {
      data: result.data,
      status: result.status,
      statusText: result.status === 201 ? 'Created' : result.status === 204 ? 'No Content' : 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      request: {}
    } as AxiosResponse;
  }

  // Si fue un código de error HTTP
  const error = new AxiosError(
    result.error?.message || `Request failed with status code ${result.status}`,
    `ERR_BAD_REQUEST`,
    config as any,
    {},
    {
      data: result.data || { error: result.error },
      status: result.status,
      statusText: 'Error',
      headers: {},
      config: config as any
    } as any
  );
  return Promise.reject(error);
}

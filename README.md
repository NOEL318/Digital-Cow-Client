# Digital Cow Frontend

SPA y PWA escrita en React 18 con Vite. Es la cara visible de Digital Cow para el ranchero: registro, login, animales, salud, reproduccion, alimentacion, produccion, dinero, reportes y captura rapida via wizards. Se despliega en Vercel y consume la API publica del backend.

## Tabla de contenidos

1. Que hace este frontend
2. Stack tecnico
3. Estructura del codigo
4. Sistema de rutas
5. Navegacion y layout
6. Internacionalizacion (i18n)
7. Cliente HTTP y autenticacion
8. PWA, offline y push
9. Subida de fotos (Cloudinary firmado)
10. Mapas, escaneo de codigos y graficas
11. Tema claro, oscuro y accesibilidad
12. Como correrlo en local
13. Como ejecutar tests y lint
14. Build de produccion y deploy en Vercel
15. Variables de entorno
16. Solucion de problemas

---

## 1. Que hace este frontend

Provee la interfaz para todas las operaciones que sostienen una explotacion ganadera:

- **Inicio:** KPIs del dia y alertas activas.
- **Animales:** catalogo en lista o tarjetas con foto y filtros, ficha individual con genealogia, eventos y ROI.
- **Hacer una nota:** wizards de captura rapida (vacunar, pesar, ordenar, alimentar, gastar, recibir dinero, diagnosticar, tratar, registrar celo, servir, prenez, parto, secar, destete, aborto, comprar animal).
- **Panel:** sub paginas Salud, Alimentacion, Dinero, Reproduccion, Produccion y Reportes con sus listados y graficos.
- **Ajustes:** perfil, cuenta, ranchos, equipo, categorias financieras, catalogo de medicamentos, idioma y tema.

Es PWA instalable. Funciona offline para lecturas en cache y encola mutaciones cuando no hay red.

## 2. Stack tecnico

| Componente | Version | Uso |
|------------|---------|------|
| React | 18.3 | UI |
| Vite | 5.4 | Build y dev server |
| TypeScript | 5.6 | Tipado |
| Tailwind CSS | 3.4 | Estilos |
| shadcn/ui + Radix | varias | Componentes accesibles (Dialog, Dropdown, Tabs, Toast, Select, Label) |
| TanStack Query | 5.59 | Data fetching y cache |
| TanStack Table | 8.20 | Tablas |
| React Router | 6.26 | Rutas |
| React Hook Form + Zod | 7.53 + 3.23 | Formularios y validacion |
| i18next + react-i18next | 23 + 15 | Internacionalizacion (es, en) |
| Axios | 1.7 | Cliente HTTP |
| Recharts | 2.13 | Graficas |
| Leaflet + React Leaflet | 1.9 + 4.2 | Mapas de ranchos y lotes |
| zxing | 0.22 | Escaneo de codigos de barras de medicamentos |
| browser-image-compression | 2.0 | Comprimir fotos en el navegador antes de subir |
| qrcode.react | 4.2 | Generar QR de animales |
| papaparse | 5.5 | Importacion CSV |
| Vite PWA plugin | 0.20 | Service worker y manifest |
| Vitest + Testing Library | 2.1 + 16 | Tests unitarios |
| MSW | 2.4 | Mock del backend en tests |

## 3. Estructura del codigo

Carpeta principal: `src/`.

```
main.tsx                Bootstrap de React y carga de i18n.
app/                    Composicion de la app.
  router.tsx            Rutas y redirects.
  providers.tsx         QueryClient, ThemeProvider, Toaster.
  theme.tsx             Contexto de tema claro/oscuro.
  AnimalIdRedirect.tsx  Redirect compatibilidad con URLs viejas /animals/:id.
components/             Componentes reutilizables del shell.
  app-shell.tsx         Layout principal con sidebar y topbar.
  bottom-nav.tsx        Barra inferior mobile con cinco destinos.
  desktop-sidebar.tsx   Sidebar lateral en escritorio.
  protected-route.tsx   Guard que exige autenticacion.
  role-gate.tsx         Guard que exige rol especifico.
  user-menu.tsx         Menu del usuario en topbar.
  language-switcher.tsx Selector de idioma.
  theme-toggle.tsx      Toggle claro/oscuro.
  offline-indicator.tsx Indica al usuario cuando esta sin red.
  ranch-map.tsx         Mapa Leaflet con lotes.
  comparison-chart.tsx  Grafica de comparacion entre animales.
  ui/                   Componentes base derivados de shadcn.
features/               Modulos de negocio. Cada uno trae componentes, hooks, API y tipos.
  auth/                 Login, registro, reset, verificacion, invitaciones.
  admin/                Panel administrativo para super-admin.
  animals/              Lista, ficha, badges, comparacion, compras.
  ranches/              Ranchos y lotes con mapa.
  team/                 Miembros del equipo y roles.
  breeds/               Catalogo de razas.
  catalog/              Vacunas, enfermedades, medicamentos, plagas.
  health/               Vacunaciones, diagnosticos, tratamientos, planes, visitas vet, alertas.
  reproduction/         Eventos reproductivos, semen, toros, alertas.
  production/           Pesajes, ordeños, muestras, tanque, sacrificio, KPIs, curvas.
  feeding/              Items, planes, registros, costo por unidad.
  finance/              Ingresos, gastos, ventas, P&L, ROI, categorias.
  reports/              Reportes consolidados.
  dashboard/            KPIs del inicio.
  agenda/               Calendario de actividades.
  wizard/               Wizards de captura rapida para Hacer una nota.
  csv-import/           Importacion masiva.
  lot-conditions/       Estado diario de un corral.
pages/                  Rutas top level. Cada pagina compone uno o varios features.
  inicio/               Pantalla principal.
  animales/             Listado, detalle, edicion, version imprimible.
  panel/                Indice y sub paneles por dominio.
  ajustes/              Configuracion del tenant y la cuenta.
  hacer-nota/           Lanzador de wizards.
  health/, finance/, reproduction/, production/, feeding/, reports/  Paginas internas usadas por el panel.
  ranches/, team/, settings/, auth/, admin/, dashboard/, AppLayout.tsx
lib/                    Helpers compartidos:
  http.ts               Cliente axios con interceptores de auth y reintento.
  auth-storage.ts       Persistencia de tokens en localStorage.
  i18n.ts               Configuracion de i18next.
  offline.ts            Estado de red.
  offline-queue.ts      Cola persistente de mutaciones offline.
  push-notifications.ts Suscripcion a notificaciones push.
  use-voice.ts          Hook de reconocimiento de voz para captura.
  csv.ts                Parsing y validacion de CSV.
  catalog.ts            Selectores de catalogos compartidos.
  utils.ts              Mezcla de utilidades pequenas.
  page.ts               Tipos comunes de paginacion.
public/                 Recursos estaticos y archivos PWA.
  locales/es/*.json     Traducciones espanol por namespace.
  locales/en/*.json     Traducciones ingles por namespace.
  manifest.webmanifest  Manifest PWA.
  icons/                Iconos para instalacion.
test/                   Setup y mocks de Vitest y MSW.
```

## 4. Sistema de rutas

Las rutas estan definidas en `src/app/router.tsx`. La estructura es:

- Publicas: `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/accept-invitation`, `/admin/login`.
- Protegidas: todas las demas pasan por `ProtectedRoute` que verifica el JWT en `AuthStorage`.
- Fase 6: cinco destinos principales en espanol: `/inicio`, `/animales`, `/hacer-nota`, `/panel`, `/ajustes`.
- Compatibilidad: las rutas en ingles antiguas (`/dashboard`, `/animals`, `/health`, etc.) redirigen via `<Navigate replace>` para no romper bookmarks.
- Catch all: `*` muestra un placeholder 404.

## 5. Navegacion y layout

`AppLayout` envuelve las rutas protegidas. Combina:

- Topbar con titulo dinamico, selector de idioma, toggle de tema y menu de usuario.
- Sidebar fijo en escritorio (`desktop-sidebar`).
- Bottom nav en mobile con cinco accesos (`bottom-nav`).
- Indicador de offline cuando se pierde red.

Las paginas leen el tenant y los roles del contexto de autenticacion. `RoleGate` esconde acciones para roles que no las tienen.

## 6. Internacionalizacion (i18n)

`src/lib/i18n.ts` arranca i18next con backend HTTP que carga JSON desde `public/locales/{lng}/{ns}.json`. El idioma se detecta de localStorage o del navegador. Los namespaces disponibles son:

`alerts`, `animals`, `auth`, `catalog`, `common`, `dashboard`, `errors`, `feeding`, `finance`, `health`, `production`, `ranches`, `reports`, `reproduction`, `reproductionAlerts`, `team`.

Patron de uso en componentes:

```ts
const { t } = useTranslation('animals');
return <h1>{t('list.title')}</h1>;
```

Errores remotos llegan con clave i18n y se resuelven via `toI18nKey` para mantener la separacion namespace:clave.

Idiomas soportados: espanol (default) e ingles. Los JSON de ambos idiomas tienen las mismas keys verificado al momento de escribir esta documentacion.

## 7. Cliente HTTP y autenticacion

`src/lib/http.ts` exporta `http`, un axios con:

- BaseURL `VITE_API_URL` o `/api/v1` cuando se sirve detras del mismo dominio.
- Interceptor que anexa `Authorization: Bearer <access>` cuando hay token en `AuthStorage`.
- Interceptor de respuesta que ante un 401 fuera de endpoints de auth intenta refresh con el refresh token, reintenta la peticion original y, si falla, limpia tokens y redirige a `/login`.
- Mutaciones offline (POST, PUT, PATCH, DELETE) sin red se encolan en `offline-queue` para reintentarse cuando vuelve la conexion.

Endpoints de auth (`/auth/login`, `/auth/refresh`, etc.) se identifican explicitamente para que un 401 ahi se muestre al formulario sin disparar refresh ni redirect.

## 8. PWA, offline y push

El plugin `vite-plugin-pwa` registra un service worker que cachea el shell, los iconos, las traducciones y los recursos del CDN. La cola `offline-queue` persiste en IndexedDB mutaciones que se hicieron sin red y las re envia cuando vuelve.

`push-notifications.ts` provee suscripcion al servidor de notificaciones del navegador. Es opcional para el usuario.

## 9. Subida de fotos (Cloudinary firmado)

Las fotos se comprimen en el navegador con `browser-image-compression` y se suben directamente a Cloudinary usando una firma generada por el backend en `POST /api/v1/photos/signature`. El frontend nunca toca el secret de Cloudinary.

## 10. Mapas, escaneo de codigos y graficas

- **Mapas:** `react-leaflet` muestra el rancho con sus lotes como poligonos. El componente esta en `components/ranch-map.tsx`.
- **Escaneo de codigos de barras:** wizard de catalogo de medicamentos usa `@zxing/browser` para leer codigos con la camara y autocompletar el formulario.
- **Graficas:** Recharts dibuja curvas de produccion, lactancia, crecimiento, P&L y comparativas entre animales.

## 11. Tema claro, oscuro y accesibilidad

`ThemeProvider` aplica `dark` en el documento segun la preferencia guardada o el sistema. Componentes Radix garantizan navegacion por teclado y atributos ARIA. Las tipografias se escalan en mobile y se priorizan iconos grandes para usuarios con baja alfabetizacion.

## 12. Como correrlo en local

Requisitos: Node 20+, npm.

```
cp ../.env.example ../.env
cd frontend
npm install
npm run dev
```

La app queda en http://localhost:5173. El proxy de Vite redirige `/api` al backend en localhost:8080. Si el backend corre en otra URL, definir `VITE_API_URL` en `.env.development`.

## 13. Como ejecutar tests y lint

```
npm test           # tests unitarios con Vitest
npm run test:watch # tests en modo watch
npm run lint       # ESLint
npm run typecheck  # tsc -b en modo solo verificacion
```

Los tests usan jsdom + MSW para mockear el backend.

## 14. Build de produccion y deploy en Vercel

```
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente
```

En Vercel:

1. Root directory: `frontend`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Variable de entorno: `VITE_API_URL=https://api.tu-dominio.com/api/v1`.

`vercel.json` define rewrites para SPA y cabeceras de cache.

## 15. Variables de entorno

| Variable | Cuando se usa | Ejemplo |
|----------|---------------|---------|
| VITE_API_URL | Build, apunta al backend publico | https://api.tu-dominio.com/api/v1 |

En dev local con proxy de Vite la variable es opcional. En produccion se define en el panel de Vercel.

## 16. Solucion de problemas

- **Pantalla blanca tras login:** revisar la consola; suele ser un crash en una pagina o un error 500 del backend. Verificar el toast y `Network`.
- **CORS error:** anadir el origen del frontend al `CORS_ALLOWED_ORIGINS` del backend y reiniciar.
- **Traducciones no cargan:** verificar que `public/locales/<lng>/<ns>.json` exista. En dev se sirven directamente desde public.
- **PWA no se instala:** revisar `manifest.webmanifest`, iconos en `public/icons/` y que la pagina se sirva por HTTPS.
- **Fotos no suben:** verificar firma del backend y limites de Cloudinary.
- **401 en bucle:** indicio de refresh token revocado; limpiar localStorage e iniciar sesion otra vez.

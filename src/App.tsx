/**
 * Este archivo es el punto de entrada del arbol React.
 * Envuelve el router de la aplicacion dentro de todos los providers globales.
 */
import { Providers } from './app/providers';
import { AppRouter } from './app/router';

/** Componente raiz. */
export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

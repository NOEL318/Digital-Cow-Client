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

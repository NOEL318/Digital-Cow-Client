/**
 * Este archivo define un componente que redirige rutas antiguas de animales
 * reemplazando el placeholder ":id" por el valor real del parametro de la URL.
 */
import { Navigate, useParams } from 'react-router-dom';

interface Props {
  /** Plantilla destino con el placeholder ":id" que se reemplaza por el parametro real. */
  to: string;
}

/**
 * react-router v6 NO interpola parametros en el atributo `to`
 * de `Navigate`. Este wrapper toma el `:id` actual y construye
 * el destino real antes de redirigir. Sin esto, los redirects
 * viejos como /animals/:id → /animales/:id terminan llevando
 * literalmente a /animales/:id y rompen al parsear el id (NaN).
 */
export function AnimalIdRedirect({ to }: Props) {
  const { id } = useParams<{ id: string }>();
  const target = id ? to.replace(':id', id) : '/animales';
  return <Navigate to={target} replace />;
}

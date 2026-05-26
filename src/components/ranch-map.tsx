/**
 * Este archivo dibuja un mapa con los ranchos geolocalizados
 * y muestra cuantos animales activos hay en cada uno.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { ranchApi } from '@/features/ranches/api';
import { EmptyState } from '@/components/ui/empty-state';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Marker icon configurado a mano para evitar el problema de bundling
// de los iconos por defecto de Leaflet con Vite.
const ranchIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

/**
 * Este componente dibuja un mapa con los ranchos geolocalizados y permite
 * navegar a la lista de animales de cada rancho. Si ningun rancho tiene
 * coordenadas, muestra un estado vacio con un acceso a la configuracion.
 *
 * Nota de rendimiento: el conteo de animales se ha quitado para evitar
 * traer todo el catalogo al abrir el mapa. La cuenta exacta se ve al
 * navegar al listado filtrado del rancho.
 */
export function RanchMap() {
  const { t } = useTranslation('common');
  const ranches = useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });

  const geolocated = useMemo(
    () => (ranches.data ?? []).filter(r => r.latitude != null && r.longitude != null),
    [ranches.data]
  );

  if (ranches.isLoading) {
    return <p className="py-8 text-center text-muted-foreground">{t('map.loading')}</p>;
  }

  if (geolocated.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title={t('map.noRanchesTitle')}
        description={t('map.noRanchesDesc')}
        ctaLabel={t('map.goToRanches')}
        onCta={() => window.location.assign('/ajustes/ranchos')}
      />
    );
  }

  const center: [number, number] = [
    Number(geolocated[0].latitude),
    Number(geolocated[0].longitude)
  ];

  return (
    <div className="h-[500px] rounded-2xl overflow-hidden border">
      <MapContainer center={center} zoom={6} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geolocated.map(r => (
          <Marker
            key={r.id}
            position={[Number(r.latitude), Number(r.longitude)]}
            icon={ranchIcon}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{r.name}</p>
                {r.location ? <p className="text-xs text-muted-foreground">{r.location}</p> : null}
                <Link
                  to={`/animales?ranchId=${r.id}`}
                  className="text-primary text-sm underline"
                >
                  {t('map.viewAnimals')}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

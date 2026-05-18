import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { ranchApi } from '@/features/ranches/api';
import { animalsApi } from '@/features/animals/api';
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

interface RanchAnimalCount {
  ranchId: number;
  count: number;
}

/**
 * Mapa de ranchos con un pin por cada rancho geolocalizado. El popup
 * muestra el nombre, conteo de animales activos y enlace a la lista
 * filtrada. Si ningun rancho tiene coordenadas, muestra un estado vacio
 * con un CTA a la configuracion del rancho.
 */
export function RanchMap() {
  const ranches = useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });
  const animalsAll = useQuery({
    queryKey: ['animals', { size: 999 }],
    queryFn: () => animalsApi.list({ size: 999 })
  });

  const geolocated = useMemo(
    () => (ranches.data ?? []).filter(r => r.latitude != null && r.longitude != null),
    [ranches.data]
  );

  const counts: RanchAnimalCount[] = useMemo(() => {
    const all = animalsAll.data?.content ?? [];
    const map = new Map<number, number>();
    for (const a of all) {
      const item = a as unknown as { lotId?: number | null; ranchId?: number };
      const rid = item.ranchId;
      if (typeof rid !== 'number') continue;
      map.set(rid, (map.get(rid) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([ranchId, count]) => ({ ranchId, count }));
  }, [animalsAll.data]);

  if (ranches.isLoading) {
    return <p className="py-8 text-center text-muted-foreground">Cargando mapa...</p>;
  }

  if (geolocated.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="Aun no tienes ranchos en el mapa"
        description="Pon la ubicacion (latitud y longitud) de cada rancho en Ajustes para verlos aqui."
        ctaLabel="Ir a ranchos"
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
        {geolocated.map(r => {
          const count = counts.find(c => c.ranchId === r.id)?.count ?? 0;
          return (
            <Marker
              key={r.id}
              position={[Number(r.latitude), Number(r.longitude)]}
              icon={ranchIcon}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{r.name}</p>
                  {r.location ? <p className="text-xs text-muted-foreground">{r.location}</p> : null}
                  <p className="text-sm">{count} animales</p>
                  <Link
                    to={`/animales?ranchId=${r.id}`}
                    className="text-primary text-sm underline"
                  >
                    Ver animales aqui
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

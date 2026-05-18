import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { Icon, type LatLngExpression } from 'leaflet';
import { MapPin, Undo2, X, CheckCircle2 } from 'lucide-react';
import { BigButton } from '@/components/ui/big-button';
import 'leaflet/dist/leaflet.css';

const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface LotPolygonPickerProps {
  /** JSON inicial del poligono: "[[lat,lng],...]". */
  initialPolygon?: string | null;
  initialCenter?: { lat: number; lng: number } | null;
  /** Callback: serialized polygon (string) and computed center (lat/lng). */
  onChange: (polygon: string | null, center: { lat: number; lng: number } | null) => void;
}

function centroid(points: Array<[number, number]>): { lat: number; lng: number } | null {
  if (points.length === 0) return null;
  const lat = points.reduce((a, p) => a + p[0], 0) / points.length;
  const lng = points.reduce((a, p) => a + p[1], 0) / points.length;
  return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
}

/**
 * Editor de polígono del lote. El usuario hace clic en el mapa para
 * agregar puntos. Tres o más puntos dibujan un poligono cerrado.
 * Botones para deshacer el último punto o borrar todo. El centroide
 * se calcula automáticamente y se devuelve junto al poligono.
 */
export function LotPolygonPicker({ initialPolygon, initialCenter, onChange }: LotPolygonPickerProps) {
  const initialPoints = parseInitial(initialPolygon);
  const [points, setPoints] = useState<Array<[number, number]>>(initialPoints);
  const center: LatLngExpression =
    initialCenter ? [initialCenter.lat, initialCenter.lng]
    : initialPoints.length > 0 ? initialPoints[0]
    : [19.4326, -99.1332];

  useEffect(() => {
    if (points.length === 0) {
      onChange(null, initialCenter ?? null);
      return;
    }
    const c = centroid(points);
    if (points.length < 3) {
      // Solo se guarda el centro (marker) cuando hay 1 o 2 puntos.
      onChange(null, c);
    } else {
      onChange(JSON.stringify(points), c);
    }
  }, [points, onChange, initialCenter]);

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
        <MapPin className="h-4 w-4" aria-hidden />
        Toca el mapa para marcar las esquinas del corral. Con tres o más puntos se dibuja el polígono.
      </p>
      <div className="h-72 rounded-xl overflow-hidden border">
        <MapContainer center={center} zoom={initialPoints.length > 0 ? 16 : 5} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onAdd={p => setPoints(prev => [...prev, p])} />
          {points.length >= 3 ? (
            <Polygon positions={points} pathOptions={{ color: '#0f766e', fillOpacity: 0.2 }} />
          ) : null}
          {points.map((p, i) => <Marker key={i} position={p} icon={markerIcon} />)}
          {initialPoints.length > 0 ? <Recenter lat={initialPoints[0][0]} lng={initialPoints[0][1]} /> : null}
        </MapContainer>
      </div>
      <div className="flex flex-wrap gap-2">
        <BigButton
          label="Quitar último"
          icon={Undo2}
          variant="outline"
          onClick={() => setPoints(prev => prev.slice(0, -1))}
          disabled={points.length === 0}
        />
        <BigButton
          label="Borrar todo"
          icon={X}
          variant="outline"
          onClick={() => setPoints([])}
          disabled={points.length === 0}
        />
        {points.length >= 3 ? (
          <span className="inline-flex items-center gap-1 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Polígono listo ({points.length} esquinas)
          </span>
        ) : points.length > 0 ? (
          <span className="text-sm text-muted-foreground">{points.length} de 3 esquinas mínimas</span>
        ) : null}
      </div>
    </div>
  );
}

function parseInitial(json: string | null | undefined): Array<[number, number]> {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr) && arr.every(p => Array.isArray(p) && p.length === 2)) {
      return arr as Array<[number, number]>;
    }
  } catch {
    return [];
  }
  return [];
}

function ClickHandler({ onAdd }: { onAdd: (p: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onAdd([Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6))]);
    }
  });
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 15));
  }, [map, lat, lng]);
  return null;
}

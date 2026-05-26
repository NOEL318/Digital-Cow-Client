/**
 * Este componente es un selector visual del modulo ranches.
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon, type LatLngExpression } from 'leaflet';
import { MapPin, Crosshair } from 'lucide-react';
import { BigButton } from '@/components/ui/big-button';
import 'leaflet/dist/leaflet.css';

const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface RanchLocationPickerProps {
  /** Lat/lng iniciales (opcional). */
  initial?: { lat: number; lng: number } | null;
  /** Callback al cambiar la ubicacion. */
  onChange: (loc: { lat: number; lng: number }) => void;
}

/**
 * Selector de ubicacion en mapa. El usuario toca el mapa para colocar
 * el pin del rancho, o usa "Usar mi ubicacion" para autollenar con la
 * geolocalizacion del navegador. Devuelve lat/lng al onChange.
 */
export function RanchLocationPicker({ initial, onChange }: RanchLocationPickerProps) {
  const { t } = useTranslation('ranches');
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(initial ?? null);
  const center: LatLngExpression = useMemo(
    () => (pos ? [pos.lat, pos.lng] : [19.4326, -99.1332]), // CDMX por defecto
    [pos]
  );

  function pick(lat: number, lng: number) {
    const next = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
    setPos(next);
    onChange(next);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      window.alert(t('geoUnsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      p => pick(p.coords.latitude, p.coords.longitude),
      err => window.alert(t('geoFailed', { error: err.message })),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
          <MapPin className="h-4 w-4" aria-hidden />
          {t('mapTapHint')}
        </p>
        <BigButton
          label={t('useMyLocation')}
          icon={Crosshair}
          variant="outline"
          onClick={useMyLocation}
        />
      </div>
      <div className="h-72 rounded-xl overflow-hidden border">
        <MapContainer center={center} zoom={pos ? 14 : 5} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={pick} />
          {pos ? (
            <>
              <Marker position={[pos.lat, pos.lng]} icon={markerIcon} />
              <RecenterMap lat={pos.lat} lng={pos.lng} />
            </>
          ) : null}
        </MapContainer>
      </div>
      {pos ? (
        <p className="text-xs text-muted-foreground">
          Coordenadas: {pos.lat}, {pos.lng}
        </p>
      ) : null}
    </div>
  );
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], Math.max(map.getZoom(), 13));
  return null;
}

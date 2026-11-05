'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, Loader2, ArrowLeft } from 'lucide-react';

/* ─────────────────── data ─────────────────── */

const clinics = [
  { id: 'monterrey', label: 'Clínica Monterrey', address: 'Monterrey, Nuevo León', phone: '81 8000 0001', lat: 25.6816, lng: -100.3111 },
  { id: 'cdmx', label: 'Clínica CDMX', address: 'Ciudad de México, CDMX', phone: '55 5000 0002', lat: 19.4326, lng: -99.1332 },
  { id: 'guadalajara', label: 'Clínica Guadalajara', address: 'Guadalajara, Jalisco', phone: '33 3000 0003', lat: 20.6597, lng: -103.3496 },
];

const PIN_HTML =
  '<div style="width:28px;height:28px;background:#2563eb;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>';

function makeIcon() {
  return L.divIcon({ className: '', html: PIN_HTML, iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -32] });
}

function FlyTo({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], zoom, { duration: 1.2 }); }, [lat, lng, zoom, map]);
  return null;
}

/* Inner component that exposes map instance to parent via callback */
function MapRef({ onMap }: { onMap: (m: L.Map) => void }) {
  const map = useMap();
  useEffect(() => { onMap(map); }, [map, onMap]);
  return null;
}

/* ─────────────────── component ─────────────────── */

type LatLng = { lat: number; lng: number; zoom: number } | null;

const btnStyle: React.CSSProperties = {
  width: 34, height: 34, background: 'white', border: 'none',
  borderBottom: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 18, color: '#374151',
};

export default function ClinicMap({ onBack }: { onBack?: () => void }) {
  const [selected, setSelected] = useState<typeof clinics[0] | null>(null);
  const [icon, setIcon] = useState<L.DivIcon | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => { setIcon(makeIcon()); }, []);

  useEffect(() => {
    const setFromIP = () =>
      fetch('https://ipapi.co/json/')
        .then((r) => r.json())
        .then((d) => { if (d.latitude && d.longitude) setUserLocation({ lat: d.latitude, lng: d.longitude, zoom: 11 }); })
        .catch(() => {});

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 13 }),
        setFromIP,
        { timeout: 6000 }
      );
    } else {
      setFromIP();
    }
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation || !mapInstance) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstance.flyTo([pos.coords.latitude, pos.coords.longitude], 13, { duration: 1.2 });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }, [mapInstance]);

  const flyTarget = selected ? { lat: selected.lat, lng: selected.lng, zoom: 13 } : userLocation;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {icon && (
        <MapContainer
          center={[23.6345, -102.5528]}
          zoom={5}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} zoom={flyTarget.zoom} />}
          <MapRef onMap={setMapInstance} />
          {clinics.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={icon} eventHandlers={{ click: () => setSelected(c) }}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>🏥 {c.label}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>📍 {c.address}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>📞 {c.phone}</p>
                  <a href="/dashboard" style={{ display: 'block', textAlign: 'center', fontSize: 12, background: '#2563eb', color: 'white', borderRadius: 6, padding: '5px 10px', textDecoration: 'none' }}>
                    Agendar cita
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* Overlay controls — rendered outside Leaflet, no stacking issues */}
      {mapInstance && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1000,
          display: 'flex', flexDirection: 'column',
          background: 'white', border: '2px solid rgba(0,0,0,0.2)',
          borderRadius: 6, boxShadow: '0 1px 5px rgba(0,0,0,0.25)', overflow: 'hidden',
        }}>
          {onBack && (
            <button type="button" onClick={onBack} title="Volver" style={btnStyle}>
              <ArrowLeft size={16} />
            </button>
          )}
          {onBack && <div style={{ height: 1, background: 'rgba(0,0,0,0.12)' }} />}
          <button type="button" onClick={() => mapInstance.zoomIn()} title="Acercar" style={btnStyle}>+</button>
          <button type="button" onClick={() => mapInstance.zoomOut()} title="Alejar" style={{ ...btnStyle, borderBottom: 'none' }}>−</button>
          <div style={{ height: 1, background: 'rgba(0,0,0,0.12)' }} />
          <button type="button" onClick={locate} title="Mi ubicación" style={{ ...btnStyle, borderBottom: 'none' }}>
            {locating
              ? <Loader2 size={16} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
              : <LocateFixed size={16} color="#2563eb" />}
          </button>
        </div>
      )}
    </div>
  );
}

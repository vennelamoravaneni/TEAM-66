import React, { useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { ProcessedHospital, AppContext } from '../types';
import L from 'leaflet';

// Fix for default Leaflet icon issues
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (status: string, isHovered: boolean) => {
  let colorClass = 'bg-slate-400';
  if (status === 'CASHLESS') colorClass = 'bg-green-500';
  if (status === 'REIMBURSEMENT') colorClass = 'bg-yellow-500';
  if (status === 'UNAVAILABLE') colorClass = 'bg-red-500';

  const scale = isHovered ? 'scale-125 ring-4 ring-white dark:ring-slate-800' : 'scale-100 ring-2 ring-white dark:ring-slate-800';

  const html = `
    <div class="relative flex items-center justify-center w-6 h-6">
       <span class="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${colorClass}"></span>
       <span class="relative inline-flex rounded-full w-4 h-4 ${colorClass} transition-transform duration-300 ${scale}"></span>
    </div>
  `;

  return L.divIcon({
    className: 'custom-marker',
    html: html,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

interface MapComponentProps {
  hospitals: ProcessedHospital[];
  hoveredHospitalId: string | null;
  selectedHospital: ProcessedHospital | null;
  onSelect: (hospital: ProcessedHospital) => void;
}

const MapController: React.FC<{ center: [number, number] | null }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    // Strict validation of coordinates before calling flyTo
    if (center && 
        Array.isArray(center) &&
        center.length === 2 &&
        typeof center[0] === 'number' && 
        typeof center[1] === 'number' && 
        !isNaN(center[0]) && 
        !isNaN(center[1])) {
      
      map.flyTo(center, 14, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
};

export const MapComponent: React.FC<MapComponentProps> = ({ 
  hospitals, 
  hoveredHospitalId, 
  selectedHospital,
  onSelect 
}) => {
  const context = useContext(AppContext);
  const defaultCenter: [number, number] = [17.3850, 78.4867];

  let activeCenter: [number, number] | null = null;
  
  // Safe extraction of coordinates
  if (selectedHospital && selectedHospital.location && !isNaN(selectedHospital.location.lat) && !isNaN(selectedHospital.location.lng)) {
    activeCenter = [selectedHospital.location.lat, selectedHospital.location.lng];
  } else if (hoveredHospitalId) {
    const hospital = hospitals.find(h => h.id === hoveredHospitalId);
    if (hospital && hospital.location && !isNaN(hospital.location.lat) && !isNaN(hospital.location.lng)) {
      activeCenter = [hospital.location.lat, hospital.location.lng];
    }
  }

  // CartoDB Tile URL - switch based on theme
  const tileLayerUrl = context?.isDarkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  // Filter out hospitals with invalid locations to prevent Leaflet errors
  const validHospitals = hospitals.filter(h => 
    h.location && 
    typeof h.location.lat === 'number' && 
    typeof h.location.lng === 'number' &&
    !isNaN(h.location.lat) && 
    !isNaN(h.location.lng)
  );

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={12} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      className="z-0 bg-slate-100 dark:bg-slate-900"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={tileLayerUrl}
      />
      
      {validHospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.location.lat, hospital.location.lng]}
          icon={createCustomIcon(hospital.status, hoveredHospitalId === hospital.id)}
          eventHandlers={{
            click: () => onSelect(hospital),
          }}
        >
          <Popup className="font-sans">
            <div className="p-1">
              <h3 className="font-bold text-slate-800">{hospital.name}</h3>
              <p className="text-xs text-slate-500">{hospital.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapController center={activeCenter} />
    </MapContainer>
  );
};
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Shield } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom Pin Icon generator using warm terracotta/sage styling
const createCustomIcon = (number, isHiddenGem) => {
  const bg = isHiddenGem ? '#688464' : '#C85A32'; // Sage for hidden gems, Terracotta for landmarks
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bg};
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 11px;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      ">
        ${number}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const InteractiveMap = ({ items = [], center = [26.9239, 75.8267], zoom = 13 }) => {
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    if (items && items.length > 0 && items[0].latitude && items[0].longitude) {
      setMapCenter([items[0].latitude, items[0].longitude]);
    }
  }, [items]);

  // Extract coordinates for the route polyline
  const routePoints = items
    .filter((i) => i.latitude && i.longitude)
    .map((i) => [i.latitude, i.longitude]);

  return (
    <div className="bg-white rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
      <div className="bg-sand-50 border-b border-sand-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-terracotta-600" />
          <h3 className="font-display font-bold text-sm text-charcoal-800">
            Itinerary Route & Geo-Navigator
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-charcoal-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500 inline-block"></span>
            Itinerary Stop
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500 inline-block"></span>
            Hidden Gem
          </span>
        </div>
      </div>

      <div className="h-80 w-full relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Warm, clean CartoDB Voyager or OpenStreetMap tiles without blue hue */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Route path line */}
          {routePoints.length > 1 && (
            <Polyline
              positions={routePoints}
              color="#C85A32"
              weight={3}
              opacity={0.8}
              dashArray="6, 6"
            />
          )}

          {/* Markers */}
          {items.map((item, idx) => {
            if (!item.latitude || !item.longitude) return null;
            const isGem = item.category === 'HIDDEN_GEM';
            const icon = createCustomIcon(idx + 1, isGem);

            return (
              <Marker
                key={item.id || idx}
                position={[item.latitude, item.longitude]}
                icon={icon}
              >
                <Popup>
                  <div className="p-1 max-w-[200px] text-xs">
                    <div className="font-bold text-charcoal-800 text-sm mb-0.5">
                      {item.placeName}
                    </div>
                    <div className="text-[11px] text-terracotta-600 font-semibold mb-1">
                      {item.startTime} • Day {item.dayNumber}
                    </div>
                    <p className="text-charcoal-600 text-[11px] leading-tight mb-2">
                      {item.recommendationReason}
                    </p>
                    <div className="pt-1 border-t border-sand-200 flex items-center justify-between text-[10px] text-charcoal-500">
                      <span>Est. ₹{item.estimatedCost || 0}</span>
                      <span className="font-bold text-sage-700">{item.crowdLevel}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveMap;

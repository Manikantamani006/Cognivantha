import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Issue } from '../types';

interface IssueMapProps {
  issues: Issue[];
}

interface ResolvedCoordinates {
  [key: string]: [number, number];
}

// Custom priority SVG icon generator
const createPriorityIcon = (priority: Issue['priority'] | string) => {
  let color = '#10B981'; // Green (Low)
  if (priority === 'High') {
    color = '#EF4444'; // Red
  } else if (priority === 'Medium') {
    color = '#F59E0B'; // Orange/Yellow
  }

  const svgHtml = `
    <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.26801 0 0 6.26801 0 14C0 24.5 14 38 14 38C14 38 28 24.5 28 14C28 6.26801 21.732 0 14 0ZM14 19C11.2386 19 9 16.7614 9 14C9 11.2386 11.2386 9 14 9C16.7614 9 19 11.2386 19 14C19 16.7614 16.7614 19 14 19Z" 
            fill="${color}" stroke="#FFFFFF" stroke-width="2" />
    </svg>
  `;

  return L.divIcon({
    className: 'custom-priority-marker',
    html: svgHtml,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -36]
  });
};

// Coordinate parser from string: e.g. "Lat 12.9716, Lng 77.5946" or "12.9716, 77.5946"
const parseCoords = (locationStr?: string): [number, number] | null => {
  if (!locationStr) return null;
  
  const matches = locationStr.match(/[-+]?[0-9]*\.?[0-9]+/g);
  if (matches && matches.length >= 2) {
    const lat = parseFloat(matches[0]);
    const lng = parseFloat(matches[1]);
    
    // Check if values are in standard coordinate range
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      // Must contain decimals to avoid matching street numbers
      if (locationStr.toLowerCase().includes('lat') || locationStr.toLowerCase().includes('lng') || 
          (matches[0].includes('.') && matches[1].includes('.'))) {
        return [lat, lng];
      }
    }
  }
  return null;
};

export default function IssueMap({ issues }: IssueMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [resolvedCoords, setResolvedCoords] = useState<ResolvedCoordinates>({});
  const [isGeocoding, setIsGeocoding] = useState(false);

  // 1. Geocode locations that are addresses instead of raw coordinates
  useEffect(() => {
    let active = true;

    const geocodeAll = async () => {
      setIsGeocoding(true);
      const newResolved: ResolvedCoordinates = {};
      
      for (const issue of issues) {
        if (!issue.location) continue;

        const direct = parseCoords(issue.location);
        if (direct) {
          newResolved[issue.id] = direct;
        } else {
          // If geocoding cache already exists in current state, reuse it to avoid API calls
          if (resolvedCoords[issue.id]) {
            newResolved[issue.id] = resolvedCoords[issue.id];
          } else {
            // Otherwise, fetch from OSM Nominatim API
            try {
              // Throttle to respect OpenStreetMap Nominatim request guidelines
              await new Promise(resolve => setTimeout(resolve, 800));
              if (!active) return;
              
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(issue.location)}`,
                {
                  headers: { 'User-Agent': 'Cognivantha-Prototype-Civic-App' }
                }
              );
              const data = await response.json();
              if (active && data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                newResolved[issue.id] = [lat, lon];
              }
            } catch (err) {
              console.warn(`Geocoding failed for issue "${issue.title}":`, err);
            }
          }
        }
      }

      if (active) {
        setResolvedCoords(prev => {
          // Only update state if something actually changed
          const isSame = Object.keys(newResolved).every(key => 
            prev[key] && prev[key][0] === newResolved[key][0] && prev[key][1] === newResolved[key][1]
          ) && Object.keys(prev).length === Object.keys(newResolved).length;

          return isSame ? prev : newResolved;
        });
        setIsGeocoding(false);
      }
    };

    geocodeAll();

    return () => {
      active = false;
    };
  }, [issues]);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Bangalore center coordinates as standard default
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      maxZoom: 18,
      minZoom: 2
    }).setView([12.9716, 77.5946], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Prevent map container double-clicks from propagating (especially in lists/modals)
    map.on('click', () => {});

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Render markers & adjust map bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const coordinatesList: L.LatLngExpression[] = [];

    issues.forEach(issue => {
      const coords = resolvedCoords[issue.id];
      if (coords) {
        const priorityColorText = 
          issue.priority === 'High' ? 'text-rose-600' : 
          issue.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600';

        const statusBg = 
          issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          issue.status === 'Flagged' ? 'bg-rose-50 text-rose-700 border-rose-200' :
          issue.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200';

        const popupContent = `
          <div style="font-family: ui-sans-serif, system-ui, sans-serif; min-width: 220px; max-width: 280px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
              <span class="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${priorityColorText}" 
                    style="border-color: currentColor; background-color: rgba(0,0,0,0.03);">
                ${issue.priority} Priority
              </span>
              <span class="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${statusBg}">
                ${issue.status}
              </span>
            </div>
            <h4 style="margin: 4px 0; font-weight: 700; font-size: 14px; color: #0f172a; line-height: 1.3;">${issue.title}</h4>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">Category: <b>${issue.category}</b></p>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #334155; line-height: 1.4; max-height: 80px; overflow-y: auto;">
              ${issue.description}
            </p>
            <div style="display: flex; align-items: center; font-size: 10px; color: #475569; font-family: monospace; border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <span style="margin-right: 4px;">📍</span> ${issue.location}
            </div>
          </div>
        `;

        const marker = L.marker(coords, { icon: createPriorityIcon(issue.priority) })
          .addTo(map)
          .bindPopup(popupContent);
          
        markersRef.current.push(marker);
        coordinatesList.push(coords);
      }
    });

    // Auto fit bounds
    if (coordinatesList.length > 0) {
      if (coordinatesList.length === 1) {
        map.setView(coordinatesList[0], 14, { animate: true });
      } else {
        const bounds = L.latLngBounds(coordinatesList);
        map.fitBounds(bounds, { padding: [40, 40], animate: true });
      }
    }
  }, [issues, resolvedCoords]);

  const hasVisibleIssues = Object.keys(resolvedCoords).length > 0;

  return (
    <div className="w-full relative">
      <div className="w-full h-80 rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-50 z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
      
      {/* Geocoding loading indicator overlay */}
      {isGeocoding && (
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs border border-slate-200 px-2 py-1 rounded shadow-xs text-[10px] text-slate-500 font-medium flex items-center gap-1.5 z-10 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
          Geocoding addresses...
        </div>
      )}

      {/* Warning message if no markers could be parsed/resolved */}
      {!isGeocoding && !hasVisibleIssues && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 backdrop-blur-xs rounded-xl p-4 text-center z-10">
          <div className="max-w-xs">
            <p className="text-sm font-semibold text-slate-700">No active locations found</p>
            <p className="text-xs text-slate-500 mt-1">Make sure reported issues have valid coordinates or addresses.</p>
          </div>
        </div>
      )}
    </div>
  );
}

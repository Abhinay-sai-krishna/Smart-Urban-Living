

import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  HeatmapLayer,
  TrafficLayer,
  InfoWindow,
  Polyline,
} from '@react-google-maps/api';
import type { WasteData } from '../types';
import { GOOGLE_API_KEY } from '../constants';
import ApiKeyHealthCheck from '../components/ApiKeyHealthCheck';

// FIX: Added a local interface for LatLngLiteral to resolve the "Cannot find namespace 'google'" error.
// This provides a type definition for latitude/longitude objects used in the map.
interface LatLngLiteral {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const hyderabadCenter = {
  lat: 17.3850,
  lng: 78.4867
};

// Custom dark theme for Google Maps
const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
        },
        {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
        },
    ],
};

// Function to generate random points within a radius for dummy data
const generateRandomPoint = (center: { lat: number, lng: number }, radius: number) => {
  const y0 = center.lat;
  const x0 = center.lng;
  const rd = radius / 111300; // about 111300 meters in one degree

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  return { lat: y + y0, lng: x + x0 };
};

// Decodes a polyline string into an array of LatLng objects.
const decodePolyline = (encoded: string): LatLngLiteral[] => {
  if (!encoded) {
    return [];
  }

  let index = 0;
  let lat = 0;
  let lng = 0;
  const path = [];

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    path.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return path;
};

interface MapPageProps {
  wasteData: WasteData[];
}

const MapPage: React.FC<MapPageProps> = ({ wasteData }) => {
  const isApiKeySet = GOOGLE_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: isApiKeySet ? GOOGLE_API_KEY : '',
    libraries: ['visualization', 'places'],
    preventGoogleFontsLoading: true,
  });

  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [selectedBin, setSelectedBin] = useState<WasteData | null>(null);
  
  // State for layer visibility
  const [showTraffic, setShowTraffic] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showBins, setShowBins] = useState(true);

  // State for Directions using Routes API
  const [routePath, setRoutePath] = useState<LatLngLiteral[]>([]);
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded) {
      const points = Array.from({ length: 150 }, () => {
        const point = generateRandomPoint(hyderabadCenter, 8000); // 8km radius
        return new (window as any).google.maps.LatLng(point.lat, point.lng);
      });
      setHeatmapData(points);
    }
  }, [isLoaded]);

  const calculateRoute = async () => {
    if (!originRef.current?.value || !destinationRef.current?.value) {
      return;
    }

    const ROUTES_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    try {
      const response = await fetch(ROUTES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          // Field mask to request only the encoded polyline for efficiency
          'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
        },
        body: JSON.stringify({
          origin: { address: originRef.current.value },
          destination: { address: destinationRef.current.value },
          travelMode: 'DRIVE',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `Routes API request failed with status ${response.status}. Make sure the Routes API is enabled in your Google Cloud project.`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const encodedPolyline = data.routes[0].polyline.encodedPolyline;
        const decodedPath = decodePolyline(encodedPolyline);
        setRoutePath(decodedPath);
        setShowBins(false);
        setShowHeatmap(false);
      } else {
        throw new Error('No routes found between the specified locations.');
      }

    } catch(e) {
        const errorMessage = (e instanceof Error) ? e.message : "An unknown error occurred.";
        console.error("Directions request failed", errorMessage);
        alert(`Could not calculate directions: ${errorMessage}`);
    }
  };

  const clearRoute = () => {
      setRoutePath([]);
      if (originRef.current) originRef.current.value = '';
      if (destinationRef.current) destinationRef.current.value = '';
      setShowBins(true);
      setShowHeatmap(true);
  };

  const getBinIconUrl = (fillLevel: number): string => {
    if (fillLevel > 80) {
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
    if (fillLevel >= 50) {
      return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }
    return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
  };
  
  if (!isApiKeySet) {
    return (
        <div className="p-4 sm:p-6 h-full flex flex-col items-center justify-center bg-bg-secondary backdrop-blur-md text-center rounded-xl shadow-lg border border-border-color">
            <h2 className="text-2xl font-bold text-red-400 mb-4">API Key Not Set</h2>
            <p className="text-text-secondary">The Google Maps API key is missing. Please add it to use the map features.</p>
            <p className="text-sm text-accent bg-slate-800 px-3 py-2 rounded-md mt-4 font-mono">Open constants.tsx and replace 'YOUR_GOOGLE_MAPS_API_KEY_HERE' with your actual key.</p>
        </div>
    );
  }

  if (loadError) {
    return <ApiKeyHealthCheck apiKey={GOOGLE_API_KEY} />;
  }

  if (!isLoaded) {
    return (
        <div className="p-4 sm:p-6 h-full flex items-center justify-center">
             <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full relative">
      <div className="absolute top-8 left-8 z-10 bg-bg-secondary backdrop-blur-md p-4 rounded-xl shadow-lg w-full max-w-sm border border-border-color animate-fade-in">
        <h3 className="text-lg font-semibold text-text-main mb-3">Plan a Route</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Origin"
            ref={originRef}
            className="w-full bg-slate-700/50 border border-border-color rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="text"
            placeholder="Destination"
            ref={destinationRef}
            className="w-full bg-slate-700/50 border border-border-color rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={calculateRoute}
            className="flex-1 bg-accent text-white px-3 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity"
          >
            Get Directions
          </button>
          <button
            onClick={clearRoute}
            className="flex-1 bg-slate-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-slate-500 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="absolute top-8 right-8 z-10 bg-bg-secondary backdrop-blur-md p-2 rounded-xl shadow-lg flex flex-col space-y-2 border border-border-color animate-fade-in">
        <button
          onClick={() => setShowTraffic(s => !s)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            showTraffic ? 'bg-accent text-white' : 'bg-slate-700 hover:bg-slate-600 text-text-main'
          }`}
          aria-pressed={showTraffic}
        >
          Traffic
        </button>
        <button
          onClick={() => setShowHeatmap(s => !s)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            showHeatmap ? 'bg-accent text-white' : 'bg-slate-700 hover:bg-slate-600 text-text-main'
          }`}
          aria-pressed={showHeatmap}
        >
          Pollution
        </button>
        <button
          onClick={() => setShowBins(s => !s)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            showBins ? 'bg-accent text-white' : 'bg-slate-700 hover:bg-slate-600 text-text-main'
          }`}
          aria-pressed={showBins}
        >
          Bins
        </button>
      </div>
      <div className="bg-bg-secondary rounded-xl shadow-lg h-full w-full overflow-hidden border border-border-color">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={hyderabadCenter}
          zoom={12}
          options={mapOptions}
          onClick={() => setSelectedBin(null)}
        >
          {showTraffic && <TrafficLayer autoUpdate />}
          {showHeatmap && heatmapData.length > 0 && <HeatmapLayer data={heatmapData} options={{gradient: ['rgba(0,0,0,0)', '#845ef7', '#818cf8']}} />}
          {showBins && wasteData.map(bin => (
            <Marker
              key={bin.id}
              position={bin.position}
              icon={{ url: getBinIconUrl(bin.fillLevel) }}
              title={`Bin at ${bin.location}: ${bin.fillLevel}% full`}
              onClick={() => setSelectedBin(bin)}
            />
          ))}
          {selectedBin && (
            <InfoWindow
              position={selectedBin.position}
              onCloseClick={() => setSelectedBin(null)}
            >
              <div className="text-gray-900 p-1">
                <h4 className="font-bold text-base">{selectedBin.location}</h4>
                <p>Fill Level: <strong>{selectedBin.fillLevel}%</strong></p>
              </div>
            </InfoWindow>
          )}
          {routePath.length > 0 && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#818cf8',
                strokeOpacity: 0.9,
                strokeWeight: 6,
                geodesic: true,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapPage;
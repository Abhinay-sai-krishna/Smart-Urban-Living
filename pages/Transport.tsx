

import React, { useState, useCallback, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GoogleMap, useJsApiLoader, TrafficLayer } from '@react-google-maps/api';
import { getTrafficSuggestions } from '../services/geminiService';
import AIGenerationBlock from '../components/AIGenerationBlock';
import type { TrafficData, UserRole } from '../types';
import { GOOGLE_API_KEY } from '../constants';
import StatCard from '../components/StatCard';
import SkeletonLoader from '../components/SkeletonLoader';

const containerStyle = { width: '100%', height: '100%' };
const hyderabadCenter = { lat: 17.3850, lng: 78.4867 };

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

const MapView = React.memo(() => {
    const isApiKeySet = GOOGLE_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: isApiKeySet ? GOOGLE_API_KEY : '',
        libraries: ['visualization', 'places'],
        preventGoogleFontsLoading: true,
    });

    if (!isApiKeySet) {
        return <div className="flex items-center justify-center h-full bg-slate-800 rounded-lg text-text-secondary text-center p-4">API Key needed for map view.</div>;
    }

    if (!isLoaded) return <div className="flex items-center justify-center h-full bg-slate-800 rounded-lg"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={hyderabadCenter}
            zoom={12}
            options={mapOptions}
        >
            <TrafficLayer autoUpdate />
        </GoogleMap>
    );
});

const TransportLoadingSkeleton = () => (
    <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
            <SkeletonLoader className="h-9 w-3/4 mb-2" />
            <SkeletonLoader className="h-5 w-1/2" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <SkeletonLoader className="h-28" />
            <SkeletonLoader className="h-28" />
            <SkeletonLoader className="h-28" />
            <SkeletonLoader className="h-28" />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg h-[400px] lg:h-auto border border-border-color">
                <SkeletonLoader className="h-6 w-1/3 mb-4" />
                <SkeletonLoader className="h-full w-full" style={{ height: 'calc(100% - 2.5rem)'}} />
            </div>
            <div className="lg:col-span-1 h-full">
                <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg h-full border border-border-color">
                    <SkeletonLoader className="h-6 w-2/3 mb-4" />
                    <SkeletonLoader className="h-4 w-full mb-2" />
                    <SkeletonLoader className="h-4 w-full mb-2" />
                    <SkeletonLoader className="h-4 w-5/6" />
                </div>
            </div>
        </div>

        {/* Map */}
        <div className="bg-bg-secondary backdrop-blur-md p-4 rounded-xl shadow-lg h-[500px] border border-border-color">
            <SkeletonLoader className="h-6 w-1/4 mb-4 px-2" />
            <SkeletonLoader className="h-full w-full" style={{ height: 'calc(100% - 2.5rem)' }} />
        </div>
    </div>
);

interface TransportProps {
  trafficData: TrafficData[];
  userRole: UserRole;
  isLoading: boolean;
}

const Transport: React.FC<TransportProps> = ({ trafficData, userRole, isLoading }) => {
  const [suggestions, setSuggestions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSuggestions = useCallback(async () => {
    setIsGenerating(true);
    const result = await getTrafficSuggestions(trafficData);
    setSuggestions(result);
    setIsGenerating(false);
  }, [trafficData]);

  const stats = useMemo(() => {
    if (trafficData.length === 0) {
      return { current: 0, avg: 0, peak: 0, low: 0, peakHour: 'N/A' };
    }
    const densities = trafficData.map(d => d.density);
    const current = densities[densities.length - 1];
    const avg = densities.reduce((a, b) => a + b, 0) / densities.length;
    const peak = Math.max(...densities);
    const low = Math.min(...densities);
    const peakHour = trafficData.find(d => d.density === peak)?.hour || 'N/A';
    return { current, avg, peak, low, peakHour };
  }, [trafficData]);

  if (isLoading || trafficData.length === 0) {
    return <TransportLoadingSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6">
       <div className="flex-shrink-0 mb-6 animate-fade-in-down">
          <h1 className="text-3xl font-bold text-text-main">Traffic Management</h1>
          <p className="text-text-secondary mt-1">Monitor and optimize traffic flow across the city.</p>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}><StatCard title="Current Density" value={stats.current.toFixed(0)} unit="%" description="Latest city-wide average" trend={{value: "+2%", color: "text-red-400"}}/></div>
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}><StatCard title="Average Speed" value={32} unit="km/h" description="City-wide average" trend={{value: "-8%", color: "text-red-400"}}/></div>
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><StatCard title="Congestion Level" value={"Medium"} description="3 high-congestion areas" /></div>
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}><StatCard title="Active Incidents" value={5} description="2 major, 3 minor" trend={{value: "+2%", color: "text-green-400"}}/></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg h-[400px] lg:h-auto border border-border-color animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-lg font-semibold mb-4 text-text-main">Traffic Volume (24 Hours)</h3>
            <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={trafficData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(100, 116, 139, 0.5)', 
                    color: '#f1f5f9' 
                  }}
                />
                <Area type="monotone" dataKey="density" stroke="#818cf8" fill="url(#colorUv)" name="Density" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-1 h-full animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <AIGenerationBlock
                title="AI Rerouting Suggestions"
                content={suggestions}
                isLoading={isGenerating}
                onGenerate={handleGenerateSuggestions}
                userRole={userRole}
                citizenInfo="AI-powered suggestions for optimizing traffic flow are available to city officials. Check local news for updates on traffic management."
            />
        </div>
      </div>
       <div className="bg-bg-secondary backdrop-blur-md p-4 rounded-xl shadow-lg h-[500px] border border-border-color animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <h3 className="text-lg font-semibold mb-4 text-text-main px-2">Live Traffic Map</h3>
        <div className="h-[calc(100%-2.5rem)] rounded-lg overflow-hidden">
         <MapView />
        </div>
      </div>
    </div>
  );
};

export default Transport;
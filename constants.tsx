import React from 'react';
import { Module } from './types';
import { DashboardIcon, TransportIcon, EnergyIcon, WasteIcon, PollutionIcon, MapIcon, AboutIcon } from './components/Icons';

// The API key for Google Cloud services (Maps, Air Quality).
// IMPORTANT: Replace this placeholder with your actual Google Cloud API key.
// FIX: Explicitly typed GOOGLE_API_KEY as a string to resolve a TypeScript comparison error where its literal type was being inferred.
export const GOOGLE_API_KEY: string = 'AIzaSyD6oBh0NNdXxXYHXYClGxcl4uuusBC1IU8';

// FIX: Replaced JSX.Element with React.ReactElement to resolve JSX namespace issue.
export const MODULES: { name: Module; icon: React.ReactElement }[] = [
  { name: Module.Dashboard, icon: <DashboardIcon /> },
  { name: Module.Transport, icon: <TransportIcon /> },
  { name: Module.Energy, icon: <EnergyIcon /> },
  { name: Module.Waste, icon: <WasteIcon /> },
  { name: Module.Pollution, icon: <PollutionIcon /> },
  { name: Module.Map, icon: <MapIcon /> },
  { name: Module.About, icon: <AboutIcon /> },
];
import React, { useState, useEffect } from 'react';

interface HealthCheckResult {
  status: 'checking' | 'success' | 'failed';
  message: string;
}

interface ApiKeyHealthCheckProps {
  apiKey: string;
}

const checkService = async (url: string, options?: RequestInit): Promise<HealthCheckResult> => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
        // Try to get a specific error message from Google's response structure
        const errorMessage = data?.error?.message || `Request failed with status ${response.status}`;
        return { status: 'failed', message: errorMessage };
    }
    return { status: 'success', message: 'Service is configured correctly.' };
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "An unknown network error occurred.";
    return { status: 'failed', message: errorMessage };
  }
};

const StatusIndicator: React.FC<{ result: HealthCheckResult }> = ({ result }) => {
    let color = 'text-slate-400';
    let text = 'Checking...';
    if (result.status === 'success') {
        color = 'text-green-400';
        text = 'SUCCESS';
    } else if (result.status === 'failed') {
        color = 'text-red-400';
        text = 'FAILED';
    }

    return (
        <div className="w-24 text-center">
            <span className={`px-3 py-1 text-sm font-bold rounded-full bg-bg-primary ${color}`}>{text}</span>
        </div>
    );
};

const ApiKeyHealthCheck: React.FC<ApiKeyHealthCheckProps> = ({ apiKey }) => {
  const [mapsResult, setMapsResult] = useState<HealthCheckResult>({ status: 'checking', message: '' });
  const [airQualityResult, setAirQualityResult] = useState<HealthCheckResult>({ status: 'checking', message: '' });

  useEffect(() => {
    const runChecks = async () => {
      // Maps Geocoding API (good proxy for Maps JS)
      setMapsResult(await checkService(`https://maps.googleapis.com/maps/api/geocode/json?address=Hyderabad&key=${apiKey}`));
      
      // Air Quality API
      setAirQualityResult(await checkService(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: { latitude: 17.3850, longitude: 78.4867 } }),
      }));
    };

    runChecks();
  }, [apiKey]);
  
  const allChecks = [mapsResult, airQualityResult];
  const allChecksDone = allChecks.every(r => r.status !== 'checking');
  const allSuccess = allChecksDone && allChecks.every(r => r.status === 'success');

  const renderCheckRow = (name: string, result: HealthCheckResult) => (
    <div className="flex items-start p-3 border-b border-border-color last:border-b-0">
        <StatusIndicator result={result} />
        <div className="ml-4 flex-1">
            <p className="font-semibold text-text-main">{name}</p>
            {result.status === 'failed' && <p className="text-sm text-red-400 mt-1">{result.message}</p>}
        </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 h-full flex items-center justify-center">
        <div className="bg-bg-secondary backdrop-blur-md rounded-xl shadow-2xl w-full max-w-2xl border border-border-color">
            <div className="p-6 border-b border-border-color">
                <h2 className="text-2xl font-bold text-red-400">API Key Configuration Error</h2>
                <p className="text-text-secondary mt-2">
                    The application failed to connect to Google's services. This is a configuration issue with your API key in the Google Cloud Console, not a code error.
                    The health check below shows the status of each required service.
                </p>
            </div>
            <div className="py-2">
                {renderCheckRow("Maps JavaScript API", mapsResult)}
                {renderCheckRow("Air Quality API", airQualityResult)}
            </div>
            {allChecksDone && !allSuccess && (
                <div className="p-6 border-t border-border-color bg-slate-900/50 rounded-b-xl">
                    <h3 className="font-bold text-accent">How to Fix This:</h3>
                    <ol className="list-decimal list-inside text-text-secondary mt-2 space-y-2 text-sm">
                        <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline hover:text-sky-300">Google Cloud Console</a>.</li>
                        <li>Ensure your project has an active <strong className="text-text-main">Billing Account</strong> associated with it. This is the most common cause of failure.</li>
                        <li>Make sure the <strong className="text-text-main">Maps JavaScript API</strong> and <strong className="text-text-main">Air Quality API</strong> are <strong className="text-text-main">ENABLED</strong> in the "APIs & Services" library.</li>
                        <li>Check your API key's restrictions. For testing, try removing all "Application restrictions" temporarily.</li>
                    </ol>
                </div>
            )}
        </div>
    </div>
  );
};

export default ApiKeyHealthCheck;
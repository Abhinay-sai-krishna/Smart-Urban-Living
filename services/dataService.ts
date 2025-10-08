import type { TrafficData, EnergyData, WasteData, PollutionData, WeatherData } from '../types';
import { GOOGLE_API_KEY } from '../constants';

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// Traffic Data
export const generateInitialTrafficData = (): TrafficData[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const hour = `${(i * 2).toString().padStart(2, '0')}:00`;
    return { hour, density: randomBetween(20, 80) };
  });
};

export const updateTrafficData = (data: TrafficData[]): TrafficData[] => {
  const lastPoint = data[data.length - 1];
  const newLastPointDensity = Math.max(10, Math.min(100, lastPoint.density + randomBetween(-10, 10)));

  return data.map((point, index) => {
    if (index === data.length - 1) {
      // This is the last point, return it with the new large-delta density
      return {
        ...point,
        density: newLastPointDensity
      };
    }
    // For all other points, apply the small delta
    return {
      ...point,
      density: Math.max(10, Math.min(100, point.density + randomBetween(-2, 2)))
    };
  });
};

// Energy Data
export const generateInitialEnergyData = (): EnergyData[] => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    usage: randomBetween(300, 700),
  }));
};

export const updateEnergyData = (data: EnergyData[]): EnergyData[] => {
    const lastDataPoint = data[data.length - 1];
    const newTime = `${(parseInt(lastDataPoint.time.split(':')[0]) + 1) % 24}`.padStart(2, '0') + ':00';
    
    const newUsage = lastDataPoint.usage + randomBetween(-20, 20);

    const newData = [...data.slice(1), { time: newTime, usage: Math.max(200, Math.min(800, newUsage)) }];
    return newData;
};


// Waste Data
const hyderabadCenter = {
  lat: 17.3850,
  lng: 78.4867
};

const getRandomDate = () => {
    const today = new Date();
    const randomDays = randomBetween(-5, 10);
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + randomDays);
    return resultDate.toISOString().split('T')[0];
};

export const generateInitialWasteData = (): WasteData[] => {
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  const statuses: ('pending' | 'completed')[] = ['pending', 'completed'];

  const bins = [
    { id: 'bin-01', location: 'Charminar', fillLevel: randomBetween(40, 95), position: { lat: 17.3616, lng: 78.4747 } },
    { id: 'bin-02', location: 'Uppal', fillLevel: randomBetween(20, 70), position: { lat: 17.3991, lng: 78.5583 } },
    { id: 'bin-03', location: 'Boduppal', fillLevel: randomBetween(60, 100), position: { lat: 17.4143, lng: 78.5835 } },
    { id: 'bin-04', location: 'Secunderabad', fillLevel: randomBetween(30, 85), position: { lat: 17.4399, lng: 78.4983 } },
    { id: 'bin-05', location: 'Nallakunta', fillLevel: randomBetween(10, 50), position: { lat: 17.4048, lng: 78.5028 } },
    { id: 'bin-06', location: 'LB Nagar', fillLevel: randomBetween(50, 90), position: { lat: 17.3596, lng: 78.5499 } },
    { id: 'bin-07', location: 'Hayathnagar', fillLevel: randomBetween(25, 75), position: { lat: 17.3218, lng: 78.5901 } },
    { id: 'bin-08', location: 'Alwal', fillLevel: randomBetween(35, 80), position: { lat: 17.4988, lng: 78.5083 } },
  ];

  return bins.map(bin => ({
    ...bin,
    status: statuses[randomBetween(0, 1)],
    priority: priorities[randomBetween(0, 2)],
    dueDate: getRandomDate(),
  }));
};


export const updateWasteData = (data: WasteData[]): WasteData[] => {
  return data.map(bin => ({
    ...bin,
    fillLevel: Math.min(100, bin.fillLevel + randomBetween(1, 5)),
  }));
};


// Pollution Data
const AIR_QUALITY_API_URL = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${GOOGLE_API_KEY}`;

export const generateInitialPollutionData = (): PollutionData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    aqi: randomBetween(30, 150),
  }));
};

export const fetchCurrentAQI = async (): Promise<{ aqi: number | null; error: string | null }> => {
  try {
    const response = await fetch(AIR_QUALITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: {
          latitude: hyderabadCenter.lat,
          longitude: hyderabadCenter.lng,
        },
      }),
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody?.error?.message || errorMessage;
      } catch (e) {
        // Ignore if response is not json
      }
      console.error('Failed to fetch AQI data:', errorMessage);
      return { aqi: null, error: errorMessage };
    }

    const data = await response.json();
    // Using the Universal AQI (uaqi) as the standard measure
    const uaqi = data?.indexes?.find((index: any) => index.code === 'uaqi');
    
    if (uaqi) {
        return { aqi: uaqi.aqi, error: null };
    } else {
        return { aqi: null, error: "Universal AQI not found in API response." };
    }

  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "An unknown network error occurred.";
    console.error('Error fetching AQI data:', errorMessage);
    return { aqi: null, error: errorMessage };
  }
};

// Weather Data
const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${hyderabadCenter.lat}&longitude=${hyderabadCenter.lng}&current=temperature_2m,relative_humidity_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;

export const fetchWeatherData = async (): Promise<{ data: WeatherData | null; error: string | null }> => {
    try {
        const response = await fetch(WEATHER_API_URL);
        if (!response.ok) {
            throw new Error(`Weather API request failed with status ${response.status}`);
        }
        const data = await response.json();

        const weatherData: WeatherData = {
            current: {
                temperature: Math.round(data.current.temperature_2m),
                humidity: data.current.relative_humidity_2m,
                precipitationChance: data.current.precipitation_probability,
            },
            forecast: data.daily.time.slice(1).map((date: string, index: number) => ({
                date: date,
                maxTemp: Math.round(data.daily.temperature_2m_max[index + 1]),
                minTemp: Math.round(data.daily.temperature_2m_min[index + 1]),
                weatherCode: data.daily.weather_code[index + 1],
            })),
        };
        
        return { data: weatherData, error: null };

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "An unknown network error occurred.";
        console.error('Error fetching weather data:', errorMessage);
        return { data: null, error: errorMessage };
    }
};
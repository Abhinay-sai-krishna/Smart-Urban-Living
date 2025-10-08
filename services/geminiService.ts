import { GoogleGenAI, Type } from "@google/genai";
import type { TrafficData, WasteData, PollutionData, EnergyData, RouteInfo } from '../types';

// FIX: Per @google/genai guidelines, initialize directly with process.env.API_KEY, assuming it is set.
// The previous conditional check and non-null assertion have been removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContent = async (prompt: string) => {
  try {
    // FIX: Per @google/genai guidelines, the model name is passed directly as a string literal.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error: Could not retrieve AI suggestion.";
  }
};

export const getTrafficSuggestions = async (data: TrafficData[]): Promise<string> => {
  const latestDensity = data[data.length - 1].density;
  const prompt = `Based on the current traffic density of ${latestDensity}%, provide 3 concise, actionable rerouting suggestions for city traffic management. Format as a bulleted list.`;
  return generateContent(prompt);
};

export const getEnergyTips = async (data: EnergyData[]): Promise<string> => {
  const avgUsage = data.reduce((acc, cur) => acc + cur.usage, 0) / data.length;
  const prompt = `Current average energy consumption is ${avgUsage.toFixed(2)} MWh. Provide 3 concise, actionable energy efficiency tips for citizens. Format as a bulleted list.`;
  return generateContent(prompt);
};

export const getWasteRoutes = async (data: WasteData[], optimization: 'distance' | 'time'): Promise<RouteInfo | string> => {
  const highFillBins = data.filter(bin => bin.fillLevel > 80);
  if (highFillBins.length === 0) {
    return "All bin levels are currently manageable. No optimized routes needed at this time.";
  }
  const binLocations = highFillBins.map(bin => `${bin.location} (${bin.fillLevel}%)`).join(', ');
  const optimizationCriterion = optimization === 'distance' ? 'shortest distance' : 'shortest time';
  const prompt = `Smart bins at these locations are nearly full: ${binLocations}. Generate an optimized collection route as a sequence of locations to visit, optimized for ${optimizationCriterion}. Include an estimated total distance (e.g., '15 km') and estimated time (e.g., '45 minutes') for the route.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            route: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An ordered list of locations to visit for waste collection."
            },
            estimatedDistance: {
              type: Type.STRING,
              description: "The total estimated distance of the collection route, e.g., '15 km'."
            },
            estimatedTime: {
              type: Type.STRING,
              description: "The total estimated time to complete the route, e.g., '45 minutes'."
            }
          },
          required: ["route", "estimatedDistance", "estimatedTime"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI.");
    }
    return JSON.parse(jsonText.trim()) as RouteInfo;
  } catch (error) {
    console.error("Error generating waste routes:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Error: Could not generate optimized route. The AI service may be temporarily unavailable or experiencing issues. Details: ${errorMessage}`;
  }
};


export const getPollutionAlerts = async (data: PollutionData[]): Promise<string> => {
  const latestAqi = data[data.length - 1].aqi;
  const prompt = `The current Air Quality Index (AQI) is ${latestAqi}. Based on this, provide a predictive alert and a short, actionable recommendation for the public. The tone should be informative and cautionary.`;
  return generateContent(prompt);
};
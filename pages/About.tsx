import React from 'react';

const About: React.FC = () => {
  return (
    <div className="h-full">
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 h-full flex flex-col items-center justify-center text-center">
        <div className="bg-bg-secondary backdrop-blur-md p-8 rounded-xl shadow-lg max-w-4xl w-full border border-border-color animate-fade-in-up">
          <h1 className="text-4xl font-bold text-text-main mb-4">
            About the Smart Urban Living Dashboard
          </h1>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            This dashboard is a centralized platform designed for city officials and citizens to monitor and enhance urban sustainability. By leveraging real-time data, advanced visualization, and AI-powered insights from the Gemini API, it provides a comprehensive overview of key city metrics. The goal is to facilitate data-driven decision-making, optimize resource management, and foster a more efficient, eco-friendly, and responsive urban environment.
          </p>

          <h2 className="text-3xl font-bold text-accent mb-6">Key Features</h2>
          <ul className="text-left space-y-4 text-text-secondary list-none sm:list-disc sm:pl-6">
            <li>
              <strong className="text-text-main font-semibold">City-Wide Dashboard:</strong> Get an at-a-glance summary of the most critical urban metrics, including traffic density, energy consumption, waste management status, and air quality.
            </li>
            <li>
              <strong className="text-text-main font-semibold">Transport Module:</strong> Analyze real-time traffic patterns and utilize AI to generate actionable rerouting suggestions, helping to alleviate congestion and reduce commute times.
            </li>
            <li>
              <strong className="text-text-main font-semibold">Energy Module:</strong> Track city-wide energy usage with detailed charts and receive AI-generated tips for improving energy efficiency and promoting conservation.
            </li>
            <li>
              <strong className="text-text-main font-semibold">Waste Management:</strong> Monitor the fill levels of smart bins across the city and use AI to create optimized collection routes, reducing fuel consumption and ensuring timely service.
            </li>
            <li>
              <strong className="text-text-main font-semibold">Pollution Control:</strong> View historical and current air quality data (AQI) and receive predictive alerts from AI, enabling proactive measures to protect public health.
            </li>
            <li>
              <strong className="text-text-main font-semibold">Interactive Map:</strong> A comprehensive, multi-layered map that visualizes traffic flow, pollution hotspots, and waste bin locations. It also includes a powerful route planning tool for efficient navigation.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
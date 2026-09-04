import React from 'react';
import { Sun, CloudRain, Cloud, Wind, Droplets, Compass } from 'lucide-react';
import { useTrip } from '../context/TripContext';

const WeatherWidget = () => {
  const { weather, activeTrip } = useTrip();

  if (!weather) return null;

  const {
    destination = activeTrip?.destination || 'Jaipur',
    temperature = 26,
    condition = 'Pleasant & Sunny',
    rainProbability = 15,
    humidity = 45,
    windSpeed = 8.5,
    advice = 'Ideal conditions for heritage walks and photography.'
  } = weather;

  const isRain = condition.toLowerCase().contains?.('rain') || rainProbability > 40;

  return (
    <div className="bg-white rounded-2xl border border-sand-300 shadow-warm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-charcoal-400 block">
            Current Atmosphere
          </span>
          <h3 className="font-display font-bold text-base text-charcoal-800">
            {destination}
          </h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-terracotta-500">
          {isRain ? <CloudRain className="w-6 h-6" /> : <Sun className="w-6 h-6 text-amber-500" />}
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
          {Math.round(temperature)}°C
        </span>
        <span className="text-xs font-semibold text-terracotta-700 bg-sand-100 px-2 py-0.5 rounded-full">
          {condition}
        </span>
      </div>

      {/* Meteorological Signal Chips */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-[11px] text-charcoal-600">
        <div className="p-2 rounded-lg bg-sand-50 border border-sand-200 flex items-center gap-1.5">
          <CloudRain className="w-3.5 h-3.5 text-terracotta-500" />
          <span>{rainProbability}% Rain</span>
        </div>
        <div className="p-2 rounded-lg bg-sand-50 border border-sand-200 flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-sage-600" />
          <span>{humidity}% Humidity</span>
        </div>
        <div className="p-2 rounded-lg bg-sand-50 border border-sand-200 flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-charcoal-400" />
          <span>{windSpeed} km/h</span>
        </div>
      </div>

      {/* AI Weather Advice */}
      <div className="p-2.5 rounded-xl bg-ivory-50 border border-sand-200 text-xs text-charcoal-700 flex items-start gap-2">
        <Compass className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
        <p className="leading-snug">{advice}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;

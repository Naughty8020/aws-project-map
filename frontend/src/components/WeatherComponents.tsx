'use client';

import { useState, useEffect } from 'react';
import fetchWeatherData from '../api/weather';
import type { Spot } from '../types/spot';

type Props = {
  spots: Spot[];
  selectedSpot: Spot | null;
};

function weatherIcon(condition?: string) {
  if (!condition) return '🌤️';

  switch (condition.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
    case 'drizzle':
      return '🌧️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'mist':
    case 'fog':
    case 'haze':
      return '🌫️';
    default:
      return '🌤️';
  }
}

export default function WeatherData({ selectedSpot }: Props) {
  const [weather, setWeather] = useState<{
    temperature: number;
    condition: string;
  } | null>(null);

  const lat = selectedSpot?.lat ?? 35.6895;
  const lng = selectedSpot?.lng ?? 139.6917;

  useEffect(() => {
    async function loadWeather() {
      const data = await fetchWeatherData(lat, lng);
      setWeather(data);
    }
    loadWeather();
  }, [lat, lng]);

  if (!weather) return null;

  return (
    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 shadow-md text-white text-sm">
      {/* 天気アイコン */}
      <span className="text-2xl">{weatherIcon(weather.condition)}</span>

      {/* 温度表示 */}
      <span>{Math.round(weather.temperature)}°C</span>
    </div>
  );
}


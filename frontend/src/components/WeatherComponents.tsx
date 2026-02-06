'use client';

import { useState, useEffect } from 'react';
import fetchWeatherData from '../api/weather';
import type { Spot } from '../types/spot';

type Props = {
  spots: Spot[]; // spotsが必要なければ削除してもOK
  selectedSpot: Spot | null;
};

// キャッシュの有効期限 (2時間)
const CACHE_DURATION = 2 * 60 * 60 * 1000;

function weatherIcon(condition?: string) {
  if (!condition) return '🌤️';
  switch (condition.toLowerCase()) {
    case 'clear': return '☀️';
    case 'clouds': return '☁️';
    case 'rain':
    case 'drizzle': return '🌧️';
    case 'thunderstorm': return '⛈️';
    case 'snow': return '❄️';
    case 'mist':
    case 'fog':
    case 'haze': return '🌫️';
    default: return '🌤️';
  }
}

export default function WeatherData({ selectedSpot }: Props) {
  const [weather, setWeather] = useState<{
    temperature: number;
    condition: string;
  } | null>(null);

  // デフォルトは京都（または東京）
  const lat = selectedSpot?.lat ?? 35.0116;
  const lng = selectedSpot?.lng ?? 135.7681;

  useEffect(() => {
    async function loadWeather() {
      const cacheKey = `weather_${lat}_${lng}`;
      const cached = localStorage.getItem(cacheKey);
      const now = Date.now();

      // --- キャッシュチェック ---
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (now - timestamp < CACHE_DURATION) {
          setWeather(data);
          return; // キャッシュがあればここで終了
        }
      }

      // --- キャッシュがない場合のみFetch ---
      try {
        const data = await fetchWeatherData(lat, lng);
        setWeather(data);
        // 新しいデータをキャッシュに保存
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
      } catch (error) {
        console.error("Weather fetch failed", error);
      }
    }

    loadWeather();
  }, [lat, lng]);

  if (!weather) return null;

  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1 shadow-md text-white text-sm border border-white/30">
      <span className="text-xl">{weatherIcon(weather.condition)}</span>
      <span className="font-bold">{Math.round(weather.temperature)}°C</span>
      <span className="text-[10px] opacity-60 uppercase">{weather.condition}</span>
    </div>
  );
}

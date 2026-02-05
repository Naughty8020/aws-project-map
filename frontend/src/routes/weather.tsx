import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import fetchWeatherData from '../api/weather'
// 必要に応じてパスを調整してください
// import type { Spot } from '../types/spot' 

function weatherIcon(condition?: string) {
  if (!condition) return '🌤️'
  switch (condition.toLowerCase()) {
    case 'clear': return '☀️'
    case 'clouds': return '☁️'
    case 'rain':
    case 'drizzle': return '🌧️'
    case 'thunderstorm': return '⛈️'
    case 'snow': return '❄️'
    case 'mist':
    case 'fog':
    case 'haze': return '🌫️'
    default: return '🌤️'
  }
}

export const Route = createFileRoute('/weather')({
  component: WeatherPage,
})

function WeatherPage() {
  // TanStack Routerでは検索パラメータ（?lat=...）から取得することも可能ですが、
  // 一旦現在のロジックを継承します
  const [weather, setWeather] = useState<{
    temperature: number;
    condition: string;
  } | null>(null)

  // デフォルト値（東京）
  const lat = 35.6895
  const lng = 139.6917

  useEffect(() => {
    async function loadWeather() {
      const data = await fetchWeatherData(lat, lng)
      setWeather(data)
    }
    loadWeather()
  }, [lat, lng])

  if (!weather) return (
    <div className="p-10 text-white">Loading weather...</div>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl text-white">
        <span className="text-6xl">{weatherIcon(weather.condition)}</span>
        <div className="flex flex-col">
          <span className="text-4xl font-bold">{Math.round(weather.temperature)}°C</span>
          <span className="text-sm opacity-80 uppercase tracking-widest">{weather.condition}</span>
        </div>
      </div>
    </div>
  )
}

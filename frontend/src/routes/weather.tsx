import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import fetchWeatherData from '../api/weather'
import { fetchKyotoSpots } from '../api/spots'

const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2時間をミリ秒に変換

async function getWeatherDataWithCache(lat: number, lng: number) {
  const cacheKey = `weather_${lat}_${lng}`;
  const cached = localStorage.getItem(cacheKey);
  const now = Date.now();

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (now - timestamp < CACHE_DURATION) {
      console.log(`Cache Hit: ${cacheKey}`);
      return data;
    }
  }

  // キャッシュがない、または2時間過ぎた場合はAPIを叩く
  console.log(`API Fetch: ${cacheKey}`);
  const data = await fetchWeatherData(lat, lng);
  localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
  return data;
}

export const Route = createFileRoute('/weather')({
  component: WeatherPage,
})

function WeatherPage() {
  const [spotsWithWeather, setSpotsWithWeather] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true)
        const spotsData = await fetchKyotoSpots()

        const combinedData = await Promise.all(
          spotsData.map(async (spot: any) => {
            try {
              // キャッシュ機能付きの関数に変更
              const weather = await getWeatherDataWithCache(spot.lat, spot.lng)
              return { ...spot, weather }
            } catch {
              return { ...spot, weather: null }
            }
          })
        )

        setSpotsWithWeather(combinedData)
      } catch (error) {
        console.error("Load failed:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAllData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-black font-bold">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p>京都のデータを読込中 (2h Cache Active)</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-6 md:p-12 text-black bg-gray-50">
      <h1 className="text-3xl font-black mb-10 flex items-center gap-3">
        <span className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg">KYOTO</span>
        Spot Weather
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spotsWithWeather.map((spot, index) => {
          const w = spot.weather;
          const temp = w?.main?.temp ?? w?.temperature ?? w?.temp;
          const cond = w?.weather?.[0]?.main ?? w?.condition;

          return (
            <div key={index} className="group relative overflow-hidden bg-white border border-gray-200 rounded-3xl p-6 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-extrabold text-gray-800">{spot.name}</h3>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <span className="text-xl">{weatherIcon(cond)}</span>
                  <span className="font-mono font-bold text-blue-700">
                    {temp !== undefined ? `${Math.round(temp)}°` : "--°"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{spot.description}</p>
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">{weatherIcon(cond)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function weatherIcon(condition?: string) {
  const c = condition?.toLowerCase() || ''
  if (c.includes('clear')) return '☀️'
  if (c.includes('cloud')) return '☁️'
  if (c.includes('rain')) return '🌧️'
  if (c.includes('snow')) return '❄️'
  return '🌤️'
}

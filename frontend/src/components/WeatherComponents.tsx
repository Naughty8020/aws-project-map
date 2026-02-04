'use client';

import { useState, useEffect } from 'react';
import fetchWeatherData from '../api/weather';

export default function WeatherData() {
  const [weather, setWeather] = useState<{ temperature: number; condition: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 例として東京の座標 (35.6895, 139.6917) を使用
  const lat = 35.6895;
  const lng = 139.6917;

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        const data = await fetchWeatherData(lat, lng);
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [lat, lng]);

  if (loading) return <p>データを読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>エラー: {error}</p>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '300px' }}>
      <h2>現在の天気</h2>
      <p><strong>場所:</strong> 東京 (緯度: {lat}, 経度: {lng})</p>
      {weather && (
        <>
          <p><strong>気温:</strong> {weather.temperature} °C</p>
          <p><strong>状態:</strong> {weather.condition}</p>
        </>
      )}
      <button onClick={() => window.location.reload()} style={{ marginTop: '10px' }}>
        再読み込み
      </button>
    </div>
  );
}

export default async function fetchWeatherData(lat: number, lng: number): Promise<{ temperature: number; condition: string }> {
  // 座標を動的に埋め込み
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=Asia%2FTokyo`;

  const res = await fetch(url);

  if (!res.ok) throw new Error('Failed to fetch weather data');

  const data = await res.json();

  // Open-Meteoの現在の天気データから抽出
  return {
    temperature: data.current_weather.temperature,
    condition: getWeatherCondition(data.current_weather.weathercode)
  };
}

// WMO Weather interpretation codes を日本語に変換
function getWeatherCondition(code: number): string {
  if (code === 0) return '快晴';
  if (code <= 3) return '晴れ/曇り';
  if (code >= 51 && code <= 67) return '雨';
  if (code >= 71 && code <= 77) return '雪';
  if (code >= 80) return '豪雨/雷雨';
  return '不明';
}

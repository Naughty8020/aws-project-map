import React from 'react';
import Header from './components/Header';
import GoogleMap from './components/MapComponents';
import CrowdGraph from './components/CrowdGraph';
import SelectedSpotCard from './components/SelectedSpotCard';
import { fetchKyotoSpots } from './api/spots';
import type { Spot } from './types/spot';

export default function App() {
  const [spots, setSpots] = React.useState<Spot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedSpotName, setSelectedSpotName] = React.useState<string | null>(null);

  // S3からデータ取得
  React.useEffect(() => {
    async function loadSpots() {
      try {
        const data = await fetchKyotoSpots();
        setSpots(data);
      } catch (err) {
        console.error(err);
        setError('データ取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }
    loadSpots();
  }, []);

  const selectedSpot: Spot | null = React.useMemo(() => {
    if (!selectedSpotName) return null;
    return spots.find((s) => s.name === selectedSpotName) ?? null;
  }, [spots, selectedSpotName]);

  const handleSelectSpot = (spot: Spot) => setSelectedSpotName(spot.name);

  // Escで選択解除
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSpotName(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="flex gap-20 px-10 pb-10 mt-16">
        {/* 左：Map */}
        <div className="flex-[2] min-w-[400px]">
          <GoogleMap
            spots={spots}
            selectedSpot={selectedSpot}
            onSelectSpot={handleSelectSpot}
          />
        </div>

        {/* 右：カード＋グラフ */}
        <div className="flex-[2] flex flex-col h-[700px] gap-4">
          {/* カード */}
          <div className="h-1/2 overflow-hidden">
            <SelectedSpotCard
              spot={selectedSpot}
              onClear={() => setSelectedSpotName(null)}
            />
          </div>

          {/* グラフ */}
          <div className="h-1/2 w-full">
            <CrowdGraph
              spots={spots}
              selectedSpot={selectedSpot}
              onSelectSpot={handleSelectSpot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


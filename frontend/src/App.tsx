import React from 'react';
import Header from './components/Header';
import GoogleMap from './components/MapComponents';
import CrowdGraph from './components/CrowdGraph';
import { useCrowdData } from './hooks/useCrowdData';
import type { Spot } from './types/spot';

export default function App(){
  const { data, isLoading, error } = useCrowdData();

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  const spots = data ?? [];

  // ✅ 追加：選択状態（名前で持つと安全＆シンプル）
  const [selectedSpotName, setSelectedSpotName] = React.useState<string | null>(null);

  const selectedSpot: Spot | null = React.useMemo(() => {
    if (!selectedSpotName) return null;
    return spots.find((s) => s.name === selectedSpotName) ?? null;
  }, [spots, selectedSpotName]);

  const handleSelectSpot = (spot: Spot) => {
    setSelectedSpotName(spot.name);
  };

  return (
    <div>
      <Header />
      <div className="flex gap-20 p-10 ml-10 mt-16">
        <div className="flex-[2] min-w-[400px]">
          <GoogleMap
            spots={spots}
            selectedSpot={selectedSpot}
            onSelectSpot={handleSelectSpot}
          />
        </div>

        <div className="flex-[2] flex justify-center">
          <div className="w-full mt-40 max-w-full">
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

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GoogleMap from './components/MapComponents';
import CrowdGraph from './components/CrowdGraph';
import { useCrowdData } from './hooks/useCrowdData';
import type { Spot } from './types/spot';
import SelectedSpotCard from './components/SelectedSpotCard';

export default function App() {
  const { data, isLoading, error } = useCrowdData();
  const spots: Spot[] = data ?? [];

  const [selectedSpotName, setSelectedSpotName] = React.useState<string | null>(null);

  const selectedSpot: Spot | null = React.useMemo(() => {
    if (!selectedSpotName) return null;
    return spots.find((s) => s.name === selectedSpotName) ?? null;
  }, [spots, selectedSpotName]);

  const handleSelectSpot = (spot: Spot) => setSelectedSpotName(spot.name);

  // 任意：Escで解除
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSpotName(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

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

        {/* 右：カード（上）＋グラフ（下） */}
        <div className="flex-[2] flex flex-col h-[700px]">
          {/* 上半分：カード */}
          <div className="h-1/2 overflow-hidden">
            <SelectedSpotCard
              spot={selectedSpot}
              onClear={() => setSelectedSpotName(null)}
            />
          </div>

          {/* 下半分：グラフ */}
          <div className="h-1/2 flex items-center justify-center">
            <CrowdGraph
              spots={spots}
              selectedSpot={selectedSpot}
              onSelectSpot={handleSelectSpot}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
}

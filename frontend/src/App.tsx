import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
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
      setSpots(data.map((s) => ({ ...s, city: 'kyoto' as const })));
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
  <div className="min-h-screen flex flex-col">
    <Header />

    {/* main は「必要なだけ伸びる」 */}
    <main className="flex-1 pt-16">
  <div
    className="mx-auto w-full max-w-[1400px] flex items-stretch gap-20 px-10 pb-10
               h-[min(700px,calc(100vh-220px))]"
  >
    <div className="flex-[2] min-w-[400px] h-full">
      <GoogleMap spots={spots} selectedSpot={selectedSpot} onSelectSpot={handleSelectSpot} />
    </div>

    <div className="flex-[2] h-full flex flex-col gap-4 min-h-0">
      <div className="flex-1 min-h-0 overflow-hidden">
        <SelectedSpotCard spot={selectedSpot} onClear={() => setSelectedSpotName(null)} />
      </div>
      <div className="flex-1 min-h-0">
        <CrowdGraph spots={spots} selectedSpot={selectedSpot} onSelectSpot={handleSelectSpot} />
      </div>
    </div>
  </div>
</main>


    {/* Footer は自然に一番下へ */}
    <Footer />
  </div>
);

}


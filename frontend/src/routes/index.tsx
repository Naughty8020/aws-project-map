import React from 'react';
import GoogleMap from '../components/MapComponents';
import CrowdGraph, { type SortMode } from '../components/CrowdGraph';
import SelectedSpotCard from '../components/SelectedSpotCard';
import SpotDetailModal from '../components/SpotDetailModal'; // ⭐ 追加
import { fetchKyotoSpots } from '../api/spots';
import type { Spot } from '../types/spot';
import { sortSpotsByDistance } from '../utils/distance';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

export default function IndexPage() {
  const [spots, setSpots] = React.useState<Spot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedSpotName, setSelectedSpotName] = React.useState<string | null>(null);
  const [modalSpot, setModalSpot] = React.useState<Spot | null>(null); // ⭐ モーダル用
  const [myPos, setMyPos] = React.useState<{ lat: number; lng: number } | null>(null);
  const [myAcc, setMyAcc] = React.useState<number | null>(null);
  const [sortMode, setSortMode] = React.useState<SortMode>('crowd-asc');

  const detailPanelRef = React.useRef<HTMLDivElement>(null);
  const scrollToDetail = React.useCallback(() => {
    detailPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

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

  // 並び替え済みデータ
  const viewSpots = React.useMemo(() => {
    if (sortMode === 'distance') {
      if (!myPos) return spots;
      return sortSpotsByDistance(spots, myPos);
    }

    const copy = [...spots];
    switch (sortMode) {
      case 'crowd-asc':
        return copy.sort((a, b) => a.crowd - b.crowd);
      case 'crowd-desc':
        return copy.sort((a, b) => b.crowd - a.crowd);
      case 'name':
        return copy.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
      default:
        return copy;
    }
  }, [spots, myPos, sortMode]);

  // Escでカード選択解除
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

      <main className="flex-1 pt-16 px-10">
        <div className="mx-auto w-full max-w-[1700px] flex items-stretch gap-20 pb-10 h-[calc(100vh-220px)]">
          <div className="flex-[2] min-w-[400px] h-full">
            <GoogleMap
              spots={spots}
              selectedSpot={selectedSpot}
              onSelectSpot={handleSelectSpot}
              onLocationChange={(pos, acc) => {
                setMyPos(pos);
                setMyAcc(acc ?? null);
                setSortMode('distance');
              }}
              myPos={myPos}
              myAcc={myAcc}
              onShowDetail={scrollToDetail}
            />
          </div>

          <div className="flex-[2] h-full flex flex-col gap-4 min-h-0">
            {/* ✅ スクロール先 */}
            <div ref={detailPanelRef} className="flex-1 min-h-0 overflow-hidden">
              <SelectedSpotCard
                spot={selectedSpot}
                onClear={() => setSelectedSpotName(null)}
                onOpenDetail={(spot) => setModalSpot(spot)}
              />
            </div>

            <div className="flex-1 mt-8 min-h-0">
              <CrowdGraph
                spots={viewSpots}
                selectedSpot={selectedSpot}
                onSelectSpot={handleSelectSpot}
                sortMode={sortMode}
                onSortModeChange={setSortMode}
                canSortByDistance={!!myPos}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ⭐ 詳細モーダル */}
      {modalSpot && (
        <SpotDetailModal
          spot={modalSpot}
          onClose={() => setModalSpot(null)}
        />
      )}

    </div>
  );
}


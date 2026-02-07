import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import GoogleMap from '../components/MapComponents';
import CrowdGraph, { type SortMode } from '../components/CrowdGraph';
import SelectedSpotCard from '../components/SelectedSpotCard';
import SpotDetailModal from '../components/SpotDetailModal';

import type { Spot } from '../types/spot';
import { sortSpotsByDistance } from '../utils/distance';

import { fetchKyotoSpots } from '../api/spots';
import { syncAiSpots } from '../api/aiClinent';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

export default function IndexPage() {
  const [spots, setSpots] = React.useState<Spot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedSpotName, setSelectedSpotName] = React.useState<string | null>(null);
  const [modalSpot, setModalSpot] = React.useState<Spot | null>(null);

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

  // ✅ データ取得（AI優先 → 失敗時S3）
  React.useEffect(() => {
    async function loadSpots() {
      try {
        try {
          const aiSpots = await syncAiSpots();
          setSpots(aiSpots.map((s) => ({ ...s, city: 'kyoto' as const })));
        } catch (aiErr) {
          console.warn('AI sync failed, fallback to S3', aiErr);
          const base = await fetchKyotoSpots();
          setSpots(base.map((s) => ({ ...s, city: 'kyoto' as const })));
        }
      } catch (err) {
        console.error(err);
        setError('データ取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    loadSpots();
  }, []);

  // ✅ 選択中スポット
  const selectedSpot: Spot | null = React.useMemo(() => {
    if (!selectedSpotName) return null;
    return spots.find((s) => s.name === selectedSpotName) ?? null;
  }, [spots, selectedSpotName]);

  const handleSelectSpot = (spot: Spot) => {
    setSelectedSpotName(spot.name);
  };

  const handleShowDetailFromInfo = React.useCallback(
    (spot: Spot) => {
      scrollToDetail();
      setModalSpot(spot);
    },
    [scrollToDetail]
  );

  // ✅ 並び替え
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

  // ✅ Escで解除
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSpotName(null);
        setModalSpot(null);
      }
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
          {/* 🗺 Map */}
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
              onShowDetail={handleShowDetailFromInfo}
            />
          </div>

          {/* 📊 Right panel */}
          <div className="flex-[2] h-full flex flex-col gap-4 min-h-0">
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
          myPos={myPos}
          onClose={() => setModalSpot(null)}
        />
      )}
    </div>
  );
}


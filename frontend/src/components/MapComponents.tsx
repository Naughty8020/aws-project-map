import '../components/MapComponent.css';
import type { Spot } from '../types/spot';
import { APIProvider, Map, useApiIsLoaded,useMap } from '@vis.gl/react-google-maps';
import { Circle } from './Circle';
import React from 'react';

type Props = {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function MapInner({
  spots,
  mapId,
  selectedSpot,
  onSelectSpot,
}: {
  spots: Spot[];
  mapId?: string;
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
}) {
  const isLoaded = useApiIsLoaded();

  // ✅ Mapインスタンス取得（Mapの子コンポーネントで使える）
  const map = useMap();

  const getCrowdColor = (crowd: number): string => {
    if (crowd < 10) return '#00FF00';
    if (crowd < 20) return '#33FF00';
    if (crowd < 30) return '#66FF00';
    if (crowd < 40) return '#99FF00';
    if (crowd < 50) return '#CCFF00';
    if (crowd < 60) return '#FFFF00';
    if (crowd < 70) return '#FFCC00';
    if (crowd < 80) return '#FF9900';
    return '#FF0000';
  };

  const crowdToRadius = (crowd: number): number => {
    const c = clamp(crowd, 0, 100);
    const scaled = Math.sqrt(c); // 0〜10に圧縮
    return clamp(60 + scaled * 16, 60, 220); // 60m〜220m
  };

  // ✅ Graphクリック/Mapクリックで selectedSpot が変わったら panTo / zoom
  React.useEffect(() => {
    if (!map || !selectedSpot) return;

    map.panTo({ lat: selectedSpot.lat, lng: selectedSpot.lng });

    // いまのズームが低いときだけ上げる（ユーザー操作を邪魔しにくい）
    const currentZoom = map.getZoom() ?? 13;
    const targetZoom = 15;
    if (currentZoom < targetZoom) map.setZoom(targetZoom);
  }, [map, selectedSpot]);

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center">地図を読み込み中...</div>;
  }

  return (
    <Map
      defaultZoom={13}
      defaultCenter={{ lat: 35.0116, lng: 135.7681 }}
      gestureHandling="greedy"
      {...(mapId ? { mapId } : {})}
    >
      {spots.map((spot) => {
        const isSelected = selectedSpot?.name === spot.name;

        return (
          <Circle
            key={spot.name}
            center={{ lat: spot.lat, lng: spot.lng }}
            radius={crowdToRadius(spot.crowd)}
            onClick={() => onSelectSpot(spot)}
            options={{
              clickable: true,

              fillColor: getCrowdColor(spot.crowd),
              fillOpacity: isSelected
                ? 0.28
                : 0.08 + clamp(spot.crowd / 100, 0, 1) * 0.18,

              // 選択中は枠を強調（黒枠）
              strokeColor: isSelected ? '#111827' : getCrowdColor(spot.crowd),
              strokeOpacity: isSelected ? 0.9 : 0.35,
              strokeWeight: isSelected ? 3 : 1,
            }}
          />
        );
      })}
    </Map>
  );
}

export default function GoogleMap({ spots, selectedSpot, onSelectSpot }: Props) {
  const MAP_ID = (import.meta.env.VITE_MAP_ID as string | undefined) || undefined;
  const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? '';

  return (
    <div className="w-full max-w-[1000px] h-[700px] mx-auto mt-10 rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <APIProvider apiKey={API_KEY}>
        <MapInner
          spots={spots}
          mapId={MAP_ID}
          selectedSpot={selectedSpot}
          onSelectSpot={onSelectSpot}
        />
      </APIProvider>
    </div>
  );
}

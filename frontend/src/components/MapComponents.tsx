import React from 'react';
import { APIProvider, Map, useApiIsLoaded, useMap } from '@vis.gl/react-google-maps';
import { Circle } from './Circle';
import type { Spot } from '../types/spot';

// 親コンポーネントのProps
type Props = {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
};

// MapInnerのProps
interface MapInnerProps extends Props {
  mapId?: string;
}

// 数値を指定範囲にクランプ
function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

// MapInnerコンポーネント
function MapInner({ mapId, spots, selectedSpot, onSelectSpot }: MapInnerProps) {
  const isLoaded = useApiIsLoaded();
  const map = useMap();

  // 人混み数に応じた色
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

  // crowdを半径に変換
  const crowdToRadius = (crowd: number): number => {
    const c = clamp(crowd, 0, 100);
    const scaled = Math.sqrt(c);
    return clamp(60 + scaled * 16, 60, 220);
  };

  // selectedSpotが変わったらパン・ズーム
  React.useEffect(() => {
    if (!map || !selectedSpot) return;

    map.panTo({ lat: selectedSpot.lat, lng: selectedSpot.lng });

    const currentZoom = map.getZoom() ?? 13;
    const targetZoom = 15;
    if (currentZoom < targetZoom) map.setZoom(targetZoom);
  }, [map, selectedSpot]);

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center">地図を読み込み中...</div>;
  }

  return (
    <Map
      className="w-full h-full"   // ← これ追加（最重要）
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

// 親コンポーネント
export default function GoogleMap({ spots, selectedSpot, onSelectSpot }: Props) {
  const MAP_ID = import.meta.env.VITE_MAP_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="w-full h-full rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <APIProvider apiKey={API_KEY ?? ''}>
        <MapInner
          mapId={MAP_ID}
          spots={spots}
          selectedSpot={selectedSpot}
          onSelectSpot={onSelectSpot}
        />
      </APIProvider>
    </div>
  );
}


import React from 'react';
import { APIProvider, Map, useApiIsLoaded, useMap } from '@vis.gl/react-google-maps';
import { Circle } from './Circle';
import LocationOverlay from './LocationOverlay';
import CurrentLocationControl from './CurrentLocationControl';
import type { Spot } from '../types/spot';
import SelectedSpotInfoWindow from './SelectedSpotInfoWindow';
import { syncAiSpots } from '../api/aiClinent';


type Props = {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;

  // ✅ Appから受け取る現在地
  myPos?: google.maps.LatLngLiteral | null;
  myAcc?: number | null;

  // ✅ Mapが取得したらAppへ通知
  onLocationChange?: (pos: google.maps.LatLngLiteral, acc?: number) => void;
  onShowDetail?: (spot: Spot) => void;
};

interface MapInnerProps extends Props {
  mapId?: string;
}


function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function MapInner({
  mapId,
  spots,
  selectedSpot,
  onSelectSpot,
  myPos,
  myAcc,
  onLocationChange,
  onShowDetail,
}: MapInnerProps) {
  const isLoaded = useApiIsLoaded();
  const map = useMap();

  const recenteringRef = React.useRef(false);

  // ✅ hover と pinned（固定）
  const [hoverSpotName, setHoverSpotName] = React.useState<string | null>(null);
  const [pinnedSpotName, setPinnedSpotName] = React.useState<string | null>(null);

  // 表示するスポット：固定が最優先
  const shownSpot = React.useMemo(() => {
    const name = pinnedSpotName ?? hoverSpotName;
    if (!name) return null;
    return spots.find((s) => s.name === name) ?? null;
  }, [spots, pinnedSpotName, hoverSpotName]);

  const isPinned = pinnedSpotName !== null;

  // ✅ ローカル（保険）: Appが使わない場合でも動くように
  const [locating, setLocating] = React.useState(false);
  const [myPosLocal, setMyPosLocal] = React.useState<google.maps.LatLngLiteral | null>(null);
  const [myAccLocal, setMyAccLocal] = React.useState<number | null>(null);

  // ✅ 表示に使う現在地（App優先）
  const effectivePos = myPos ?? myPosLocal;
  const effectiveAcc = myAcc ?? myAccLocal;

  const geolocationEnabled = typeof window !== 'undefined' && 'geolocation' in navigator;

  const handleLocate = React.useCallback(() => {
    if (!geolocationEnabled || !map) return;

    recenteringRef.current = true;

    setPinnedSpotName(null);
    setHoverSpotName(null);

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {

        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const acc = pos.coords.accuracy;

        setMyPosLocal(next);
        setMyAccLocal(acc ?? null);
        onLocationChange?.(next, acc);

        map.panTo(next);
        const z = map.getZoom() ?? 13;
        if (z < 15) map.setZoom(15);

        setLocating(false);

        window.setTimeout(() => {
          recenteringRef.current = false;
        }, 300);
      },
      (err) => {
        console.error('geolocation error:', err);
        setLocating(false);
        alert('現在地を取得できませんでした（位置情報の許可 / HTTPS を確認）');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 }
    );
  }, [geolocationEnabled, map, onLocationChange]);

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
    const scaled = Math.sqrt(c);
    return clamp(200 + scaled * 16, 60, 500);
  };

  React.useEffect(() => {
    if (!map) return;

    if (recenteringRef.current) return;

    // pinned があればそれに寄せる。なければ selectedSpot（グラフ選択）に寄せる
    const target = (pinnedSpotName
      ? spots.find((s) => s.name === pinnedSpotName) ?? null
      : selectedSpot);

    if (!target) return;

    map.panTo({ lat: target.lat, lng: target.lng });

    const currentZoom = map.getZoom() ?? 13;
    const targetZoom = 15;
    if (currentZoom < targetZoom) map.setZoom(targetZoom);
  }, [map, selectedSpot, pinnedSpotName, spots]);

  React.useEffect(() => {
    if (!map) return;

    const listener = map.addListener('click', () => {
      setPinnedSpotName(null);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);



  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center">地図を読み込み中...</div>;
  }

  return (
    <div className="w-full h-full relative">
      {/* ✅ 右下コントロール（被り回避：GoogleズームはOFFにする前提） */}
      <CurrentLocationControl
        onLocate={handleLocate}
        locating={locating}
        enabled={geolocationEnabled}
        onZoomIn={() => map?.setZoom((map?.getZoom() ?? 13) + 1)}
        onZoomOut={() => map?.setZoom((map?.getZoom() ?? 13) - 1)}
      />

      <Map
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
        defaultZoom={13}
        defaultCenter={{ lat: 35.0116, lng: 135.7681 }}
        gestureHandling="greedy"
        zoomControl={false} // ✅ これで「Googleの＋−」を消して被り解消
        streetViewControl={false}
        fullscreenControl={false}
        {...(mapId ? { mapId } : {})}
      >
        <LocationOverlay position={effectivePos} accuracyMeters={effectiveAcc} />

        {/* ✅ 選択中スポットの吹き出し */}
        <SelectedSpotInfoWindow
          spot={shownSpot}
          myPos={effectivePos}
          onClose={() => setPinnedSpotName(null)} // ✅ ×で固定解除
          // ✅ 固定中だけ「詳細を見る」を有効化（hover中は出さない/押せない）
          onShowDetail={isPinned ? onShowDetail : undefined}
        />


        {spots.map((spot) => {
          const hovered = hoverSpotName === spot.name;
          const pinned = pinnedSpotName === spot.name;

          return (
            <Circle
              key={spot.name}
              center={{ lat: spot.lat, lng: spot.lng }}
              radius={crowdToRadius(spot.crowd)}
              onMouseOver={() => {
                if (pinnedSpotName) return; // 固定中は hover 追従しない
                setHoverSpotName(spot.name);
              }}
              onMouseOut={() => {
                if (pinnedSpotName) return;
                setHoverSpotName((prev) => (prev === spot.name ? null : prev));
              }}
              onClick={(e) => {
                e?.stop?.();
                setPinnedSpotName(spot.name); // ✅ クリックで固定
                setHoverSpotName(null);       // ✅ プレビュー解除
                onSelectSpot(spot);           // ✅ 選択状態も更新（右ペイン連動したいなら）
              }}
              options={{
                clickable: true,
                fillColor: getCrowdColor(spot.crowd),
                fillOpacity: pinned
                  ? 0.28
                  : hovered
                    ? 0.16
                    : 0.08 + clamp(spot.crowd / 100, 0, 1) * 0.18,
                strokeColor: pinned ? '#111827' : getCrowdColor(spot.crowd),
                strokeOpacity: pinned ? 0.9 : hovered ? 0.7 : 0.35,
                strokeWeight: pinned ? 3 : hovered ? 2 : 1,
              }}
            />
          );
        })}

      </Map>
    </div>
  );
}

export default function GoogleMap(props: Props) {
  const MAP_ID = import.meta.env.VITE_MAP_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // ✅ 追加：コンポーネントがマウントされた時に実行
  React.useEffect(() => {
    const runSync = async () => {
      try {
        console.log("Starting AI Sync...");
        const res = await syncAiSpots();
        console.log("AI Sync Completed!", res);
      } catch (err) {
        console.error("AI Sync Failed:", err);
      }
    };

    runSync();
  }, []); // 空の配列を渡すことで1回だけ実行される

  return (
    <div className="w-full h-full rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <APIProvider apiKey={API_KEY ?? ''}>
        <MapInner mapId={MAP_ID} {...props} />
      </APIProvider>
    </div>
  );
}

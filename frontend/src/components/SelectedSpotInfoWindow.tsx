import { useContext, useEffect, useRef } from 'react';
import { GoogleMapsContext } from '@vis.gl/react-google-maps';
import type { Spot } from '../types/spot';

type Props = {
  spot: Spot | null;
  myPos?: { lat: number; lng: number } | null;
  onClose?: () => void;
  onShowDetail?: () => void;
};

// ✅ 距離計算（Haversine）
function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function SelectedSpotInfoWindow({ spot, myPos, onClose, onShowDetail }: Props) {
  const map = useContext(GoogleMapsContext)?.map;
  const infoRef = useRef<google.maps.InfoWindow | null>(null);

  // InfoWindow は1回だけ生成
  if (!infoRef.current) {
    infoRef.current = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, -8),
    });
  }

  useEffect(() => {
    if (!map || !infoRef.current) return;

    if (!spot) {
      infoRef.current.close();
      return;
    }

    // ✅ 現在地からの距離テキスト
    let distanceText = '';
    if (myPos) {
      const d = distanceMeters(myPos, { lat: spot.lat, lng: spot.lng });
      distanceText =
        d < 1000
          ? `📍 現在地から ${Math.round(d)}m`
          : `📍 現在地から ${(d / 1000).toFixed(1)}km`;
    }

    const destination = `${spot.lat},${spot.lng}`;

    const directionsUrl = myPos
    ? `https://www.google.com/maps/dir/?api=1&origin=${myPos.lat},${myPos.lng}&destination=${destination}&travelmode=walking`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;


    const content = `
  <div style="
    font-size:14px;
    line-height:1.4;
    min-width:160px;
    padding:6px 8px;
  ">
    <div style="font-weight:600; margin-bottom:4px;">
      ${spot.name}
    </div>

    <div style="color:#374151; margin-bottom:4px;">
      混雑度：
      <span style="
        font-weight:600;
        color:${spot.crowd >= 70 ? '#dc2626' : spot.crowd >= 40 ? '#d97706' : '#16a34a'};
      ">
        ${spot.crowd}%
      </span>
    </div>

    ${
      distanceText
        ? `<div style="font-size:12px; color:#6b7280; margin-bottom:6px;">${distanceText}</div>`
        : `<div style="height:6px;"></div>`
    }

    <a
      href="${directionsUrl}"
      target="_blank"
      rel="noopener noreferrer"
      style="
        display:inline-block;
        padding:6px 10px;
        border:1px solid #e5e7eb;
        border-radius:8px;
        text-decoration:none;
        color:#111827;
        background:#fff;
        font-size:12px;
        font-weight:600;
      "
    >
      🧭 Google Mapsで経路を見る
    </a>

    <a
  id="show-detail-link"
  href="#"
  style="
    display:inline-block;
    margin-top:6px;
    font-size:12px;
    font-weight:600;
    color:#2563eb;
    text-decoration:none;
  "
>
  ▶ 詳細を見る
</a>

  </div>
`;

    infoRef.current.setContent(content);
    infoRef.current.setPosition({ lat: spot.lat, lng: spot.lng });
    infoRef.current.open(map);
    infoRef.current.setZIndex(1000);

    // ✅ 詳細リンクのクリックを紐付け（後付け）
    let cleanupClick: (() => void) | undefined;
    setTimeout(() => {
      const el = document.getElementById('show-detail-link') as HTMLAnchorElement | null;
      if (!el) return;

      const handler = (e: MouseEvent) => {
        e.preventDefault();
        onShowDetail?.();
      };

      el.addEventListener('click', handler);
      cleanupClick = () => el.removeEventListener('click', handler);
    }, 0);

    const listener = infoRef.current.addListener('closeclick', () => {
      onClose?.();
    });

    return () => {
      cleanupClick?.(); // ✅ 追加
      google.maps.event.removeListener(listener);
    };
  }, [map, spot, myPos, onClose, onShowDetail]); // ✅ 追加


  return null;
}

import { useContext, useEffect, useMemo, useRef } from "react";
import { GoogleMapsContext } from "@vis.gl/react-google-maps";

type Props = {
  position: google.maps.LatLngLiteral | null;
  accuracyMeters: number | null;
};

export default function LocationOverlay({ position, accuracyMeters }: Props) {
  const map = useContext(GoogleMapsContext)?.map;

  const markerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  // 生成は一度だけ
  if (!markerRef.current) markerRef.current = new google.maps.Marker();
  if (!circleRef.current) circleRef.current = new google.maps.Circle();

  // 見た目設定（青点っぽい）
  const markerOptions = useMemo<google.maps.MarkerOptions>(() => {
    return {
      clickable: false,
      // シンプルな青丸（SVG）
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillOpacity: 1,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: "#1d4ed8",   // blue-700
        strokeColor: "#ffffff",
      },
      zIndex: 9999,
    };
  }, []);

  const circleOptions = useMemo<google.maps.CircleOptions>(() => {
    return {
      clickable: false,
      strokeOpacity: 0.25,
      strokeWeight: 1,
      fillOpacity: 0.10,
      fillColor: "#1d4ed8",
      strokeColor: "#1d4ed8",
      zIndex: 9998,
    };
  }, []);

  // mapに乗せる
  useEffect(() => {
    if (!map) return;

    markerRef.current!.setMap(map);
    circleRef.current!.setMap(map);

    return () => {
      markerRef.current?.setMap(null);
      circleRef.current?.setMap(null);
    };
  }, [map]);

  // 更新
  useEffect(() => {
    if (!markerRef.current || !circleRef.current) return;

    markerRef.current.setOptions(markerOptions);
    circleRef.current.setOptions(circleOptions);

    if (!position) {
      markerRef.current.setVisible(false);
      circleRef.current.setVisible(false);
      return;
    }

    markerRef.current.setVisible(true);
    markerRef.current.setPosition(position);

    circleRef.current.setVisible(true);
    circleRef.current.setCenter(position);

    const r = accuracyMeters ?? 50;
    circleRef.current.setRadius(Math.max(10, Math.min(r, 1000)));
  }, [position, accuracyMeters, markerOptions, circleOptions]);

  return null;
}

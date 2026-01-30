/* eslint-disable complexity */
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';

import type { Ref } from 'react';
import { GoogleMapsContext, latLngEquals } from '@vis.gl/react-google-maps';

type CircleEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  onRadiusChanged?: (r: ReturnType<google.maps.Circle['getRadius']>) => void;
  onCenterChanged?: (p: ReturnType<google.maps.Circle['getCenter']>) => void;
};

/**
 * ✅ 外から渡す形を「options + center + radius + events」に統一
 * - MapComponents.tsx で `<Circle options={{...}} center={...} radius={...} />` が通る
 * - options の中に center/radius を入れても動く（トップレベルを優先）
 */
export type CircleProps = CircleEventProps & {
  options?: google.maps.CircleOptions;
  center?: google.maps.LatLng | google.maps.LatLngLiteral | null;
  radius?: number | null;
};

export type CircleRef = Ref<google.maps.Circle | null>;

function useCircle(props: CircleProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged,
    options,
    center,
    radius
  } = props;

  // callbacks を ref に退避（再レンダリングで effect を余計に走らせない）
  const callbacks = useRef<Record<string, (e: unknown) => void>>({});
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged
  });

  const circle = useRef<google.maps.Circle | null>(null);

  // map 取得
  const map = useContext(GoogleMapsContext)?.map;

  // circle インスタンス生成は一度だけ
  if (circle.current === null) {
    circle.current = new google.maps.Circle();
  }

  // ✅ setOptions 用に最終 options を合成
  // - options.center/radius があっても、props の center/radius が優先
  const mergedOptions = useMemo<google.maps.CircleOptions>(() => {
    const base = options ?? {};
    const merged: google.maps.CircleOptions = { ...base };

    if (center !== undefined) merged.center = center ?? null;
    if (radius !== undefined) merged.radius = radius ?? 0;

    return merged;
  }, [options, center, radius]);

  // options 更新（setOptions は差分適用してくれる前提）
  useEffect(() => {
    if (!circle.current) return;
    circle.current.setOptions(mergedOptions);
  }, [mergedOptions]);

  // center の厳密同期（latLngEquals を活かす）
  useEffect(() => {
    if (!circle.current) return;

    const nextCenter = mergedOptions.center;
    if (!nextCenter) return;

    if (!latLngEquals(nextCenter, circle.current.getCenter())) {
      circle.current.setCenter(nextCenter);
    }
  }, [mergedOptions.center]);

  // radius の厳密同期
  useEffect(() => {
    if (!circle.current) return;

    const nextRadius = mergedOptions.radius;
    if (nextRadius === undefined || nextRadius === null) return;

    if (nextRadius !== circle.current.getRadius()) {
      circle.current.setRadius(nextRadius);
    }
  }, [mergedOptions.radius]);

  // map が来たら circle を map に乗せる
  useEffect(() => {
    if (!circle.current) return;

    if (!map) {
      if (map === undefined) {
        console.error('<Circle> has to be inside a Map component.');
      }
      return;
    }

    circle.current.setMap(map);

    return () => {
      circle.current?.setMap(null);
    };
  }, [map]);

  // イベント購読
  useEffect(() => {
    if (!circle.current) return;

    const gme = google.maps.event;

    [
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut']
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(circle.current!, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback];
        if (callback) callback(e);
      });
    });

    gme.addListener(circle.current, 'radius_changed', () => {
      const newRadius = circle.current!.getRadius();
      callbacks.current.onRadiusChanged?.(newRadius);
    });

    gme.addListener(circle.current, 'center_changed', () => {
      const newCenter = circle.current!.getCenter();
      callbacks.current.onCenterChanged?.(newCenter);
    });

    return () => {
      if (circle.current) gme.clearInstanceListeners(circle.current);
    };
  }, []);

  return circle.current;
}

/**
 * Component to render a circle on a map
 */
export const Circle = forwardRef<google.maps.Circle | null, CircleProps>((props, ref) => {
  const circle = useCircle(props);

  useImperativeHandle(ref, () => circle);

  return null;
});

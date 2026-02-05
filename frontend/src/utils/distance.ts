import type { Spot } from "../types/spot";

const R = 6371000; // meters

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s));
}

export function sortSpotsByDistance(spots: Spot[], me: { lat: number; lng: number }) {
  return [...spots].sort(
    (x, y) =>
      distanceMeters(me, { lat: x.lat, lng: x.lng }) -
      distanceMeters(me, { lat: y.lat, lng: y.lng })
  );
}

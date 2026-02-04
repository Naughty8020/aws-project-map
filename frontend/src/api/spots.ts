// // src/api/spots.ts
// import type { Spot } from '../types/spot';
//
// export async function fetchKyotoSpots(): Promise<Spot[]> {
//   const res = await fetch('http://localhost:3000/api/spots'); // APIのURL
//   if (!res.ok) throw new Error('Failed to fetch spots');
//   return res.json() as Promise<Spot[]>;
// }
//

import type { Spot } from '../types/spot';

export async function fetchKyotoSpots(): Promise<Spot[]> {
  const res = await fetch(
    'https://kyoto-tourist-data.s3.amazonaws.com/spots.json'
  ); // S3 の公開URL
  if (!res.ok) throw new Error('Failed to fetch spots');
  return res.json() as Promise<Spot[]>;
}

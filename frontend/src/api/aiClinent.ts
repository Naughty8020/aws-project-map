// src/api/spots.ts
import type { Spot, ApiResponse } from '../types/spot'; // Spots ではなく Spot

const API_BASE_URL = 'http://localhost:3000';

export async function fetchKyotoSpots(): Promise<Spot[]> {
  const res = await fetch(`${API_BASE_URL}/api/events`);
  if (!res.ok) throw new Error('Failed to fetch spots');

  // result の型を ApiResponse<Spot[]> に固定
  const result = (await res.json()) as ApiResponse<Spot[]>;

  if (!result.success) {
    throw new Error(result.error || 'Unknown error occurred');
  }

  return result.data; // ここで Spot[] が返る
}

export async function syncAiSpots(): Promise<Spot[]> {
  const res = await fetch(`${API_BASE_URL}/api/sync-spots`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync spots');

  const result = (await res.json()) as ApiResponse<Spot[]>;

  console.log('Sync result:', result);
  if (!result.success) {
    throw new Error(result.error || 'Sync error');
  }

  return result.data;
}

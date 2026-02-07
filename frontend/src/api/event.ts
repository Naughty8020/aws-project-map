import type { KyotoEvent } from '../types/event.ts';

export const getKyotoEvents = async (): Promise<KyotoEvent[]> => {
  const API_URL = 'http://localhost:3000/api/events';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    const result = await response.json();
    console.log('Fetched events:', result);

    // そのまま配列を返す
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};


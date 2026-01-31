import { hc } from 'hono/client';

// AppType が取れるまで一旦 any で通す（後で戻す）
export const client = hc<any>(import.meta.env.VITE_API_URL as string);

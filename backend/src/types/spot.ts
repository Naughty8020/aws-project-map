// src/types/spot.ts
export interface Spot {
  name: string;
  lat: number;
  lng: number;
  crowd: number;
  imageUrl: string;
  description: string;
  city?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Bedrockのレスポンスを受けるための一時的な型（おまけ）
export interface BedrockResponse {
  content?: { text: string }[];
}

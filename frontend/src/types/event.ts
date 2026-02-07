// 1件のイベント型
export interface KyotoEvent {
  eventId: string;
  eventName: string;
  eventDate: string;
  city: string;
  detail: string;
  image?: string | null;
  category?: string | null;
  link?: string | null;
  data: KyotoEvent[];
}

export interface KyotoEventResponse {
  success: boolean;
  data: KyotoEvent[];
}


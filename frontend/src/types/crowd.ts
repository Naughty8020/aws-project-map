export type CrowdPoint = {
  time: string;      // 例: "2026-01-30T12:00:00Z"
  value: number;     // 混雑度など
  lat?: number;
  lng?: number;
};

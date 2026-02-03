// export type Spot = {
//   name: string;
//   lat: number;
//   lng: number;
//   crowd: number;
//   imageUrl?: string;
//   description?: string;
//   city: 'kyoto';
// };

export interface Spot {
  name: string;       // スポット名
  lat: number;        // 緯度
  lng: number;        // 経度
  crowd: number;      // 混雑度 (0〜100)
}



import {useQuery} from '@tanstack/react-query';
// import {client} from '../api/aiClinent.ts';
//
// export const useCrowdData = () => {
//   return useQuery({
//     queryKey: ['crowdData'],
//     queryFn: async () => {
//       const res = await client.api.ai.$get();
//       return await res.json();
//     },
//   });
// };



export type Spot = {
  name: string;
  lat: number;
  lng: number;
  crowd: number;  

};


export const useCrowdData = () => {
  return useQuery<Spot[]>({
    queryKey: ['crowdData'],
    queryFn: async () => {
      // モックデータを返す
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ここでダミーのJSON（Spot型の配列）を返す
      const dummyData: Spot[] = [
        {
          name: "東京タワー",
          lat: 35.6586,
          lng: 139.7454,
          crowd: 80
        },
        {
          name: "浅草寺",
          lat: 35.7148,
          lng: 139.7967,
          crowd: 95
        },
        {
          name: "代々木公園",
          lat: 35.6717,
          lng: 139.6949,
          crowd: 30
        },
        {
          name: "新宿御苑",
          lat: 35.6852,
          lng: 139.7101,
          crowd: 50
        }
      ];

      return dummyData;
    },
  });
};

import React from 'react';
import type { Spot } from '../types/spot';

type Props = {
  spot: Spot | null;
  onClear: () => void;
};

function crowdLabel(crowd: number) {
  if (crowd < 10) return { text: 'ガラガラ', cls: 'bg-[#00FF00]/10 text-[#008000]' };
  if (crowd < 20) return { text: 'とても空いている', cls: 'bg-[#33FF00]/10 text-[#2B8000]' };
  if (crowd < 30) return { text: '空いている', cls: 'bg-[#66FF00]/10 text-[#558000]' };
  if (crowd < 40) return { text: 'やや空いている', cls: 'bg-[#99FF00]/10 text-[#7D8000]' };
  if (crowd < 50) return { text: 'ふつう', cls: 'bg-[#CCFF00]/10 text-[#808000]' };
  if (crowd < 60) return { text: 'やや混雑', cls: 'bg-[#FFFF00]/10 text-[#808000]' };
  if (crowd < 70) return { text: '混雑', cls: 'bg-[#FFCC00]/10 text-[#806600]' };
  if (crowd < 80) return { text: 'かなりの混雑', cls: 'bg-[#FF9900]/10 text-[#804D00]' };
  return { text: '満員', cls: 'bg-[#FF0000]/10 text-[#800000]' };
}

export default function SelectedSpotCard({ spot, onClear }: Props) {
  if (!spot) {
    return (
      <div className="h-full flex items-center justify-center border border-dashed rounded-xl text-gray-400">
        地図またはグラフから観光地を選択
      </div>
    );
  }

  const badge = crowdLabel(spot.crowd);

  return (
    <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {spot.imageUrl && (
        <img src={spot.imageUrl} alt={spot.name} className="h-40 w-full object-cover" />
      )}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{spot.name}</h2>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`}>
            {badge.text}
          </span>
        </div>
        {spot.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{spot.description}</p>
        )}
        <div className="text-sm text-gray-700">
          混雑度：<span className="font-semibold">{spot.crowd}%</span>
        </div>
        <div className="mt-auto flex justify-end">
          <button
            onClick={onClear}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            解除
          </button>
        </div>
      </div>
    </div>
  );
}


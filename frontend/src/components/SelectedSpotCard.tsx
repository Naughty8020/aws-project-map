import type { Spot } from '../types/spot';
import WeatherData from './WeatherComponents';

type Props = {
  spot: Spot | null;
  onClear: () => void;
  onOpenDetail: (spot: Spot) => void;
};

function crowdLabel(crowd: number) {
  if (crowd < 10) return { text: 'ガラガラ', color: 'bg-green-500' };
  if (crowd < 30) return { text: '空いている', color: 'bg-lime-500' };
  if (crowd < 50) return { text: 'ふつう', color: 'bg-yellow-500' };
  if (crowd < 70) return { text: '混雑', color: 'bg-orange-500' };
  return { text: '満員', color: 'bg-red-500' };
}

export default function SelectedSpotCard({ spot, onClear, onOpenDetail }: Props) {
  if (!spot) {
    return (
      <div className="h-full min-h-[240px] flex items-center justify-center border border-dashed rounded-2xl text-gray-400">
        地図またはグラフから観光地を選択
      </div>
    );
  }

  const badge = crowdLabel(spot.crowd);

  return (
    <div
      className="relative h-full min-h-[240px] w-full rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
      onClick={() => onOpenDetail(spot)} // ⭐ カード全体クリックで開く
    >
      {spot.imageUrl ? (
        <img
          src={spot.imageUrl}
          alt={spot.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-800" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
        <div className="flex items-center gap-2">
          <WeatherData selectedSpot={spot} spots={[]} />
          <span
            className={`backdrop-blur-md rounded-2xl px-3 py-1 text-xl font-bold text-white shadow-sm ${badge.color}`}
          >
            {badge.text}
          </span>
        </div>

        {/* ❌ モーダル開かないようにイベント止める */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute top-4 right-4 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-white">
          <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">{spot.name}</h2>

          <div className="flex items-baseline gap-2 text-sm font-medium">
            <span className="text-gray-200 text-xs">混雑度:</span>
            <span className="text-lg font-bold">{spot.crowd}%</span>
          </div>

          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden mb-3 mt-1">
            <div
              className={`h-full transition-all duration-700 ease-out ${badge.color}`}
              style={{ width: `${spot.crowd}%` }}
            />
          </div>

          {spot.description && (
            <p className="text-sm text-gray-300 line-clamp-2 leading-snug">
              {spot.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

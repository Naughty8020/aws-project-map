import type { Spot } from '../types/spot';

type Props = {
  spot: Spot | null;
  onClear: () => void;
};

function crowdLabel(crowd: number) {
  if (crowd < 30) return { text: '空いてる', cls: 'bg-green-100 text-green-800' };
  if (crowd < 60) return { text: 'ふつう', cls: 'bg-yellow-100 text-yellow-800' };
  return { text: '混雑', cls: 'bg-red-100 text-red-800' };
}

export default function SelectedSpotCard({ spot, onClear }: Props) {
  if (!spot) return null;

  const badge = crowdLabel(spot.crowd);

  return (
    <div className="w-full mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-gray-900">{spot.name}</h2>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`}>
              {badge.text}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>混雑度：<span className="font-semibold text-gray-900">{spot.crowd}%</span></span>
            <span>lat：{spot.lat.toFixed(4)}</span>
            <span>lng：{spot.lng.toFixed(4)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          解除
        </button>
      </div>
    </div>
  );
}

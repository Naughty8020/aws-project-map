import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { Spot } from '../types/spot';

export type SortMode = 'crowd-asc' | 'crowd-desc' | 'name' | 'distance';

type Props = {
  spots: Spot[]; // ← App側で並び替え済みの配列が来る
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;

  // ✅ 追加：App側の並び替えモード
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  canSortByDistance: boolean;
};

export default function CrowdGraph({
  spots,
  selectedSpot,
  onSelectSpot,
  sortMode,
  onSortModeChange,
  canSortByDistance,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const baseColor = (crowd: number) => {
    if (crowd < 10) return '#00FF00';
    if (crowd < 20) return '#33FF00';
    if (crowd < 30) return '#66FF00';
    if (crowd < 40) return '#99FF00';
    if (crowd < 50) return '#CCFF00';
    if (crowd < 60) return '#FFFF00';
    if (crowd < 70) return '#FFCC00';
    if (crowd < 80) return '#FF9900';
    return '#FF0000';
  };

  const series = [
    {
      name: '混雑度',
      data: spots.map((s) => ({
        x: s.name,
        y: s.crowd,
        fillColor: selectedSpot?.name === s.name ? '#111827' : baseColor(s.crowd),
      })),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      events: {
        dataPointSelection: (_e, _chart, config) => {
          const spot = spots[config.dataPointIndex];
          if (spot) onSelectSpot(spot);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      max: 100,
      title: { text: '混雑度 (%)' },
    },
    yaxis: {
      labels: {
        style: { fontSize: '13px' },
      },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val}%` },
    },
    legend: { show: false },
  };

  const chartHeight = spots.length * 45;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const labelOf = (m: SortMode) => {
    if (m === 'crowd-asc') return '混雑度 低い順';
    if (m === 'crowd-desc') return '混雑度 高い順';
    if (m === 'name') return '名前順';
    return '現在地から近い順';
  };

  const optionsList: { key: SortMode; label: string; disabled?: boolean }[] = [
    { key: 'crowd-asc', label: '混雑度 低い順' },
    { key: 'crowd-desc', label: '混雑度 高い順' },
    { key: 'name', label: '名前順' },
    {
      key: 'distance',
      label: canSortByDistance ? '現在地から近い順' : '現在地から近い順（現在地未取得）',
      disabled: !canSortByDistance,
    },
  ];

  return (
    <>
      {/* ソートUI */}
      <div ref={dropdownRef} className="relative w-72  z-50">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-2 py-1 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition whitespace-nowrap"
        >
          <span>並び替え： {labelOf(sortMode)}</span>
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>

        <div
          className={[
            'absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform origin-top transition-all duration-200',
            open ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none',
          ].join(' ')}
        >
          {optionsList.map((opt) => (
            <div
              key={opt.key}
              onClick={() => {
                if (opt.disabled) return;
                onSortModeChange(opt.key);
                setOpen(false);
              }}
              className={[
                'px-4 py-2 select-none',
                opt.disabled ? 'text-gray-400 cursor-not-allowed bg-white' : 'cursor-pointer hover:bg-gray-100',
                sortMode === opt.key ? 'bg-gray-100 font-medium' : '',
              ].join(' ')}
              title={opt.disabled ? '現在地を取得すると使えます' : undefined}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      {/* グラフスクロール領域 */}
      <div className="max-h-[270px] overflow-y-auto pr-2">
        <ReactApexChart options={options} series={series} type="bar" height={chartHeight} />
      </div>
    </>
  );
}

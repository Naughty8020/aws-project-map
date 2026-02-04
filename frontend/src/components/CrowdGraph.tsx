import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { Spot } from '../types/spot';

type Props = {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
};

export default function CrowdGraph({ spots, selectedSpot, onSelectSpot }: Props) {
  const [sortType, setSortType] = React.useState<'crowd-desc' | 'crowd-asc' | 'name'>('crowd-asc');
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

  const sortedSpots = React.useMemo(() => {
    const copy = [...spots];
    switch (sortType) {
      case 'crowd-desc':
        return copy.sort((a, b) => b.crowd - a.crowd);
      case 'crowd-asc':
        return copy.sort((a, b) => a.crowd - b.crowd);
      case 'name':
        return copy.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
      default:
        return copy;
    }
  }, [spots, sortType]);

  const series = [{
    name: '混雑度',
    data: sortedSpots.map((s) => ({
      x: s.name,
      y: s.crowd,
      fillColor: selectedSpot?.name === s.name ? '#111827' : baseColor(s.crowd),
    })),
  }];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      events: {
        dataPointSelection: (_e, _chart, config) => {
          const spot = sortedSpots[config.dataPointIndex];
          if (spot) onSelectSpot(spot);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true, // ← 横棒に変更
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
        style: { fontSize: '13px' }, // ← 名前が大きく読みやすい
      },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val}%` },
    },
    legend: { show: false },
  };

  // 上位10件分の高さを計算（1件あたり約45px）
  const chartHeight = sortedSpots.length * 45;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      {/* ソートUI */}
      <div ref={dropdownRef} className="relative w-56 mb-3 z-50">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-2 py-1 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition whitespace-nowrap"
        >
          <span>
            並び替え：
            {sortType === 'crowd-asc' && ' 混雑度 低い順'}
            {sortType === 'crowd-desc' && ' 混雑度 高い順'}
            {sortType === 'name' && ' 名前順'}
          </span>
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>

        <div
          className={`absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform origin-top transition-all duration-200 ${
            open ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
        >
          {[
            { key: 'crowd-asc', label: '混雑度 低い順' },
            { key: 'crowd-desc', label: '混雑度 高い順' },
            { key: 'name', label: '名前順' },
          ].map((opt) => (
            <div
              key={opt.key}
              onClick={() => {
                setSortType(opt.key as any);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                sortType === opt.key ? 'bg-gray-100 font-medium' : ''
              }`}
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

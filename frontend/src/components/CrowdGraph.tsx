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

  const baseColor = React.useCallback((crowd: number) => {
    if (crowd < 10) return '#00FF00';
    if (crowd < 20) return '#33FF00';
    if (crowd < 30) return '#66FF00';
    if (crowd < 40) return '#99FF00';
    if (crowd < 50) return '#CCFF00';
    if (crowd < 60) return '#FFFF00';
    if (crowd < 70) return '#FFCC00';
    if (crowd < 80) return '#FF9900';
    return '#FF0000';
  }, []);

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

  const categories = React.useMemo(() => sortedSpots.map((s) => s.name), [sortedSpots]);
  const data = React.useMemo(() => sortedSpots.map((s) => s.crowd), [sortedSpots]);
  const series = React.useMemo(() => [{ name: '混雑度', data }], [data]);

  const colors = React.useMemo(
    () =>
      sortedSpots.map((s) =>
        selectedSpot?.name === s.name ? '#111827' : baseColor(s.crowd)
      ),
    [sortedSpots, selectedSpot, baseColor]
  );

  const options: ApexOptions = React.useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        events: {
          dataPointSelection: (_e, _chart, config) => {
            const idx = config.dataPointIndex;
            const spot = sortedSpots[idx];
            if (spot) onSelectSpot(spot);
          },
        },
      },
      plotOptions: {
        bar: { columnWidth: '45%', distributed: true, borderRadius: 6 },
      },
      colors,
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: {
        categories,
        labels: { rotate: -45, style: { fontSize: '12px' } },
      },
      yaxis: {
        min: 0,
        max: 100,
        title: { text: '混雑度 (%)' },
      },
      tooltip: {
        y: { formatter: (val: number) => `${val}%` },
      },
    }),
    [categories, colors, onSelectSpot, sortedSpots]
  );

  // 🔽 外側クリックで閉じる
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <div ref={dropdownRef} className="relative w-56 mb-3">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <span className="whitespace-nowrap">
            並び替え：
            {sortType === 'crowd-asc' && ' 混雑度 低い順'}
            {sortType === 'crowd-desc' && ' 混雑度 高い順'}
            {sortType === 'name' && ' 名前順'}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

                  <div
            className={`absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform origin-top transition-all duration-200 z-50 ${
              open
                ? 'scale-y-100 opacity-100'
                : 'scale-y-0 opacity-0 pointer-events-none'
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
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition ${
                sortType === opt.key ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </>
  );
}

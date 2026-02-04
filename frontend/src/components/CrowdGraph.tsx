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
  // 🔽 初期値を「混雑度 低い順」に変更
  const [sortType, setSortType] = React.useState<'crowd-desc' | 'crowd-asc' | 'name'>('crowd-asc');

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

  // 🔽 ソート処理（default削除）
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

  return (
    <>
      {/* 🔽 並び替えUI（default削除） */}
      <div style={{ marginBottom: 12 }}>
        <select value={sortType} onChange={(e) => setSortType(e.target.value as any)}>
          <option value="crowd-asc">混雑度 低い順</option>
          <option value="crowd-desc">混雑度 高い順</option>
          <option value="name">名前順</option>
        </select>
      </div>

      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </>
  );
}

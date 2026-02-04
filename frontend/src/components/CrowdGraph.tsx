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

  const categories = React.useMemo(() => spots.map((s) => s.name), [spots]);
  const data = React.useMemo(() => spots.map((s) => s.crowd), [spots]);
  const series = React.useMemo(() => [{ name: '混雑度', data }], [data]);
  const colors = React.useMemo(
    () =>
      spots.map((s) =>
        selectedSpot?.name === s.name ? '#111827' : baseColor(s.crowd)
      ),
    [spots, selectedSpot, baseColor]
  );

  const options: ApexOptions = React.useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        events: {
          dataPointSelection: (_e, _chart, config) => {
            const idx = config.dataPointIndex;
            const spot = spots[idx];
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
      xaxis: { categories, labels: { rotate: -45, style: { fontSize: '12px' } } },
      yaxis: { min: 0, max: 100, title: { text: '混雑度 (%)' } },
      tooltip: { y: { formatter: (val: number) => `${val}%` } },
    }),
    [categories, colors, onSelectSpot, spots]
  );

  return <ReactApexChart options={options} series={series} type="bar" height={400} />;
}


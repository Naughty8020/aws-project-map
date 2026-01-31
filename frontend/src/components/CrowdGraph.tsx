import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { Spot } from '../types/spot';

type Props = {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
};


function baseColor(crowd: number): string {
  if (crowd < 30) return '#22c55e'; // green
  if (crowd < 60) return '#eab308'; // yellow
  return '#ef4444'; // red
}

export default function CrowdGraph({ spots, selectedSpot, onSelectSpot }: Props){
  const categories = React.useMemo(() => spots.map((s) => s.name), [spots]);
  const data = React.useMemo(() => spots.map((s) => s.crowd), [spots]);

  const series = React.useMemo(
    () => [
      {
        name: '混雑度',
        data,
      },
    ],
    [data]
  );

  // ✅ 選択中だけ濃く/暗くして強調
  const colors = React.useMemo(() => {
    return spots.map((s) => {
      if (!selectedSpot) return baseColor(s.crowd);
      return selectedSpot.name === s.name ? '#111827' : baseColor(s.crowd);
    });
  }, [spots, selectedSpot]);

  const options: ApexOptions = React.useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        events: {
          // ✅ 棒クリックで選択
          dataPointSelection: (_event, _chart, config) => {
            const idx = config.dataPointIndex;
            const spot = spots[idx];
            if (spot) onSelectSpot(spot);
          },
        },
      },

      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          borderRadius: 6,
        },
      },

      colors,

      dataLabels: {
        enabled: false,
      },

      legend: {
        show: false,
      },

      xaxis: {
        categories,
        labels: {
          rotate: -45, // 多いとき見やすい
          style: {
            fontSize: '12px',
          },
        },
      },

      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: '混雑度 (%)',
        },
      },

      tooltip: {
        y: {
          formatter: (val) => `${val}%`,
        },
      },
    }),
    [categories, colors, onSelectSpot, spots]
  );

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </div>
  );
}

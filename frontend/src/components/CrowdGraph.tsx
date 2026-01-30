import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { Spot } from '../types/spot';


type Props = {
  spots: Spot[];
};

export default function CrowdGraph({ spots }: Props) {
  // X軸（観光地名）
  const categories = React.useMemo(
    () => spots.map((s) => s.name),
    [spots]
  );

  // 混雑度
  const data = React.useMemo(
    () => spots.map((s) => s.crowd),
    [spots]
  );

  const series = React.useMemo(
    () => [
      {
        name: '混雑度',
        data,
      },
    ],
    [data]
  );

  const options: ApexOptions = React.useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
      },

      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          borderRadius: 6,
        },
      },

      colors: spots.map((s) => {
        if (s.crowd < 30) return '#22c55e'; // green
        if (s.crowd < 60) return '#eab308'; // yellow
        return '#ef4444'; // red
      }),

      dataLabels: {
        enabled: false,
      },

      legend: {
        show: false,
      },

      xaxis: {
        categories,
        labels: {
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
    [categories, spots]
  );

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={400}
      />
    </div>
  );
}

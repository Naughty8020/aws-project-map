   
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const colors = [
  '#008FFB',
  '#00E396',
  '#FEB019',
  '#FF4560',
  '#775DD0',
  '#3F51B5',
  '#546E7A',
  '#D4526E',
];

export default function ApexChart() {
  const [state, setState] = React.useState({
    series: [
      {
        data: [21, 22, 10, 28, 16, 21, 13, 30],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
       categories: [
  '清水寺',       // Kiyomizu-dera
  '金閣寺',       // Kinkaku-ji
  '銀閣寺',       // Ginkaku-ji
  '伏見稲荷大社', // Fushimi Inari Taisha
  '嵐山',         // Arashiyama
  '祇園',         // Gion
  '二条城',       // Nijo-jo
  '平安神宮',     // Heian Shrine
],
        labels: {
          style: {
            colors: colors,
            fontSize: '12px',
          },
        },
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={550}
        width={800}
      />
    </div>
  );
}


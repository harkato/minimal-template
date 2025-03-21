import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface NonLinearChartProps {
  data: [number, number][]; // Lista de pares [x, y]
}

const NonLinearChart: React.FC<NonLinearChartProps> = ({ data }) => {
  const series = [
    {
      name: 'Medição',
      data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'line',
      zoom: { enabled: true },
    },
    xaxis: {
      type: 'numeric',
      title: { text: 'Ângulo' },
    },
    yaxis: {
      title: { text: 'Torque' },
      min: 0,
      max: 100,
    },
    stroke: {
      curve: 'smooth',
    },
    markers: {
      size: 2,
    },
  };

  return <Chart options={options} series={series} type="line" height={350} />;
};

export default NonLinearChart;

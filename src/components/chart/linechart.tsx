// LineChart.js
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@mui/material';

const LineChart = () => {
  const options = {
    title: {
      text: 'Número de apertos por estação',
    },
    xAxis: {
      categories: ['1', '2', '3', '4', '5', '6'],
    },
    yAxis: {
      title: {
        text: 'Valores',
      },
    },
    series: [
      {
        name: 'Processo 1',
        data: [10, 15, 12, 25, 18, 20],
      },
      {
        name: 'Processo 2',
        data: [5, 20, 25, 30, 28, 40],
      },
    ],
  };

  return <Card><HighchartsReact highcharts={Highcharts} options={options} /></Card>;
  
};

export default LineChart;

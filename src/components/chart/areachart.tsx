import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@mui/material';

const AreaChart = () => {
  const options = {
    chart: {
      type: 'area',
    },

    title: {
      text: 'Ângulo/Torque X Tempo'
    },
    
    xAxis: {
      categories: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
      title: {
        text: 'Tempo',
      },
    },
    yAxis: {
      title: {
        text: 'Valores',
      },
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666',
        },
      },
    },
    series: [
      {
        name: 'Ângulo',
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
      },
      {
        name: 'Torque',
        data: [8, 10, 15, 26, 23, 38, 23, 32, 48, 55, 35, 28],
      },
    ],
  };

  return (
      <Card><HighchartsReact highcharts={Highcharts} options={options} /></Card>
  );
};

export default AreaChart;
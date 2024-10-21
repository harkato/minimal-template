import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@mui/material';

const AreaChart = () => {
  const options = {
    chart: {
      type: 'area',
    },
    
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        name: 'Usuários Ativos',
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
      },
      {
        name: 'Usuários Inativos',
        data: [8, 10, 15, 26, 23, 38, 23, 32, 48, 55, 35, 28],
      },
    ],
  };

  return (
      <Card><HighchartsReact highcharts={Highcharts} options={options} /></Card>
  );
};

export default AreaChart;

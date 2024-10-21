// TorqueChart.js
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@mui/material';

const TorqueChart = () => {
  // Dados do gráfico
  const options = {
    title: {
      text: 'Gráfico de Torque vs RPM',
    },
    xAxis: {
      title: {
        text: 'Rotação (RPM)',
      },
      categories: ['1000', '2000', '3000', '4000', '5000', '6000', '7000'],
    },
    yAxis: {
      title: {
        text: 'Torque (Nm)',
      },
      min: 0, // Define o valor mínimo do eixo Y
    },
    series: [
      {
        name: 'Torque',
        data: [150, 200, 250, 320, 290, 270, 220], // Exemplo de dados do torque para cada RPM
      },
    ],
    tooltip: {
      valueSuffix: ' Nm', // Mostra a unidade de torque no tooltip
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true, // Mostra os valores dos pontos
        },
        enableMouseTracking: true, // Habilita interatividade com o mouse
      },
    },
  };

  return <Card><HighchartsReact highcharts={Highcharts} options={options} /></Card>;
};

export default TorqueChart;

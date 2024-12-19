// TorqueChart.tsx
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TorqueChart = () => {
  const { t } = useTranslation();
  // Dados do gráfico
  const options = {
    title: {
      text: `${t('charts.title')}`,
    },
    xAxis: {
      title: {
        text: `${t('charts.time')}`,
      },
      categories: ['10:04', '10:12', '10:19', '10:33', '10:40', '10:48', '10:55', '11:02', '11:09'],
    },
    yAxis: {
      title: {
        text: `${t('charts.rate')}`,
      },
      min: 0, // Define o valor mínimo do eixo Y
      plotLines: [
        {
          value: 0.8, // Valor no eixo Y onde a linha será desenhada
          color: 'red', // Cor da linha
          dashStyle: 'Dash', // Estilo da linha (pontilhada)
          width: 2, // Espessura da linha

        },
      ],
    },
    series: [
      {
        name: `${t('charts.rate')}`,
        data: [0.3, 0.2, 0.2, 0.4, 0.7, 0.9, 0.7, 0.3], // Exemplo de dados do torque para cada RPM
      },
    ],
    tooltip: {
      valueSuffix: ' Nok/Vin', // Mostra a unidade de torque no tooltip
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false, // Mostra os valores dos pontos
        },
        enableMouseTracking: true, // Habilita interatividade com o mouse
      },
    },
  };

  return <Card><HighchartsReact highcharts={Highcharts} options={options} /></Card>;
};

export default TorqueChart;

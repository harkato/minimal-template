import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

const stackedChartOptions = {
  chart: {
    height: 450,
    type: 'bar',
    stacked: true, // Habilita colunas empilhadas
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 1, // Reduz a largura da borda para visualização de colunas
    colors: ['#fff'], // Cor da borda das colunas
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: {
    title: {
      text: 'Valores', // Título do eixo Y
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val;
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
};

export default function StackedColumnsChart() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(stackedChartOptions);
  const [series, setSeries] = useState([
    {
      name: 'NOK',
      data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75],
    },
    {
      name: 'Ângulo Alto',
      data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75],
    },
    {
      name: 'Ângulo Baixo',
      data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10],
    },
    {
      name: 'Torque Alto',
      data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0],
    },
    {
      name: 'Torque Baixo',
      data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10],
    },
    {
      name: 'Ângulo Alto & Torque Baixo',
      data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75],
    },
    {
      name: 'Ângulo Alto & Torque Alto',
      data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10],
    },
    {
      name: 'Ângulo Baixo & Torque Baixo',
      data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0],
    },
    {
      name: 'Ângulo Baixo & Torque Alto',
      data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10],
    },
  ]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      yaxis: {
        title: {
          text: "Total de apertos NOK", // Título do eixo Y
        },
        labels: {
          style: {
            colors: [secondary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
    }));
  }, [secondary, line, t]);

  return <ReactApexChart options={options} series={series} type="bar" height={450} />;
}
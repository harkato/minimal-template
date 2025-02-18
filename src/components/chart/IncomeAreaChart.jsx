import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

const areaChartOptions = {
  chart: {
      height: 450,
      type: 'area',
      toolbar: {
        tools: {
            // download: false,
            pan: false,
            // reset: false    
            customIcons: [{
                icon: '<img src="/assets/icons/glass/print.png">',
                index: 4,
                colors: "#6E8192",
                title: 'Print',
                class: 'print-icon',
                /* eslint-disable */
                click: function() {
                    window.print();
                }
                /* eslint-enable */
                },
                // {
                //     icon: '<img src="/assets/icons/glass/download.png">',
                //     index: 4,
                //     colors: "#6E8192",
                //     title: 'download',
                //     class: 'download-icon',
                //     /* eslint-disable */
                //     click: function() {
                //         console.log();
                //         ;
                //     }
                //     /* eslint-enable */
                // }
            ]        
          },
      }
  },
  dataLabels: {
      enabled: false
  },
  stroke: {
      curve: 'smooth',
      width: 2
  },
  grid: {
      strokeDashArray: 0
  },
};

// Função para converter dados em CSV
const convertToCSV = (grip) => {
  const headers = [
    'Tempo',
    'Torque',
    'Angulo',
  ];
  const csvRows = grip.map(
    (row) =>
      `${row.Time},${row.Torque},${row.Angle}`
  );
  return [headers.join(','), ...csvRows].join('\n');
};

// Função para baixar o arquivo CSV
const downloadCSV = (grip) => {
  const csvData = convertToCSV(grip);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'Trace.csv';
  link.click();

  URL.revokeObjectURL(url); // Limpa o objeto URL
};

export default function IncomeAreaChart({ slot, grip }) {
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);

  useEffect(() => {
      if (!grip || grip.length === 0) {
          return; // Evita erros se grip for nulo ou vazio
      }

      const times = grip.map(item => item.Time);
      const torques = grip.map(item => item.Torque);
      const angles = grip.map(item => item.Angle);  
      
      setOptions((prevState) => ({
          ...prevState,
          colors: [theme.palette.primary.main, theme.palette.primary[700]],
          xaxis: {
              title: {
                  text: slot === 'TORQUE X ÂNGULO' ? 'ÂNGULO' : 'TEMPO',
              },
              categories: slot === 'TORQUE X ÂNGULO' ? angles : times, // Usa os valores de tempo do grip
              labels: slot === 'TORQUE X ÂNGULO' ? {
                  style: {  colors: Array(angles.length).fill(secondary), }
              }:
              {
                style: {  colors: Array(times.length).fill(secondary), }
            },
              axisBorder: {
                  show: true,
                  color: line
              },
              tickAmount: 10 
          },
          yaxis: {
              title: {
                  text: slot === 'ÂNGULO' ? 'ÂNGULO'
                      : 'TORQUE',
              },
              labels: {
                  style: {
                      colors: [secondary]
                  }
              }
          },
          grid: {
              borderColor: line
          },
          /* eslint-disable */
          tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
              const yAxisLabel = slot === 'ÂNGULO' ? 'ÂNGULO' : 'TORQUE'
              const xAxisLabel = slot === 'TORQUE X ÂNGULO' ? 'ÂNGULO' : 'TEMPO'
              const eixoX = slot === 'TORQUE X ÂNGULO' ? angles : times  
              const suffixY = slot === 'ÂNGULO' ? 'º' : 'Nm '
              const suffixX = slot === 'TORQUE X ÂNGULO' ? 'º' : 'ms '   
              return ( 
                '<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; color:#01548F">' + slot + '</div>' + // Título (slot)
                // Label e valor do eixo Y  
                  '<span class="apexcharts-tooltip-text">' + yAxisLabel + ': ' + series[seriesIndex][dataPointIndex] + suffixY +'</span>' + 
                // Label e valor do eixo X
                  '<span class="apexcharts-tooltip-text">' + xAxisLabel + ': ' + eixoX[dataPointIndex] + suffixX + '</span>' + 
                '</div>'
              );
            }
          }
          /* eslint-enable */
      }));
      
      setSeries([
          {
              name: slot,
              data: slot === 'ÂNGULO' ? angles : torques 
          },
      ]);
  }, [primary, secondary, line, theme, slot, grip]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

IncomeAreaChart.propTypes = {
  slot: PropTypes.string,
  grip: PropTypes.arrayOf( // Define o tipo correto para grip
      PropTypes.shape({
          Time: PropTypes.number.isRequired,
          Torque: PropTypes.number.isRequired,
          Angle: PropTypes.number.isRequired,
      })
  ).isRequired,
};
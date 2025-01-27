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
            download: false,
            pan: false,
            reset: false            
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
  }
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
    //   const minTime = slot === 'TORQUE X ÂNGULO' ? Math.min(...angles) :  Math.min(...times);
    // const maxTime = slot === 'TORQUE X ÂNGULO' ? Math.max(...angles) :  Math.max(...times);
    // console.log(`minimo: ${minTime}, máximo: ${maxTime}`);
    

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
          }
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
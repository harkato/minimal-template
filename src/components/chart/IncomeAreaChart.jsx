import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import { color } from 'highcharts';
import { colors } from '@mui/material';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
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

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({ slot }) {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]], 
      xaxis: {
        title: {
          text: 'TEMPO',
          colors: secondary,
        },
        // categories:
        //   slot === 'torque'
        //     ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        //     : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'ÂNGULO' ? 11 : 7
      },
      yaxis: {
        title: {
          text: slot,
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
  }, [primary, secondary, line, theme, slot]);

  const [series, setSeries] = useState([
    {
      name: 'TORQUE',
      data: [0, 86, 28, 115, 48, 210, 136]
    },
    // {
    //   name: 'angulo',
    //   data: [0, 43, 14, 56, 24, 105, 68]
    // }
  ]);

  useEffect(() => {
    setSeries([
      {
        name: slot,
        data: slot === 'TORQUE' ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35, 40, 28, 51, 42, 109, 100] 
        : slot === 'ÂNGULO' ? [-31, -20, -8, 21, 42, 9, -100]
        : [1, 2, 3, 4, 5, 6, 7]
      },
      // {
      //   name: 'Ângulo',
      //   data: slot === 'torque' ? [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41] : [11, 32, 45, 32, 34, 52, 41]
      // }
    ]);
  }, [slot]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

IncomeAreaChart.propTypes = { slot: PropTypes.string };

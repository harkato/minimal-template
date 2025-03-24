import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

const areaChartOptions = {
  chart: {
    height: 450,
    type: 'line', // mudou de area para line 
    toolbar: {
      tools: {
        pan: true,
        // customIcons: [{
        //     icon: '<img src="/assets/icons/glass/print.png">',
        //     index: 4,
        //     colors: "#6E8192",
        //     title: 'Print',
        //     class: 'print-icon',
        //     /* eslint-disable */
        //     click: function() {
        //         window.print();
        //     }
        //     /* eslint-enable */
        //     },

        // ]
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  grid: {
    strokeDashArray: 0,
  },
};

export default function IncomeAreaChart({ slot, grip }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (!grip || grip.length === 0) {
      return; // Evita erros se grip for nulo ou vazio
    }

    const times = grip.Time;
    const torques = grip.Torque;
    const angles = grip.Angle;

    const torqueTime = times.map((time, index) => [time, torques[index]]);
    const angleTime = times.map((time, index) => [time, angles[index]]);
    const torqueAngle = angles.map((angle, index) => [angle, torques[index]]);

    setOptions((prevState) => ({
      ...prevState,
      // colors: [theme.palette.primary.main, theme.palette.primary[700]], 
      xaxis: {
        title: {
          text: slot === 'TORQUE X ÂNGULO' ? t('charts.angle') : t('charts.times'),
        },
        // categories: slot === 'TORQUE X ÂNGULO' ? angles : times, // Usa os valores de tempo do grip
        labels:
          slot === 'TORQUE X ÂNGULO'
            ? {
                style: { colors: Array(angles.length).fill(secondary) },
              }
            : {
                style: { colors: Array(times.length).fill(secondary) },
              },
        axisBorder: {
          show: true,
          color: line,
        },
        tickAmount: 10,
        type: 'numeric',
      },
      yaxis: {
        title: {
          text: slot === 'ÂNGULO' ? t('charts.angle') : t('charts.torque'),
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
      /* eslint-disable */
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const yAxisLabel = slot === 'ÂNGULO' ? t('charts.angle') : t('charts.torque');
          const xAxisLabel = slot === 'TORQUE X ÂNGULO' ? t('charts.angle') : t('charts.times');
          const eixoX = slot === 'TORQUE X ÂNGULO' ? angles : times;
          const suffixY = slot === 'ÂNGULO' ? 'º' : 'Nm ';
          const suffixX = slot === 'TORQUE X ÂNGULO' ? 'º' : 'ms ';
          const labelTooltip = slot === 'ÂNGULO' ? t('charts.angle') 
          : slot === 'TORQUE X ÂNGULO' ? t('charts.torqueAngle')
          :t('charts.torque');
          return (
            '<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; color:#01548F">' +
            labelTooltip +
            '</div>' + // Título (slot)
            // Label e valor do eixo Y
            '<span class="apexcharts-tooltip-text">' +
            yAxisLabel +
            ': ' +
            series[seriesIndex][dataPointIndex] +
            suffixY +
            '</span>' +
            // Label e valor do eixo X
            '<span class="apexcharts-tooltip-text">' +
            xAxisLabel +
            ': ' +
            eixoX[dataPointIndex] +
            suffixX +
            '</span>' +
            '</div>'
          );
        },
      },
      /* eslint-enable */
    }));

    setSeries([
      {
        name: slot,
        data:  slot === 'ÂNGULO' ? angleTime : slot === 'TORQUE' ? torqueTime : torqueAngle,
      },
    ]);
  }, [primary, secondary, line, theme, slot, grip, t]);

  return <ReactApexChart options={options} series={series} type="line" height={450} />;
}

IncomeAreaChart.propTypes = {
  slot: PropTypes.string,
  grip: PropTypes.shape({
    Time: PropTypes.arrayOf(PropTypes.number).isRequired,
    Torque: PropTypes.arrayOf(PropTypes.number).isRequired,
    Angle: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

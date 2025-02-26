import type { CardProps } from '@mui/material/Card';
import type { ColorType } from 'src/theme/core/palette';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';

import { varAlpha, bgGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { Chart, useChart } from 'src/components/chart';

import React, { useEffect, useState } from 'react';
import { blue } from '@mui/material/colors';

// import styled from 'styled-components';
// import { lighten } from 'polished';
// import { darken } from 'polished';

// ----------------------------------------------------------------------

/* ================================ COMPONENTE DO TOP 5===================================== */

type Props = CardProps & {
  title: string;
  total: number;
  trend: string;
  // percent: number;
  // color?: ColorType;
  // icon: React.ReactNode;
  criticality: number[];
  chart: {
    series: number[];
    categories: string[];
    options?: ChartOptions;
  };
};

export function AnalyticsWidgetSummary({
  // icon,
  title,
  total,
  chart,
  trend,
  // percent,
  color = 'primary',
  criticality,
  sx,
  ...other
}: Props) {
  const theme = useTheme();
  // const cor: ColorType = (getColor(total) as ColorType)
  const cor = getColor(total);
  // const bgColor = [theme.palette[color as ColorType].light]; // lighter

  const chartColors = ['white']; // dark
  // tabela do Card
  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart.categories },
    // stroke: {
    // // curve: 'straight',
    // colors: ['#FFFFFF'] // Define a cor da linha para vermelho (#FF0000)
    // },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
    },
    ...chart.options,
  });

  const [taxaTop5, setTaxaTop5] = React.useState<number[]>([0.5, 0.8]); // Iniciando taxa de alerta e atenção

  const handleChange = (event: Event, newValue: number | number[]) => {
    setTaxaTop5(newValue as number[]);
  };

  function getColor(taxaAtual: number): string {
    if (taxaAtual >= criticality[1]) {
      // return "error";
      return '#f24f4f';
    }
    if (taxaAtual >= criticality[0]) {
      // return "warning";
      return '#FFB300';
    }
    // return "success";
    return '#20878b';
  }

  function getIcon(trend: string) {
    if (trend === 'Up') {
      return <img alt="icon" src="/assets/icons/glass/up_red.png" />;
    }
    if (trend === 'Steady') {
      return <img alt="icon" src="/assets/icons/glass/dash.png" />;
    }
    return <img alt="icon" src="/assets/icons/glass/down_green.png" />;
  }

  // % do Card lado superior direito
  // const renderTrending = (
  //   <Box
  //     sx={{
  //       top: 16,
  //       gap: 0.5,
  //       right: 16,
  //       display: 'flex',
  //       position: 'absolute',
  //       alignItems: 'center',
  //     }}
  //   >
  //     <Iconify width={20} icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
  //     <Box component="span" sx={{ typography: 'subtitle2' }}>
  //       {percent > 0 && '+'}
  //       {fPercent(percent)}
  //     </Box>
  //   </Box>
  // );

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: `${'white'}`, // darker
        backgroundColor: `${cor}`,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ width: 40, height: 40 }}>{getIcon(trend)}</Box>
        <Chart
          type="bar"
          series={[{ data: chart.series, color: '#FFFFFF' }]}
          options={chartOptions}
          width={70}
          height={56}
        />
      </Box>

      {/* {renderTrending} */}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          {/* <Box sx={{ mb: 1, typography: 'h6' }}>{title}</Box> */}
          {/* Nome da tarefa */}
          <Box
            sx={{
              mb: 1,
              typography: 'h6',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Box>
          {/* taxa de  NOK/OK */}
          <Box sx={{ typography: 'h3', textAlign: 'center' }}>{fShortenNumber(total)}</Box>
        </Box>

        {/* <Chart
          type="bar"
          series={[{ data: chart.series }]}
          options={chartOptions}
          width={70}
          height={56}
        /> */}
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `white`,
        }}
      />
    </Card>
  );
}

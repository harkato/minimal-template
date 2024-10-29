import React, { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, CardHeader } from '@mui/material';

import { _tasks, _posts, _timeline } from 'src/_mock';
import LineChart from 'src/components/chart/linechart';
import { DashboardContent } from 'src/layouts/dashboard';
import TorqueChart from 'src/components/chart/torquechart';
import AreaChart from 'src/components/chart/areachart';
import { useTranslation } from 'react-i18next';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsDashboardCard } from '../analytics-dashboard-card';





// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { t, i18n } = useTranslation();
  
  const [cardData, setCardData] = useState([
    {
      id: '1',
      title: 'FAHRWERK',
      color: '#22c57e',
      vehicles: 37,
      nok: 28,
      nokVin: 0.757,
      target: 0.8,
      topIssues: [
        { code: '2490 01', description: 'Bomba d\'água', occurrences: 8 },
        { code: '3109 01', description: 'Suporte quadro auxiliar LE', occurrences: 4 },
        { code: '3182 01', description: 'Quadro Auxiliar LD', occurrences: 3 },
        { code: '6902 01', description: 'Travessas na carroceria', occurrences: 3 },
        { code: '4107 01', description: 'Suporte bomba de vácuo', occurrences: 3 },
      ],
    },
    {
      id: '2',
      title: 'ZP6',
      color: '#f24f4f',
      vehicles: 37,
      nok: 21,
      nokVin: 0.568,
      target: 0.8,
      topIssues: [
        { code: '2638 01', description: 'Duto freio no agregado hidráulico', occurrences: 4 },
        { code: '3402 01', description: 'Roda dianteira LD', occurrences: 3 },
        { code: '4237 01', description: 'Dobradiças porta traseira LE', occurrences: 2 },
        { code: '2640 01', description: 'Duto freio agregado hidráulico 740', occurrences: 2 },
        { code: '4208 01', description: 'Batente da tampa dianteira LD', occurrences: 2 },
      ],
    },
    {
      id: '3',
      title: 'BANCOS',
      color: '#f24f4f',
      vehicles: 28,
      nok: 47,
      nokVin: 1.679,
      target: 0.8,
      topIssues: [
        { code: '2490 01', description: 'Bomba d\'água', occurrences: 8 },
        { code: '3109 01', description: 'Suporte quadro auxiliar LE', occurrences: 4 },
        { code: '3182 01', description: 'Quadro Auxiliar LD', occurrences: 3 },
        { code: '6902 01', description: 'Travessas na carroceria', occurrences: 3 },
        { code: '4107 01', description: 'Suporte bomba de vácuo', occurrences: 3 },
      ],
    },
    {
      id: '4',
      title: 'BANCOS',
      color: '#f24f4f',
      // color: '#f52f2f',
      vehicles: 28,
      nok: 47,
      nokVin: 1.679,
      target: 0.8,
      topIssues: [
        { code: '2490 01', description: 'Bomba d\'água', occurrences: 8 },
        { code: '3109 01', description: 'Suporte quadro auxiliar LE', occurrences: 4 },
        { code: '3182 01', description: 'Quadro Auxiliar LD', occurrences: 3 },
        { code: '6902 01', description: 'Travessas na carroceria', occurrences: 3 },
        { code: '4107 01', description: 'Suporte bomba de vácuo', occurrences: 3 },
      ],
    },
    {
      id: '5',
      title: 'ZP6',
      color: '#22c57e',
      vehicles: 37,
      nok: 21,
      nokVin: 0.568,
      target: 0.8,
      topIssues: [
        { code: '2638 01', description: 'Duto freio no agregado hidráulico', occurrences: 4 },
        { code: '3402 01', description: 'Roda dianteira LD', occurrences: 3 },
        { code: '4237 01', description: 'Dobradiças porta traseira LE', occurrences: 2 },
        { code: '2640 01', description: 'Duto freio agregado hidráulico 740', occurrences: 2 },
        { code: '4208 01', description: 'Batente da tampa dianteira LD', occurrences: 2 },
      ],
    },
    {
      id: '6',
      title: 'ZP6',
      color: '#22c57e',
      vehicles: 37,
      nok: 21,
      nokVin: 0.568,
      target: 0.8,
      topIssues: [
        { code: '2638 01', description: 'Duto freio no agregado hidráulico', occurrences: 4 },
        { code: '3402 01', description: 'Roda dianteira LD', occurrences: 3 },
        { code: '4237 01', description: 'Dobradiças porta traseira LE', occurrences: 2 },
        { code: '2640 01', description: 'Duto freio agregado hidráulico 740', occurrences: 2 },
        { code: '4208 01', description: 'Batente da tampa dianteira LD', occurrences: 2 },
      ],
    },
  ]);

  const handleDeleteCard = (id: string) => {
    setCardData((prevData) => prevData.filter((card) => card.id !== id));
  };

  const handleAddCard = () => {
    const newCard = {
      id: `${Date.now()}`, // Gera um ID único baseado no timestamp
      title: 'Processo',
      color: '#22c57e', // Cor padrão
      vehicles: 0,
      nok: 0,
      nokVin: 0.0,
      target: 1.0,
      topIssues: [
        { code: '0001', description: 'Exemplo de problema', occurrences: 1 },
      ],
    };
    setCardData((prevData) => [...prevData, newCard]);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid container sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          {t('dashboard.process')}
        </Typography>

        <Button
          variant="contained"
          size='small'
          color="primary"
          onClick={handleAddCard}
          sx={{ mb: 3 }}
        >
          Novo Processo
        </Button>
      </Grid>
      

      <Grid container spacing={5}>
        {cardData.map((data) => (
          <Grid xs={12} sm={6} md={6} key={data.id}>
            <AnalyticsDashboardCard {...data} onDelete={handleDeleteCard} />
          </Grid>
        ))}

        {/* <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="New users"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Purchase orders"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid> */}
        <Grid xs={12} md={6} lg={12}>
          <TorqueChart/>
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <Card>
            <CardHeader title='Gráfico de Área'/>
            <CardContent>
              <AreaChart/>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <LineChart/>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>
        


        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}

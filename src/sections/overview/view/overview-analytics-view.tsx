import React, { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
} from '@mui/material';

import { _tasks, _posts, _timeline } from 'src/_mock';
import LineChart from 'src/components/chart/linechart';
import { DashboardContent } from 'src/layouts/dashboard';
import TorqueChart from 'src/components/chart/torquechart';
import AreaChart from 'src/components/chart/areachart';
import { useTranslation } from 'react-i18next';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsDashboardCard } from '../analytics-dashboard-card';
import { AnalyticsChartCard } from '../analytics-chart-card';
import { initialData } from './initial-data';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { t, i18n } = useTranslation();

  const [cardData, setCardData] = useState(initialData);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedCards, setSelectedCards] = useState(cardData.map((card) => card.id)); // Inicialmente, todos os cards estão selecionados

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleToggleCard = (id: string) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((cardId) => cardId !== id)
        : [...prevSelected, id]
    );
  };

  const handleApplySelection = () => {
    handleMenuClose();
  };

  const handleDeleteCard = (id: string) => {
    setCardData((prevData) => prevData.filter((card) => card.id !== id));
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid container sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          {t('dashboard.process')}
        </Typography>

        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleMenuOpen}
          sx={{ mb: 3 }}
        >
          {t('dashboard.newProcess')}
        </Button>
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
          {cardData.map((card) => (
            <MenuItem key={card.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCards.includes(card.id)}
                    onChange={() => handleToggleCard(card.id)}
                  />
                }
                label={card.title}
              />
            </MenuItem>
          ))}
          <Button onClick={handleApplySelection} color="primary">
            {t('dashboard.applySelection')}
          </Button>
        </Menu>
      </Grid>

      <Grid container spacing={5}>
        {cardData
          .filter((data) => selectedCards.includes(data.id))
          .map((data) => (
            <Grid xs={12} sm={6} md={6} key={data.id}>
              <AnalyticsDashboardCard {...data} onDelete={handleDeleteCard} />
            </Grid>
          ))}
        {/* <Grid xs={6}>
          <AnalyticsChartCard id="12" />
        </Grid> */}

        <Grid xs={12} md={6} lg={12}>
          <TorqueChart />
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <Card>
            <CardHeader title="Gráfico de Área" />
            <CardContent>
              <AreaChart />
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <LineChart />
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
      </Grid>
    </DashboardContent>
  );
}

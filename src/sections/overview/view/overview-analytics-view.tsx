import React, { useEffect, useState } from 'react';
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
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { BarLabel } from '@mui/x-charts';

import { AreaChartNew } from 'src/components/chart/AreaChartNew';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsChartBar } from '../analytics-chart-bar';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsDashboardCard } from '../analytics-dashboard-card';
import { AnalyticsChartCard } from '../analytics-chart-card';
import { initialData } from './initial-data';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { initialDataTopFive } from './initial-data-top-five';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { t, i18n } = useTranslation();

  const [cardData, setCardData] = useState(initialData);
  const [topFiveData, setTopFiveData] = useState(initialDataTopFive);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedCards, setSelectedCards] = useState(cardData.map((card) => card.id)); // Inicialmente, todos os cards estão selecionados

  const [taxaApertadeira, setTaxaApertadeira] = useState<number[]>([0.6, 0.8]);
  
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

  // Simulando atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setTopFiveData((prevData) => {
        const randomIndex = Math.floor(Math.random() * prevData.length); // Seleciona um card aleatório
        const updatedCard = prevData[randomIndex];

        // Atualiza apenas o card selecionado
        const updatedData = prevData.map((card, index) =>
          index === randomIndex
            ? {
                ...updatedCard,
                total: Math.round(Math.random() * 100) / 100, // Atualiza o valor total aleatoriamente
                percent: Math.round((Math.random() * 5 - 2.5) * 100) / 100, // Atualiza o percent aleatoriamente
                title: updatedCard.title.includes('Novo')
                  ? updatedCard.title.replace('Novo ', '')
                  : `Novo ${updatedCard.title}`, // Alterna o título
              }
            : card
        );

        return updatedData;
      });
    }, 20000); // Atualiza a cada 20 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  const sortedTopFiveData = [...topFiveData].sort((a, b) => a.title.localeCompare(b.title));

  const statusToColor: Record<
    string,
    'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info'
  > = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    primary: 'primary',
    secondary: 'secondary',
    info: 'info',
  };

  function getColor(
    status: string
  ): 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info' | undefined {
    return statusToColor[status] || 'primary';
  }

  function getColorApertadeira(taxaAtual: number){
    return taxaAtual >= taxaApertadeira[1]
    ? "#f24f4f"
    : taxaAtual >= taxaApertadeira[0]
    ? "#ffd666"
    : "#20878b"
  }

  return (
    <DashboardContent maxWidth="xl">
      <Grid container sx={{ justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
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

      {/* ================================TP 5===================================== */}
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        TOP 5 NOK
      </Typography>

      <Grid container spacing={2}>
        {sortedTopFiveData.map((item, index) => (
          <Grid key={index} xs={12} sm={6} md={2.4}>
            <AnalyticsWidgetSummary
              title={item.title}
              percent={item.percent}
              total={item.total}
              color={getColor(item.color)}
              icon={item.icon}
              chart={item.chart}
            />
          </Grid>
        ))}
      </Grid>

      {/* ================================GRAFICO DE AREA================================ */}
      {/* <Grid xs={12} md={6} lg={4} paddingTop={5}>
          <Card>
          <AreaChartNew />
          </Card>
        </Grid> */}

      {/* ================================NOK POR TURNO================================== */}
      {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsConversionRates
            title="NOK POR TURNO"
            subheader="última semana"
            chart={{
              categories: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
              series: [
                { name: '1º TURNO', data: [44, 55, 41, 64, 22, 0] },
                { name: '2º TURNO', data: [53, 32, 33, 52, 13, 0] },
                { name: '3º TURNO', data: [15, 22, 33, 25, 31, 0] },
              ],
            }}
          />
        </Grid> */}

      {/* ======================================CARDS APERTADEIRAS============================ */}
      <Grid container sx={{ justifyContent: 'space-between', mt: 4 }}>
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          {t('dashboard.process')}
        </Typography>
      </Grid>

      <Grid container spacing={5}>
        {cardData
          .filter((data) => selectedCards.includes(data.id))
          .map((data) => (
            <Grid xs={12} sm={6} md={4} key={data.id}>
              <AnalyticsDashboardCard {...data} color={getColorApertadeira(data.nokVin)} onDelete={handleDeleteCard} />
            </Grid>
          ))}
        {/* ========================================CARD TORQUE============================== */}
        {/* <Grid xs={12}>
          <AnalyticsChartCard id="12" />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={12}>
          <TorqueChart />
        </Grid> */}
        {/* ======================================ANGULO/TORQUE X TEMPO ============================ */}
        {/* <Grid xs={12} md={6} lg={12}>
          <Card>
            <CardContent>
              <AreaChart />
            </CardContent>
          </Card>
        </Grid> */}
        {/* ==========================================NUMERO DE APERTOS POR ESTAÇÃO===================== */}
        {/* <Grid xs={12} md={6} lg={12}>
          <LineChart />
        </Grid> */}
        {/* =============================================OK/NOK Última hora================================= */}
        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="OK/NOK Última hora"
            chart={{
              series: [
                { label: 'OK', value: 3500 },
                { label: 'NOK', value: 500 },
                // { label: 'Europe', value: 1500 },
                // { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid> */}
        {/* ====================================================GRÁFICO DE DISPERSÃO============================ */}
        {/* <Grid xs={12} md={6} lg={8}>
          <Card>
          <h2 style={{ textAlign: 'center' }}>Dispersão</h2>
          <ScatterChart
            width={900}
            height={400} 
            series={[{ data: [
              { x: 100, y: 200, id: 1 },
              { x: 120, y: 100, id: 2 },
              { x: 170, y: 300, id: 3 },
              { x: 140, y: 250, id: 4 },
              { x: 150, y: 400, id: 5 },
              { x: 110, y: 280, id: 6 },
              { x: 300, y: 300, id: 7 },
              { x: 400, y: 500, id: 8 },
              { x: 200, y: 700, id: 9 },
              { x: 340, y: 350, id: 10 },
              { x: 560, y: 500, id: 11 },
              { x: 230, y: 780, id: 12 },
              { x: 500, y: 400, id: 13 },
              { x: 300, y: 500, id: 14 },
              { x: 240, y: 300, id: 15 },
              { x: 320, y: 550, id: 16 },
              { x: 500, y: 400, id: 17 },
              { x: 420, y: 280, id: 18 },
          ]}]}
          grid={{ vertical: true, horizontal: true }}          
          />

          </Card>
        </Grid> */}
        {/* ==================================NOK BARRA======================================== */}
        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsWebsiteVisits
            title="NOK"
            subheader="por hora"
            chart={{
              categories: ['10h', '11h', '12h', '13h', '14h'],
              series: [{
                 name: 'ALTA',
                 data: [93, 90, 86, 87, 77] 
              },],
            }}
          />
        </Grid> */}

        {/* ==============================TOP 5 BARRA COLORIDO=============================== */}
        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsChartBar            
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
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
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}

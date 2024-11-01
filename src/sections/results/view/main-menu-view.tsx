import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Box, Grid, Button, Typography, Paper, Stack } from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { Icon } from '@iconify/react';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

// Componentes de cada página simulada
function ResultsPage() {
  return (
    <div>
      <Typography variant="h4">Página de Resultados</Typography>
    </div>
  );
}

function OtherPage({ title }: { title: string }) {
  return (
    <div>
      <Typography variant="h4">{title}</Typography>
    </div>
  );
}

export function MainMenu() {
  const navigate = useNavigate();
  const icon = (name: string) => (
    <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
  );

  // Função para navegar para uma página
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <DashboardContent>
      <Grid container spacing={3}>
        {/* Categoria: General */}
        <Grid item xs={12} md={12}>
          <Typography variant="h4" mb="10px">
            General
          </Typography>
          <Grid container spacing={1}>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: '1%', width: '100%', maxWidth: 150, padding: 1 }}
              onClick={() => handleNavigation('/results')}
            >
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Iconify icon="ic:round-view-list" width="3em" />
                <Typography variant="button">Result</Typography>
              </Stack>
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: '1%', width: '100%', maxWidth: 150, padding: 1 }}
              onClick={() => handleNavigation('/user')}
            >
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Iconify icon="mdi:users" width="3em" />
                <Typography variant="button">Users</Typography>
              </Stack>
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: '1%', width: '100%', maxWidth: 150, padding: 1 }}
              onClick={() => handleNavigation('/event')}
            >
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Iconify icon="material-symbols:info" width="3em" />
                <Typography variant="button">Event</Typography>
              </Stack>
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: '1%', width: '100%', maxWidth: 150, padding: 1 }}
              onClick={() => handleNavigation('/program-detail')}
            >
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Iconify icon="material-symbols:list-alt" width="3em" />
                <Typography variant="button">Program Detail</Typography>
              </Stack>
            </Button>
          </Grid>
        </Grid>

        {/* Categoria: Tightening */}
        <Grid item xs={12} md={12}>
          <Typography variant="h4" mb="10px">
            Tightening
          </Typography>
          <Grid container spacing={1}>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: '1%', width: '100%', maxWidth: 150, padding: 1 }}
              onClick={() => handleNavigation('/job-result')}
            >
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Iconify icon="ic:round-view-list" width="3em" />
                <Typography variant="button">Job Result</Typography>
              </Stack>
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: '1%', width: '100%', maxWidth: 150, padding: 1 }}
              onClick={() => handleNavigation('/job-result')}
            >
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Iconify icon="humbleicons:exclamation" width="3em" />
                <Typography variant="button">Top NOK Job</Typography>
              </Stack>
            </Button>
          </Grid>
        </Grid>

        {/* Categoria: Adhesive */}
        <Grid item xs={12} md={12}>
          <Typography variant="h4" mb="10px">
            Adhesive
          </Typography>
          <Grid container spacing={1}>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: '1%', width: '100%', maxWidth: 150, padding: 1 }}
              onClick={() => handleNavigation('/adhesive-result')}
            >
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Iconify icon="ic:round-view-list" width="3em" />
                <Typography variant="button">Adhesive Result</Typography>
              </Stack>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

// Configuração do App com rotas
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/event" element={<OtherPage title="Event Page" />} />
        <Route path="/program-detail" element={<OtherPage title="Program Detail Page" />} />
        <Route path="/job-result" element={<OtherPage title="Job Result Page" />} />
        <Route path="/top-nok-job" element={<OtherPage title="Top NOK Job Page" />} />
        <Route path="/adhesive-result" element={<OtherPage title="Adhesive Result Page" />} />
        <Route path="/riveting-result" element={<OtherPage title="Riveting Result Page" />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Box, Grid, Button, Typography, Paper, Stack } from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { Icon } from '@iconify/react';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

export function MainMenu() {
  const navigate = useNavigate();

  // Função para navegar para uma página
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <DashboardContent>
      {/* Categoria: General */}
      <Grid container spacing={1} mb={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h4" mb="10px">
            General
          </Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={() => handleNavigation('/results')}
          >
            <Stack direction="column" alignItems="center" spacing={0.5}>
              <Iconify icon="ic:round-view-list" width="3em" />
              <Typography variant="button">Result</Typography>
            </Stack>
          </Button>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={() => handleNavigation('/user')}
          >
            <Stack direction="column" alignItems="center" spacing={0.5}>
              <Iconify icon="mdi:users" width="3em" />
              <Typography variant="button">Users</Typography>
            </Stack>
          </Button>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={() => handleNavigation('/event')}
          >
            <Stack direction="column" alignItems="center" spacing={0.5}>
              <Iconify icon="material-symbols:info" width="3em" />
              <Typography variant="button">Event</Typography>
            </Stack>
          </Button>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
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
      <Grid container spacing={1} mb={2}>
        <Grid item xs={12}>
          <Typography variant="h4" mt="10px" mb="10px">
            Tightening
          </Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={() => handleNavigation('/job-result')}
          >
            <Stack direction="column" alignItems="center" spacing={0.5}>
              <Iconify icon="ic:round-view-list" width="3em" />
              <Typography variant="button">Job Result</Typography>
            </Stack>
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
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
      <Grid container spacing={1} mb={2}>
        <Grid item xs={12}>
          <Typography variant="h4" mb="10px">
            Adhesive
          </Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={() => handleNavigation('/adhesive-result')}
          >
            <Stack direction="column" alignItems="center" spacing={0.5}>
              <Iconify icon="ic:round-view-list" width="3em" />
              <Typography variant="button">Adhesive Result</Typography>
            </Stack>
          </Button>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

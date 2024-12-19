import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
// import MainCard from 'components/MainCard';
import IncomeAreaChart from 'src/components/chart/IncomeAreaChart';

// ==============================|| DEFAULT - CHART AREA ||============================== //

export  function AreaChartNew() {
  const [slot, setSlot] = useState('TORQUE');

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          {/* <Typography variant="h5" align="center">Torque Ângulo Tempo</Typography> */}
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" margin= '20px 20px 0px 0px' spacing={5}>
            <Button
              size="small"
              onClick={() => setSlot('TORQUE')}
              color={slot === 'TORQUE' ? 'primary' : 'secondary'}
              variant={slot === 'TORQUE' ? 'outlined' : 'text'}
            >
              TORQUE
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('ÂNGULO')}
              color={slot === 'ÂNGULO' ? 'primary' : 'secondary'}
              variant={slot === 'ÂNGULO' ? 'outlined' : 'text'}
            >
              ÂNGULO
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('TORQUE X ÂNGULO')}
              color={slot === 'TORQUE X ÂNGULO' ? 'primary' : 'secondary'}
              variant={slot === 'TORQUE X ÂNGULO' ? 'outlined' : 'text'}
            >
              TORQUE X ÂNGULO
            </Button>
          </Stack>
        </Grid>
      </Grid>
      {/* <MainCard content={false} sx={{ mt: 1.5 }}> */}
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart slot={slot} />
        </Box>
      {/* </MainCard> */}
    </>
  );
}

export default AreaChartNew;
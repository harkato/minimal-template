import { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IncomeAreaChart from 'src/components/chart/IncomeAreaChart';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from 'react-router-dom';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';

// Função para converter dados em CSV
// const convertToCSV = (grip) => {
//   const headers = [
//     'Tempo',
//     'Torque',
//     'Angulo',
//   ];
//   const csvRows = grip.map(
//     (row) =>
//       `${row.Time},${row.Torque},${row.Angle}`
//   );
//   return [headers.join(','), ...csvRows].join('\n');
// };

// // Função para baixar o arquivo CSV
// const downloadCSV = (grip) => {
//   const csvData = convertToCSV(grip);
//   const blob = new Blob([csvData], { type: 'text/csv' });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement('a');
//   link.href = url;
//   link.download = 'Trace.csv';
//   link.click();

//   URL.revokeObjectURL(url); // Limpa o objeto URL
// };
const botaoImprimir = document.getElementById('imprimir');

export  function AreaChartNew({ grip }) {
  const [slot, setSlot] = useState('TORQUE');
  const navigate = useNavigate(); // Inicializa o useNavigate

  const handleGoBack = () => {
    navigate(-1); // Navega para a página anterior no histórico
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          {/* Botão para voltar a pagina */}
          {/* <Button
            size="small"
            onClick={() => handleGoBack()}
          >
            <Box
              sx={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              <ArrowBackOutlinedIcon color='primary' />
            </Box>              
          </Button> */}
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
        <Box sx={{ pt: 1, pr: 2 }}>
          {/* função que gera o gráfico */}
          <IncomeAreaChart slot={slot} grip={grip} />
        </Box>
    </>
  );
}

export default AreaChartNew;
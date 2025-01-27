import  {  useState, useRef, useMemo, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  TablePagination,
  Toolbar,
  Tooltip,
  IconButton,
  Card,
  useTheme,
  Avatar,
  List,
  ListItemAvatar,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { ArrowUpward, ArrowDownward, MessageOutlined } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDetailData, useResultData } from 'src/routes/hooks/useToolData';
import { number } from 'prop-types';
import { LineChart } from '@mui/x-charts/LineChart';
import AreaChartNew from 'src/components/chart/AreaChartNew';
// import { CartesianGrid, XAxis, YAxis, Legend} from '@mui/x-charts;


interface DataDetail {
  resultTime: string;
  idTool: number;
  tool: string;
  programNumber: number;
  programName: string;
  programId: number;
  id: string,
  idAdic1: string,
  idAdic2: string,
  idAdic3: string,
  toolSerialNumber: string,
  jobNumber: number,
  stepJob: number,
  sizeJob: number,
  generalStatus: string,
  torque: number,
  statusTorque: string,
  maxTorque: number,
  minTorque: number,
  angle: number,
  statusAngle: string,
  maxAngle: number,
  minAngle: number,
  grip: {Time: number; Torque: number; Angle: number }[];
}

interface GripData {
  Time: number;
  Torque: number;
  Angle: number;
}

function getStatusIcon(status: string, i: number) {
  return status === 'OK' ? (
    <CheckIcon sx={{ color: '#20878b' }} />
  ) : i % 2 === 0 ? (
    <ArrowUpward sx={{ color: '#f24f4f' }} />
  ) : (
    <ArrowDownward sx={{ color: '#FFB300' }} />
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function DetailsPage() {
  const [data, setData] = useState<DataDetail| null>(null);
  const { t, i18n } = useTranslation();
  const { isLoading: isLoadingDetail, isError: isErrorDetail, data: detailData, error: errorDetail } = useDetailData();
  if(detailData){
    // console.log("Dados grip:", detailData[0].grip); 
  }
  const classes = useStyles();
  const tableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (detailData && detailData.length > 0) { // Verifica se há dados
        setData(detailData[0]);
    } else {
      setData(null); // Define data como null caso não haja dados
    }
  }, [detailData]);

  if (isLoadingDetail) {
    return <Typography>Carregando...</Typography>;
  }

  if (isErrorDetail || !data) { // Verifica erro ou dados nulos
    return <Typography>Erro ao carregar os dados.</Typography>;
  }

  return (
    <>
      {/* <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, ml: 4 }}>
        {t('Detalhes do resultado')}
      </Typography> */}
      
      {/* Renderiza os dados */}
      {/* <Typography>Data: {data.resultTime}</Typography> */}
            {/* ... outros dados */}

      <Grid container spacing={2} sx={{ mt: 2 }}> {/* Container principal com espaçamento */}
      <Grid item xs={12} md={9}> {/* Grid para o gráfico (ocupa 8 colunas em telas médias e maiores, 12 em telas menores) */}
        <Card>
          {data?.grip && <AreaChartNew grip={data.grip} />}
        </Card>
      </Grid>
      <Grid item xs={12} md={3}> {/* Grid para a lista (ocupa 4 colunas em telas médias e maiores, 12 em telas menores) */}
        <Card>
          <List>
          <ListItem divider>
              <ListItemText primary={<Typography variant="h5" >
                {data.resultTime}
              </Typography>} />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="h4" noWrap>
                  {getStatusIcon(data.generalStatus,2)}
                  {data.generalStatus} 
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem divider>
              <ListItemText 
              primary={
                <>
                  <Typography variant="subtitle1">Ferramenta</Typography>
                  <Typography variant="body2" color="text.secondary">ID Ferramenta</Typography>
                  <Typography variant="body2" color="text.secondary">Nº de série</Typography>
                  <Typography variant="body2" color="text.secondary">Identificador</Typography>
                  <Typography variant="body2" color="text.secondary">Identificador adic. 1</Typography>
                  <Typography variant="body2" color="text.secondary">Identificador adic. 2</Typography>
                  <Typography variant="body2" color="text.secondary">Identificador adic. 3</Typography>
                </>
              }
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                <Typography variant="subtitle1" noWrap>
                  {data.tool}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.idTool}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.toolSerialNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.idAdic1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.idAdic2}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.idAdic3}
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItem>              
            <ListItem divider>
              <ListItemText 
              primary={
                <>
                  <Typography variant="subtitle1">Programa</Typography>
                  <Typography variant="body2" color="text.secondary">ID Programa</Typography>
                  <Typography variant="body2" color="text.secondary">Nº Job</Typography>
                  <Typography variant="body2" color="text.secondary">Passo Job</Typography>
                  <Typography variant="body2" color="text.secondary">Tamanho Job</Typography>
                </>
              }
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                <Typography variant="subtitle1" noWrap>
                  {data.programName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.programId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.jobNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.stepJob}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.sizeJob}
                  </Typography>                  
                </Stack>
              </ListItemSecondaryAction>
            </ListItem>
              {/* <ListItem divider>
              <ListItemText primary={<Typography variant="subtitle1">Staus Geral</Typography>} />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                  {getStatusIcon(data.generalStatus,2)}
                  {data.generalStatus} 
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItem>             */}
            <ListItem divider>
              <ListItemText 
              primary={
                <>
                  <Typography variant="subtitle1">Torque</Typography>
                  <Typography variant="body2" color="text.secondary">Torque máximo</Typography>
                  <Typography variant="body2" color="text.secondary">Torque mínimo</Typography>
                </>
              }
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                <Typography variant="subtitle1" color="secondary" noWrap>
                {getStatusIcon(data.statusTorque,2)}
                  {data.torque}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.maxTorque}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.minTorque}
                  </Typography>                
                </Stack>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem divider>
              <ListItemText 
              primary={
                <>
                  <Typography variant="subtitle1">Ângulo</Typography>
                  <Typography variant="body2" color="text.secondary">Ângulo máximo</Typography>
                  <Typography variant="body2" color="text.secondary">Ângulo mínimo</Typography>
                </>
              }
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                <Typography variant="subtitle1" color="secondary" noWrap>
                {getStatusIcon(data.statusAngle,2)}
                  {data.angle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.maxAngle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {data.minAngle}
                  </Typography>                
                </Stack>
              </ListItemSecondaryAction>
            </ListItem>            
          </List>
          </Card>
      </Grid>
    </Grid>
  </>
);
}

// codigo funcionando +-
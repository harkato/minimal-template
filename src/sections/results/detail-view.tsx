import { useState, useRef, useEffect, ReactNode } from 'react';
import 'dayjs/locale/en-gb';
import {
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Box,
  CircularProgress,
  Alert,
  DialogContent,
  DialogTitle,
  IconButton,
  Dialog,
  Button,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { ResultDataRow } from 'src/types/DataRow';
import { format } from 'date-fns';
import ClearIcon from '@mui/icons-material/Clear';
import { useDetailsInfo } from 'src/routes/hooks/api';
import 'src/styles/print.css';
import IncomeAreaChart from 'src/components/chart/IncomeAreaChart';

interface DetailsPageProps {
  dataRow: ResultDataRow;
  onClose: () => void;
}

// Define o tipo do valor
interface GraphData {
  Torque: number[];
  Angle: number[];
  Time: number[];
}

function getStatusIcon(status: number) {
  switch (status) {
    case 0:
      return <CheckIcon sx={{ color: '#20878b' }} />;
    case 1:
      // return <CancelIcon sx={{ color: 'f24f4f' }} />;
      return <ClearIcon sx={{ color: '#f24f4f' }} />;
    case 2:
      return <ArrowDownward sx={{ color: '#FFB300' }} />;
    case 3:
      return <ArrowUpward sx={{ color: '#f24f4f' }} />;
    default:
      return null;
  }
}

function getStatus(status: number) {
  return status ? 'NOK' : 'OK';
}

export function DetailsPage({ dataRow, onClose }: DetailsPageProps) {
  const [data, setData] = useState<GraphData | null>(null); // useState<DataDetail | null>(null);
  const { t, i18n } = useTranslation();
  const [isPrinting, setIsPrinting] = useState(false);
  // Gráfico de apertos
  const {
    data: fetchDetailsData,
    error: errorFetchDetailsData,
    isError: isErrorFetchDetailsData,
    isLoading: isLoadingFetchDetailsData,
  } = useDetailsInfo(dataRow.tid);
  // } = useCombinedDetailsInfo(105953723);

  const transformDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm:ss');
  };
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetchDetailsData && fetchDetailsData.Torque.length > 0) {
      setData(fetchDetailsData);
    } else {
      setData(null);
    }
  }, [fetchDetailsData]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('print');
    const handleChange = (event: any) => setIsPrinting(event.matches);

    mediaQuery.addEventListener('change', handleChange);
    setIsPrinting(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  return (
    // <PrintModal open onClose={onClose}>
    <>
      <Dialog open onClose={onClose} fullWidth maxWidth="xl">
        <DialogTitle sx={{ backgroundColor: '#00477A', color: 'white' }}>
          {`DETALHES DE RESULTADO -  ${dataRow.toolDTO?.toolName || ''}  ${transformDate(dataRow.dateTime) || ''}`}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            className="no-print"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Renderiza os dados */}
          <Grid container sx={{ mt: 1 }}>
            {/* {' '} */}
            {/* Container principal com espaçamento */}
            <Grid item xs={12} md={12} lg={8} xl={9}>
              {/* {' '} */}
              {/* Grid para o gráfico (ocupa 8 colunas em telas médias e maiores, 12 em telas menores) */}
              <Card>
                {isLoadingFetchDetailsData ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100px',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : isErrorFetchDetailsData || !data ? (
                  (() => (
                      <Alert
                        variant="filled"
                        severity="error"
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        falha ao carregar os dados
                      </Alert>
                    )
                  )()
                ) : (
                  <>
                    {/* {isPrinting ? ( */}
                      <>
                        <div style={{ pageBreakInside: 'avoid' }}>
                          <Box display="flex" justifyContent="center">
                            <Typography variant="h4" style={{ color: '#00477A' }}>
                              TORQUE X TEMPO
                            </Typography>
                          </Box>
                          <IncomeAreaChart slot="TORQUE" grip={data} />
                        </div>
                        <div style={{ pageBreakInside: 'avoid' }}>
                          <Box display="flex" justifyContent="center">
                            <Typography variant="h4" style={{ color: '#00477A' }}>
                              ÂNGULO X TEMPO
                            </Typography>
                          </Box>
                          <IncomeAreaChart slot="ÂNGULO" grip={data} />
                        </div>
                        <div style={{ pageBreakInside: 'avoid' }}>
                          <Box display="flex" justifyContent="center">
                            <Typography variant="h4" style={{ color: '#00477A' }}>
                              TORQUE X ÂNGULO
                            </Typography>
                          </Box>
                          <IncomeAreaChart slot="TORQUE X ÂNGULO" grip={data} />
                        </div>
                      </>
                    {/* ) : (
                      <AreaChartNew grip={data} />
                    )} */}
                  </>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={4} xl={3}>
              {' '}
              {/* Grid para a lista (ocupa 4 colunas em telas médias e maiores, 12 em telas menores) */}
              <Card style={{ pageBreakBefore: 'always' }} >
                <List>
                  <ListItem divider>
                    <ListItemText
                      primary={
                        <Typography variant="h5">{transformDate(dataRow.dateTime)}</Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack alignItems="flex-end">
                        <Typography variant="h4" noWrap>
                          {getStatusIcon(dataRow.generalStatus)}
                          {getStatus(dataRow.generalStatus)}
                        </Typography>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      primary={
                        <>
                          <Typography variant="subtitle1">Ferramenta</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID Ferramenta
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Nº de série
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Veículo
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Identificador
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Identificador adic. 1
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Identificador adic. 2
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Identificador adic. 3
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack alignItems="flex-end">
                        {/* <Typography variant="subtitle1" noWrap> */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            wordWrap: 'break-word',
                            // maxWidth: '80%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {dataRow.toolDTO?.toolName || '*'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.toolDTO?.toolId || '*'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.toolDTO?.toolSerialNumber || '*'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.tid || '*'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.identifier || '*'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.addIdentifier1 || '*'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.addIdentifier2 || '*'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.addIdentifier3 || '*'}
                        </Typography>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      primary={
                        <>
                          <Typography variant="subtitle1">Programa</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID Programa
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Nº Job
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Contagem Job
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tamanho Job
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack alignItems="flex-end">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            wordWrap: 'break-word',
                            // maxWidth: '70%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {dataRow.toolProgramDTO?.programName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.toolProgramDTO?.programId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.jobNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.jobCount}
                          {/* ver stepJob */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.jobSize}
                        </Typography>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      primary={
                        <>
                          <Typography variant="subtitle1">Torque</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Torque máximo
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Torque mínimo
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack alignItems="flex-end">
                        <Typography variant="subtitle1" color="primary" noWrap>
                          {getStatusIcon(dataRow.torqueStatus)}
                          {getStatus(dataRow.torqueStatus)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.torqueHighLimit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.torqueLowLimit}
                        </Typography>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      primary={
                        <>
                          <Typography variant="subtitle1">Ângulo</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ângulo máximo
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ângulo mínimo
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack alignItems="flex-end">
                        <Typography variant="subtitle1" color="primary" noWrap>
                          {getStatusIcon(dataRow.angleStatus)}
                          {getStatus(dataRow.angleStatus)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.angleHighLimit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dataRow.angleLowLimit}
                        </Typography>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <Button onClick={handlePrint} className="no-print">
          Imprimir
        </Button>
      </Dialog>
    </>
  );
}

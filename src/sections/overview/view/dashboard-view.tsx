import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Collapse,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  Slider,
  Switch,
  TextField,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useDashboard } from 'src/context/DashboardContext';
import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTranslation } from 'react-i18next';
import { AnalyticsDashboardCard } from '../card-tools';
import { AnalyticsWidgetSummary } from '../card-top-five';
import { useFetchToolsData, useTopNokOk } from 'src/routes/hooks/api';
import SSEComponent from 'src/routes/hooks/sse';
import { SkeletonTools, SkeletonTopFive } from '../card-loading';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

interface DataTopNokOk {
  title: string;
  trend: string;
  total: number;
  chart: {
    categories: string[]; // apenas a hora do finalTimestamp
    series: number[]; // nok
  };
}

interface ToolData {
  toolName: string;
  toolId: string;
  toolRevision: number;
  products: number;
  ok: number;
  nok: number;
  nokOkRate: number;
  topIssues: any[];
}

interface TopNokOkItem {
  initialTimestamp: string;
  finalTimestamp: string;
  statusType: string;
  toolName: string | null;
  toolId: number;
  toolRevision: number;
  rows: number;
  products: number;
  ok: number;
  nok: number;
  nokOkRate: number;
  trend: string;
  topIssues: null;
  lastResults: LastResultItem[] | null;
}

// Interface para os itens de lastResults
interface LastResultItem {
  initialTimestamp: string;
  finalTimestamp: string;
  statusType: string;
  toolName: string | null;
  toolId: number;
  toolRevision: number;
  rows: number;
  products: number;
  ok: number;
  nok: number;
  nokOkRate: number;
  trend: string;
  topIssues: null;
  lastResults: null;
}

export function OverviewAnalyticsView() {
  const { t } = useTranslation();

  // MENU TOP 5 E FERRAMENTAS
  const [openModal, setOpenModal] = React.useState(false); // Abertura do modal de seleção de cards
  const [openListTopFive, setOpenListTopFive] = React.useState(false); // Abre a categoria do Top 5
  const [openListAperto, setOpenListAperto] = React.useState(false); // Abre a categoria das apertadeiras
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // Define a posição do popover
  const [valueLabel, setValueLabel] = React.useState<string[]>([]); // Valor de referência para ordenação das ferramentas selecionadas
  const [taxaTopFive, setTaxaTopFive] = React.useState<number[]>(() => {
    // Limites de criticidade topFive
    const storedTaxaTop5 = localStorage.getItem('taxaTop5Slider');
    return storedTaxaTop5 ? JSON.parse(storedTaxaTop5) : [0.6, 0.8];
  });
  const [toolLimits, setToolLimits] = React.useState<number[]>([0.7, 0.8]); // VERIFICAR O USO
  const [selectedTools, setselectedTools] = useState<string[]>(() => {
    const storedFilters = localStorage.getItem('selectedTools');
    return storedFilters ? JSON.parse(storedFilters) : [];
  });
  const openLabels = Boolean(anchorEl); // Armazena informações do modal, abertura do modal
  const id = openLabels ? 'github-label' : undefined;
  const [selectLabels, setLabels] = useState<any[]>([]); // Ferramentas selecionadas no menu

  // ESTADOS DO TOP 5 E FERRAMENTAS
  const { pendingValue, setPendingValue } = useDashboard(); // Usa o context do Dashboard, pegando estados globais
  const [topFive, setTopFive] = useState(() => {
    // Mostra Top 5
    const localData = localStorage.getItem('topFive');
    return localData ? JSON.parse(localData) : true; // Retorna o valor do localStorage ou `true` como fallback
  });
  const [topFiveData, setTopFiveData] = useState<DataTopNokOk[]>([]); // Dados do Top 5
  const [tools, setTools] = useState<ToolData[]>([]);
  const finalDateTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');
  // '2022-10-03T16:00:00'; // Precisa alterar para a hora do sistema e/ou criar alguma regra
  const {
    isPending: isLoadingTopNokOk,
    data: TopNokOkData,
    error: TopNokOkError,
    isError: TopNokOkIsError,
  } = useTopNokOk(finalDateTime, topFive); // Query top 5
  const { data: toolListData } = useFetchToolsData(); // Query para a lista de ferramentas disponíveis
  const [toolsInfoData, setToolsInfoData] = useState<any[]>([]);

  const transformarDados = () => {
    if (!TopNokOkData) {
      return; // Ou retorne um array vazio: return [];
    }

    const novosDados: DataTopNokOk[] = TopNokOkData.map((item: TopNokOkItem) => {
      if (!item) {
        // Verificação adicional para cada item
        console.warn('An item in TopNokOkData is null or undefined. Skipping.');
        return null;
      }

      // Criar categorias e séries baseadas nos resultados passados
      const baseCategories =
        item.lastResults?.map((result) => {
          const finalTimestamp = new Date(result.finalTimestamp);
          return finalTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }) || [];

      const baseSeries = item.lastResults?.map((result) => result.nokOkRate) || [];

      // Adicionar o próprio item principal ao final dos arrays
      if (item.finalTimestamp && item.nokOkRate !== undefined) {
        baseCategories.push(
          new Date(item.finalTimestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
        baseSeries.push(item.nokOkRate);
      }

      return {
        title: item.toolName || 'N/A',
        trend: item.trend,
        total: item.nokOkRate,
        chart: {
          categories: baseCategories,
          series: baseSeries,
        },
      };
    }).filter((item: null) => item !== null); // Remove itens nulos que possam ter sido retornados

    setTopFiveData(novosDados);
  };

  const sortedTopFiveData = [...(topFiveData || [])].sort((a, b) => a.title.localeCompare(b.title)); // Ordena o Top 5 por ordem alfabética

  // Salva a taxa do top 5 no localStorage
  useEffect(() => {
    localStorage.setItem('taxaTop5Slider', JSON.stringify(taxaTopFive));
  }, [taxaTopFive]);

  // Salva a seleção do top 5
  useEffect(() => {
    localStorage.setItem('topFive', JSON.stringify(topFive));
  }, [topFive]);

  // Tratamento de dados do top 5
  useEffect(() => {
    transformarDados();
    // eslint-disable-next-line
  }, [TopNokOkData]);

  // Define a lista de ferramentas no menu
  useEffect(() => {
    if (toolListData) {
      setLabels(toolListData);
    }
  }, [toolListData]);

  // Atualiza o filtro usado para query de ferramentas
  useEffect(() => {
    const toolIds = pendingValue.map((tool: any) => tool.toolId);
    setselectedTools(toolIds);
    localStorage.setItem('selectedTools', JSON.stringify(toolIds));
  }, [pendingValue]);

  // SSE APERTADEIRA
  // useEffect(() => {
  //   if (toolsInfoData) {
  //     const transformedData = toolsInfoData.map((tool: any) => ({
  //       toolName: tool.toolName,
  //       products: tool.products,
  //       toolId: tool.toolId,
  //       nok: tool.nok,
  //       nokOkRate: tool.nokOkRate,
  //       topIssues: tool.topIssues,
  //     }));
  //     setTools(transformedData);
  //   }
  // }, [toolsInfoData]);

  // useEffect(() => {
  //   // erro TOP 5
  //   if (TopNokOkIsError) {
  //     toast.error(`Erro ao carregar dados do TOP 5. ${TopNokOkError.message}`);
  //   }
  // }, [TopNokOkIsError, TopNokOkError]);

  // useEffect(() => {
  //   // erro card apertadeira
  //   toolsQueries.forEach((query) => {
  //     if (query.isError) {
  //       toast.error(
  //         `Erro ao carregar dados da ferramenta ${query?.data?.toolName || ''}. ${query.error.message}`
  //       );
  //     }
  //   });
  // }, [toolsQueries]);

  useEffect(() => {
    // Conexão perdida
    const handleOffline = () => toast.error('Conexão perdida. Verifique sua conexão com a rede.');

    window.addEventListener('offline', handleOffline);

    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  useEffect(() => {
    // Conexão restaurada
    const handleOnline = () => toast.success('Conexão restaurada');
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Gerencia o valor do slider e taxa de criticidade
  const handleTaxaTopFive = (event: Event, newValue: number | number[]) => {
    setTaxaTopFive(newValue as number[]); // Atualiza o estado do top 5
    localStorage.setItem('taxaTopFiveSlider', JSON.stringify(taxaTopFive));
  };

  // Gerencia a abertura do Top 5 no modal
  const handleClickTopFive = () => {
    setOpenListTopFive(!openListTopFive);
  };
  // Abre o menu
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    // Fecha o componente relacionado ao rótulo
    handleCloseLabel();
    // Fecha o modal
    setOpenModal(false);
  };

  // Gerencia os valores de seleção de apertadeiras
  const handleCloseLabel = () => {
    setValueLabel(pendingValue);
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  // Gerencia filtros de múltipla seleção
  const handleSelectionChange = (
    event: any,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const selectedValues = event.target.value as string[];
    setState(selectedValues);
  };

  const handleNewToolData = (newTool: any) => {
    setToolsInfoData((prevTools) => {
      // Verifica se a ferramenta já existe na lista para evitar duplicação
      const exists = prevTools.some((tool) => tool.toolId === newTool.toolId);
      if (exists) {
        return prevTools.map((tool) =>
          tool.toolId === newTool.toolId ? { ...tool, ...newTool } : tool
        );
      }
      return [...prevTools, newTool]; // Adiciona se não existir
    });
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid container sx={{ justifyContent: 'flex-end', mt: 4 }}>
        <Button
          data-testid="novo processo"
          variant="contained"
          size="large"
          color="primary"
          onClick={handleOpen}
          sx={{ mb: 3 }}
        >
          {t('dashboard.newProcess')}
        </Button>

        {/* ================================ MENU TOP 5 E APERTADEIRAS ===================================== */}
        <Modal
          data-testid="modal-dashboard"
          open={openModal}
          onClose={() => {
            handleClose();
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={[style, { borderRadius: '20px' }]}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <List
                sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItemButton onClick={handleClickTopFive}>
                  <ListItemText primary="TOP 5" />
                  <div style={{ alignSelf: 'end' }}>
                    <FormControlLabel
                      style={{ color: 'blue', textAlign: 'center' }}
                      control={
                        <Switch
                          checked={topFive}
                          onChange={(event) => setTopFive(event.target.checked)}
                          onClick={(event) => event.stopPropagation()}
                        />
                      }
                      label=""
                    />
                  </div>
                  {openListTopFive ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openListTopFive} timeout="auto" unmountOnExit>
                  <Typography variant="h5" sx={{ textAlign: 'center' }}>
                    {t('dashboard.criticalityRate')}
                  </Typography>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4, flexDirection: 'column' }}>
                      <Slider
                        getAriaLabel={() => 'Criticidade'}
                        value={taxaTopFive}
                        onChange={handleTaxaTopFive}
                        valueLabelDisplay="auto"
                        // getAriaValueText={valuetext}
                        disabled={!topFive}
                        min={0.0}
                        step={0.01}
                        max={1.0}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
                <Grid container spacing={2}>
                  <Grid sx={{ width: '100%' }}>
                    <Autocomplete
                      multiple
                      options={selectLabels}
                      getOptionLabel={(option) => option.toolName || ''}
                      getOptionKey={(option) => option.toolId || option.toolName}
                      value={selectLabels.filter((option) =>
                        pendingValue.some((pv) => pv.toolId === option.toolId)
                      )}
                      onChange={(_, newValue: string[]) =>
                        handleSelectionChange(
                          { target: { value: newValue.map((tool) => tool) } },
                          setPendingValue
                        )
                      }
                      disableCloseOnSelect
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('dashboard.selectTools')}
                          variant="outlined"
                          InputLabelProps={{
                            style: { color: 'black' }, // Cor do rótulo
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { color: 'black' }, // Cor do texto de entrada
                          }}
                        />
                      )}
                      renderTags={(selected, getTagProps) =>
                        selected.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return <Chip key={key} label={option.toolName} {...tagProps} />;
                        })
                      }
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </List>
            </Typography>
          </Box>
        </Modal>
      </Grid>
      {/* ================================TOP 5===================================== */}
      {topFive && (
        <div id="topFive">
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 2, color: '#035590' } }}>
            TOP 5 NOK
          </Typography>
          <Grid container spacing={2} sx={{ mb: { xs: 5, md: 5 } }}>
            {isLoadingTopNokOk ? (
              <SkeletonTopFive />
            ) : (
              // sortedTopFiveData -- ordem alfabética
              topFiveData.map((item, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <AnalyticsWidgetSummary
                    title={item.title}
                    total={item.total}
                    chart={item.chart}
                    trend={item.trend}
                    criticality={taxaTopFive}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </div>
      )}

      {/* ======================================CARDS APERTADEIRAS============================ */}
      <div id="ferramentas">
        <Grid container sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 2, color: '#035590' } }}>
            {t('dashboard.process')}
          </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ mb: { xs: 5, md: 5 } }}>
          <>
            <SSEComponent toolIds={['1', '2']} onData={handleNewToolData} />
            {toolsInfoData.map((tool) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tool.toolId}>
                <AnalyticsDashboardCard
                  title={tool.toolName}
                  id={tool.toolId}
                  vehicles={tool.products}
                  nokVin={tool.nokOkRate}
                  nok={tool.nok}
                  topIssues={tool.topIssues}
                  targetAlert={toolLimits[0]}
                  targetCritical={toolLimits[1]}
                  onDelete={() => {
                    setTools((prev) => prev.filter((t) => t.toolId !== tool.toolId));
                    setPendingValue((prev) => prev.filter((t) => t.toolId !== tool.toolId));
                  }}
                />
              </Grid>
            ))}
            {/* {toolsInfoData?.map((toolData, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                {isPending ? (
                  <SkeletonTools key={`skeleton-${index}`} />
                ) : toolData ? (
                  <AnalyticsDashboardCard
                    title={toolData.toolName}
                    id={toolData.toolId}
                    vehicles={toolData.products}
                    nokVin={toolData.nokOkRate}
                    nok={toolData.nok}
                    topIssues={toolData.topIssues}
                    targetAlert={toolLimits[0]}
                    targetCritical={toolLimits[1]}
                    onDelete={() => {
                      setPendingValue((prev) => prev.filter((t) => t.toolId !== toolData.toolId));
                    }}
                  />
                ) : null}
              </Grid>
            ))} */}
          </>
        </Grid>
      </div>
    </DashboardContent>
  );
}

const style = {
  position: 'absolute',
  alignContent: 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,

  '@media (max-width: 768px)': {
    // Estilo para telas com largura máxima de 768px (ajuste conforme necessário)
    width: '90%', // Ocupa 90% da largura da tela
  },
};

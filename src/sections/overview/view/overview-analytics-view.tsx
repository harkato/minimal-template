import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  AutocompleteCloseReason,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Collapse,
  FormControlLabel,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  Popper,
  SelectChangeEvent,
  Slider,
  styled,
  Switch,
  TextField,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useDashboard } from 'src/context/DashboardContext';
import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTranslation } from 'react-i18next';
import { AnalyticsDashboardCard } from '../analytics-dashboard-card';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { useFetchToolsData, useToolsInfo, useTopNokOk } from 'src/routes/hooks/api';
import { useQuery } from '@tanstack/react-query';
import { Pending } from '@mui/icons-material';
import { SkeletonTools, SkeletonTopFive } from '../loading-card';

interface DataTopNokOk {
  title: string; // toolName
  trend: string; // trend
  total: number; // nokOkRate
  // color: string; // campo em branco
  chart: {
    // lastResults
    categories: string[]; // apenas a hora do finalTimestamp
    series: number[]; // nok
  };
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
  lastResults: LastResultItem[] | null; // Adicionei a tipagem para lastResults
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

interface ToolFilters {
  toolId: number;
  toolRevision: number;
}

interface ToolData {
  toolName: string;
  products: number;
  toolId: string;
  nok: number;
  nokOkRate: number;
  topIssues: any[];
}
const initialFilters = {
  toolId: 0,
  toolRevision: 0,
};

export function OverviewAnalyticsView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeScreen = window.innerWidth > 768;

  // MENU DE SELEÇÃO DE CARDS
  const [openModal, setOpenModal] = React.useState(false); // Abertura do modal de seleção de cards
  const [openListTopFive, setOpenListTopFive] = React.useState(false); // Abre a categoria do Top 5
  const [openListAperto, setOpenListAperto] = React.useState(false); // Abre a categoria das apertadeiras
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // Define a posição do popover
  const [valueLabel, setValueLabel] = React.useState<string[]>([]); // Valor de referência para ordenação das ferramentas selecionadas
  const [valueSliderTopFive, setValueSliderTopFive] = React.useState<number[]>(() => {
    // Limites de referência para o top 5
    const storedTaxaTop5 = localStorage.getItem('taxaTop5Slider');
    return storedTaxaTop5 ? JSON.parse(storedTaxaTop5) : [0.0, 1.0];
  });
  const [taxaTopFive, setTaxaTopFive] = React.useState<number[]>(() => {
    const storedTaxaTop5 = localStorage.getItem('taxaTop5Slider');
    return storedTaxaTop5 ? JSON.parse(storedTaxaTop5) : [0.6, 0.8];
  });
  const [toolLimits, setToolLimits] = React.useState<number[]>([0.7, 0.8]);
  const [tools, setTools] = useState<ToolData[]>([]);
  const [toolsWithRevisions, setToolsWithRevisions] = useState<
    { toolId: number; toolRevision: number }[]
  >(() => {
    const storedFilters = localStorage.getItem('selectedTools');
    return storedFilters ? JSON.parse(storedFilters) : [];
  });
  const openLabels = Boolean(anchorEl);
  const id = openLabels ? 'github-label' : undefined;

  // Usa o context do Dashboard, pegando estados globais
  const { cardData, pendingValue, setPendingValue, selectedCards, handleDeleteCard } =
    useDashboard();

  const [selectLabels, setLabels] = useState<any[]>([]);

  // MOSTRA TOP 5 E FERRAMENTAS
  const [topFive, setTopFive] = useState(() => {
    const localData = localStorage.getItem('topFive');
    return localData ? JSON.parse(localData) : true; // Retorna o valor do localStorage ou `true` como fallback
  });

  const [topFiveData, setTopFiveData] = useState<DataTopNokOk[]>([]);

  //  TOP 5 QUARKUS
  const finalDateTime = '2022-10-03T16:00:00'; // Precisa alterar para a hora do sistema e/ou criar alguma regra
  const {
    isPending: isLoadingTopNokOk,
    isError: isErrorTopNokOk,
    data: TopNokOkData,
    error: errorTopNokOk,
  } = useTopNokOk(finalDateTime, topFive);

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

      const chartData = {
        categories:
          item.lastResults?.map((result) => {
            // Tratamento para lastResults null/undefined
            const finalTimestamp = new Date(result.finalTimestamp);
            return finalTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }) || [],
        series: item.lastResults?.map((result) => result.nokOkRate) || 0,
      };

      return {
        title: item.toolName || 'N/A',
        trend: item.trend,
        total: item.nokOkRate,
        // color: "",
        chart: chartData,
      };
    }).filter((item: null) => item !== null); // Remove itens nulos que possam ter sido retornados

    setTopFiveData(novosDados);
  };

  useEffect(() => {
    transformarDados();
    // console.log('topFiveData',  topFiveData)
    // console.log('TopNokOkData', TopNokOkData);
    // eslint-disable-next-line
  }, [TopNokOkData]);

  // Garante que `data` está definido antes de usar
  // const sortedTopFiveData = [...(TopFiveData || [])].sort((a, b) =>
  const sortedTopFiveData = [...(topFiveData || [])].sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    // Sempre que o valor do slider mudar, salva no localStorage
    localStorage.setItem('taxaTop5Slider', JSON.stringify(taxaTopFive));
  }, [taxaTopFive]);

  // Salva a seleção do top 5
  useEffect(() => {
    localStorage.setItem('topFive', JSON.stringify(topFive));
  }, [topFive]);

  // Dados das ferramentas
  const {
    isPending: isLoadingToolList,
    isError: isErrorToolList,
    data: toolListData,
    error: errorToolList,
  } = useFetchToolsData();

  const toolsQueries = useToolsInfo(toolsWithRevisions);

  // Conta quantas queries ainda estão pendentes
  const pendingCount = toolsQueries.filter((query) => query.isPending).length;

  const toolsInfo = toolsQueries.map((query) => query.data).filter(Boolean);

  useEffect(() => {
    if (toolListData) {
      setLabels(toolListData);
    }
  }, [toolListData]);

  // Atualiza o filtro de ferramentas
  useEffect(() => {
    const transformedData = pendingValue.map((tool: any) => ({
      toolId: tool.toolId,
      toolRevision: tool.revision,
    }));

    setToolsWithRevisions(transformedData);
    localStorage.setItem('selectedTools', JSON.stringify(transformedData));
  }, [pendingValue]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValueSliderTopFive(newValue as number[]); // Atualiza o estado do slider
    setTaxaTopFive(newValue as number[]); // Atualiza o estado do top 5
    localStorage.setItem('taxaTopFiveSlider', JSON.stringify(taxaTopFive));
  };

  // Gerencia a abertura do Top 5 no modal
  const handleClickTopFive = () => {
    setOpenListTopFive(!openListTopFive);
  };

  // Gerencia a abertura do Card Apertadeira no modal
  const handleClickAperto = () => {
    setOpenListAperto(!openListAperto);
  };

  // Gerencia o menu de Apertadeiras disponíveis
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // setPendingValue(valueLabel);
    setAnchorEl(event.currentTarget);
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

  return (
    <DashboardContent maxWidth="xl">
      <Grid container sx={{ justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={handleOpen}
          sx={{ mb: 3 }}
        >
          {t('dashboard.newProcess')}
        </Button>

        <Modal
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
                        />
                      }
                      label=""
                    />
                  </div>
                  {openListTopFive ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openListTopFive} timeout="auto" unmountOnExit>
                  <Typography variant="h5" sx={{ textAlign: 'center' }}>
                    Taxa de criticidade
                  </Typography>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4, flexDirection: 'column' }}>
                      <Slider
                        getAriaLabel={() => 'Criticidade'}
                        value={valueSliderTopFive}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disabled={!topFive}
                        min={0.0}
                        step={0.01}
                        max={1.0}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
                <ListItemButton onClick={handleClickAperto}>
                  <ListItemText primary={t('dashboard.process')} />
                  {openListAperto ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openListAperto} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{
                        pl: 4,
                        flexDirection: 'column',
                      }}
                    >
                      <Box
                        onClick={handleClick}
                        sx={{
                          width: 600,
                          display: 'flex',
                          flexDirection: 'column',
                          fontSize: 13,
                          '@media (max-width: 768px)': {
                            // Estilo para telas com largura máxima de 768px (ajuste conforme necessário)
                            columnCount: 1, // Ocupa 90% da largura da tela
                          },
                        }}
                      >
                        <Typography
                          variant="button"
                          sx={{
                            textAlign: 'center',
                            alignSelf: 'center',
                            width: '85%',
                            color: 'black',
                            marginBottom: '10px',
                            '@media (max-width: 768px)': {
                              alignSelf: 'center',
                            },
                          }}
                        >
                          {t('dashboard.selectTools')}
                        </Typography>
                        {/* </Button> */}
                        <div style={{ columnCount: isLargeScreen ? 3 : 1, alignSelf: 'center' }}>
                          {pendingValue.map(
                            (
                              tool,
                              id // Mostra as ferramentas selecionadas
                            ) => (
                              <Box
                                key={id}
                                sx={{
                                  mb: '20px',
                                  height: 20,
                                  padding: '.15em 4px',
                                  fontWeight: 400,
                                  lineHeight: '15px',
                                  borderRadius: '2px',
                                  width: '100%',
                                }}
                              >
                                {tool.toolName}
                              </Box>
                            )
                          )}
                        </div>
                      </Box>
                      <StyledPopper
                        id={id}
                        open={openLabels}
                        anchorEl={anchorEl}
                        placement="bottom"
                      >
                        <ClickAwayListener onClickAway={handleCloseLabel}>
                          <div>
                            <Autocomplete
                              open
                              multiple
                              key={openLabels ? pendingValue.length : 0}
                              onClose={(
                                event: React.ChangeEvent<{}>,
                                reason: AutocompleteCloseReason
                              ) => {
                                if (reason === 'escape') {
                                  handleCloseLabel();
                                }
                              }}
                              value={pendingValue}
                              onChange={(_, newValue: string[]) =>
                                handleSelectionChange(
                                  { target: { value: newValue.map((tool) => tool) } },
                                  setPendingValue
                                )
                              }
                              disableCloseOnSelect
                              renderTags={() => null}
                              noOptionsText="Sem ferramentas"
                              getOptionLabel={(option) => option.toolName}
                              getOptionKey={(option) => option.toolId || option.toolName}
                              renderOption={(props, option, { selected }) => {
                                const { key, ...optionProps } = props;
                                return (
                                  <li key={key} {...optionProps}>
                                    <Box
                                      component={DoneIcon}
                                      sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
                                      style={{
                                        visibility: selected ? 'visible' : 'hidden',
                                      }}
                                    />
                                    <Box
                                      component="span"
                                      sx={{
                                        width: 14,
                                        height: 14,
                                        flexShrink: 0,
                                        borderRadius: '3px',
                                        mr: 1,
                                        mt: '2px',
                                      }}
                                      style={{ backgroundColor: option.color }}
                                    />
                                    <Box
                                      sx={() => ({
                                        flexGrow: 1,
                                        '& span': {
                                          color: '#8b949e',
                                          ...theme.applyStyles('light', {
                                            color: '#586069',
                                          }),
                                        },
                                      })}
                                    >
                                      {option.toolName}
                                      <br />
                                      <span>{option.description}</span>
                                    </Box>
                                    <Box
                                      component={CloseIcon}
                                      sx={{ opacity: 0.6, width: 18, height: 18 }}
                                      style={{
                                        visibility: selected ? 'visible' : 'hidden',
                                      }}
                                    />
                                  </li>
                                );
                              }}
                              options={[...selectLabels].sort((a, b) => {
                                // Display the selected labels first.
                                let ai = valueLabel.indexOf(a);
                                ai = ai === -1 ? valueLabel.length + selectLabels.indexOf(a) : ai;
                                let bi = valueLabel.indexOf(b);
                                bi = bi === -1 ? valueLabel.length + selectLabels.indexOf(b) : bi;
                                return ai - bi;
                              })}
                              renderInput={(params) => (
                                <StyledInput
                                  ref={params.InputProps.ref}
                                  inputProps={params.inputProps}
                                  autoFocus
                                  placeholder={t('dashboard.filterTools')}
                                />
                              )}
                            />
                          </div>
                        </ClickAwayListener>
                      </StyledPopper>
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </Typography>
          </Box>
        </Modal>
      </Grid>

      {/* ================================TP 5===================================== */}
      {topFive && (
        <div id="topFive">
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 5, color: '#035590' } }}>
            TOP 5 NOK
          </Typography>
          <Grid container spacing={2}>
            {isLoadingTopNokOk ? (
              <SkeletonTopFive />
            ) : (
              sortedTopFiveData.map((item, index) => (
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
      {tools && (
        <div id="ferramentas">
          <Grid container sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5, color: '#035590' } }}>
              {t('dashboard.process')}
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <>
              {toolsQueries.map((query, index) =>
                query.isPending ? (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <SkeletonTools key={`skeleton-${index}`} />
                  </Grid>
                ) : query.data ? (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={query.data.toolId}>
                    <AnalyticsDashboardCard
                      title={query.data.toolName}
                      id={query.data.toolId}
                      vehicles={query.data.products}
                      nokVin={query.data.nokOkRate}
                      nok={query.data.nok}
                      topIssues={query.data.topIssues}
                      targetAlert={toolLimits[0]}
                      targetCritical={toolLimits[1]}
                      onDelete={() => {
                        setTools((prev) => prev.filter((t) => t.toolId !== query.data.toolId));
                        setPendingValue((prev) =>
                          prev.filter((t) => t.toolId !== query.data.toolId)
                        );
                      }}
                    />
                  </Grid>
                ) : null
              )}
            </>
          </Grid>
        </div>
      )}
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

function valuetext(value: number) {
  return `${value}°C`;
}

const StyledPopper = styled(Popper)(({ theme }) => ({
  border: `1px solid ${'#e1e4e8'}`,
  boxShadow: `0 8px 24px ${'rgba(149, 157, 165, 0.2)'}`,
  color: '#24292e',
  backgroundColor: '#fff',
  borderRadius: 6,
  width: 300,
  zIndex: theme.zIndex.modal,
  fontSize: 13,
  ...theme.applyStyles('dark', {
    border: `1px solid ${'#30363d'}`,
    boxShadow: `0 8px 24px ${'rgb(1, 4, 9)'}`,
    color: '#c9d1d9',
    backgroundColor: '#1c2128',
  }),
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  padding: 10,
  width: '100%',
  borderBottom: `1px solid ${'#30363d'}`,
  '& input': {
    borderRadius: 4,
    backgroundColor: '#fff',
    border: `1px solid ${'#30363d'}`,
    padding: 8,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontSize: 14,
    '&:focus': {
      boxShadow: `0px 0px 0px 3px ${'rgba(3, 102, 214, 0.3)'}`,
      borderColor: '#0366d6',
      ...theme.applyStyles('dark', {
        boxShadow: `0px 0px 0px 3px ${'rgb(12, 45, 107)'}`,
        borderColor: '#388bfd',
      }),
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#0d1117',
      border: `1px solid ${'#eaecef'}`,
    }),
  },
  ...theme.applyStyles('dark', {
    borderBottom: `1px solid ${'#eaecef'}`,
  }),
}));

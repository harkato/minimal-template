import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  AutocompleteCloseReason,
  Box,
  Button,
  ClickAwayListener,
  Collapse,
  FormControlLabel,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  Popper,
  Slider,
  styled,
  Switch,
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
// import { initialDataTopFive } from './initial-data-top-five';
import { useToolListData, useTopFiveData } from 'src/routes/hooks/useToolData';
import { useTopNokOk } from 'src/routes/hooks/api';

interface DataTopNokOk {
  title: string; // toolName
  trend: string;  // trend
  total: number; // nokOkRate
  color: string; // campo em branco
  chart: {  // lastResults
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

interface LastResultItem { // Interface para os itens de lastResults
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
  return `${value}`;
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

export function OverviewAnalyticsView() {
  const { t, i18n } = useTranslation();

  const {
    cardData,
    pendingValue,
    setPendingValue,
    selectedCards,
    setSelectedCards,
    handleDeleteCard
  } = useDashboard();
  
  // const [topFiveData, setTopFiveData] = useState(initialDataTopFive);
  const [topFiveData, setTopFiveData] = useState<DataTopNokOk[]>([]);;
  const [value, setValue] = React.useState<number[]>(() => {
    const storedTaxaTop5 = localStorage.getItem('taxaTop5Slider');
    return storedTaxaTop5 ? JSON.parse(storedTaxaTop5) : [0.0, 1.0];     
  });
  const [open, setOpen] = React.useState(false);
  const [openListTop5, setOpenListTop5] = React.useState(false);
  const [openListAperto, setOpenListAperto] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [valueLabel, setValueLabel] = React.useState<LabelType[]>([]);
  const [taxaTop5, setTaxaTop5] = React.useState<number[]>(() => {
    const storedTaxaTop5 = localStorage.getItem('taxaTop5Slider');
    return storedTaxaTop5 ? JSON.parse(storedTaxaTop5) : [0.6, 0.8];     
  });
  const [targetTools, setTargetTools] = React.useState<number[]>([0.7, 0.8]);
  const [top5, setTop5] = useState(() => {
    const localData = localStorage.getItem("top5");
    return localData ? JSON.parse(localData) : true; // Retorna o valor do localStorage ou `true` como fallback
  });
  const [ferramentas, setFerramentas] = useState(true);
  const theme = useTheme();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // Fecha o componente relacionado ao rótulo
    handleCloseLabel();
    // Fecha o modal
    setOpen(false);
  };

  const isOptionEqualToValue = (option: LabelType, value: LabelType) => option.id === value.id;
  const { isLoading: isLoadingToolList, isError: isErrorToolList, data: toolListData, error: errorToolList } = useToolListData();
  const [selectLabels, setLabels] = useState<LabelType[]>([]);

  useEffect(() => {
      if (toolListData) {
        setLabels(toolListData);
      }
    }, [toolListData]);
    
  // TOP5 do JsonServer
  // const { isLoading: isLoadingTopFive, isError: isErrorTopFive, data: TopFiveData, error: errorTopFive } = useTopFiveData();

    // =============================================== TOP 5 QUARKUS =================================================
  const iniDateTime = '2022-03-10T16:00:00'
  const { isLoading: isLoadingTopNokOk, isError: isErrorTopNokOk, data: TopNokOkData, error: errorTopNokOk } = useTopNokOk(iniDateTime);
  // console.log('TopNokOkData', TopNokOkData)  
  const transformarDados = () => {
    if (!TopNokOkData) {  // Verifica se TopNokOkData está definido
        console.error("TopNokOkData is undefined. Cannot transform data.");
        return; // Ou retorne um array vazio: return [];
    }

    const novosDados: DataTopNokOk[] = TopNokOkData.map((item: TopNokOkItem) => {
        if (!item) { // Verificação adicional para cada item
            console.warn("An item in TopNokOkData is null or undefined. Skipping.");
            return null; 
        }

        const chartData = {
          categories: item.lastResults?.map(result => { // Tratamento para lastResults null/undefined
                const finalTimestamp = new Date(result.finalTimestamp);
                return finalTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }) || [],
            series: item.lastResults?.map(result => result.nok) || 0,
        };

        return {
            title: `${item.toolName}/${item.toolRevision}` || "N/A",
            trend: item.trend,
            total: item.nokOkRate,
            color: "",
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
  const sortedTopFiveData = [...(topFiveData || [])].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  useEffect(() => {
    // Sempre que o valor do slider mudar, salva no localStorage
    localStorage.setItem('taxaTop5Slider', JSON.stringify(taxaTop5));
}, [taxaTop5]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]); // Atualiza o estado do slider
    setTaxaTop5(newValue as number[]); // Atualiza o estado do top 5
    localStorage.setItem('taxaTop5Slider', JSON.stringify(taxaTop5));
  };

  const handleClickTop5 = () => {
    setOpenListTop5(!openListTop5);
  };

  const handleClickAperto = () => {
    setOpenListAperto(!openListAperto);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // setPendingValue(valueLabel);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLabel = () => {
    setValueLabel(pendingValue);
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const openLabels = Boolean(anchorEl);
  const id = openLabels ? 'github-label' : undefined;
  const isLargeScreen = window.innerWidth > 768;  

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
          open={open}
          onClose={handleClose}
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
                <ListItemButton onClick={handleClickTop5}>
                  <ListItemText primary="TOP 5" />
                  {openListTop5 ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openListTop5} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4, flexDirection: 'column' }}>
                      {/* ================================== habilita o top 5                       */}
                      <div style={{ alignSelf: 'end' }}>
                        <FormControlLabel
                          style={{ color: 'blue', textAlign: 'center' }}
                          control={
                            <Switch
                              checked={top5}
                              onChange={(event) => setTop5(event.target.checked)}
                            />
                          }
                          label=""
                        />
                      </div>
                      <Slider
                        getAriaLabel={() => 'Criticidade'}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disabled={!top5}
                        min={0.0}
                        step={0.1}
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
                        <Button
                          disableRipple
                          aria-describedby={id}
                          sx={{
                            alignSelf: 'center',
                            width: '85%',
                            color: 'black',
                            marginBottom: '10px',
                            '@media (max-width: 768px)': {
                              alignSelf: 'center',
                            },
                          }}
                          onClick={handleClick}
                        >
                          <span style={{ alignSelf: 'center' }}>
                            {t('dashboard.selectTools')}
                          </span>
                        </Button>
                        <div style={{ columnCount: isLargeScreen ? 3 : 1, alignSelf: 'center' }}>
                          {pendingValue.map((label) => (
                            <Box
                              key={label.id}
                              sx={{
                                mb: '20px',
                                height: 20,
                                padding: '.15em 4px',
                                fontWeight: 400,
                                lineHeight: '15px',
                                borderRadius: '2px',
                                width: '100%',
                              }}
                              style={{
                                backgroundColor: label.color,
                                color: theme.palette.getContrastText(label.color),
                              }}
                            >
                              {/* lista tool selecionada */}
                              {label.name}
                            </Box>
                          ))}
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
                              onChange={(event, newValue, reason) => {
                                if (
                                  event.type === 'keydown' &&
                                  ((event as React.KeyboardEvent).key === 'Backspace' ||
                                    (event as React.KeyboardEvent).key === 'Delete') &&
                                  reason === 'removeOption'
                                ) {
                                  return;
                                }
                                setPendingValue(newValue);
                              }}
                              disableCloseOnSelect
                              renderTags={() => null}
                              noOptionsText="Sem ferramentas"
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
                                      {/* scroll tool */}
                                      {option.name}
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
                              isOptionEqualToValue={isOptionEqualToValue}
                              options={[...selectLabels].sort((a, b) => {
                                // Display the selected labels first.
                                let ai = valueLabel.indexOf(a);
                                ai = ai === -1 ? valueLabel.length + selectLabels.indexOf(a) : ai;
                                let bi = valueLabel.indexOf(b);
                                bi = bi === -1 ? valueLabel.length + selectLabels.indexOf(b) : bi;
                                return ai - bi;
                              })}
                              getOptionLabel={(option) => option.id}
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
      {top5 && (
        <div id="top5">
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 5, color: '#035590' } }}>
            TOP 5 NOK
          </Typography>
          <Grid container spacing={2}>
            {sortedTopFiveData.map((item, index) => (
              <Grid key={index} xs={12} sm={6} md={2.4}>
                <AnalyticsWidgetSummary
                  title={item.title}
                  total={item.total}
                  chart={item.chart}
                  trend={item.trend}
                  criticality={taxaTop5}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {/* ======================================CARDS APERTADEIRAS============================ */}
      {ferramentas && (
        <div id="ferramentas">
          <Grid container sx={{ justifyContent: 'space-between', mt: 4 }}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5, color: '#035590' } }}>
              {t('dashboard.process')}
            </Typography>
          </Grid>
          <Grid container spacing={5}>
            {(cardData || [])
              .filter((data) => selectedCards.includes(data.id))
              .filter((data) => pendingValue.some((pending) => pending.id === data.id))
              .map((data) => (
                <Grid xs={12} sm={6} md={4} key={data.id}>
                  <AnalyticsDashboardCard
                    {...data}
                    targetAlert={targetTools[0]}
                    targetCritical={targetTools[1]}
                    onDelete={() => handleDeleteCard(data.id)}
                  />
                </Grid>
              ))} 
          </Grid>
        </div>
      )}
    </DashboardContent>
  );
}

interface LabelType {
  id: string;
  name: string;
  color: string;
  description?: string;
}

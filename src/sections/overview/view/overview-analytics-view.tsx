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
import { useFetchToolsData, useToolsInfo } from 'src/routes/hooks/api';
import { useQuery } from '@tanstack/react-query';
import { Pending } from '@mui/icons-material';

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
  toolId: 6,
  toolRevision: 3,
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
  const [valueLabel, setValueLabel] = React.useState<LabelType[]>([]); // Valor de referência para ordenação das ferramentas selecionadas
  const [valueSliderTopFive, setValueSliderTopFive] = React.useState<number[]>([0.0, 1.0]); // Limites de referência para o top 5
  const [taxaTopFive, setTaxaTopFive] = React.useState<number[]>([0.6, 0.8]);
  const [toolLimits, setToolLimits] = React.useState<number[]>([0.7, 0.8]);
  const [filters, setFilters] = useState<ToolFilters>(initialFilters);
  const [tools, setTools] = useState<ToolData[]>([]);
  const openLabels = Boolean(anchorEl);
  const id = openLabels ? 'github-label' : undefined;

  // Usa o context do Dashboard, pegando estados globais
  const { cardData, pendingValue, setPendingValue, selectedCards, handleDeleteCard } =
    useDashboard();

  const [selectLabels, setLabels] = useState<LabelType[]>([]);

  // MOSTRA TOP 5 E FERRAMENTAS
  const [topFive, setTopFive] = useState(() => {
    const localData = localStorage.getItem('topFive');
    return localData ? JSON.parse(localData) : true; // Retorna o valor do localStorage ou `true` como fallback
  });

  // Dados das ferramentas
  const {
    isLoading: isLoadingToolList,
    isError: isErrorToolList,
    data: toolListData,
    error: errorToolList,
  } = useFetchToolsData();

  const { data: toolsInfo } = useToolsInfo(filters.toolId, filters.toolRevision);
  // Dados do Top 5
  // const {
  //   isLoading: isLoadingTopFive,
  //   isError: isErrorTopFive,
  //   data: TopFiveData,
  //   error: errorTopFive,
  // } = useTopFiveData();
  // const dataAPI = getTopFiveData()

  useEffect(() => {
    if (toolListData) {
      setLabels(toolListData);
      // setSelectedCards(toolListData.map((card: { id: any; }) => card.id));
    }
  }, [toolListData]);

  useEffect(() => {
    if (toolsInfo) {
      const transformedData = {
        toolName: toolsInfo.toolName,
        products: toolsInfo.products,
        toolId: toolsInfo.toolId,
        nok: toolsInfo.nok,
        nokOkRate: toolsInfo.nokOkRate,
        topIssues: toolsInfo.topIssues,
      };
      setTools((prevTools) => [...prevTools, transformedData]);
    }
  }, [toolsInfo]);

  console.log('Dados atualizados toolsInfo: ', tools);

  // Ordena o Card Top 5 por ordem alfabética
  // const sortedTopFiveData = [...(data || [])].sort((a, b) => a.title.localeCompare(b.title));

  // Atualiza valores limite do Top 5
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValueSliderTopFive(newValue as number[]); // Atualiza o estado do slider
    setTaxaTopFive(newValue as number[]); // Atualiza o estado do top 5
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
                <ListItemButton onClick={handleClickTopFive}>
                  <ListItemText primary="TOP 5" />
                  {openListTopFive ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openListTopFive} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4, flexDirection: 'column' }}>
                      {/* ================================== habilita o top 5                       */}
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
                      <Slider
                        getAriaLabel={() => 'Temperature range'}
                        value={valueSliderTopFive}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disabled={!topFive}
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
                          <span style={{ alignSelf: 'center' }}>{t('dashboard.selectTools')}</span>
                        </Button>
                        <div style={{ columnCount: isLargeScreen ? 3 : 1, alignSelf: 'center' }}>
                          {pendingValue.map((label) => (
                            <Box
                              key={label.name}
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
                              options={[...selectLabels].sort((a, b) => {
                                // Display the selected labels first.
                                let ai = valueLabel.indexOf(a);
                                ai = ai === -1 ? valueLabel.length + selectLabels.indexOf(a) : ai;
                                let bi = valueLabel.indexOf(b);
                                bi = bi === -1 ? valueLabel.length + selectLabels.indexOf(b) : bi;
                                return ai - bi;
                              })}
                              getOptionLabel={(option) => option.name}
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
        <div id="TopFive">
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 5, color: '#035590' } }}>
            TOP 5 NOK
          </Typography>

          <Grid container spacing={2}>
            {/* {sortedTopFiveData.map((item, index) => (
              <Grid key={index} xs={12} sm={6} md={2.4}>
                <AnalyticsWidgetSummary
                  title={item.title}
                  total={item.total}
                  chart={item.chart}
                  criticality={taxaTopFive}
                />
              </Grid>
            ))} */}
          </Grid>
        </div>
      )}

      {/* ======================================CARDS APERTADEIRAS============================ */}
      {tools && (
        <div id="ferramentas">
          <Grid container sx={{ justifyContent: 'space-between', mt: 4 }}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5, color: '#035590' } }}>
              {t('dashboard.process')}
            </Typography>
          </Grid>

          <Grid container spacing={5}>
            {tools.map((tool) => (
              <Grid xs={12} sm={6} md={4} key={tool.toolId}>
                <AnalyticsDashboardCard
                  title={tool.toolName}
                  id={tool.toolId}
                  vehicles={tool.products}
                  nokVin={tool.nokOkRate}
                  {...tool}
                  targetAlert={toolLimits[0]}
                  targetCritical={toolLimits[1]}
                  onDelete={() => setTools((prev) => prev.filter((t) => t.toolId !== tool.toolId))}
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
  name: string;
  color: string;
  description?: string;
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

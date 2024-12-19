import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  AutocompleteClasses,
  AutocompleteCloseReason,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  ClickAwayListener,
  Collapse,
  FormControlLabel,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Popper,
  Slider,
  styled,
  useTheme,
  Switch,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  autocompleteClasses,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { useDashboard } from 'src/context/DashboardContext';
import { _tasks, _posts, _timeline } from 'src/_mock';
import LineChart from 'src/components/chart/linechart';
import { DashboardContent } from 'src/layouts/dashboard';
import TorqueChart from 'src/components/chart/torquechart';
import AreaChart from 'src/components/chart/areachart';
import { useTranslation } from 'react-i18next';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { BarLabel } from '@mui/x-charts';

import { AreaChartNew } from 'src/components/chart/AreaChartNew';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsChartBar } from '../analytics-chart-bar';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsDashboardCard } from '../analytics-dashboard-card';
import { AnalyticsChartCard } from '../analytics-chart-card';
import { initialData } from './initial-data';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { initialDataTopFive } from './initial-data-top-five';

// ----------------------------------------------------------------------
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

  const [topFiveData, setTopFiveData] = useState(initialDataTopFive);

  /* LEONARDO */
  const [value, setValue] = React.useState<number[]>([0.0, 1.0]);
  const [valueTools, setValueTools] = React.useState<number[]>([0.0, 1.0]);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [openListTop5, setOpenListTop5] = React.useState(false);
  const [openListAperto, setOpenListAperto] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [valueLabel, setValueLabel] = React.useState<LabelType[]>([]);
  const [popperPosition, setPopperPosition] = useState(null); // Armazena posição
  const [valueSlider, setValueSlider] = React.useState<number>(10);
  const [checked, setChecked] = React.useState(true);
  const [taxaTop5, setTaxaTop5] = React.useState<number[]>([0.6, 0.8]);
  const [targetTools, setTargetTools] = React.useState<number[]>([0.7, 0.8]);  
  const [top5, setTop5] = useState(true);
  const [ferramentas, setFerramentas] = useState(true);
  const [filterIds, setFilterIds] = useState([]);
  const theme = useTheme();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    // Fecha o componente relacionado ao rótulo
    handleCloseLabel();

    // Fecha o modal
    setOpen(false);
  };

  // function getColor(taxaAtual: number) {
  //   return taxaAtual >= taxaTop5[1]
  //     ? "error"
  //     : taxaAtual >= taxaTop5[0]
  //       ? "warning"
  //       : "success"
  // }

  // function getIcon(taxaAtual: number) {
  //   if (taxaAtual >= taxaTop5[1]) {
  //     return <img alt="icon" src="/assets/icons/glass/up_red.png" />;
  //   } if (taxaAtual >= taxaTop5[0]) {
  //     return <img alt="icon" src="/assets/icons/glass/dash.png" />;
  //   }
  //   return <img alt="icon" src="/assets/icons/glass/down_green.png" />;
  // }

/*   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  }; */

/*   const handleToggleCard = (id: string) => {
    setFilteredCardData((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((cardId) => cardId !== id)
        : [...prevSelected, id]
    );
  };

  const handleApplySelection = () => {
    handleMenuClose();
  }; */

/*   const handleDeleteCard = (id: string) => {
    setFilteredCardData((prevData) => prevData.filter((card) => card.id !== id));
    // setCardData((prevData) => prevData.filter((card) => card.id !== id));
  }; */

  // Simulando atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setTopFiveData((prevData) => {
        const randomIndex = Math.floor(Math.random() * prevData.length); // Seleciona um card aleatório
        const updatedCard = prevData[randomIndex];

        // Atualiza apenas o card selecionado
        const updatedData = prevData.map((card, index) =>
          index === randomIndex
            ? {
                ...updatedCard,
                total: Math.round(Math.random() * 100) / 100, // Atualiza o valor total aleatoriamente
                percent: Math.round((Math.random() * 5 - 2.5) * 100) / 100, // Atualiza o percent aleatoriamente
                title: updatedCard.title.includes('Novo')
                  ? updatedCard.title.replace('Novo ', '')
                  : `Novo ${updatedCard.title}`, // Alterna o título
              }
            : card
        );

        return updatedData;
      });
    }, 20000); // Atualiza a cada 20 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  const sortedTopFiveData = [...topFiveData].sort((a, b) => a.title.localeCompare(b.title));

  // const statusToColor: Record<
  //   string,
  //   'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info'
  // > = {
  //   success: 'success',
  //   error: 'error',
  //   warning: 'warning',
  //   primary: 'primary',
  //   secondary: 'secondary',
  //   info: 'info',
  // };

  // function getColor(
  //   status: string
  // ): 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info' | undefined {
  //   return statusToColor[status] || 'primary';
  // }

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]); // Atualiza o estado do slider
    setTaxaTop5(newValue as number[]); // Atualiza o estado do top 5
  };

  const handleChangeTaxa = (event: Event, newValue: number | number[]) => {
    setValueTools(newValue as number[]); // Atualiza o estado do slider da apertadeira
    setTargetTools(newValue as number[]); // Atualiza o estado da apertadeira
  };

  const handleClickTop5 = () => {
    setOpenListTop5(!openListTop5);
  };

  const handleClickAperto = () => {
    setOpenListAperto(!openListAperto);
  };

  /*   const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
    }; */

/*   const handleChangeSwitch = (event: Event, newValue: number | number[]) => {
    setTaxaTop5(newValue as number[]);
  }; */

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
        {/*         <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
          {cardData.map((card) => (
            <MenuItem key={card.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCards.includes(card.id)}
                    onChange={() => handleToggleCard(card.id)}
                  />
                }
                label={card.title}
              />
            </MenuItem>
          ))}
          <Button onClick={handleApplySelection} color="primary">
            {t('dashboard.applySelection')}
          </Button>
        </Menu> */}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
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
                    {/*                     <div style={{ justifySelf: 'center' }}>
                      <TextField id="outlined-basic" sx={{ width: '100px' }} label="Mín." variant="outlined" />
                      <TextField id="outlined-basic" sx={{ width: '100px' }} label="Max." variant="outlined" />
                    </div> */}
                    <ListItemButton sx={{ pl: 4, flexDirection: 'column' }}>
                      {/*                       <div style={{ alignSelf: 'end' }}>
                        <FormControlLabel
                          style={{ color: 'blue', textAlign: 'center', }}
                          control={<Switch checked={top5} onChange={(event) => setTop5(event.target.checked)} defaultChecked />}
                          label=""
                        />
                      </div> */}
                      <Slider
                        getAriaLabel={() => 'Temperature range'}
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
                  <ListItemText primary="Aperto" />
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
                      {/*                       <div style={{ alignSelf: 'end' }}>
                        <FormControlLabel
                          style={{ color: 'blue', textAlign: 'center', }}
                          control={<Switch checked={ferramentas} onChange={(event) => setFerramentas(event.target.checked)} />}
                          label=""
                        />
                      </div> */}
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
                              // Estilo para telas com largura máxima de 768px (ajuste conforme necessário)
                              alignSelf: 'center', // Ocupa 90% da largura da tela
                            },
                          }}
                          onClick={handleClick}
                        >
                          <span style={{ alignSelf: 'center' }}>
                            Ferramentas
                          </span>
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
/*                                 if (reason === 'selectOption') {
                                  // Primeiro converte para 'unknown', depois para o tipo desejado
                                  const selectedCards = cardData.filter((card) =>
                                    (newValue as unknown as { id: number }[]).some(
                                      (selected) => Number(selected.id) === Number(card.id)  // Garantir que ambos sejam números
                                    )
                                  );
                              
                                  setFilteredCardData((prev) => [
                                    ...prev,
                                    ...selectedCards.filter((card) => !prev.some((c) => c.id === card.id)),
                                  ]);
                                } else if (reason === 'removeOption') {
                                  setFilteredCardData((prev) =>
                                    prev.filter((card) => !(newValue as unknown as { id: number }[]).some((removed) => removed.id === card.id))
                                  );
                                }
                                
                                console.log(filteredCardData)
                                setPendingValue([...newValue]); */
                              }}
                              disableCloseOnSelect
                              renderTags={() => null}
                              noOptionsText="Sem ferramentas"
                              renderOption={(props, option, { selected }) => {
                                /* eslint-disable react/prop-types */
                                const { key, ...optionProps } = props;
                                /* eslint-disable react/prop-types */
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
                              options={[...labels].sort((a, b) => {
                                // Display the selected labels first.
                                let ai = valueLabel.indexOf(a);
                                ai = ai === -1 ? valueLabel.length + labels.indexOf(a) : ai;
                                let bi = valueLabel.indexOf(b);
                                bi = bi === -1 ? valueLabel.length + labels.indexOf(b) : bi;
                                return ai - bi;
                              })}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <StyledInput
                                  ref={params.InputProps.ref}
                                  inputProps={params.inputProps}
                                  autoFocus
                                  placeholder="Filtrar ferramentas"
                                />
                              )}
                            />
                          </div>
                        </ClickAwayListener>
                      </StyledPopper>
                      <div
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'center',
                          fontSize: '15px',
                          marginTop: '20px',
                        }}
                      >
                        Taxa
                        {/*                       <Typography id="non-linear-slider" sx={{ ml: 5}} gutterBottom>
                        Taxa
                      </Typography> */}
                        <Slider
                          getAriaLabel={() => 'Temperature range'}
                          value={valueTools}
                          onChange={handleChangeTaxa}
                          valueLabelDisplay="auto"
                          getAriaValueText={valuetext}
                          disabled={!ferramentas}
                          min={0.0}
                          step={0.1}
                          max={1.0}
                        />
                        {/*                         <Slider
                          aria-label="Temperature range"
                          defaultValue={0.5}
                          min={0.0}
                          step={0.1}
                          marks
                          max={1.0}
                          onChange={handleChangeTaxa}
                          getAriaValueText={valuetext}
                          valueLabelDisplay="auto"
                          disabled={!ferramentas}

                        /> */}
                      </div>
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </Typography>
            {/*             <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography> */}
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
                  criticality={taxaTop5}
                // color={getColor(item.total)}
                // percent={item.percent}

                // color={getColor(item.color)}
                // icon={item.icon}
                // icon={getIcon(item.total)}
                />
              </Grid>
            ))}

            {/* <Grid xs={12} sm={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="Amortecedor"
            percent={3.2}
            total={0.89}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/up_red.png" />}
            chart={{
              categories: ['9h', '10h', '11h', '12', '13h', '14h', '15h', '16h'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="Air Bag"
            percent={0}
            total={0.95}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/dash.png" />}
            chart={{
              categories: ['9h', '10h', '11h', '12', '13h', '14h', '15h', '16h'],
              series: [40, 70, 50, 28, 70, 75, 53, 53],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="Coluna de direção"
            percent={3.6}
            total={0.73}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/up_red.png" />}
            chart={{
              categories: ['9h', '10h', '11h', '12', '13h', '14h', '15h', '16h'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={2.4}>
          <AnalyticsWidgetSummary
            title="Cinto coluna B"
            percent={-4.3}
            total={0.84}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/down_green.png" />}
            chart={{
              categories: ['9h', '10h', '11h', '12', '13h', '14h', '15h', '16h'],
              series: [22, 8, 35, 50, 82, 84, 67, 40],
            }}
          />
        </Grid> */}
          </Grid>
        </div>
      )}

      {/* ================================GRAFICO DE AREA================================ */}
      {/* <Grid xs={12} md={6} lg={4} paddingTop={5}>
          <Card>
          <AreaChartNew />
          </Card>
        </Grid> */}

      {/* ================================NOK POR TURNO================================== */}
      {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsConversionRates
            title="NOK POR TURNO"
            subheader="última semana"
            chart={{
              categories: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
              series: [
                { name: '1º TURNO', data: [44, 55, 41, 64, 22, 0] },
                { name: '2º TURNO', data: [53, 32, 33, 52, 13, 0] },
                { name: '3º TURNO', data: [15, 22, 33, 25, 31, 0] },
              ],
            }}
          />
        </Grid> */}

      {/* ======================================CARDS APERTADEIRAS============================ */}
      {ferramentas && (
        <div id="ferramentas">
          <Grid container sx={{ justifyContent: 'space-between', mt: 4 }}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5, color: '#035590' } }}>
              {t('dashboard.process')}
            </Typography>
          </Grid>

          <Grid container spacing={5}>
            {cardData
              .filter((data) => selectedCards.includes(data.id))
              .filter((data) =>
                pendingValue.some((pending) => pending.name === data.title)
              )
              .map((data) => (

                <Grid xs={12} sm={6} md={4} key={data.id}>
                  <AnalyticsDashboardCard 
                  {...data} 
                    targetAlert = {targetTools[0]}
                    targetCritical={targetTools[1]}
                    onDelete={handleDeleteCard} 
                  />
                </Grid>
              ))}
            {/* ========================================CARD TORQUE============================== */}
            {/* <Grid xs={12}>
          <AnalyticsChartCard id="12" />
        </Grid> */}

            {/* <Grid xs={12} md={6} lg={12}>
          <TorqueChart />
        </Grid> */}
            {/* ======================================ANGULO/TORQUE X TEMPO ============================ */}
            {/* <Grid xs={12} md={6} lg={12}>
          <Card>
            <CardContent>
              <AreaChart />
            </CardContent>
          </Card>
        </Grid> */}
            {/* ==========================================NUMERO DE APERTOS POR ESTAÇÃO===================== */}
            {/* <Grid xs={12} md={6} lg={12}>
          <LineChart />
        </Grid> */}
            {/* =============================================OK/NOK Última hora================================= */}
            {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="OK/NOK Última hora"
            chart={{
              series: [
                { label: 'OK', value: 3500 },
                { label: 'NOK', value: 500 },
                // { label: 'Europe', value: 1500 },
                // { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid> */}
            {/* ====================================================GRÁFICO DE DISPERSÃO============================ */}
            {/* <Grid xs={12} md={6} lg={8}>
          <Card>
          <h2 style={{ textAlign: 'center' }}>Dispersão</h2>
          <ScatterChart
            width={900}
            height={400} 
            series={[{ data: [
              { x: 100, y: 200, id: 1 },
              { x: 120, y: 100, id: 2 },
              { x: 170, y: 300, id: 3 },
              { x: 140, y: 250, id: 4 },
              { x: 150, y: 400, id: 5 },
              { x: 110, y: 280, id: 6 },
              { x: 300, y: 300, id: 7 },
              { x: 400, y: 500, id: 8 },
              { x: 200, y: 700, id: 9 },
              { x: 340, y: 350, id: 10 },
              { x: 560, y: 500, id: 11 },
              { x: 230, y: 780, id: 12 },
              { x: 500, y: 400, id: 13 },
              { x: 300, y: 500, id: 14 },
              { x: 240, y: 300, id: 15 },
              { x: 320, y: 550, id: 16 },
              { x: 500, y: 400, id: 17 },
              { x: 420, y: 280, id: 18 },
          ]}]}
          grid={{ vertical: true, horizontal: true }}          
          />

          </Card>
        </Grid> */}
            {/* ==================================NOK BARRA======================================== */}
            {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsWebsiteVisits
            title="NOK"
            subheader="por hora"
            chart={{
              categories: ['10h', '11h', '12h', '13h', '14h'],
              series: [{
                 name: 'ALTA',
                 data: [93, 90, 86, 87, 77] 
              },],
            }}
          />
        </Grid> */}

            {/* ==============================TOP 5 BARRA COLORIDO=============================== */}
            {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsChartBar            
          />
        </Grid> */}

            {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}
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

// From https://github.com/abdonrd/github-labels
const labels = [
  {
    id: 1,
    name: 'FAHRWERK',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 2,
    name: 'ZP6',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 3,
    name: 'BANCOS',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 4,
    name: 'TACTO12',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 5,
    name: 'R2',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 6,
    name: 'FRONTEND',
    color: '#9fc3da29',
    description: '',
  },
    {
    id: 7,
    name: 'FAHRWERK2',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 8,
    name: 'ZP62',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 9,
    name: 'BANCOS2',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 10,
    name: 'TACTO11',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 11,
    name: 'R3',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 12,
    name: 'FRONTEND2',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 13,
    name: 'FAHRWERK3',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 14,
    name: 'ZP63',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 15,
    name: 'BANCOS3',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 16,
    name: 'TACTO10',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 17,
    name: 'R1',
    color: '#9fc3da29',
    description: '',
  },
  {
    id: 18,
    name: 'FRONTEND3',
    color: '#9fc3da29',
    description: '',
  },
];

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CardHeader,
  Popover,
  Slider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';

/* ================================ COMPONENTE DO CARD FERRAMENTAS ===================================== */

export type Props = {
  id: string;
  title: string;
  vehicles: number | undefined;
  nok: number;
  nokVin: number;
  targetAlert: number;
  targetCritical: number;
  topIssues: { programNumber: number; programName: string; nokOkRate: number }[];
  onDelete?: (id: string) => void;
};

export const LoadingCardTools = React.memo(
  ({
    id,
    title,
    vehicles,
    nok,
    nokVin,
    targetAlert,
    targetCritical,
    topIssues,
    onDelete,
  }: Props) => {
    const [expanded, setExpanded] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleExpandClick = (event: any) => {
      if (!open) {
        setExpanded(!expanded);
      }
    };
    const { t } = useTranslation();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const idPopover = open ? 'simple-popover' : undefined;
    const [newTargetAlert, setNewTargetAlert] = useState(targetAlert);
    const [newTargetCritical, setNewTargetCritical] = useState(targetCritical);
    const newColor = getColor();
    const handleSliderClick = (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
    };
    const handleChangeTarget = (event: Event, newValue: number | number[]) => {
      if (Array.isArray(newValue)) {
        setNewTargetAlert(newValue[0]);
        setNewTargetCritical(newValue[1]);
        localStorage.setItem(`targetAlert-${id}`, JSON.stringify(newValue[0]));
        localStorage.setItem(`targetCritical-${id}`, JSON.stringify(newValue[1]));
      } else {
        setNewTargetAlert(newValue);
        setNewTargetCritical(newValue);
        localStorage.setItem(`targetAlert-${id}`, JSON.stringify(newValue));
        localStorage.setItem(`targetCritical-${id}`, JSON.stringify(newValue));
      }
    };
    function getColor(): string {
      // return '#cdd1cf';
      return '#7e807f';
    }

    useEffect(() => {
      const storedAlert = localStorage.getItem(`targetAlert-${id}`);
      const storedCritical = localStorage.getItem(`targetCritical-${id}`);
      if (storedAlert) {
        setNewTargetAlert(JSON.parse(storedAlert));
      }
      if (storedCritical) {
        setNewTargetCritical(JSON.parse(storedCritical));
      }
    }, [id]);

    return (
      <Card sx={{ bgcolor: `white` }}>
        <Box>
          <CardHeader
            title={title}
            sx={{
              p: 3,
              boxShadow: 'none',
              // bgcolor: color,
              bgcolor: newColor,
              padding: '20px',
              cursor: 'pointer',
              color: `white`,
              backgroundColor: `${newColor}`,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onClick={handleExpandClick}
            action={
              <>
                <IconButton
                  sx={{ color: `white` }}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <IconButton aria-label="settings" onClick={handleClick} sx={{ ml: 'auto' }}>
                  <SettingsIcon htmlColor="white" />
                </IconButton>
                <Popover
                  id={idPopover}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  BackdropProps={{
                    // Configuração do backdrop
                    style: {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor e opacidade do escurecimento
                      backdropFilter: 'blur(2px)', // Adiciona um efeito de blur (opcional)
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '300px',
                      p: 3,
                      display: 'flex',
                      alignItems: 'flex-end',
                      textAlign: 'center',
                    }}
                  >
                    {/* <div onClick={handleSliderClick} style={{ width: '100%' }}> */}
                    <div style={{ width: '100%' }}>
                      <Typography variant="h5" sx={{ mb: { xs: 1, md: 4 } }}>
                        {t('dashboard.criticalityRate')}
                      </Typography>
                      <Slider
                        value={[newTargetAlert, newTargetCritical]}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        min={0.0}
                        step={0.01}
                        max={1.0}
                        onChange={handleChangeTarget}
                      />
                    </div>
                  </Box>
                </Popover>
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete && onDelete(id)}
                  sx={{ ml: 'auto' }}
                >
                  <DeleteIcon htmlColor="white" />
                </IconButton>
              </>
            }
          />
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid>
                <Typography variant="body2">{t('dashboard.vehicles')} ------</Typography>
                <Typography variant="body2">NOK: ------</Typography>
                <Typography variant="body2">
                  {t('dashboard.limits')} {newTargetAlert} / {newTargetCritical}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="h3">{t('dashboard.rate')} -.--</Typography>
              </Grid>
            </Grid>
            <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '10px' }}>
              {t('dashboard.topPrograms')}
            </Typography>
            <TableContainer
              component={Paper}
              style={{ backgroundColor: 'transparent', borderRadius: '5px' }}
            >
              <Table size="small">
                <TableHead style={{ backgroundColor: 'transparent', borderRadius: '5px' }}>
                  <TableRow>
                    <TableCell sx={{ padding: '2px' }}>Número</TableCell>
                    <TableCell sx={{ padding: '2px' }}>Nome</TableCell>
                    <TableCell sx={{ padding: '2px' }}>Taxa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topIssues.map((issue, index) => (
                    <TableRow key={index} style={{ borderBottom: '1px solid #ddd' }}>
                      <TableCell sx={{ padding: '2px' }}>{issue.programNumber}</TableCell>
                      <TableCell sx={{ padding: '2px' }}>{issue.programName}</TableCell>
                      <TableCell sx={{ padding: '2px' }}>{issue.nokOkRate.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
);

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Collapse, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, CardHeader, Grid, Popover, Slider } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete'
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { varAlpha, bgGradient } from 'src/theme/styles';


export type Props = CardProps & {
  id: string;
  title: string;
  color: string;
  // color?: ColorType;
  vehicles: number;
  nok: number;
  nokVin: number;
  targetAlert: number;
  targetCritical: number;
  topIssues: { code: string; description: string; occurrences: number }[];
  onDelete?: (id: string) => void;
}

export function AnalyticsDashboardCard({
  id,
  title,
  // color = 'error', 
  color = '#ff0000',
  vehicles,
  nok,
  nokVin,
  targetAlert,
  targetCritical,
  topIssues,
  onDelete,
  // sx,
  ...other
}: Props) {
  const [expanded, setExpanded] = useState(false);
  

  const theme = useTheme();

  // const bgColor = [theme.palette[color as ColorType].main];
  
  const handleExpandClick = () => setExpanded(!expanded);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const idPopover = open ? 'simple-popover' : undefined;
  
  
  const [newTargetAlert, setNewTargetAlert] = useState(targetAlert); // Valor inicial para targetAlert
  const [newTargetCritical, setNewTargetCritical] = useState(targetCritical); // Valor inicial para targetCritical
  const newColor = getColor()


  const handleChangeTarget = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setNewTargetAlert(newValue[0]);
      setNewTargetCritical(newValue[1]);
    }else{
      setNewTargetAlert(newValue);
      setNewTargetCritical(newValue);
    }
  };

  function getColor(): string {
    console.log(targetAlert)
      if (nokVin >= newTargetCritical) { 
        return '#f24f4f';
      } if (nokVin >= newTargetAlert) {
        return '#FFB300';
      }
      return '#20878b';    
  }

  return (
    <Card 
    sx={{ bgcolor: `white` }} >
      <Box>
        <CardHeader
          title={title}
          sx={{
            p: 3,
            boxShadow: 'none',
            // bgcolor: color,
            bgcolor: newColor,
            padding: '20px',
            position: 'relative',
            cursor: 'pointer',
            color: `white`,
            backgroundColor: `${newColor}`,            
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
            <IconButton
                aria-label="settings"
                onClick={handleClick}
                sx={{ ml: 'auto' }}
              >
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
              >
                <Box sx={{ width: '300px', p: 4, display: 'flex', alignItems: 'flex-end' }}>
                <Slider 
                  defaultValue={[targetAlert, targetCritical]}
                  aria-labelledby="continuous-slider" 
                  valueLabelDisplay="auto"
                  min={0.0}
                  step={0.1}
                  max={1.0}
                  onChange={handleChangeTarget}
                />
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
          <Grid container sx={{ justifyContent: "space-between" }}>
            <Grid>
              <Typography variant="body2">Veículos: {vehicles}</Typography>
              <Typography variant="body2">NOK: {nok}</Typography>
              <Typography variant="body2">
                Limites: {newTargetAlert} / {newTargetCritical}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h3">Taxa: {nokVin.toFixed(3)}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '10px' }}>
            Top 5 Quitações:
          </Typography>

          <TableContainer component={Paper} style={{ backgroundColor: 'transparent', borderRadius: '5px' }}>
            <Table>
              <TableBody>
                {topIssues.map((issue, index) => (
                  <TableRow key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <TableCell sx={{ padding: '2px' }}>{issue.code}</TableCell>
                    <TableCell sx={{ padding: '2px' }}>{issue.description}</TableCell>
                    <TableCell sx={{ padding: '2px' }}>({issue.occurrences})</TableCell>
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
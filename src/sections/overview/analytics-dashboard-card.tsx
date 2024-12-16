import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Collapse, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, CardHeader, Grid } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete'

import type { ColorType } from 'src/theme/core/palette';
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
  target: number;
  topIssues: { code: string; description: string; occurrences: number }[];
  onDelete?: (id: string) => void;
}

export function AnalyticsDashboardCard({
  id,
  title,
  color = 'error',
  vehicles,
  nok,
  nokVin,
  target,
  topIssues,
  onDelete,
  ...other
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const theme = useTheme();

  const bgColor = [theme.palette[color as ColorType].lighter];
  
  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <Card 
    sx={{ bgcolor: `${color}.lighter` }} >
      <Box>
        <CardHeader
          title={title}
          // sx={{
          //   bgcolor: color,
          //   color: '#FFFFFF',
          //   padding: '20px',
          //   cursor: 'pointer',
          // }}
          sx={{
            ...bgGradient({
              //color: `135deg, ${varAlpha(theme.vars.palette[color as ColorType].lightChannel, 0.48)}, ${varAlpha(theme.vars.palette[color as ColorType].mainChannel, 0.48)}`,
              color: `${varAlpha(theme.vars.palette[color as ColorType].mainChannel, 0.8)}, ${varAlpha(theme.vars.palette[color as ColorType].mainChannel)}`,
            }),
            p: 3,
            boxShadow: 'none',
            bgcolor: color,
            padding: '20px',
            position: 'relative',
            cursor: 'pointer',
            color: `${color}.darker`,
            backgroundColor: 'common.white',
          }}
          onClick={handleExpandClick}
          action={
            <>
              <IconButton
              sx={{ color: `${color}.darker` }}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <IconButton aria-label="delete" onClick={() => onDelete && onDelete(id)} sx={{ ml: 'auto' }}>
            <DeleteIcon sx={{ color: `${color}.darker` }} />
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
              <Typography variant="body2">Limite: {target}</Typography>
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
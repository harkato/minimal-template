import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Collapse, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, CardHeader, Grid } from '@mui/material';
import { useTheme } from '@emotion/react';
import type { CardProps } from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type Props = CardProps & {
  title: string;
  color: string;
  vehicles: number;
  nok: number;
  nokVin: number;
  target: number;
  topIssues: { code: string; description: string; occurrences: number }[];
}

export function AnalyticsDashboardCard({
  title,
  color,
  vehicles,
  nok,
  nokVin,
  target,
  topIssues,
  ...other
}: Props) {
  
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
    sx={{
      bgcolor: 'common.white',
    }}
    >
      <CardHeader
        title={title}
        sx={{
          bgcolor: color,
          color: '#FFFFFF',
          padding: '20px',
          cursor: 'pointer',
        }}
        onClick={handleExpandClick}
        action={
          <IconButton sx={{ color: 'white' }}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }/>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Título */}
          {/* Informações sobre os veículos */}
          <Grid container sx={{
            justifyContent: "space-between"}}>
            <Grid>
              <Typography variant="body2">Veículos: {vehicles}</Typography>
              <Typography variant="body2">NOK: {nok}</Typography>
              <Typography variant="body2">Limite: {target}</Typography>
            </Grid>
            <Grid>
              <Typography variant="h3">Taxa: {nokVin.toFixed(3)}</Typography>
              
            </Grid>
          </Grid>
          

          {/* Título dos Top 5 Quitações */}
          <Typography variant="h6" component="div" style={{ marginTop: '10px', marginBottom: '10px'}}>
          Top 5 Quitações:
          </Typography>

          {/* Listagem das questões principais */}
          <TableContainer component={Paper} style={{ backgroundColor: 'white', borderRadius: '5px' }}>
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
  )
}
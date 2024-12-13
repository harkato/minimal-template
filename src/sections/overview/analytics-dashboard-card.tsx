import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Collapse, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, CardHeader, Grid } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete'

export type Props = CardProps & {
  id: string;
  title: string;
  color: string;
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
  color,
  vehicles,
  nok,
  nokVin,
  targetAlert,
  targetCritical,
  topIssues,
  onDelete,
  ...other
}: Props) {
  const [expanded, setExpanded] = useState(false);
  
  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <Card sx={{ bgcolor: 'common.white' }}>
      <Box>
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
            <>
              <IconButton
              sx={{ color: 'white' }}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <IconButton aria-label="delete" onClick={() => onDelete && onDelete(id)} sx={{ ml: 'auto' }}>
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
              <Typography variant="body2">Limites: {targetAlert} / {targetCritical}</Typography>
            </Grid>
            <Grid>
              <Typography variant="h3">Taxa: {nokVin.toFixed(2)}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '10px' }}>
            Top 5 Programas:
          </Typography>

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
  );
}
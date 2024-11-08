import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Collapse, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, CardHeader, Grid } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete'
import TorqueChart from 'src/components/chart/torquechart';

export type Props = CardProps & {
  id: string;
  onDelete?: (id: string) => void;
}

export function AnalyticsChartCard({
  id,
  onDelete,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  
  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <Card sx={{ bgcolor: 'common.white' }}>
      <Box>
        <CardHeader
          title='Torque'
          sx={{
            bgcolor: '#20878b',
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
          <TorqueChart/>
        </CardContent>
      </Collapse>

      
    </Card>
  );
}
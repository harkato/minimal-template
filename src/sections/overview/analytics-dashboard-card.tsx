import React, { useState } from 'react';
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
  Grid,
} from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import { SvgColor } from 'src/components/svg-color';
import { Iconify } from 'src/components/iconify';

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
};

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
              <IconButton aria-label="settings">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#FFFFFF"
                    d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"
                  />
                </svg>
              </IconButton>
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
              <Typography variant="body2">Veículos: {vehicles}</Typography>
              <Typography variant="body2">NOK: {nok}</Typography>
              <Typography variant="body2">
                Limites: {targetAlert} / {targetCritical}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h3">Taxa: {nokVin.toFixed(2)}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '10px' }}>
            Top 5 Programas:
          </Typography>

          <TableContainer
            component={Paper}
            style={{ backgroundColor: 'white', borderRadius: '5px' }}
          >
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
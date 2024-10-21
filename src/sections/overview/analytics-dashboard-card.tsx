import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, CardHeader } from '@mui/material';
import { useTheme } from '@emotion/react';
import type { CardProps } from '@mui/material/Card';

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
  const theme = useTheme();

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
        }}/>
      <CardContent
      sx={{
        // color: '#FFFFFF',
      }}>
      {/* Título */}
        {/* Informações sobre os veículos */}
        
        <Typography variant="body2">Veículos: {vehicles}</Typography>
        <Typography variant="body2">NOK: {nok}</Typography>
        <Typography variant="body2">Nok/Vin: {nokVin.toFixed(3)}</Typography>
        <Typography variant="body2">Target: {target}</Typography>

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
    </Card>
  )
}
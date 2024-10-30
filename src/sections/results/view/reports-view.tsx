import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';

type Order = 'asc' | 'desc';

interface DataRow {
  id: number;
  status: string;
  identifier: string;
  programName: string;
  resultTime: string;
  finalTorque: number;
  torqueStatus: string;
}

const initialData: DataRow[] = [
  { id: 1, status: 'OK', identifier: '123', programName: 'PVT1', resultTime: '2022-01-01 08:00', finalTorque: 20.5, torqueStatus: 'High' },
  { id: 2, status: 'NOK', identifier: '124', programName: 'PVT2', resultTime: '2022-01-02 08:00', finalTorque: 15.3, torqueStatus: 'Low' },
  { id: 3, status: 'OK', identifier: '125', programName: 'PVT3', resultTime: '2022-01-03 08:00', finalTorque: 10.7, torqueStatus: 'Medium' },
  // Adicione mais dados conforme necessário
];

export default function ResultPage() {
  const [data, setData] = useState(initialData);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DataRow>('programName');
  const [filters, setFilters] = useState({
    programName: '',
    status: '',
  });

  // Função para ordenar os dados
  const handleRequestSort = (property: keyof DataRow) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[property];
      const bVal = b[property];
      if (aVal < bVal) return isAsc ? -1 : 1;
      if (aVal > bVal) return isAsc ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  // Função para aplicar filtros
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
    const filteredData = initialData.filter(row => 
        (filters.programName ? row.programName.includes(filters.programName) : true) &&
        (filters.status ? row.status === filters.status : true)
    );
    setData(filteredData);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>Results</Typography>
      
      {/* Menu de Filtros */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Nome do Programa"
          name="programName"
          variant="outlined"
          value={filters.programName}
          onChange={handleFilterChange}
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          label="Status"
          name="status"
          variant="outlined"
          value={filters.status}
          onChange={handleFilterChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="OK">OK</MenuItem>
          <MenuItem value="NOK">NOK</MenuItem>
        </TextField>
        <Button variant="contained" onClick={() => setData(initialData)}>
          Limpar Filtros
        </Button>
      </Box>

      {/* Tabela de Dados */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'identifier'}
                  direction={orderBy === 'identifier' ? order : 'asc'}
                  onClick={() => handleRequestSort('identifier')}
                >
                  Identificador
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'programName'}
                  direction={orderBy === 'programName' ? order : 'asc'}
                  onClick={() => handleRequestSort('programName')}
                >
                  Nome do Programa
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'resultTime'}
                  direction={orderBy === 'resultTime' ? order : 'asc'}
                  onClick={() => handleRequestSort('resultTime')}
                >
                  Data do Resultado
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'finalTorque'}
                  direction={orderBy === 'finalTorque' ? order : 'asc'}
                  onClick={() => handleRequestSort('finalTorque')}
                >
                  Torque Final
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'torqueStatus'}
                  direction={orderBy === 'torqueStatus' ? order : 'asc'}
                  onClick={() => handleRequestSort('torqueStatus')}
                >
                  Status do Torque
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.identifier}</TableCell>
                <TableCell>{row.programName}</TableCell>
                <TableCell>{row.resultTime}</TableCell>
                <TableCell>{row.finalTorque}</TableCell>
                <TableCell>{row.torqueStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

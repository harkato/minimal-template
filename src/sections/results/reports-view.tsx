import React, { useCallback, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Grid,
  TablePagination,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

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

const initialData = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  status: i % 2 === 0 ? 'OK' : 'NOK', // Alterna entre 'OK' e 'NOK'
  identifier: `${123 + i}`, // Identificador único
  programName: `PVT${(i % 5) + 1}`, // Cicla entre PVT1 a PVT5
  resultTime: `2022-01-${String((i % 31) + 1).padStart(2, '0')} ${String((8 + (i % 12)) % 24).padStart(2, '0')}:00`, // Datas variando por dia e hora
  finalTorque: (Math.random() * 25).toFixed(1), // Torque aleatório entre 0 e 25 com uma casa decimal
  torqueStatus: ['Low', 'Medium', 'High'][i % 3], // Cicla entre 'Low', 'Medium', 'High'
}));

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
    const filteredData = initialData.filter(
      (row) =>
        (filters.programName ? row.programName.includes(filters.programName) : true) &&
        (filters.status ? row.status === filters.status : true)
    );
    setData(filteredData);
  };

  const table = useTable();
  const paginatedData = data.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Results
      </Typography>
      {/* Menu de Filtros */}
      <Grid
        container
        spacing={2}
        sx={{ borderRadius: '8px', padding: 2, marginBottom: 2, backgroundColor: '#fefefe' }}
      >
        {/* Data */}
        <Grid item xs={12} sm={6} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date Range" sx={{ width: '100%' }} />
          </LocalizationProvider>
        </Grid>

        {/* Ferramentas */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="Tool Structure"
            name="status"
            variant="outlined"
            value={filters.status}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="OK">Apertadeira 1</MenuItem>
            <MenuItem value="NOK">Apertadeira 2</MenuItem>
          </TextField>
        </Grid>

        {/* Resultados */}

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="Max results"
            name="status"
            variant="outlined"
            value={filters.status}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="NOK">50</MenuItem>
            <MenuItem value="OK">100</MenuItem>
            <MenuItem value="OK">300</MenuItem>
            <MenuItem value="OK">500</MenuItem>
            <MenuItem value="NOK">1000</MenuItem>
          </TextField>
        </Grid>
        {/* Program name */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Program name"
            name="programName"
            variant="outlined"
            value={filters.programName}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>

        {/* Bolt */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Bolt"
            name="programName"
            variant="outlined"
            value={filters.programName}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="Status"
            name="status"
            variant="outlined"
            value={filters.status}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="OK">OK</MenuItem>
            <MenuItem value="NOK">NOK</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" onClick={() => setData(initialData)}>
            Limpar Filtros
          </Button>
          <Button variant="contained" onClick={() => setData(initialData)}>
            Run report
          </Button>
        </Grid>
      </Grid>

      {/* Tabela de Dados */}
      <Grid item xs={12} sm={12} md={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'identifier'}
                    direction={orderBy === 'identifier' ? order : 'asc'}
                    onClick={() => handleRequestSort('identifier')}
                  >
                    Identificador
                  </TableSortLabel>
                </TableCell>
                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'programName'}
                    direction={orderBy === 'programName' ? order : 'asc'}
                    onClick={() => handleRequestSort('programName')}
                  >
                    Nome do Programa
                  </TableSortLabel>
                </TableCell>
                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'resultTime'}
                    direction={orderBy === 'resultTime' ? order : 'asc'}
                    onClick={() => handleRequestSort('resultTime')}
                  >
                    Data do Resultado
                  </TableSortLabel>
                </TableCell>
                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'finalTorque'}
                    direction={orderBy === 'finalTorque' ? order : 'asc'}
                    onClick={() => handleRequestSort('finalTorque')}
                  >
                    Torque Final
                  </TableSortLabel>
                </TableCell>
                <TableCell size="small">
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
              {paginatedData.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}
                >
                  <TableCell
                    size="small"
                    sx={{ backgroundColor: row.status === 'OK' ? 'inherit' : '#f24f4f' }}
                  >
                    {row.status}
                  </TableCell>
                  <TableCell size="small">{row.identifier}</TableCell>
                  <TableCell size="small">{row.programName}</TableCell>
                  <TableCell size="small">{row.resultTime}</TableCell>
                  <TableCell size="small">{row.finalTorque}</TableCell>
                  <TableCell size="small">{row.torqueStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            page={table.page}
            count={data.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </TableContainer>
      </Grid>
    </DashboardContent>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

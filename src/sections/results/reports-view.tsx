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
  Toolbar,
  OutlinedInput,
  InputAdornment,
  Tooltip,
  IconButton,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

type Order = 'asc' | 'desc';

interface DataRow {
  resultTime: string;
  id: number;
  tool: string;
  job: number;
  programName: string;
  fuso: number;
  torque: number;
  torqueStatus: string;
  angle: string;
  angleStatus: string;
  generalStatus: string;
}

const initialData = Array.from({ length: 200 }, (_, i) => ({
  resultTime: `2024/01/${String((i % 31) + 1).padStart(2, '0')} ${String((8 + (i % 12)) % 24).padStart(2, '0')}:00`, // Datas variando por dia e hora
  id: i + 1,
  tool: 'MAKITA',
  job: 1,
  programName: `PVT${(i % 5) + 1}`,
  fuso: Math.round((Math.random() * 4 + 1)), // Fuso aleatório entre 1 e 5
  torque: (Math.random() * 25).toFixed(1), // Torque aleatório entre 0 e 25 com uma casa decimal
  torqueStatus: i % 3 === 0 ? 'OK' : 'NOK', // Alterna entre 'OK' e 'NOK'
  angle: (Math.random() * 90).toFixed(1),
  angleStatus: i % 3 === 0 ? 'OK' : 'NOK',
  generalStatus: i % 3 === 0 ? 'OK' : 'NOK',
}));

export default function ResultPage() {
  const [data, setData] = useState(initialData);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DataRow>('resultTime');
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
        (filters.status ? row.generalStatus === filters.status : true)
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
        <Grid item xs={6} sm={3} md={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Início" sx={{ width: '100%' }} />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Fim" sx={{ width: '100%' }} />
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
          <Toolbar
            sx={{
              height: 50,
              display: 'flex',
              justifyContent: 'space-between',
              p: (theme) => theme.spacing(0, 1, 0, 3),
            }}
          >
            <div />
            <div>
              <Tooltip title="Save or Export">
                <IconButton>
                  <Iconify icon="material-symbols:save" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton>
                  <Iconify icon="material-symbols:print" />
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
          <Table>
            <TableHead>
              <TableRow>
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
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    Id
                  </TableSortLabel>
                </TableCell>

                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'tool'}
                    direction={orderBy === 'tool' ? order : 'asc'}
                    onClick={() => handleRequestSort('tool')}
                  >
                    Nome da Ferramenta
                  </TableSortLabel>
                </TableCell>

                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'job'}
                    direction={orderBy === 'job' ? order : 'asc'}
                    onClick={() => handleRequestSort('job')}
                  >
                    Job
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
                    active={orderBy === 'fuso'}
                    direction={orderBy === 'fuso' ? order : 'asc'}
                    onClick={() => handleRequestSort('fuso')}
                  >
                    Fuso
                  </TableSortLabel>
                </TableCell>

                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'torque'}
                    direction={orderBy === 'torque' ? order : 'asc'}
                    onClick={() => handleRequestSort('torque')}
                  >
                    Torque
                  </TableSortLabel>
                </TableCell>
                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'torqueStatus'}
                    direction={orderBy === 'torqueStatus' ? order : 'asc'}
                    onClick={() => handleRequestSort('torqueStatus')}
                  >
                    Status Torque
                  </TableSortLabel>
                </TableCell>

                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'angle'}
                    direction={orderBy === 'angle' ? order : 'asc'}
                    onClick={() => handleRequestSort('angle')}
                  >
                    Ângulo
                  </TableSortLabel>
                </TableCell>
                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'angleStatus'}
                    direction={orderBy === 'angleStatus' ? order : 'asc'}
                    onClick={() => handleRequestSort('angleStatus')}
                  >
                    Status Ângulo
                  </TableSortLabel>
                </TableCell>

                <TableCell size="small">
                  <TableSortLabel
                    active={orderBy === 'generalStatus'}
                    direction={orderBy === 'generalStatus' ? order : 'asc'}
                    onClick={() => handleRequestSort('generalStatus')}
                  >
                    Status Geral
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                >
                  <TableCell size="small">{row.resultTime}</TableCell>
                  <TableCell size="small">{row.id}</TableCell>
                  <TableCell size="small">{row.tool}</TableCell>
                  <TableCell size="small">{row.job}</TableCell>
                  <TableCell size="small">{row.programName}</TableCell>
                  <TableCell size="small">{row.fuso}</TableCell>
                  <TableCell size="small">{row.torque}</TableCell>
                  <TableCell size="small">
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        color: 'white',
                        backgroundColor: row.torqueStatus === 'OK' ? '#20878b' : '#f24f4f',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {row.torqueStatus}
                    </Box>
                  </TableCell>
                  <TableCell size="small">{row.angle}</TableCell>

                  <TableCell size="small">
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        color: 'white',
                        backgroundColor: row.angleStatus === 'OK' ? '#20878b' : '#f24f4f',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {row.angleStatus}
                    </Box>
                  </TableCell>

                  <TableCell size="small">
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        color: 'white',
                        backgroundColor: row.generalStatus === 'OK' ? '#20878b' : '#f24f4f',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {row.generalStatus}
                    </Box>
                  </TableCell>
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

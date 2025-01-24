import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';
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
  Tooltip,
  IconButton,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useResultData } from 'src/routes/hooks/useToolData';
import { use } from 'i18next';

type Order = 'asc' | 'desc';

interface DataRow {
  dateTime: string;
  tid: string;
  toolName: string;
  job: number;
  programName: string;
  fuso: number;
  torque: number;
  torqueStatus: string;
  angle: number;
  angleStatus: string;
  generalStatus: string;
}

const initialFilters = {
  id: '',
  tool: '',
  programName: '',
  status: '',
  startDate: '',
  endDate: '',
};

// Função para converter dados em CSV
const convertToCSV = (rows: DataRow[]) => {
  const headers = [
    'Data e hora',
    'Id',
    'Ferramenta',
    'Job',
    'Programa',
    'Fuso',
    'Status Geral',
    'Torque',
    'Status Torque',
    'Ângulo',
    'Status ângulo',
  ];
  const csvRows = rows.map(
    (row) =>
      `${row.dateTime},${row.tid},${row.toolName},${row.job},${row.programName},${row.fuso},${row.generalStatus},${row.torque},${row.torqueStatus},${row.angle},${row.angleStatus}`
  );
  return [headers.join(','), ...csvRows].join('\n');
};

// Função para baixar o arquivo CSV
const downloadCSV = (rows: DataRow[]) => {
  const csvData = convertToCSV(rows);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'table-data.csv';
  link.click();

  URL.revokeObjectURL(url); // Limpa o objeto URL
};

function getStatusIcon(status: string, i: number) {
  return status === 'OK' ? (
    <CheckIcon sx={{ color: '#20878b' }} />
  ) : i % 2 === 0 ? (
    <ArrowUpward sx={{ color: '#f24f4f' }} />
  ) : (
    <ArrowDownward sx={{ color: '#FFB300' }} />
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const transformDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy HH:mm');
};

export default function ResultPage() {
  // const [initialData, setInitialData] = useState<DataRow[]>([]);
  // const [data, setData] = useState(initialData);
  const [data, setData] = useState<DataRow[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DataRow>('dateTime');
  const [filters, setFilters] = useState(initialFilters);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { t, i18n } = useTranslation();

  const params = {
    finalDateTime: '2020-06-25T00:00:00',
    initialDateTime: '2020-06-20T00:00:00',
    page: 1,
    pageSize: 50,
  };

  const {
    isLoading: isLoadingResult,
    isError: isErrorResult,
    data: resultData,
    error: errorResult,
  } = useResultData(params);

  // const [filters2, setFilters2] = useState({
  //   initialDateTime = '2020-06-20T00%3A00%3A00',
  //   finalDateTime = '2020-06-23T00%3A00%3A00',
  //   page: 1,
  //   pageSize: 10,
  // });

  console.log('dados resutados: ', data);

  const classes = useStyles();
  const getCurrentDateTime = () => {
    const now = dayjs(); // Utiliza o Dayjs para obter a data e hora atual
    const isoString = now.format('YYYY-MM-DDTHH:mm'); // Formata para o padrão datetime-local
    return isoString;
  };

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
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setStartDate(null);
    setEndDate(null);
  };

  const handleSearch = () => {
    console.log('Filtros aplicados:', filters, startDate, endDate);
  };

  const table = useTable();
  const paginatedData = data.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultData) {
      const transformedData = resultData.map((item: any) => ({
        dateTime: transformDate(item.dateTime),
        tid: item.tid,
        toolName: item.toolDTO.toolName || 'Unknown Tool', // Extrai de toolDTO
        job: item.jobNumber || 0,
        programName: item.toolProgramDTO.programName || 'No Program',
        fuso: item.spindleNumber || 0,
        torque: item.torque || 0,
        torqueStatus: item.torqueStatus === 1 ? 'OK' : 'NOK',
        angle: item.angle || 0,
        angleStatus: item.angleStatus === 0 ? 'OK' : 'NOK',
        generalStatus: item.generalStatus === 0 ? 'OK' : 'NOK',
      }));
      setData(transformedData);
    }
  }, [resultData]);

  const handlePrintAllPages = () => {
    const fullTable = document.createElement('div');

    fullTable.innerHTML = `
    <html>
                <head>
            <title>Resultados</title>
            <style>
              @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
              @page {
                size: landscape;
                margin: 20mm;
              }
              body {
                font-family: Poppins, sans-serif;
                margin: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .status-icon {
                align-items: center;
                justify-content: center;
                gap: 4px;
              }
              .status-ok {
                color: #20878b;
              }
              .status-error {
                color: #f24f4f;
              }
              .status-warning {
                color: #f9a825; /* Cor amarela */
              }
              .torque-angle-col {
                text-align: center; /* Centraliza o conteúdo */
                width: 60px; /* Define uma largura menor para a coluna */
              }
            </style>
          </head>
          <body>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Data</th>
            <th>Id</th>
            <th>Ferramenta</th>
            <th>Job</th>
            <th>Programa</th>
            <th>Fuso</th>
            <th style="width: 100px;">Status Geral</th>
            <th style="width: 100px;">Torque</th>
            <th style="width: 100px;">Ângulo</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f5f5f5'};">
                <td>${row.dateTime}</td>
                <td>${row.tid}</td>
                <td>${row.toolName}</td>
                <td>${row.job}</td>
                <td>${row.programName}</td>
                <td>${row.fuso}</td>
                <td class="status-icon">
                    <span class="material-icons ${
                      row.generalStatus === 'OK' ? 'status-ok' : 'status-error'
                    }">
                      ${row.generalStatus === 'OK' ? 'check_circle' : 'cancel'}
                    </span>
                    ${row.generalStatus}
                  </td>
                <td class="torque-angle-col status-icon">
                    ${row.torque}
                    <span class="material-icons ${
                      row.torqueStatus === 'OK' ? 'status-ok' : 'status-warning'
                    }">
                      ${row.torqueStatus === 'OK' ? 'check_circle' : 'arrow_downward'}
                    </span>
                  </td>
                  <td class="torque-angle-col status-icon">
                    ${row.angle}
                    <span class="material-icons ${
                      row.angleStatus === 'OK' ? 'status-ok' : 'status-warning'
                    }">
                      ${row.angleStatus === 'OK' ? 'check_circle' : 'arrow_downward'}
                    </span>
                  </td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
      </body>
      </html>
    `;

    // Cria a janela de impressão com os dados completos
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(fullTable.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, ml: 4 }}>
        {t('results.results')}
      </Typography>

      {/* Menu de Filtros */}
      <Grid
        container
        spacing={2}
        sx={{ borderRadius: '8px', padding: 2, marginBottom: 2, backgroundColor: '#fefefe' }}
      >
        {/* ID */}
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            label={t('results.identifier')}
            name="id"
            variant="outlined"
            value={filters.id}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>

        {/* Ferramentas */}
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            select
            label={t('results.tools')}
            name="tool"
            variant="outlined"
            value={filters.tool}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">{t('results.all')}</MenuItem>
            <MenuItem value="STANLEY">STANLEY</MenuItem>
            <MenuItem value="MAKITA">MAKITA</MenuItem>
          </TextField>
        </Grid>

        {/* Programas */}
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            select
            label={t('results.programs')}
            name="programName"
            variant="outlined"
            value={filters.programName}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">{t('results.all')}</MenuItem>
            <MenuItem value="101-M001/task 1">PVT1</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <TextField
            select
            label="Status"
            name="status"
            variant="outlined"
            value={filters.status}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">{t('results.all')}</MenuItem>
            <MenuItem value="OK">OK</MenuItem>
            <MenuItem value="NOK">NOK</MenuItem>
          </TextField>
        </Grid>

        {/* Data */}
        <Grid item xs={5} sm={5} md={3}>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DatePicker
              name="startDate"
              label="Início"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider> */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <TextField
              id="datetime-local"
              label={t('results.startDate')}
              type="datetime-local"
              defaultValue={getCurrentDateTime()}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={5} sm={5} md={3}>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DatePicker
              name="endDate"
              label="Fim"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider> */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <TextField
              id="datetime-local"
              label={t('results.endDate')}
              type="datetime-local"
              defaultValue={getCurrentDateTime()}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" onClick={handleResetFilters}>
            {t('results.clearFilters')}
          </Button>
          <Button variant="contained" onClick={handleSearch}>
            {t('results.seach')}
          </Button>
        </Grid>
      </Grid>

      {/* Tabela de Dados */}
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Toolbar
          sx={{
            height: 50,
            display: 'flex',
            justifyContent: 'flex-end',
            p: (theme) => theme.spacing(0, 1, 0, 3),
          }}
        >
          <div>
            <Tooltip title={t('results.saveExport')}>
              <IconButton onClick={() => downloadCSV(data)}>
                <Iconify icon="material-symbols:save" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('results.print')}>
              <IconButton onClick={handlePrintAllPages}>
                <Iconify icon="material-symbols:print" />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
        <div ref={tableRef}>
          <Table stickyHeader sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'dateTime'}
                    direction={orderBy === 'dateTime' ? order : 'asc'}
                    onClick={() => handleRequestSort('dateTime')}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {t('results.date')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'tid'}
                    direction={orderBy === 'tid' ? order : 'asc'}
                    onClick={() => handleRequestSort('tid')}
                    sx={{ display: 'flex', justifyContent: 'right' }}
                  >
                    Id
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'toolName'}
                    direction={orderBy === 'toolName' ? order : 'asc'}
                    onClick={() => handleRequestSort('toolName')}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {t('results.tools')}
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'job'}
                    direction={orderBy === 'job' ? order : 'asc'}
                    onClick={() => handleRequestSort('job')}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {t('results.job')}
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'programName'}
                    direction={orderBy === 'programName' ? order : 'asc'}
                    onClick={() => handleRequestSort('programName')}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {t('results.programs')}
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'fuso'}
                    direction={orderBy === 'fuso' ? order : 'asc'}
                    onClick={() => handleRequestSort('fuso')}
                    sx={{ display: 'flex', justifyContent: 'right' }}
                  >
                    {t('results.spindle')}
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'generalStatus'}
                    direction={orderBy === 'generalStatus' ? order : 'asc'}
                    onClick={() => handleRequestSort('generalStatus')}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {t('results.generalStatus')}
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'torque'}
                    direction={orderBy === 'torque' ? order : 'asc'}
                    onClick={() => handleRequestSort('torque')}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    Torque
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'angle'}
                    direction={orderBy === 'angle' ? order : 'asc'}
                    onClick={() => handleRequestSort('angle')}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {t('results.angle')}
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow
                  key={row.tid}
                  sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                >
                  <TableCell sx={{ textAlign: 'center' }}>{row.dateTime}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.tid}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.toolName}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.job}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.programName}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.fuso}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
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
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {getStatusIcon(row.torqueStatus, row.torque)}
                    </Box>
                    {row.torque}
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {getStatusIcon(row.angleStatus, row.angle)}
                    </Box>
                    {row.angle}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
    </>
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

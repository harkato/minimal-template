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
  toolbarClasses,
  FormControl,
  InputLabel,
  Select,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { ArrowUpward, ArrowDownward, Cancel } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import {
  useResultData,
  useFetchToolsData,
  useResultPaginate,
  resultPgLength,
} from 'src/routes/hooks/useToolData';

type Order = 'asc' | 'desc';

interface DataRow {
  dateTime: string;
  tid: string;
  toolName: string;
  job: number;
  programName: string;
  fuso: number;
  torque: number;
  torqueStatus: number;
  angle: number;
  angleStatus: number;
  generalStatus: string;
}

enum Status {
  OK = 0,
  NOK = 1,
  LOW = 2,
  HIGH = 3,
}

interface Filters {
  identifier: string;
  toolList: any;
  programList: string[];
  generalStatus: string;
  initialDateTime: string;
  finalDateTime: string;
  page: number;
  pageSize: number;
}

const initialFilters = {
  identifier: '',
  toolList: [''],
  programList: [],
  generalStatus: '',
  finalDateTime: '',
  initialDateTime: '',
  page: 1,
  pageSize: 50,
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

const getStatusIcon = (status: Status) => {
  switch (status) {
    case Status.OK:
      return <CheckIcon sx={{ color: '#20878b' }} />;
    case Status.NOK:
      return <CancelIcon sx={{ color: '20878b' }} />;
    case Status.LOW:
      return <ArrowDownward sx={{ color: '#FFB300' }} />;
    case Status.HIGH:
      return <ArrowUpward sx={{ color: '#f24f4f' }} />;
    default:
      return null;
  }
};
//     <CheckIcon sx={{ color: '#20878b' }} />
//   ) : i % 2 === 0 ? (
//     <ArrowUpward sx={{ color: '#f24f4f' }} />
//   ) : (
//     <ArrowDownward sx={{ color: '#FFB300' }} />
//   );
// }

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
  const { t } = useTranslation();
  const [data, setData] = useState<DataRow[]>([]);
  const [toolsData, setToolsData] = useState(['']);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DataRow>('dateTime');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [pages, setPages] = useState(0); // numero da pagina atual
  const [rowsPerPages, setRowsPerPages] = useState(5); // linhas por pagina
  const [totalCount, setTotalCount] = useState(100); // quantidade total de itens
  const {
    isLoading: isLoadingResultPg,
    isError: isErrorResultPg,
    data: resultPgData,
    error: errorResultPg,
    // refetch,
  } = useResultPaginate(pages, rowsPerPages); // recebe os dados paginados da API

  // teste
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
    refetch,
  } = useResultData(filters);

  const {
    isLoading: isLoadingTools,
    isError: isErrorTools,
    data: fetchToolsData,
    error: toolsError,
  } = useFetchToolsData();

  const classes = useStyles();
  // const getCurrentDateTime = () => {
  //   const now = dayjs(); // Utiliza o Dayjs para obter a data e hora atual
  //   const isoString = now.format('YYYY-MM-DDTHH:mm'); // Formata para o padrão datetime-local
  //   return isoString;
  // };

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

  const handleListChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValues = event.target.value as string[];
    setSelectedTools(selectedValues);
  };

  // Atualiza `filters` quando `selectedTools` mudar
  useEffect(() => {
    const toolsWithRevisions = toolsData
      .filter((tool: any) => selectedTools.includes(tool.toolName))
      .map((tool: any) => ({
        id: tool.toolId,
        revision: tool.revision,
      }));

    setFilters((prevFilters) => ({
      ...prevFilters,
      toolList: JSON.stringify(toolsWithRevisions), // Agora contém os objetos { id, revision }
    }));
  }, [toolsData, selectedTools]); // Atualiza sempre que `selectedTools` mudar

  // Verifica se os dados estão corretos

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formattedDate = dayjs(value).format('YYYY-MM-DDTHH:mm:ss');

    setFilters({ ...filters, [name]: formattedDate });
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // const status = () => (value === 'OK' ? 'OK' : 'NOK');
    setFilters({ ...filters, generalStatus: value });
  };

  // const handleMaxResultsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setFilters({ ...filters, pageSize: Number.parseInt(value, 10) });
  // };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSelectedTools([]);
  };

  const handleSearch = () => {
    refetch();
  };

  const table = useTable();
  const paginatedData = data.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetchToolsData) {
      setToolsData(fetchToolsData);
    }
  }, [fetchToolsData]);

  useEffect(() => {
    async function fetchTotalCount() {
      const count = await resultPgLength(); // Chama a função que busca o número de itens
      setTotalCount(parseInt(count, 10));
    }
    fetchTotalCount();
    console.log(totalCount);
  }, [resultPgData, totalCount]);

  useEffect(() => {
    // atualiza os dados da tabela
    if (resultPgData) {
      const transformedData = resultPgData.map((item: any) => ({
        dateTime: transformDate(item.dateTime),
        tid: item.identifier,
        toolName: item.toolDTO.toolName || '', // Extrai de toolDTO
        job: item.jobNumber || '',
        programName: item.toolProgramDTO.programName || '',
        fuso: item.spindleNumber || '',
        torque: item.torque || '',
        torqueStatus: item.torqueStatus,
        angle: item.angle || '',
        angleStatus: item.angleStatus,
        generalStatus: item.generalStatus === 1 ? 'OK' : 'NOK',
      }));
      setData(transformedData);
      console.log(transformedData);
    }
  }, [resultPgData]);
  // Atualiza o estado page e chama useResultPg para carregar os novos dados.
  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPages(newPage);
  };
  //  Atualiza o estado rowsPerPage e chama useResultPg para carregar os novos dados.
  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPages(parseInt(event.target.value, 10));
    setPages(0); // Resetar para a primeira página ao mudar rowsPerPage
    // console.log('data:', data);
  };

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
                      row.torqueStatus === 1 ? 'status-ok' : 'status-warning'
                    }">
                      ${row.torqueStatus === 1 ? 'check_circle' : 'arrow_downward'}
                    </span>
                  </td>
                  <td class="torque-angle-col status-icon">
                    ${row.angle}
                    <span class="material-icons ${
                      row.angleStatus === 1 ? 'status-ok' : 'status-warning'
                    }">
                      ${row.angleStatus === 1 ? 'check_circle' : 'arrow_downward'}
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

  // TABELA

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
            name="identifier"
            variant="outlined"
            value={filters.identifier}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>

        {/* Ferramentas */}
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{t('results.tools')}</InputLabel>
            <Select
              multiple
              displayEmpty
              value={selectedTools || []}
              onChange={handleListChange}
              renderValue={(selected) =>
                selected.length === 0 ? (
                  <em />
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                )
              }
            >
              <MenuItem value="Todos">{t('results.all')}</MenuItem>
              {toolsData.map((tool: any, index: number) => (
                <MenuItem key={index} value={tool.toolName}>
                  {tool.toolName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Programas */}
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            select
            label={t('results.programs')}
            name="programList"
            variant="outlined"
            // value={filters.programList}
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
            value={filters.generalStatus}
            onChange={handleStatusChange}
            fullWidth
          >
            <MenuItem value="">{t('results.all')}</MenuItem>
            <MenuItem value="1">OK</MenuItem>
            <MenuItem value="0">NOK</MenuItem>
          </TextField>
        </Grid>

        {/* Data */}
        <Grid item xs={5} sm={5} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <TextField
              id="datetime-local"
              label={t('results.startDate')}
              type="datetime-local"
              defaultValue=""
              name="initialDateTime"
              className={classes.textField}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={5} sm={5} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <TextField
              id="datetime-local"
              label={t('results.endDate')}
              type="datetime-local"
              defaultValue=""
              name="finalDateTime"
              className={classes.textField}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Número de resultados */}

        <Grid item xs={12} sm={6} md={6}>
          <TextField
            select
            label="Número de resultados"
            name="pageSize"
            variant="outlined"
            value={filters.pageSize}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
          </TextField>
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
                  key={index}
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
                      {getStatusIcon(row.torqueStatus)}
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
                      {getStatusIcon(row.angleStatus)}
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
          page={pages}
          count={totalCount}
          rowsPerPage={rowsPerPages}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
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

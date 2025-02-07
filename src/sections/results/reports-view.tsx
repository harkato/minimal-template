import React, { useCallback, useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Toolbar,
  Tooltip,
  IconButton,
  SelectChangeEvent,
  listItemTextClasses,
  TablePagination,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { ArrowUpward, ArrowDownward, Cancel } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import {
  useFetchToolsData,
  useResultPaginate,
  fetchProgramsData,
  useResultAmount,
} from 'src/routes/hooks/api';
import { useQuery } from '@tanstack/react-query';
import FiltersMenu from './components/filter-menu';
import { printAllPages } from 'src/utils/print-table';

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
  programList: any;
  generalStatus: string;
  initialDateTime: string;
  finalDateTime: string;
}

const initialFilters = {
  identifier: '',
  toolList: '',
  programList: '',
  generalStatus: '',
  finalDateTime: '',
  initialDateTime: '',
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
  const [programsData, setProgramsData] = useState(['']);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DataRow>('dateTime');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [page, setPage] = useState(0); // numero da pagina atual
  const [rowsPerPage, setRowsPerPage] = useState(25); // linhas por pagina
  const [totalCount, setTotalCount] = useState(100); // quantidade total de itens
  // const {
  //   isLoading: isLoadingResultPg,
  //   isError: isErrorResultPg,
  //   data: resultPgData,
  //   error: errorResultPg,
  //   // refetch,
  // } = useResultPaginate(page, rowsPerPages); // recebe os dados paginados da API

  const { data: resultPgDataAmount } = useResultAmount(filters); // recebe a quantidade total de itens da busca na NOVA API

  const {
    isLoading: isPlaceholderData,
    isError: isErrorResult,
    data: resultData,
    error: errorResult,
    refetch,
  } = useResultPaginate(page, rowsPerPage, resultPgDataAmount?.total || 0, filters);

  const {
    isLoading: isLoadingTools,
    isError: isErrorTools,
    data: fetchToolsData,
    error: toolsError,
  } = useFetchToolsData();

  const { data: queryProgramsData } = useQuery({
    queryFn: () => fetchProgramsData('programs/tools', filters.toolList),
    queryKey: ['programs', JSON.stringify(filters)],
    enabled: !!filters.toolList && filters.toolList.length > 0,
  });

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

  const handleToolListChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValues = event.target.value as string[];
    setSelectedTools(selectedValues);
  };

  const handleProgramListChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValues = event.target.value as string[];
    setSelectedPrograms(selectedValues);
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
      toolList: toolsWithRevisions, // Agora contém os objetos { id, revision }
    }));
  }, [toolsData, selectedTools]); // Atualiza sempre que `selectedTools` mudar

  useEffect(() => {
    const programNumbers = programsData
      .filter((program: any) => selectedPrograms.includes(program.programName))
      .map((program: any) => program.programId);

    setFilters((prevFilters) => ({
      ...prevFilters,
      programList: programNumbers,
    }));
  }, [programsData, selectedPrograms]);
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

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSelectedTools([]);
    setSelectedPrograms([]);
  };

  const handleSearch = () => {
    refetch();
    setPage(0);
  };

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetchToolsData) {
      setToolsData(fetchToolsData);
    }
    if (queryProgramsData) {
      setProgramsData(queryProgramsData);
    }
  }, [fetchToolsData, queryProgramsData]);

  useEffect(() => {
    if (resultPgDataAmount) {
      setTotalCount(resultPgDataAmount?.total || 0);
    }
  }, [resultPgDataAmount]);

  useEffect(() => {
    // atualiza os dados da tabela
    if (resultData) {
      const transformedData = resultData.map((item: any) => ({
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
    }
  }, [resultData]);
  // Atualiza o estado page e chama useResultPg para carregar os novos dados.
  console.log('Dados: ', data);

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  //  Atualiza o estado rowsPerPage e chama useResultPg para carregar os novos dados.
  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    const newPageSize = parseInt(event.target.value, 10);

    setRowsPerPage(newPageSize);
    setPage(0); // Resetar para a primeira página ao mudar pageSize
    setFilters((prevFilters) => ({
      ...prevFilters,
      pageSize: newPageSize,
    }));
  };

  const handlePrintAllPages = () => {
    printAllPages(data);
  };
  // TABELA

  return (
    <>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, ml: 4 }}>
        {t('results.results')}
      </Typography>

      {/* Menu de Filtros */}
      <FiltersMenu
        filters={filters}
        selectedTools={selectedTools}
        selectedPrograms={selectedPrograms}
        toolsData={toolsData}
        programsData={programsData}
        handleFilterChange={handleFilterChange}
        handleToolListChange={handleToolListChange}
        handleProgramListChange={handleProgramListChange}
        handleStatusChange={handleStatusChange}
        handleDateChange={handleDateChange}
        handleResetFilters={handleResetFilters}
        handleSearch={handleSearch}
      />

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
              {data.map((row, index) => (
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
          page={page}
          count={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[25, 50, 100, 200]}
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

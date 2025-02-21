import React, { useCallback, useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { format } from 'date-fns';
import {
  Box,
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
  TablePagination,
  CircularProgress,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
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
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useQuery } from '@tanstack/react-query';
import FiltersMenu from './components/filter-menu';
import { printAllPages } from 'src/utils/print-table';
import { useNavigate } from 'react-router-dom';

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
  angleStatus: string;
  torqueStatus: string;
  generalStatus: string;
  initialDateTime: string;
  finalDateTime: string;
  blockSearch: boolean;
}

const initialFilters = {
  identifier: '',
  toolList: '',
  programList: '',
  angleStatus: '',
  torqueStatus: '',
  generalStatus: '',
  finalDateTime: '',
  initialDateTime: '',
  blockSearch: true,
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

const transformDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy HH:mm');
};

export default function ResultPage() {
  const { t } = useTranslation();
  const tableRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DataRow[]>([]); // Resultados
  const [toolsData, setToolsData] = useState(['']); // Lista de ferramentas
  const [programsData, setProgramsData] = useState(['']); // Lista de programas
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DataRow>('dateTime');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Recebe a quantidade total de itens da busca
  const { data: resultPgDataAmount } = useResultAmount(filters);

  // Recebe os resultados filtrados
  const { 
    isLoading: isLoadingResult, 
    isError: isErrorResult, 
    data: resultData, 
    error: errorResult, 
    refetch 
  } = useResultPaginate(
    page,
    rowsPerPage,
    resultPgDataAmount?.total || 0,
    filters
  );

  // Lista de ferramentas
  const { data: fetchToolsData } = useFetchToolsData();

  // Lista dos programas das ferramentas
  const {
    data: queryProgramsData,
    error: errorProgramsData,
    isError: isErrorProgramsData,
  } = useQuery({
    queryFn: () => fetchProgramsData('programs/tools', filters.toolList),
    queryKey: ['programs', JSON.stringify(filters)],
    enabled: !!filters.toolList && filters.toolList.length > 0,
  });

  // Atualiza o filtro de ferramentas
  useEffect(() => {
    const toolsWithRevisions = toolsData
      .filter((tool: any) => selectedTools.includes(tool.toolName))
      .map((tool: any) => ({
        id: tool.toolId,
        revision: tool.revision,
      }));

    setFilters((prevFilters) => ({
      ...prevFilters,
      toolList: toolsWithRevisions,
    }));
  }, [toolsData, selectedTools]);

  // Atualiza o filtro de programas
  useEffect(() => {
    const programNumbers = programsData
      .filter((program: any) => selectedPrograms.includes(program.programName))
      .map((program: any) => program.programNumber);

    setFilters((prevFilters) => ({
      ...prevFilters,
      programList: programNumbers,
    }));
  }, [programsData, selectedPrograms]);

  // Atualiza a lista de ferramentas e de programas
  useEffect(() => {        
    if (fetchToolsData) {
      setToolsData(fetchToolsData);
    }
    if (queryProgramsData) {
      setProgramsData(queryProgramsData);
    }
    // console.log(`programsData ${programsData} size ${programsData.length}`);
    // console.log("selectedTools", selectedTools.length);
    
  }, [fetchToolsData, queryProgramsData]);

  // Atualiza o número de itens totais
  useEffect(() => {
    if (resultPgDataAmount) {
      setTotalCount(resultPgDataAmount?.total || 0);
    }
  }, [resultPgDataAmount]);

  // Tratamento de resultados para a tabela
  useEffect(() => {
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
        generalStatus: item.generalStatus === 0 ? 'OK' : 'NOK',
      }));
      setData(transformedData);
    }
  }, [resultData]);

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
    setFilters({ ...filters, [name]: value, blockSearch: true });
  };

  // Gerencia filtros de múltipla seleção
  const handleSelectionChange = (
    event: SelectChangeEvent<string[]>,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const selectedValues = event.target.value as string[];
    setState(selectedValues);
    setFilters({ ...filters, blockSearch: true });
  };

  // Gerencia o filtro de data
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formattedDate = dayjs(value).format('YYYY-MM-DDTHH:mm:ss');

    setFilters({ ...filters, [name]: formattedDate, blockSearch: true });
  };

  // Gerencia o filtro de data por periodo
  const handleDateChangePeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedPeriod(value)
    let period = ""
    let today = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    
    if (value === "yesterday") {
        period = dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss'); // Subtrai 1 dia da data atual
    } else if (value === "3days") { 
      period = dayjs().subtract(3, 'day').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === "7days") { 
      period = dayjs().subtract(7, 'day').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === "30days") { 
      period = dayjs().subtract(30, 'day').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === "3months") { 
      period = dayjs().subtract(3, 'month').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === "6months") { 
      period = dayjs().subtract(6, 'month').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === "1year") { 
      period = dayjs().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      today = ''
    }
    setFilters({ ...filters, initialDateTime: period, finalDateTime: today, blockSearch: true });    
  };

  // Gerencia o filtro de status
  // const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setFilters({ ...filters, generalStatus: value, blockSearch: true });
  // };
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if(value === '0' || value === '1'){
      setFilters({ ...filters, generalStatus: value, angleStatus: '', torqueStatus: '', blockSearch: true });
    } else if(value === '2' || value === '3'){
      setFilters({ ...filters, angleStatus: value, generalStatus: '', torqueStatus: '', blockSearch: true });
    } else if(value === '4' ){
      setFilters({ ...filters, torqueStatus: '2', generalStatus: '', angleStatus: '', blockSearch: true });
    } else if(value === '5' ){
      setFilters({ ...filters, torqueStatus: '3', generalStatus: '', angleStatus: '', blockSearch: true });
    }else{
      setFilters({ ...filters, generalStatus: '', angleStatus: '', torqueStatus: '', blockSearch: true });
    }
  };

  // Reseta os filtros
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSelectedTools([]);
    setSelectedPrograms([]);
    setSelectedPeriod('');
    setProgramsData(['']);
  };

  // Faz a pesquisa
  const handleSearch = () => {
    setFilters({ ...filters, blockSearch: false });
    refetch();
    setPage(0);
  };

  // Gerencia a mudança de página
  // const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
  //   setPage(newPage);
  // };
  const handleChangePage = useCallback((event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0; // Rola para o topo ao mudar a página
    }
  }, []);
  
  //  Gerencia as linhas por página
  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    const newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    setPage(0);
    setFilters((prevFilters) => ({
      ...prevFilters,
      pageSize: newPageSize,
    }));
  };

  // Função de impressão da tabela
  const handlePrintAllPages = () => {
    printAllPages(data);
  };

  return (
    <>
      {/* ================================================================== titulo da pagina ============================================= */}
      {/* <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, ml: 4 }}>  
        {t('results.results')}
      </Typography> */}

      {/* Menu de Filtros */}
      <FiltersMenu
        filters={filters}
        selectedTools={selectedTools}
        setSelectedTools={setSelectedTools}
        selectedPrograms={selectedPrograms}
        setSelectedPrograms={setSelectedPrograms}
        toolsData={toolsData}
        programsData={programsData}
        handleFilterChange={handleFilterChange}
        handleSelectionChange={handleSelectionChange}
        handleStatusChange={handleStatusChange}
        handleDateChange={handleDateChange}
        handleDateChangePeriod={handleDateChangePeriod}
        handleResetFilters={handleResetFilters}
        handleSearch={handleSearch}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      {/* Tabela de Dados */}
      <TableContainer component={Paper} sx={{ maxHeight: 440 }} ref={tableContainerRef}>
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
        <TablePagination
          component="div"
          page={page}
          count={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[25, 50, 100, 200]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div ref={tableRef}>
          <Table stickyHeader sx={{ minWidth: 650 }} size="small">
            {/* Head da tabela */}
            <TableHead>
              <TableRow>
              {isLoadingResult ? (
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  <CircularProgress />
                </TableCell>
              ) : !filters.blockSearch && resultData.length === 0 ? (
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  Não foram encontrados registros.
                </TableCell>
              ) : (
                <>
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
                  </>
                )}
              </TableRow>
            </TableHead>
            {/* Corpo da tabela */}
            {!isLoadingResult && (
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                >
                  {/* <TableCell sx={{ textAlign: 'center' }}>{row.dateTime}</TableCell> */}
                  <TableCell sx={{ textAlign: 'left' }} >
                  <Box
                      sx={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                      onClick={() => handleNavigation('/detail')}
                    >
                      <AddBoxOutlinedIcon sx={{ color: '#00477A' }} />
                    </Box>
                    {row.dateTime}
                  </TableCell>
                  
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
            )}
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

// const getCurrentDateTime = () => {
//   const now = dayjs(); // Utiliza o Dayjs para obter a data e hora atual
//   const isoString = now.format('YYYY-MM-DDTHH:mm'); // Formata para o padrão datetime-local
//   return isoString;
// };

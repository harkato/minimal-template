import React, { useCallback, useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { format } from 'date-fns';
import {
  Typography,
  IconButton,
  SelectChangeEvent,
  DialogTitle,
  DialogContent,
  Alert,
  Stack,
  Grid,
  Card,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import {
  useFetchToolsData,
  useResultPaginate,
  fetchProgramsData,
  useResultAmount,
} from 'src/routes/hooks/api';
import { useQuery } from '@tanstack/react-query';
import FiltersNokTrend from './components/filter-nok-trend';
import { printAllPages } from 'src/utils/print-table';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import Dialog from '@mui/material/Dialog';
import { DetailsPage } from './detail-view';
import { ResultDataRow } from 'src/types/DataRow';
import ResultsTable from './components/ResultsTable';
import CloseIcon from '@mui/icons-material/Close';
import StackedColumnsChart from 'src/components/chart/StackedColumnsChart';

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

export interface Filters {
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
  return format(date, 'dd/MM/yyyy HH:mm:ss');
};

export default function NokTrendPage() {
  const { t } = useTranslation();
  const tableRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DataRow[]>([]); // Resultados
  const [toolsData, setToolsData] = useState(['']); // Lista de ferramentas
  const [programsData, setProgramsData] = useState(['']); // Lista de programas
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
  const [openStack, setOpenStack] = useState(false);
  const [openDialogResults, setOpenDialogResults] = useState(false);

  // Recebe a quantidade total de itens da busca
  const { data: resultPgDataAmount } = useResultAmount(filters);

  // Recebe os resultados filtrados
  const {
    isLoading: isLoadingResult,
    isError: isErrorResult,
    data: resultData,
    error: errorResult,
    refetch,
  } = useResultPaginate(page, rowsPerPage, resultPgDataAmount?.total || 0, filters);

  // Lista de ferramentas
  const {
    data: fetchToolsData,
    error: errorFetchToolsData,
    isError: isErrorFetchToolsData,
    isLoading: isLoadingFetchToolsData,
  } = useFetchToolsData();

  // Lista dos programas das ferramentas
  const {
    data: queryProgramsData,
    error: errorProgramsData,
    isError: isErrorProgramsData,
    isLoading: isLoadingProgramsData,
  } = useQuery({
    queryFn: () => fetchProgramsData('programs/tools', filters.toolList),
    queryKey: ['programs', JSON.stringify(filters)],
    enabled: !!filters.toolList && filters.toolList.length > 0,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<ResultDataRow | null>(null);

  const handleOpenDialog = (rowData: ResultDataRow) => {
    setSelectedRowData(rowData);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRowData(null);
  };

  const handleOpenResults = () => {
    setOpenDialogResults(true);
  };

  const handleCloseDialogResults = () => {
    setOpenDialogResults(false);
  };

  // Atualiza o filtro de ferramentas
  useEffect(() => {
    const toolsWithRevisions = toolsData
      .filter((tool: any) => selectedTools.includes(tool.toolId))
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
      .filter((program: any) => selectedPrograms.includes(program.programId))
      .map((program: any) => program.programId);

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
  }, [fetchToolsData, queryProgramsData]);

  // verifica se a data final precede a inicial
  useEffect(() => {
    setPage(0);
    if (filters.initialDateTime !== '' && filters.finalDateTime !== '') {
      const iDate = dayjs(filters.initialDateTime);
      const fDate = dayjs(filters.finalDateTime);
      if (fDate.isBefore(iDate)) {
        setOpenStack(true);
      } else {
        setOpenStack(false);
      }
    }
  }, [filters.initialDateTime, filters.finalDateTime]);

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

  useEffect(() => {
    // erro lista de ferramentas
    if (isErrorFetchToolsData) {
      toast.error(`Erro ao carregar a lista de ferramentas. ${errorFetchToolsData.message}`);
    }
  }, [isErrorFetchToolsData, errorFetchToolsData, isLoadingFetchToolsData]);

  useEffect(() => {
    // erro lista de programas
    if (isErrorProgramsData) {
      toast.error(`Erro ao carregar a lista de programas. ${errorProgramsData.message}`);
    }
  }, [isErrorProgramsData, errorProgramsData, isLoadingProgramsData]);

  useEffect(() => {
    // erro resultados filtrados
    if (isErrorResult) {
      toast.error(`Erro ao carregar os resutados. ${errorResult.message}`);
    }
  }, [isErrorResult, errorResult, isLoadingResult]);

  useEffect(() => {
    // Conexão perdida
    const handleOffline = () => toast.error('Conexão perdida. Verifique sua conexão com a rede.');

    window.addEventListener('offline', handleOffline);

    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  useEffect(() => {
    // Conexão restaurada
    const handleOnline = () => toast.success('Conexão restaurada');
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

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
    setOpenStack(false);
    // faz avalidação da data
    const date = dayjs(value);
    if (!date.isValid()) {
      setOpenStack(true);
      // return;
    }
    // const formattedDate = dayjs(value).format('YYYY-MM-DDTHH:mm:ss');
    setFilters({ ...filters, [name]: value, blockSearch: true });
  };

  // Gerencia o filtro de data por periodo
  const handleDateChangePeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedPeriod(value);
    let period = '';
    let today = dayjs().format('YYYY-MM-DDTHH:mm:ss');

    if (value === 'yesterday') {
      period = dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss'); // Subtrai 1 dia da data atual
    } else if (value === '3days') {
      period = dayjs().subtract(3, 'day').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === '7days') {
      period = dayjs().subtract(7, 'day').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === '30days') {
      period = dayjs().subtract(30, 'day').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === '3months') {
      period = dayjs().subtract(3, 'month').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === '6months') {
      period = dayjs().subtract(6, 'month').format('YYYY-MM-DDTHH:mm:ss');
    } else if (value === '1year') {
      period = dayjs().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      today = '';
    }
    setFilters({ ...filters, initialDateTime: period, finalDateTime: today, blockSearch: true });
  };

  // Gerencia o filtro de status
  const handleGroupBy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '0' || value === '1') {
      setFilters({
        ...filters,
        generalStatus: value,
        angleStatus: '',
        torqueStatus: '',
        blockSearch: true,
      });
    } else if (value === '2' || value === '3') {
      setFilters({
        ...filters,
        angleStatus: value,
        generalStatus: '',
        torqueStatus: '',
        blockSearch: true,
      });
    } else if (value === '4') {
      setFilters({
        ...filters,
        torqueStatus: '2',
        generalStatus: '',
        angleStatus: '',
        blockSearch: true,
      });
    } else if (value === '5') {
      setFilters({
        ...filters,
        torqueStatus: '3',
        generalStatus: '',
        angleStatus: '',
        blockSearch: true,
      });
    } else {
      setFilters({
        ...filters,
        generalStatus: '',
        angleStatus: '',
        torqueStatus: '',
        blockSearch: true,
      });
    }
  };

  // Reseta os filtros
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSelectedTools([]);
    setSelectedPrograms([]);
    setSelectedPeriod('');
    setProgramsData(['']);
    setOpenStack(false);
    setPage(0);
  };

  // Faz a pesquisa
  const handleSearch = () => {
    setFilters({ ...filters, blockSearch: false });
    refetch();
    setPage(0);
    handleOpenResults();
  };

  // Gerencia a mudança de página
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

  const cleanObject = (obj: Filters) =>
    Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => {
        // Remove valores vazios, nulos, undefined e arrays vazios
        if (
          key === 'blockSearch' ||
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return false;
        }

        return true;
      })
    );

  // Função de impressão da tabela
  const handlePrintAllPages = () => {
    const cleanedFilters = cleanObject(filters);
    printAllPages(data, cleanedFilters);
  };

  // console.log(programsData);

  return (
    <>
      <ToastContainer
        position="bottom-left"
        theme="light"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={5}
        className="no-print"
      />
      {/* ================================================================== titulo da pagina ============================================= */}
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, ml: 4 }} className="no-print">
        Tendência NOK
      </Typography>

      {/* Menu de Filtros */}
      <FiltersNokTrend
        filters={filters}
        selectedTools={selectedTools}
        setSelectedTools={setSelectedTools}
        selectedPrograms={selectedPrograms}
        setSelectedPrograms={setSelectedPrograms}
        toolsData={toolsData}
        programsData={programsData}
        handleFilterChange={handleFilterChange}
        handleSelectionChange={handleSelectionChange}
        handleGroupBy={handleGroupBy}
        handleDateChange={handleDateChange}
        handleDateChangePeriod={handleDateChangePeriod}
        handleResetFilters={handleResetFilters}
        handleSearch={handleSearch}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        openStack={openStack}
      />
      <Grid container sx={{ mt: 1 }}>
        <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Stack sx={{ width: '80%' }} spacing={2}>
            <Alert
              variant="filled"
              severity="info"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              A pesquisa retornou mais dados do que podem ser visualizados. Mostrando apenas os 48
              últimos valores
            </Alert>
          </Stack>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          {/* Gráfico Stacked Columns */}
          <Card>
            <StackedColumnsChart />
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Dados */}
      <Dialog open={openDialogResults} onClose={handleCloseDialogResults} fullWidth maxWidth="xl">
        <DialogTitle sx={{ backgroundColor: '#00477A', color: 'white' }}>
          Resultados
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogResults}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            className="no-print"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <ResultsTable
            data={data}
            isLoadingResult={isLoadingResult}
            filters={filters}
            totalCount={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            downloadCSV={downloadCSV}
            printAllPages={handlePrintAllPages}
            handleOpenDialog={handleOpenDialog}
            resultData={resultData}
          />
        </DialogContent>
      </Dialog>

      <Dialog fullScreen open={openDialog} onClose={handleCloseDialog}>
        {selectedRowData && <DetailsPage dataRow={selectedRowData} onClose={handleCloseDialog} />}
      </Dialog>
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

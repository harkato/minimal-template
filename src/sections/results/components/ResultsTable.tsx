// ResultsTable.tsx
import React, { useRef } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  IconButton,
  TablePagination,
  CircularProgress,
  Box,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useTranslation } from 'react-i18next';
import { ResultDataRow } from 'src/types/DataRow';

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

interface NokTrendTableProps {
  data: DataRow[];
  isLoadingResult: boolean;
  filters: any;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: any, newPage: React.SetStateAction<number>) => void;
  handleChangeRowsPerPage: (event: { target: { value: string } }) => void;
  downloadCSV: (rows: DataRow[]) => void;
  printAllPages: () => void;
  handleOpenDialog: (rowData: ResultDataRow) => void;
  resultData: ResultDataRow[];
}

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

export default function NokTrendTable({
  data,
  isLoadingResult,
  filters,
  totalCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  downloadCSV,
  printAllPages,
  handleOpenDialog,
  resultData,
}: NokTrendTableProps) {
  const { t } = useTranslation();
  const tableRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }} ref={tableContainerRef} className="no-print">
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
            <IconButton onClick={printAllPages}>
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
        labelRowsPerPage={t('results.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} ${t('de')} ${count}`}
      />
      <div ref={tableRef}>
        <Table stickyHeader sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              {isLoadingResult ? (
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  <CircularProgress />
                </TableCell>
              ) : !filters.blockSearch && resultData.length === 0 ? (
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  {t('results.noRecords')}
                </TableCell>
              ) : (
                <>
                  <TableCell align="center">{t('results.date')}</TableCell>
                  <TableCell align="center">Id</TableCell>
                  <TableCell align="center">{t('results.tools')}</TableCell>
                  <TableCell align="center">{t('results.job')}</TableCell>
                  <TableCell align="center">{t('results.programs')}</TableCell>
                  <TableCell align="center">{t('results.spindle')}</TableCell>
                  <TableCell align="center">{t('results.generalStatus')}</TableCell>
                  <TableCell align="center">Torque</TableCell>
                  <TableCell align="center">{t('results.angle')}</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          {!isLoadingResult && (
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                >
                  <TableCell sx={{ textAlign: 'left' }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                      onClick={() => {
                        handleOpenDialog(resultData[index] as ResultDataRow);
                      }}
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
        labelRowsPerPage={t('results.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} ${t('de')} ${count}`}
      />
    </TableContainer>
  );
}
    
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, TableCell, TableHead, TableRow, Paper, Grid, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { z } from 'zod';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import UserModal from '../dialog';
import CrudTable from '../crud-table';

// ----------------------------------------------------------------------
interface User {
  name: string;
  role: string;
  email: string;
}

// Esquema de validação para o nome do usuário
const userNameSchema = z.string()
  .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  .max(50, { message: 'O nome deve ter no máximo 50 caracteres.' })
  .regex(/^[a-zA-Z\s]+$/, { message: 'O nome deve conter apenas letras e espaços.' });

export function UserView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: UserProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const [open, setOpen] = useState(false);
  const initialFormData = {
    name: '',
    userID: '',
    password: '',
    badge: '',
    profile: '',
    workStations: [] as string[],
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | string[]>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Lógica para cadastrar o usuário
    try {
      // Valida o nome usando o Zod
      userNameSchema.parse(formData.name);
      console.log('Nome válido:', formData.name);
      // Aqui você pode processar o envio do formulário
    } catch (e) {
      alert('Erro ao criar usuário: nome inválido')
    } finally {
      setFormData(initialFormData);
      handleClose(); // Fecha o diálogo após a submissão
    }
  };
  const profiles = ['Operador', 'Lider', 'Engenheiro de processo', 'Administrador do sistema', 'Usuário'];
  const workStations = ['ABS1', 'ABS2', 'Tacto 1', 'Tacto 13', 'R2 Chicote TC58', 'ZP6'];


  return (
    <DashboardContent>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Criar Novo Usuário</DialogTitle>
        <DialogContent>
          {/* Nome */}
          <TextField
            margin="dense"
            name="name"
            label="Nome"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
          />
          
          {/* userID */}
          <TextField
            margin="dense"
            name="userID"
            label="User ID"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.userID}
            onChange={handleChange}
          />
          
          {/* Senha */}
          <TextField
            margin="dense"
            name="password"
            label="Senha"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
          />
          
          {/* Crachá */}
          <TextField
            margin="dense"
            name="badge"
            label="Crachá"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.badge}
            onChange={handleChange}
          />

          {/* Perfil */}
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="profile-label">Perfil</InputLabel>
            <Select
              labelId="profile-label"
              name="profile"
              value={formData.profile}
              label="Perfil"
              onChange={handleChange}
            >
              {profiles.map((profile) => (
                <MenuItem key={profile} value={profile}>
                  {profile}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Postos de Trabalho */}
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="workStations-label">Postos de Trabalho</InputLabel>
            <Select
              labelId="workStations-label"
              name="workStations"
              value={formData.workStations}
              onChange={handleChange}
              label="Postos de trabalho"
            >
              {workStations.map((station) => (
                <MenuItem key={station} value={station}>
                  {station}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Criar
          </Button>
        </DialogActions>
      </Dialog>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Usuários
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleOpen}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Criar novo usuário
        </Button>
      </Box>
      {/* <Grid container spacing={3}>
        <CrudTable/>
        <h1> texto</h1>
      </Grid> */}
      
      
      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />
        
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'UserId' },
                  { id: 'name', label: 'Nome' },
                  // { id: 'company', label: 'Companhia' },
                  { id: 'cracha', label: 'Crachá' },
                  { id: 'role', label: 'Cargo' },
                  { id: 'isVerified', label: 'Verificado', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

        {/* <div style={{ padding: '20px' }}>
        <h1>Tabela de Usuários</h1>

        <UserModal open={openModal} handleClose={closeUserModal} handleSubmit={addUser} />

        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Companhia</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.company}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Nenhum usuário cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div> */}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface User {
  id: number;
  name: string;
  email: string;
}

const CrudTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ]);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({ id: 0, name: '', email: '' });

  // Abrir Modal para Adicionar ou Editar Usuário
  const handleClickOpen = (user: User | null) => {
    setEditingUser(user);
    setNewUser(user ? { ...user } : { id: 0, name: '', email: '' });
    setOpen(true);
  };

  // Fechar Modal
  const handleClose = () => {
    setOpen(false);
    setNewUser({ id: 0, name: '', email: '' });
  };

  // Adicionar ou Editar Usuário
  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => (u.id === editingUser.id ? newUser : u)));
    } else {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
    }
    handleClose();
  };

  // Excluir Usuário
  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary" onClick={() => handleClickOpen(user)}>
                  Edit
                </Button>{' '}
                <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Botão para adicionar novo usuário */}
      <Button variant="contained" color="primary" onClick={() => handleClickOpen(null)} style={{ marginTop: '20px' }}>
        Add User
      </Button>

      {/* Modal para adicionar ou editar usuário */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default CrudTable;

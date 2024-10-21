import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Tipos para usuário e props do modal
interface User {
  name: string;
  company: string;
  role: string;
  email: string;
}

interface UserModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (user: User) => void;
}

// Componente Modal com Tipagem TypeScript
const UserModal: React.FC<UserModalProps> = ({ open, handleClose, handleSubmit }) => {
  const [formData, setFormData] = useState<User>({ name: '', company: '', role: '', email: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
    setFormData({ name: '', company: '', role: '', email: '' }); // Limpar o formulário
    handleClose(); // Fechar o modal
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome"
          type="text"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Company"
          type="company"
          fullWidth
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Role"
          type="role"
          fullWidth
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={submitForm}>Cadastrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;

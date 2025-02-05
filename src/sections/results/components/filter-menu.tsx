import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslation } from 'react-i18next';

interface FiltersMenuProps {
  filters: any;
  selectedTools: string[];
  selectedPrograms: string[];
  toolsData: any[];
  programsData: any[];
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleToolListChange: (event: any) => void;
  handleProgramListChange: (event: any) => void;
  handleStatusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetFilters: () => void;
  handleSearch: () => void;
}

const FiltersMenu: React.FC<FiltersMenuProps> = ({
  filters,
  selectedTools,
  selectedPrograms,
  toolsData,
  programsData,
  handleFilterChange,
  handleToolListChange,
  handleProgramListChange,
  handleStatusChange,
  handleDateChange,
  handleResetFilters,
  handleSearch,
}) => {
  const { t } = useTranslation();

  return (
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
            onChange={handleToolListChange}
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
            {toolsData.map((tool, index) => (
              <MenuItem key={index} value={tool.toolName}>
                {tool.toolName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Programas */}
      <Grid item xs={12} sm={6} md={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>{t('results.programs')}</InputLabel>
          <Select
            multiple
            displayEmpty
            value={selectedPrograms || []}
            onChange={handleProgramListChange}
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
            {programsData.map((program, index) => (
              <MenuItem key={index} value={program.programName}>
                {program.programName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Status */}
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

      {/* Datas */}
      <Grid item xs={5} sm={5} md={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <TextField
            id="datetime-local"
            label={t('results.startDate')}
            type="datetime-local"
            name="initialDateTime"
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
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
            name="finalDateTime"
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
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

      {/* Botões */}
      <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="contained" onClick={handleResetFilters}>
          {t('results.clearFilters')}
        </Button>
        <Button variant="contained" onClick={handleSearch}>
          {t('results.seach')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default FiltersMenu;

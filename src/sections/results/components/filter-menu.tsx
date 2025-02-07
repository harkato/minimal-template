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
  Autocomplete,
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
        <Autocomplete
          multiple
          options={toolsData}
          getOptionLabel={(option) => option.toolName}
          value={selectedTools.map(
            (name) => toolsData.find((tool) => tool.toolName === name) || null
          )}
          onChange={(_, newValue) =>
            handleToolListChange({
              target: { value: newValue.map((tool) => tool?.toolName) },
            })
          }
          renderInput={(params) => (
            <TextField {...params} label={t('results.tools')} variant="outlined" />
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip label={option.toolName} {...getTagProps({ index })} />
            ))
          }
        />
      </Grid>

      {/* Programas */}
      <Grid item xs={12} sm={6} md={6}>
        <Autocomplete
          multiple
          options={programsData}
          getOptionLabel={(option) => option.programName}
          value={selectedPrograms.map(
            (name) => programsData.find((p) => p.programName === name) || null
          )}
          onChange={(_, newValue) =>
            handleProgramListChange({
              target: { value: newValue.map((p) => p?.programName) },
            })
          }
          renderInput={(params) => (
            <TextField {...params} label={t('results.programs')} variant="outlined" />
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip label={option.programName} {...getTagProps({ index })} />
            ))
          }
        />
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
            value={filters.initialDateTime}
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
            value={filters.finalDateTime}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ width: '100%' }}
          />
        </LocalizationProvider>
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

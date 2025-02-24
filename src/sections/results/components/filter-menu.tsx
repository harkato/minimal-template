import React from 'react';
import { Grid, TextField, MenuItem, Chip, Button, Autocomplete, Alert, Snackbar, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslation } from 'react-i18next';

interface FiltersMenuProps {
  filters: any;
  selectedTools: string[];
  setSelectedTools: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPrograms: string[];
  setSelectedPrograms: React.Dispatch<React.SetStateAction<string[]>>;
  toolsData: any[];
  programsData: any[];
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectionChange: (
    event: any,
    setSeletedValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => void;
  handleStatusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChangePeriod: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  handleResetFilters: () => void;
  handleSearch: () => void;
  selectedPeriod: string;
  setSelectedPeriod: React.Dispatch<React.SetStateAction<string>>;
  openStack: boolean;
}

const FiltersMenu: React.FC<FiltersMenuProps> = ({
  filters,
  selectedTools,
  setSelectedTools,
  selectedPrograms,
  setSelectedPrograms,
  toolsData,
  programsData,
  handleFilterChange,
  handleSelectionChange,
  handleStatusChange,
  handleDateChange,
  handleDateChangePeriod,
  handleResetFilters,
  handleSearch,
  selectedPeriod,
  openStack,
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
        {toolsData[0] !== '' ? ( // Verifica se toolsData existe e não está vazio
          <Autocomplete
            multiple
            options={toolsData}
            getOptionLabel={(option) => option.toolName}
            getOptionKey={(option) => option.toolId || option.toolName}
            value={selectedTools.map(
              (name) => toolsData.find((tool) => tool.toolName === name) || null
            )}
            onChange={(_, newValue) =>
              handleSelectionChange(
                { target: { value: newValue.map((tool) => tool?.toolName) } },
                setSelectedTools
              )
            }
            renderInput={(params) => (
              <TextField {...params} label={t('results.tools')} variant="outlined" />
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip key={key} label={option.toolName} {...tagProps} />;
              })
            }
          />
        ) : (
          <TextField
          select
          label={t('results.tools')}
          variant="outlined"
          fullWidth
          >
            <MenuItem>{t('results.ToolNotFound')}</MenuItem>
          </TextField>
        )} 
      </Grid>

      {/* Programas */}
      <Grid item xs={12} sm={6} md={6}>
      {programsData[0] !== '' && selectedTools.length ? ( // Verifica se toolsData existe e não está vazio
          <Autocomplete
            multiple
            options={programsData}
            getOptionLabel={(option) => option.programName}
            getOptionKey ={(option) => option.programId || option.programName}
            value={selectedPrograms.map(
              (name) => programsData.find((p) => p.programName === name) || null
            )}
            onChange={(_, newValue) =>
              handleSelectionChange(
                { target: { value: newValue.map((p) => p?.programName) } },
                setSelectedPrograms
              )
            }
            renderInput={(params) => (
              <TextField {...params} label={t('results.programs')} variant="outlined" />
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => {
                const { key , ...tagProps } = getTagProps({ index });
                return <Chip key={key} label={option.programName} {...getTagProps} />
              })
            }
          />
        ) : (
          <TextField
          select
            label={t('results.programs')}
            variant="outlined"
            fullWidth
          >
            <MenuItem>{t('results.ProgramNotFound')}</MenuItem>
            </TextField>
        )}
      </Grid>

      {/* Status */}
      <Grid item xs={12} sm={6} md={6}>
        <TextField
          select
          label="Status"
          name="status"
          variant="outlined"
          value={
            filters.torqueStatus === '2' ? "4" :
             filters.torqueStatus === '3' ? "5" :
              filters.generalStatus || filters.angleStatus
          }
          onChange={handleStatusChange}
          fullWidth
        >
          <MenuItem value="">{t('results.all')}</MenuItem>
          <MenuItem value="0">OK</MenuItem>
          <MenuItem value="1">NOK</MenuItem>
          <MenuItem value="2">{t('results.lowAngle')}</MenuItem>
          <MenuItem value="3">{t('results.highAngle')}</MenuItem>
          <MenuItem value="4">{t('results.lowTorque')}</MenuItem>
          <MenuItem value="5">{t('results.highTorque')}</MenuItem>
        </TextField>
      </Grid>

      {/* Período */}
      <Grid item xs={12} sm={6} md={6}>
        <TextField
          select
          label={t('results.Period')}
          name="periodo"
          variant="outlined"
          value={ selectedPeriod }
          onChange={handleDateChangePeriod}
          fullWidth
        >
          <MenuItem value="">_ </MenuItem> 
          <MenuItem value="yesterday">{t('results.yesterdayAndToday')}</MenuItem>
          <MenuItem value="3days">{t('results.last3Days')}</MenuItem>
          <MenuItem value="7days">{t('results.last7Days')}</MenuItem>
          <MenuItem value="30days">{t('results.last30Days')}</MenuItem>
          <MenuItem value="3months">{t('results.last3Months')}</MenuItem>
          <MenuItem value="6months">{t('results.last6Months')}</MenuItem>
          <MenuItem value="1year">{t('results.lastYear')}</MenuItem>
        </TextField>
      </Grid>

      {/* Datas */}
      <Grid item xs={5} sm={5} md={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <TextField
            id="datetime-local-initial"
            label={t('results.startDate')}
            type="datetime-local"
            name="initialDateTime"
            value={filters.initialDateTime} 
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: "2123-10-31T23:59" }}
            sx={{ width: '100%' }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={5} sm={5} md={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <TextField
            id="datetime-local-final"
            label={t('results.endDate')}
            type="datetime-local"
            name="finalDateTime"
            value={filters.finalDateTime}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: "2123-10-31T23:59" }}
            sx={{ width: '100%' }}
          />
        </LocalizationProvider>
      </Grid>

      {openStack && (
        <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert variant="filled" severity="error" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
        {t('results.invalidDate')}
        </Alert>
      </Stack>
      )}
      
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

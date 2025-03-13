// import React from 'react';
// import { vi } from 'vitest';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import '@testing-library/jest-dom';
// import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import FiltersMenu from '../src/sections/results/components/filter-menu';

// const toolsData = [
//   {
//     toolId: 1,
//     revision: 9,
//     toolName: 'PER040',
//     toolAlias: 'PER040',
//     insertId: 449,
//     ip: '172.23.1.47',
//     mac: '',
//     deviceNumber: 0,
//     protocolID: 0,
//     stationCode: 0,
//     modelID: 4,
//     servoSerialNumber: '',
//     toolSerialNumber: '042219021',
//     spindles: 1,
//     stationID: null,
//     userID: null,
//     insertDate: '2022-09-29T08:30:14.313',
//     configStr: '',
//     toolGroup: 0,
//     state: 1,
//   },
//   {
//     toolId: 2,
//     revision: 16,
//     toolName: 'PER008',
//     toolAlias: '',
//     insertId: 400,
//     ip: '172.23.1.48',
//     mac: '',
//     deviceNumber: 0,
//     protocolID: 0,
//     stationCode: 0,
//     modelID: 12,
//     servoSerialNumber: '',
//     toolSerialNumber: '5831247',
//     spindles: 1,
//     stationID: null,
//     userID: null,
//     insertDate: '2022-09-13T09:30:51.66',
//     configStr: '',
//     toolGroup: 0,
//     state: 1,
//   },
// ];

// vi.mock('@tanstack/react-query', () => ({
//   useQuery: vi.fn().mockReturnValue({ data: { ...toolsData }, isLoading: false, error: {} }),
// }));

// vi.mock('react-i18next', () => ({
//   useTranslation: () => ({
//     t: (key: string) => key, // Retorna a própria chave como texto
//     i18n: { changeLanguage: vi.fn() },
//   }),
// }));

// describe('verifica o menu de filtros', () => {
//   const queryClient = new QueryClient();
//   const mockProps = {
//     filters: {},
//     selectedTools: ['PER040'],
//     setSelectedTools: vi.fn(),
//     selectedPrograms: [],
//     setSelectedPrograms: vi.fn(),
//     toolsData: [],
//     programsData: [{ id: 1, nome: 'Programa A' }],
//     handleFilterChange: vi.fn(),
//     handleSelectionChange: vi.fn(),
//     handleStatusChange: vi.fn(),
//     handleDateChange: vi.fn(),
//     handleDateChangePeriod: vi.fn(),
//     handleResetFilters: vi.fn(),
//     handleSearch: vi.fn(),
//     selectedPeriod: '7days',
//     setSelectedPeriod: vi.fn(),
//     openStack: false,
//   };

//   beforeEach(() => {
//     queryClient.clear();
//     render(
//       <BrowserRouter>
//         <QueryClientProvider client={queryClient}>
//           <FiltersMenu {...mockProps} />
//         </QueryClientProvider>
//       </BrowserRouter>
//     );
//   });

//   it('Deve selecionar uma ferramenta', async () => {
//     const autocomplete = screen.getByTestId('ferramentas');
//     const input = within(autocomplete).getByRole('combobox');
//     autocomplete.focus();

//     fireEvent.change(input, { target: { value: 'PER040' } });
//     fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
//     fireEvent.keyDown(autocomplete, { key: 'Enter' });

//     await waitFor(() => {
//       expect(input).toHaveValue('PER040');
//     });
//   });
// });

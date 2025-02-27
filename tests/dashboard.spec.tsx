import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OverviewAnalyticsView } from '../src/sections/overview/view';
import { DashboardProvider } from '../src/context/DashboardContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Verifica o funcionamento do botão de modal', () => {
  it('Deve abrir o modal ao clicar', () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <DashboardProvider>
          <OverviewAnalyticsView />
        </DashboardProvider>
      </QueryClientProvider>
    );

    const botaoNovoProcesso = screen.getByTestId('novo processo');
    fireEvent.click(botaoNovoProcesso);

    expect(screen.getByTestId('modal-dashboard')).toBeInTheDocument();
  });
});

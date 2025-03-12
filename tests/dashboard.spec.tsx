import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { OverviewAnalyticsView } from '../src/sections/overview/view';
import { DashboardProvider } from '../src/context/DashboardContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Retorna a própria chave como texto
    i18n: { changeLanguage: vi.fn() },
  }),
}));

describe('Verifica o funcionamento do botão de modal', () => {
  const client = new QueryClient();

  beforeEach(() => {
    client.clear();
    render(
      <QueryClientProvider client={client}>
        <DashboardProvider>
          <OverviewAnalyticsView />
        </DashboardProvider>
      </QueryClientProvider>
    );
  });

  it('Deve abrir o modal ao clicar', () => {
    const botaoNovoProcesso = screen.getByTestId('novo processo');
    fireEvent.click(botaoNovoProcesso);

    expect(screen.getByTestId('modal-dashboard')).toBeInTheDocument();
  });
});

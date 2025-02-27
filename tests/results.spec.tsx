import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ResultPage from '../src/sections/results/reports-view';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Verifica o funcionamento do menu de filtros', () => {
  it('Deve abrir o modal ao clicar', () => {
    const client = new QueryClient();
    render(
      <BrowserRouter>
        <QueryClientProvider client={client}>
          <ResultPage />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const inputIdentificador = screen.getByLabelText('results.identifier');
    expect(inputIdentificador).toBeInTheDocument();
    fireEvent.change(inputIdentificador, { target: { value: '7' } });

    expect(inputIdentificador).toHaveValue('7');
  });
});

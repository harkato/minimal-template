import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ResultPage from '../src/sections/results/reports-view';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Verifica o funcionamento do menu de filtros', () => {
  it('Campo de identificador muda', () => {
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

  it('Seleciona a ferramenta correta', () => {
    const client = new QueryClient();
    render(
      <BrowserRouter>
        <QueryClientProvider client={client}>
          <ResultPage />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const inputFerramenta = screen.getByLabelText('results.identifier');
    expect(inputFerramenta).toBeInTheDocument();
    fireEvent.change(inputFerramenta, { target: { value: '7' } });

    expect(inputFerramenta).toHaveValue('7');
  });
});

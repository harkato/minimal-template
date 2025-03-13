import React from 'react';
import { vi } from 'vitest';
import { render, screen, renderHook, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ResultPage from '../src/sections/results/reports-view';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Retorna a própria chave como texto
    i18n: { changeLanguage: vi.fn() },
  }),
}));

describe('Verifica o funcionamento do menu de filtros', async () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ResultPage />
        </QueryClientProvider>
      </BrowserRouter>
    );
  });

  it('Campo de identificador muda', () => {
    const inputIdentificador = screen.getByLabelText('results.identifier');
    expect(inputIdentificador).toBeInTheDocument();
    fireEvent.change(inputIdentificador, { target: { value: '7' } });

    expect(inputIdentificador).toHaveValue('7');
  });

  // it('Seleciona a ferramenta correta', async () => {
  //   const getByTextContent = (text) => {
  //     // Passing function to `getByText`
  //     return screen.getByText((content, element) => {
  //       const hasText = (element) => element.textContent === text;
  //       const elementHasText = hasText(element);
  //       const childrenDontHaveText = Array.from(element?.children || []).every(
  //         (child) => !hasText(child)
  //       );
  //       return elementHasText && childrenDontHaveText;
  //     });
  //   };

  //   const inputFerramenta = screen.getByLabelText('results.tools');
  //   expect(inputFerramenta).toBeInTheDocument();

  //   fireEvent.mouseDown(inputFerramenta);

  //   await waitFor(() => {
  //     const elements = getByTextContent('PER040');
  //     expect(elements).toBeInTheDocument();

  //     fireEvent.click(elements);
  //   });

  //   const inputFerramentaAtualizado = screen.getByLabelText('results.tools');
  //   expect(inputFerramentaAtualizado).toHaveValue('PER040');
  // });
});

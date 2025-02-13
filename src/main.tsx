import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './i18n';

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const client = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => console.log(`Something went wrong: ${error.message}`),
  }),
});

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <QueryClientProvider client={client}>
            <App />
          </QueryClientProvider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

import { handleApiError } from './api';

const listeners: Set<(data: any) => void> = new Set();
let eventSource: EventSource | null = null;
let retryTimeout: NodeJS.Timeout | null = null;
const MAX_RETRIES = 5; // Número máximo de tentativas de reconexão
let retryCount = 0;

export const startSSE = (url: string) => {
  if (eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource(url);

  eventSource.addEventListener('tool_info', (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('Erro no callback SSE:', error);
        }
      });
    } catch (error) {
      console.error('Erro ao processar evento tool_info:', error);
    }
  });

  eventSource.onerror = () => {
    console.error('Erro na conexão SSE. Tentando reconectar...');

    if (retryTimeout) clearTimeout(retryTimeout);

    if (retryCount < MAX_RETRIES) {
      retryTimeout = setTimeout(
        () => {
          retryCount += 1;
          startSSE(url);
        },
        2 ** retryCount * 1000
      ); // Backoff exponencial
    } else {
      console.error('Número máximo de tentativas de reconexão atingido.');
      eventSource?.close();
    }
  };

  eventSource.onopen = () => {
    retryCount = 0; // Reseta tentativas após conexão bem-sucedida
  };
};

export const addSSEListener = (callback: (data: any) => void) => {
  listeners.add(callback);
};

export const removeSSEListener = (callback: (data: any) => void) => {
  listeners.delete(callback);
};

export const closeSSE = () => {
  console.log('Fechando conexão SSE...');
  eventSource?.close();
  eventSource = null;
};

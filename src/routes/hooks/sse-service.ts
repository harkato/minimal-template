import { displayedToasts, handleApiError, showToastOnce } from './api';

const listeners: Set<(data: any) => void> = new Set();
let eventSource: EventSource | null = null;
let retryTimeout: NodeJS.Timeout | null = null;
const MAX_RETRIES = 5;
let retryCount = 0;
let pingInterval: NodeJS.Timeout | null = null;
const cache = displayedToasts;

export const startSSE = (url: string) => {
  if (eventSource) {
    return;
  }

  eventSource = new EventSource(url);

  eventSource.addEventListener('tool_info', (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          handleApiError(error, url);
          console.error('Erro no callback SSE:', error);
        }
      });
    } catch (error) {
      handleApiError(error, url);
      console.error('Erro ao processar evento tool_info:', error);
    }
  });

  eventSource.onerror = (event) => {
    handleSSEError(event, url);
    eventSource?.close();
    eventSource = null;

    if (retryTimeout) clearTimeout(retryTimeout);

    if (retryCount < MAX_RETRIES) {
      retryTimeout = setTimeout(
        () => {
          retryCount += 1;
          startSSE(url);
        },
        2 ** retryCount * 1000
      );
    } else {
      console.error('Número máximo de tentativas de reconexão atingido.');
    }
  };

  eventSource.onopen = () => {
    console.log('Conexão SSE reestabelecida com sucesso!');
    retryCount = 0;
    startPingCheck(url);
  };

  // Adiciona os event listeners para detectar mudanças na conectividade
  window.addEventListener('online', () => {
    console.log('Internet restaurada. Tentando reconectar o SSE...');
    retryCount = 0;
    if (!eventSource) startSSE(url);
  });

  window.addEventListener('offline', () => {
    console.warn('Cliente ficou offline. Aguardando reconexão da internet...');
  });
};

// Inicia um mecanismo de "ping" para detectar falhas na conexão
const startPingCheck = (url: string) => {
  if (pingInterval) clearInterval(pingInterval);

  pingInterval = setInterval(async () => {
    if (!navigator.onLine) return; // Se o cliente estiver offline, evita requisições

    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      if (!response.ok) throw new Error(`Servidor retornou ${response.status}`);

      console.log('Ping bem-sucedido.');
    } catch (error) {
      console.warn('Ping falhou. Tentando reconectar o SSE...');
      eventSource?.close();
      eventSource = null;
      startSSE(url);
    }
  }, 10000);
};

export const addSSEListener = (callback: (data: any) => void) => {
  listeners.add(callback);
};

export const removeSSEListener = (callback: (data: any) => void) => {
  listeners.delete(callback);
};

export const closeSSE = () => {
  console.log('Fechando conexão SSE...');
  if (pingInterval) clearInterval(pingInterval);
  eventSource?.close();
  eventSource = null;
};

export const handleSSEError = (event: Event, url: string) => {
  console.error('Erro na conexão SSE:', event);

  const errorMessage = 'Erro na conexão em tempo real. Tentando reconectar...';

  showToastOnce(errorMessage, url);
};

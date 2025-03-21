import { handleApiError } from './api';
import { toast } from 'material-react-toastify';

const displayedToasts: Record<string, NodeJS.Timeout> = {};

/**
 * Exibe um toast de erro apenas se ainda não tiver sido exibido recentemente.
 *
 * @param message - Mensagem do erro a ser exibida
 * @param context - Identificador do erro (ex: endpoint da API ou URL do SSE)
 * @param duration - Tempo em milissegundos para reexibir o mesmo erro (padrão: 1 min)
 */
export const showToastOnce = (message: string, context: string, duration: number = 60000) => {
  const cacheKey = `${context}:${message}`;

  if (!displayedToasts[cacheKey]) {
    toast.error(message, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    displayedToasts[cacheKey] = setTimeout(() => {
      delete displayedToasts[cacheKey]; // Remove do cache após o tempo definido
    }, duration);
  }
};


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

export const handleSSEError = (event: Event, url: string) => {
  console.error('Erro na conexão SSE:', event);

  const errorMessage = 'Erro na conexão em tempo real. Tentando reconectar...';

  showToastOnce(errorMessage, url);
};

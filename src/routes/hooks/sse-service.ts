let eventSource: EventSource | null = null;
const listeners: ((data: any) => void)[] = [];

export const startSSE = (url: string) => {
  // Se a conexão SSE não estiver ativa, cria uma nova conexão
  if (!eventSource) {
    eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        listeners.forEach((listener) => listener(parsedData));
      } catch (error) {
        console.error('Erro ao processar SSE:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erro no SSE:', error);
      eventSource?.close();
      eventSource = null;
    };
  }
};

export const updateSSEUrl = (url: string) => {
  // Se a conexão SSE já estiver ativa, só atualiza a URL da conexão
  if (eventSource) {
    eventSource.close(); // Fecha a conexão existente
    eventSource = new EventSource(url); // Cria uma nova conexão com a nova URL

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        listeners.forEach((listener) => listener(parsedData));
      } catch (error) {
        console.error('Erro ao processar SSE:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erro no SSE:', error);
      eventSource?.close();
      eventSource = null;
    };
  }
};

export const addSSEListener = (callback: (data: any) => void) => {
  listeners.push(callback);
};

export const removeSSEListener = (callback: (data: any) => void) => {
  const index = listeners.indexOf(callback);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
};

import { useEffect } from 'react';
import { startSSE, addSSEListener, removeSSEListener, updateSSEUrl } from './sse-service';

const BASE_URL = 'http://192.168.1.156:8082/results?toolIds='; // Base da URL SSE

interface SSEComponentProps {
  toolIds: string[];
  onData: (newTool: any) => void;
}

export default function SSEComponent({ toolIds, onData }: SSEComponentProps) {
  useEffect(() => {
    if (toolIds.length === 0) return; // Evita chamadas com lista vazia

    const toolIdsParam = toolIds.join(','); // Converte para formato toolIds=8,9,12
    const sseUrl = `${BASE_URL}${toolIdsParam}`;

    startSSE(sseUrl); // Garante que a conexão SSE só seja iniciada uma vez
    addSSEListener(onData); // Adiciona o listener

    updateSSEUrl(sseUrl);

    // eslint-disable-next-line consistent-return
    return () => {
      removeSSEListener(onData); // Remove o listener ao desmontar
    };
  }, [toolIds, onData]);

  return null; // Nenhuma renderização necessária
}

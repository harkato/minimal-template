import { useEffect, useCallback } from 'react';
import { startSSE, addSSEListener, removeSSEListener, closeSSE } from './sse-service';
import apiConfig from 'src/config/api-config';

interface SSEComponentProps {
  toolIds: string[];
  onData: (data: any) => void;
}

export default function SSEComponent({ toolIds, onData }: SSEComponentProps) {
  useEffect(() => {
    if (toolIds.length === 0) {
      closeSSE();
      return undefined;
    }

    const toolIdsParam = toolIds.join(',');
    const sseUrl = `${apiConfig.SSE_URL}${toolIdsParam}`;

    startSSE(sseUrl);
    addSSEListener(onData);

    return () => {
      removeSSEListener(onData);
    };
  }, [toolIds, onData]);

  return null;
}

import apiConfig from 'src/config/api-config';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'material-react-toastify';
import qs from 'qs';

const displayedToasts: Record<string, NodeJS.Timeout> = {};

const handleApiError = (error: AxiosError | any, endpoint: string, toolName?: boolean) => {
  let errorMessage = 'Ocorreu um erro inesperado.';

  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Erro Axios - Resposta:', error.response.status, error.response.data);
      switch (error.response.status) {
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro Interno do Servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro na requisição: ${error.response.status}`;
          break;
      }
    } else if (error.request) {
      console.error('Erro Axios - Requisição:', error.request);
      errorMessage = 'Nenhuma resposta do servidor. Verifique sua conexão com a internet.';
    } else {
      console.error('Erro Axios - Configuração:', error.message);
      errorMessage = 'Falha na configuração da requisição.';
    }
  } else {
    console.error('Erro Genérico:', error.message);
    errorMessage = error.message || 'Ocorreu um erro inesperado.';
  }

  const cacheKey = `${endpoint}:${errorMessage}`;

  if (!displayedToasts[cacheKey]) {
    const toastMessage = toolName
      ? `Erro ao carregar dados da ferramenta. ${errorMessage}`
      : `${errorMessage}`;
    // Exibe o toast com a mensagem de erro
    toast.error(toastMessage, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    displayedToasts[cacheKey] = setTimeout(() => {
      delete displayedToasts[cacheKey];
    }, 60000);
  }
  // Lança o erro para que ele possa ser tratado por quem chamou a função, se necessário
  throw new Error(errorMessage);
};

// Usado no GET do menu de ferramentas
const fetchData = async (endpoint: string) => {
  try {
    const response = await axios.get(`${apiConfig.API_URL}/${endpoint}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, endpoint); // Exibe o toast e lança o erro
    return Promise.resolve([]);
  }
};

export const fetchDataFilters = async (
  endpoint: string,
  filters: any,
  page: number,
  pageSize: number
) => {
  const { programList, blockSearch, toolList, ...otherFilters } = filters;
  if (blockSearch) {
    return Promise.resolve([]); // Retorna um array vazio
  }
  // Remove valores vazios, null e undefined dos filtros
  const cleanParams = Object.fromEntries(
    Object.entries(otherFilters).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  );
  // console.log('cleanParams',  JSON.stringify(cleanParams));
  const toolListQuery = toolList
    ? toolList
        .map(
          (tool: { id: any; revision: any }) =>
            `&toolList=${encodeURIComponent(`{"id":${tool.id},"revision":${tool.revision}}`)}`
        )
        .join('')
    : '';
  // Serializa programList no formato correto (repeat para múltiplos valores)
  const programListQuery = programList
    ? qs.stringify({ programList }, { arrayFormat: 'repeat' })
    : '';
  // console.log('programListQuery', JSON.stringify(programListQuery));

  try {
    // Faz a requisição com os filtros formatados
    const response = await axios.get(
      `${apiConfig.API_URL}/${endpoint}?${programListQuery}${toolListQuery}`,
      {
        params: { ...cleanParams, page: page + 1, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, endpoint);
    return Promise.resolve([]);
  }
};

// Total de itens passando os filtros
export const fetchDataTotal = async (filters: any) => {
  const { programList, blockSearch, ...otherFilters } = filters;

  if (blockSearch) {
    return Promise.resolve([]); // Retorna um array vazio
  }
  // Remove valores vazios, null e undefined dos filtros
  const cleanParams = Object.fromEntries(
    Object.entries(otherFilters).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  );

  // Serializa programList no formato correto (repeat para múltiplos valores)
  const programListQuery = programList
    ? qs.stringify({ programList }, { arrayFormat: 'repeat' })
    : '';
  try {
    // Faz a requisição com os filtros formatados
    const response = await axios.get(`${apiConfig.API_URL}/results/amount?${programListQuery}`, {
      params: { ...cleanParams },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'totalItems');
    return Promise.resolve([]);
  }
};

// Retorna lista de programas de acordo com as ferramentas
export const fetchProgramsData = async (endpoint: string, toolList: any[]) => {
  const queryString = toolList
    .map(
      (tool) => `&toolList=${encodeURIComponent(`{"id":${tool.id},"revision":${tool.revision}}`)}`
    )
    .join('');
  try {
    const response = await axios.get(
      `${apiConfig.API_URL}/${endpoint}?${queryString.slice(1)}`,
      {}
    );
    return response.data;
  } catch (error) {
    handleApiError(error, endpoint);
    return Promise.resolve([]);
  }
};

// Lista de ferramentas
export function useFetchToolsData() {
  const query = useQuery({
    queryFn: () => fetchData('tools'),
    queryKey: ['tools'],
    retry: false,
  });
  return query;
}

// Hook para retornar o total de itens
export function useResultAmount(filters: any) {
  const query = useQuery({
    queryFn: () => fetchDataTotal(filters),
    queryKey: ['amount', filters],
  });
  return query;
}

// Hook para retornar os resultados passando os filtros
export function useResultPaginate(page: number, limit: number, amount: number, filters: any) {
  const queryClient = useQueryClient();
  // Chamada principal da API usando fetchDataFilters
  const query = useQuery({
    queryFn: () => fetchDataFilters('results', filters, page, limit),
    queryKey: ['results', page, limit, filters],
  });

  // Pré-carregamento da próxima página, se houver mais dados
  if (query.data && amount && (page + 1) * limit < amount) {
    queryClient.prefetchQuery({
      queryFn: () => fetchDataFilters('results', filters, page + 1, limit),
      queryKey: ['results', page + 1, limit, filters],
    });
  }

  return query;
}

// ====================================================DASHBOARD=======================================

const fetchDataTop5 = async (endpoint: string) => {
  try {
    const response = await axios.get(`${apiConfig.DASHBOARD_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    handleApiError(error, endpoint);
    return Promise.resolve([]);
  }
};

export function useTopNokOk(finalDateTime: string, switchTop5: any) {
  // Lista do TOP5 QUARKUS
  return useQuery({
    queryFn: () => fetchDataTop5(`tools/topNokOkRate`),
    queryKey: ['topNokOk_data'],
    refetchInterval: 15000, // Refetch a cada 30 segundos
    retry: false,
    enabled: !!switchTop5, // Garante que a query só execute se switchTop5 for true
  });
}

// Busca os resultados de uma apertadeira
const fetchToolsInfo = async (endpoint: string, toolId: number, toolRevision: number) => {
  try {
    const response = await axios.get(
      `${apiConfig.API_URL}/${endpoint}/${toolId}/${toolRevision}/info`
    );
    return response.data;
  } catch (error) {
    const toolIdentifier = `${endpoint}-${toolId}-${toolRevision}`;
    handleApiError(error, toolIdentifier, true);
    return Promise.resolve([]);
  }
};

export function useToolsInfo(toolsWithRevisions: { toolId: number; toolRevision: number }[]) {
  const toolQueries = useQueries({
    queries: toolsWithRevisions.map((tool) => {
      // Cria uma string única combinando toolId e toolRevision
      const toolIdentifier = `tool_${tool.toolId}_rev_${tool.toolRevision}`;

      return {
        queryKey: ['toolInfo', tool.toolId, tool.toolRevision],
        queryFn: () => fetchToolsInfo('dashboard/tools', tool.toolId, tool.toolRevision),
        refetchInterval: 15000,
        staleTime: 1000 * 60 * 5,
        retry: false,
      };
    }),
  });

  return toolQueries;
}

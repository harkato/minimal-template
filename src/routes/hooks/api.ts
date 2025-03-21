import apiConfig from 'src/config/api-config';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import qs from 'qs';
import { toast } from 'material-react-toastify';

export const displayedToasts: Record<string, NodeJS.Timeout> = {};

/**
 * Exibe um toast de erro apenas se ainda não tiver sido exibido recentemente.
 *
 * @param message - Mensagem do erro a ser exibida
 * @param context - Identificador do erro (ex: endpoint da API ou URL do SSE)
 * @param duration - Tempo em milissegundos para reexibir o mesmo erro (padrão: 1 min)
 */

const showToastOnce = (message: string, context: string, duration: number = 60000) => {
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

export const handleApiError = (
  error: AxiosError | any,
  endpoint: string, 
  toolName?: boolean,
  showToast = true
) => {
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
      console.error('Sem resposta do servidor.');
      errorMessage = 'Nenhuma resposta do servidor. Verifique sua conexão com a internet.';
    } else {
      console.error('Erro na configuração: ', error.message);
      errorMessage = 'Falha na configuração da requisição.';
    }
  } else {
    console.error('Erro desconhecido: ', error.message);
    errorMessage = error.message || 'Ocorreu um erro inesperado.';
  }

  const cacheKey = `${endpoint}:${errorMessage}`;

  if (showToast && !displayedToasts[cacheKey]) {
    const toastMessage = toolName
      ? `Erro ao carregar dados da ferramenta. ${errorMessage}`
      : `${errorMessage}`;
    // Exibe o toast com a mensagem de erro
    showToastOnce(toastMessage, endpoint);
  }
  // Lança o erro para que ele possa ser tratado por quem chamou a função, se necessário
  return new Error(errorMessage);
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
    handleApiError(error, 'totalItems', false, false);
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
    // queryFn: () => fetchDataTop5(`tools/topNokOkRate`),
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
    // const response = await axios.get(
    //   `${apiConfig.API_URL}/${endpoint}/${toolId}/${toolRevision}/info`
    // );
    const response = await axios.get(`${apiConfig.API_URL}/${endpoint}/${toolId}/${toolRevision}/info`, {
      params: {
        finalDateTime: '2022-10-24T10:00:00',
        initialDateTime: '2022-09-24T06:00:00',
        amount: 5,
      },
    });
    return response.data;
  } catch (error) {
    const toolIdentifier = `${endpoint}-${toolId}-${toolRevision}`;
    handleApiError(error, toolIdentifier, true);
    return Promise.resolve([]);
  }
};

// const fetchToolsInfoSSE = async (toolIds: number[]) => {
//   try {
//     const toolIdsQuery = toolIds.join(",");
//     const response = await axios.get(
//       `http://192.168.1.146:8082/results?toolIds=${toolIdsQuery}`
//     );
//     return response.data;
//   } catch (error) {
//     const toolIdentifier = `SSE-${toolIds.join('-')}`;
//     handleApiError(error, toolIdentifier, true);
//     return Promise.resolve([]);	
//   }
// }

// export function useToolsInfo(toolsWithRevisions: { toolId: number; toolRevision: number }[]) {
//   const toolIds = toolsWithRevisions.map((tool) => tool.toolId);

//   const toolQuery = useQuery({
//       queryKey: ['toolInfo', ...toolIds],
//       queryFn: () => fetchToolsInfoSSE(toolIds),
//       staleTime: 1000 * 60 * 5,
//       retry: false,
//     });
    
//   return toolQuery;
// }

// ====================================================DETAILS=======================================

const fetchDetailsInfo = async (endpoint: string, tId: number, graphType?: string) => {
  try {
    // const response = await axios.get( `${apiConfig.API_URL}/${endpoint}` , {
    //   params: {
    //     TID: tId,
    //     type: graphType,
    //   },
    // });
    const params: { TID: number; type?: string } = {
      TID: tId,
    };
    if (graphType) {
      params.type = graphType;
    }
    const response = await axios.get(`${apiConfig.API_URL}/${endpoint}`, {
      params,
    });
    return response.data;
  } catch (error) {
    const toolIdentifier = `${endpoint}-${tId}-${graphType}`;
    handleApiError(error, toolIdentifier, true);
    return Promise.resolve([]);
  }
};

export function useDetailsInfo(tId: number) {
  const queryTorqueTime = useQuery({
    queryFn: () => fetchDetailsInfo('resultdetails/all', tId),
    queryKey: ['details', tId],
    select: (data) => {
      if (data) {
        return {
          // ...data,
          // Torque: data.Torque.map((item: { value: number }) => item.value),
          // Angle: data.Angle.map((item: { value: number }) => item.value),
          // Time: data.Time.map((item: { value: number }) => item.value),
          Torque: data.TorquePoints,
          Angle: data.AnglePoints,
          Time: data.TimePoints,
        };
      }
      console.log('data ================', data);
      
      return data;
    },
  });
  return queryTorqueTime;
}

export function useCombinedDetailsInfo(tId: number) {
  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['details', tId, 'torque_x_time'],
        queryFn: () => fetchDetailsInfo('resultdetails', tId, 'torque_x_time'),
      },
      {
        queryKey: ['details', tId, 'angle_x_time'],
        queryFn: () => fetchDetailsInfo('resultdetails', tId, 'angle_x_time'),
      },
    ],
  });

  const isLoading = queryResults.some((result) => result.isLoading);
  const isError = queryResults.some((result) => result.isError);
  const errors = queryResults.filter((result) => result.error).map((result) => result.error);

  const combinedData = queryResults.every((result) => result.data)
    ? {
        TracePoints: {
          time: queryResults[0].data.TracePoints.map((point: { X: any; }) => point.X),
          torque: queryResults[0].data.TracePoints.map((point: { Y: any; }) => point.Y),
          angle: queryResults[1].data.TracePoints.map((point: { Y: any; }) => point.Y),
        },
      }
    : undefined;
  // console.log('combinedData', combinedData?.TracePoints);
  
  return {
    data: combinedData,
    isLoading,
    isError,
    error: errors.length > 0 ? errors : null,
  };
}
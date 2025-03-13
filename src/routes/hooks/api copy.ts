import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'material-react-toastify';
import qs from 'qs';

const API_URL = 'http://localhost:8080/msh/spc/v1';
const DASHBOARD_URL = 'http://localhost:8080/msh/spc/v1/dashboard';

// Usado no GET do menu de ferramentas
const fetchData = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data;
  } catch (error: any) {
    // Tipagem do erro para melhor tratamento
    // Tratamento de erro mais específico baseado no tipo de erro
    if (axios.isAxiosError(error)) {
      // Erros específicos do Axios (ex: erro de rede, erro do servidor)
      console.error('Erro Axios:', error.message);
      if (error.response) {
        // console.error("Dados da Resposta:", error.response.data);
        console.error('Status da Resposta:', error.response.status);
        // Exemplo: Lançar um erro customizado baseado no código de status
        if (error.response.status === 404) {
          throw new Error('Ferramentas não encontradas.'); // Ou uma mensagem mais amigável
        }
        if (error.response.status === 500) {
          throw new Error('Erro Interno do Servidor. Tente novamente mais tarde.');
        }
      } else if (error.request) {
        console.error('Erro de Requisição:', error.request); // A requisição foi feita mas não houve resposta
        throw new Error('Nenhuma resposta do servidor.');
      } else {
        console.error('Erro de Configuração:', error.message); // Algo aconteceu na configuração da requisição
        throw new Error('Falha na configuração da requisição.');
      }
    } else {
      // Erro genérico
      console.error('Erro Genérico:', error.message);
      throw new Error('Ocorreu um erro inesperado.'); // Ou uma mensagem mais genérica
    }
    return Promise.resolve([]); // Retorna um array vazio em caso de erro
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
    const response = await axios.get(`${API_URL}/${endpoint}?${programListQuery}${toolListQuery}`, {
      params: { ...cleanParams, page: page + 1, pageSize },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Erro Axios:', error.message);
    } else {
      console.error('Erro Genérico:', error.message); // Erro genérico
      throw new Error('Ocorreu um erro inesperado.');
    }
    return Promise.resolve([]); // Retorna um array vazio em caso de erro
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
    const response = await axios.get(`${API_URL}/results/amount?${programListQuery}`, {
      params: { ...cleanParams },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Erro Axios:', error.message);
    } else {
      console.error('Erro Genérico:', error.message); // Erro genérico
      throw new Error('Ocorreu um erro inesperado.');
    }
    return Promise.resolve([]); // Retorna um array vazio em caso de erro
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
    const response = await axios.get(`${API_URL}/${endpoint}?${queryString.slice(1)}`, {});
    return response.data;
  } catch (error: any) {
    // Tipagem do erro
    // Tratamento de erro mais específico baseado no tipo de erro
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // console.error("Dados da Resposta:", error.response.data);
        // console.error('Status da Resposta:', error.response.status);
        // if (error.response.status === 404) {
        //   // Exemplo de um erro customizado baseado no código de status
        //   throw new Error('Programas não encontrados.');
        // }
        if (error.response.status === 500) {
          throw new Error('Erro Interno do Servidor. Tente novamente mais tarde.');
        }
      } else if (error.request) {
        console.error('Erro de Requisição:', error.request); // A requisição foi feita mas não houve resposta
        throw new Error('Nenhuma resposta do servidor.');
      } else {
        console.error('Erro de Configuração:', error.message); // Algo aconteceu na configuração da requisição
        throw new Error('Falha na configuração da requisição.');
      }
    } else {
      console.error('Erro Genérico:', error.message); // Erro genérico
      throw new Error('Ocorreu um erro inesperado.');
    }
    return Promise.resolve([]); // Retorna um array vazio em caso de erro
  }
};

// Lista de ferramentas
export function useFetchToolsData() {
  const query = useQuery({
    queryFn: () => fetchData('tools'),
    queryKey: ['tools'],
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
    const response = await axios.get(`${DASHBOARD_URL}/${endpoint}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Erro Axios:', error.message);
    } else {
      console.error('Erro:', error.message); // Erro genérico
      throw new Error('Ocorreu um erro inesperado.');
    }
    return Promise.resolve([]);
  }
};

export function useTopNokOk(finalDateTime: string, switchTop5: any) {
  // Lista do TOP5 QUARKUS
  return useQuery({
    queryFn: () => fetchDataTop5(`tools/topNokOkRate?finalDateTime=${finalDateTime}`),
    queryKey: ['topNokOk_data'],
    refetchInterval: 30000, // Refetch a cada 60 segundos (1 minuto)
    enabled: !!switchTop5, // Garante que a query só execute se switchTop5 for true
  });
}

// Busca os resultados de uma apertadeira
const fetchToolsInfo = async (endpoint: string, toolId: number, toolRevision: number) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}/${toolId}/${toolRevision}/info`, {
      params: {
        finalDateTime: '2022-10-24T10:00:00',
        initialDateTime: '2022-09-24T06:00:00',
        amount: 5,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar informações das ferramentas:', error);
    if (error.response) {
      if (error.response.status >= 500) {
        toast.error('Erro ao comunicar com o servidor .');
      }
    } else if (error.request) {
      toast.error('Sem resposta do servidor.');
    } else {
      toast.error('Erro ao configurar requisição.');
    }
    throw error;
  }
};

export function useToolsInfo(toolsWithRevisions: { toolId: number; toolRevision: number }[]) {
  const toolQueries = useQueries({
    queries: toolsWithRevisions.map((tool) => ({
      queryKey: ['toolInfo', tool.toolId, tool.toolRevision],
      queryFn: () => fetchToolsInfo('dashboard/tools', tool.toolId, tool.toolRevision),
      staleTime: 1000 * 60 * 5,
      // retry: 1 // false,       
      retry: (failureCount: number, error: any) => {      
        if (error.status === 404) {
            console.log('não fazer retry ', tool);          
            return false; // Não tentar se for um erro 404
        }
        if (failureCount < 3) {
            return true; // tentar até 3 vezes para outros erros
        }
        return false;
      }  
          
    })),
  });

  return toolQueries;
}

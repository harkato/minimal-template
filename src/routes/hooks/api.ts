import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import qs from 'qs';

const API_URL = 'http://localhost:8080/msh/spc/v1';

// Usado no GET do menu de ferramentas
const fetchData = async (endpoint: string) => {
  const response = await axios.get(`${API_URL}/${endpoint}`);
  return response.data;
};

const fetchToolsInfo = async (endpoint: string, toolId: number, toolRevision: number) => {
  const response = await axios.get(`${API_URL}/${endpoint}/${toolId}/${toolRevision}/info`, {
    params: {
      initialDateTime: '2020-01-01T00:00:00',
      finalDateTime: '2024-01-01T00:00:00',
      worstRatedPrograms: 5,
    },
  });
  return response.data;
};

export const fetchDataFilters = async (
  endpoint: string,
  filters: any,
  page: number,
  pageSize: number
) => {
  const { programList, ...otherFilters } = filters;

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

  // Faz a requisição com os filtros formatados
  const response = await axios.get(`${API_URL}/${endpoint}?${programListQuery}`, {
    params: { ...cleanParams, page: page + 1, pageSize },
  });
  return response.data;
};

// Total de itens passando os filtros
export const fetchDataTotal = async (filters: any) => {
  const { programList, ...otherFilters } = filters;

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

  // Faz a requisição com os filtros formatados
  const response = await axios.get(`${API_URL}/results/amount?${programListQuery}`, {
    params: { ...cleanParams },
  });
  return response.data;
};

// Retorna lista de programas de acordo com as ferramentas
export const fetchProgramsData = async (endpoint: string, toolList: any[]) => {
  const response = await axios.get(`${API_URL}/${endpoint}`, {
    params: { toolList },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
  });
  return response.data;
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

export function useToolsInfo(toolId: number, toolRevision: number) {
  const query = useQuery({
    queryFn: () => fetchToolsInfo('dashboard/tools', toolId, toolRevision),
    queryKey: ['toolInfo'],
  });
  return query;
}

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import qs from 'qs';

const QUARKUS_URL = 'http://localhost:8080/msh/spc/v1';
const API_URL = 'http://localhost:8080/msh/spc/v1';

const fetchData = async (endpoint: string) => {
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`);
  // console.log("response: ", response.data);

  return response.data;
};

export const fetchDataQuarkus = async (endpoint: string, filters: any, pages: number) => {
  const { programList, ...otherFilters } = filters;
  const page = pages;

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
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}?${programListQuery}`, {
    params: { ...cleanParams, page },
  });
  return response.data;
};

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
  const response = await axios.get(`${QUARKUS_URL}/results/amount?${programListQuery}`, {
    params: { ...cleanParams },
  });
  return response.data;
};

export const fetchProgramsData = async (endpoint: string, toolList: any[]) => {
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`, {
    params: { toolList },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
  });
  return response.data;
};

// LISTA DE FERRAMENTAS

export function useFetchToolsData() {
  const query = useQuery({
    queryFn: () => fetchData('tools'),
    queryKey: ['tools'],
  });
  return query;
}

export function useTopFiveData() {
  return useQuery({
    queryFn: () => fetchData('topFive'),
    queryKey: ['topfive_data'],
  });
}

export function useResultPaginate(page: number, limit: number) {
  // faz a requisição por paginação
  const query = useQuery({
    queryFn: () => fetchData(`results?page=${page + 1}&pageSize=${limit}`),
    queryKey: ['resultsPg-data', page, limit],
  });
  return query;
}

export function useResultAmount(filters: any) {
  // retorna a quantidade de itens da busca
  const query = useQuery({
    queryFn: () => fetchDataTotal(filters),
    queryKey: ['amount', filters],
  });
  return query;
}

export function useResultPaginateQuarkus(
  page: number,
  limit: number,
  amount: number,
  filters: any
) {
  const queryClient = useQueryClient();

  // Chamada principal da API usando fetchDataQuarkus
  const query = useQuery({
    queryFn: () => fetchDataQuarkus('results', filters, page),
    queryKey: ['results', page, limit, filters],
  });

  // Pré-carregamento da próxima página, se houver mais dados
  if (query.data && amount && (page + 1) * limit < amount) {
    queryClient.prefetchQuery({
      queryFn: () => fetchDataQuarkus('results', filters, page + 1),
      queryKey: ['results', page + 1, limit, filters],
    });
  }

  return query;
}

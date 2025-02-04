import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
  const page = pages;
  const cleanParams = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  );
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`, {
    params: { ...cleanParams, page },
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

export async function resultPgLength() {
  // retorna o total de itens
  try {
    const response = await axios.get(`${API_URL}/results`, {
      params: { _limit: 0, StartPoint: 0 },
      responseType: 'text', // Adiciona o responseType para texto
    });
    if (response.status !== 200) {
      throw new Error('Erro ao buscar os dados');
    }
    return response.headers['x-total-count'];
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// export function useResultData(filters: any) {
//   const query = useQuery({
//     queryFn: () => fetchDataQuarkus('results', filters),
//     queryKey: ['results-data'],
//     placeholderData: keepPreviousData,
//     enabled: false,
//   });
//   return query;
// }

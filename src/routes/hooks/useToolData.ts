import { useQuery, useQueryClient  } from "@tanstack/react-query";
import axios from "axios";
import qs from 'qs';

// =============================API======================================
const API_URL = 'http://localhost:3001'; // API JSON Server
const QUARKUS_URL = 'http://127.0.0.1:8080/msh/spc/v1'; // API Quarkus
const filter_NOVA_API = 'generalStatus=0&toolList=%7B%0A%20%20%22id%22%3A%201%2C%0A%20%20%22revision%22%3A%209%0A%7D' // teste da API Quarkus


// ==========================FETCH=======================================
const fetchData = async (endpoint: string) => {  // fetch sem paramentros
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`);
  // console.log("response: ", response.data);
  // console.log('endpoint', endpoint);    
  return response.data;
};

export const fetchDataParams = async (endpoint: string, filters: any) => { // fetch com paramentros
  // tratamento do filtro 
  const { programList, ...otherFilters } = filters;
  // const page = pages;
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
    params: { ...cleanParams },
  });
  return response.data;
};

const fetchProgramsData = async (endpoint: string, toolList: any[]) => { // fech da lista de ferramentas
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`, {
    params: { toolList },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
  });
  return response.data;
};

const fetchDataJServer = async (endpoint: string) => { // fetch para API do JSON Server
  const response = await axios.get(`${API_URL}/${endpoint}`);
  // console.log("response: ", response.data);
  // console.log('endpoint', endpoint);    
  return response.data;
};

// =================================GET RESULTS==================================

// faz a requisição com paginação na NOVA API (DADOS DA TABELA)
export function useResultPaginateNew(page: number, limit: number, amount: number, filters: any) { 
  const isEmptyFilter = Object.keys(
    filters.toolList).length === 0 || 
    Object.values(filters.toolList).every(value => value === '' || 
    value === null || 
    value === undefined);
  const queryClient = useQueryClient();
  const query = useQuery({
    // queryFn: () => fetchData(`results?page=${page+1}&pageSize=${limit}&${filter_NOVA_API}`),
    queryFn: () => {
      if (isEmptyFilter) {
        return Promise.resolve([]); // Retorna um array vazio se os filtros estiverem vazios
      } 
        console.log('filtro é:', filters);
        
        return fetchDataParams(`results?page=${page+1}&pageSize=${limit}`, filters)
    }, 
    queryKey: ['resultsFilterPg-data', page, limit],     
  });
  // console.log('pagina', query.data);
  if (query.data && amount && (page + 1) * limit < amount && !isEmptyFilter) { // Verifique se há dados e se não está na última página
    queryClient.prefetchQuery({
      // queryFn: () => fetchData(`results?page=${page + 2}&pageSize=${limit}&${filter_NOVA_API}`),
      queryFn: () => fetchDataParams(`results?page=${page + 2}&pageSize=${limit}`, filters),
      queryKey: ['resultsFilterPg-data', page + 1, limit],
    });
  }  
  return query;
}

export function useFetchToolsData() { // Lista de ferramentas
  const query = useQuery({
    queryFn: () => fetchData('tools'),
    queryKey: ['tools'],
  });
  return query;
}

// export function useProgramsData(filters: any) { // lista os programas das ferramentas selecionadas
//   console.log('filters.toolList2', JSON.stringify(filters));
//   const query = useQuery({
//   queryFn: () => fetchProgramsData('programs/tools', filters),
//   queryKey: ['programs', JSON.stringify(filters)],
// });
// return query;
// }

export function useProgramsData(filters: any) {
  const isEmptyFilter = Object.keys(filters).length === 0 || Object.values(filters).every(value => value === '' || value === null || value === undefined);
  console.log('filters.toolList2', JSON.stringify(filters));
  const query = useQuery({
    queryFn: () => {
      if (isEmptyFilter) {
        return Promise.resolve([]); // Retorna um array vazio se os filtros estiverem vazios
      } 
        return fetchProgramsData('programs/tools', filters);
    },
    queryKey: ['programs', JSON.stringify(filters)],
  });

  return query;
}

export function useResultAmount(filters: any) { // retorna a quantidade de itens da busca
  const isEmptyFilter = Object.keys(
    filters.toolList).length === 0 || 
    Object.values(filters.toolList).every(value => value === '' || 
    value === null || 
    value === undefined);
  const query = useQuery({
    // queryFn: () => fetchData(`results/amount?${filter_NOVA_API}`), 
    queryFn: () => {
      if (isEmptyFilter) {
        return Promise.resolve([]); // Retorna um array vazio se os filtros estiverem vazios
      } 
        return fetchDataParams(`results/amount?`, filters)
    }, 
    queryKey: ['resultsFilterPgAmount-data', filters], 
  });  
  return query;
}

export function useResultData() { // Dados da tabela vindos do JSON Server
  const query = useQuery({
    queryFn: () => fetchDataJServer('results'), 
    queryKey: ['results-data'], 
  });
  return query;
}

export function useResultPaginate(page: number, limit: number) { // Dados paginados da tabela vindos do JSON Server
  const query = useQuery({
    queryFn: () => fetchDataJServer(`results?_page=${page+1}&_limit=${limit}`), 
    queryKey: ['resultsPg-data', page, limit], 
  });  
  return query;
}

// ==========================================GET DASHBOARD================================================
export function useToolListData() { // lista de ferramentas
  const query = useQuery({
    queryFn: () => fetchDataJServer('toolList'), 
    queryKey: ['toolList-data'], 
  });
  return query;
}

export function useToolData() { // lista de ferramentas do Card Apertadeiras
  const query = useQuery({
    queryFn: () => fetchDataJServer('tool'), 
    queryKey: ['tool-data'], 
  });
  return query;
}

export function useTopFiveData() { // Lista do TOP5
  return useQuery({
    queryFn: () => fetchDataJServer('topFive'),
    queryKey: ['topfive_data'], 
  });
}

// export async function resultPgLength() { // retorna o total de itens
//   try {
//     const response = await axios.get(`${API_URL}/results`, {
//       params: { _limit: 0, StartPoint: 0 },
//       responseType: 'text' // Adiciona o responseType para texto
//     });

//     if (response.status !== 200) {
//       throw new Error('Erro ao buscar os dados');
//     }
//     return response.headers["x-total-count"];
//   } catch (error) {
//     console.error('Erro na requisição:', error);
//     throw error;
//   }
// }

// ==========================================GET DETAILS================================================

export function useDetailData() { // Retorna os dados de um aperto específico vindo do JSON Server
  const query = useQuery({
    queryFn: () => fetchDataJServer('detail'), 
    queryKey: ['detail-data'], 
  });
  return query;
}
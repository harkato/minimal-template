import { useQuery, useQueryClient  } from "@tanstack/react-query";
import axios from "axios";
import qs from 'qs';

// =============================API======================================
const API_URL = 'http://localhost:3001'; // API JSON Server
const QUARKUS_URL = 'http://127.0.0.1:8080/msh/spc/v1'; // API Quarkus
const filter_NOVA_API = 'generalStatus=0&toolList=%7B%0A%20%20%22id%22%3A%201%2C%0A%20%20%22revision%22%3A%209%0A%7D' // teste da API Quarkus


// ==========================FETCH=======================================
const fetchData = async (endpoint: string) => {  // fetch sem paramentros, lista de ferramentas
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`);
  return response.data;
};

const fetchProgramsData = async (endpoint: string, toolList: any[]) => { // fech da lista de programas
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`, {
    params: { toolList },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
  });
  return response.data;
};

export const fetchDataParams = async (endpoint: string, filters: any) => { // fetch com paramentros  
  // console.log("filtro como parametro", JSON.stringify(filters))
  // tratamento do filtro 
  const { /* programList, */ blockSearch, ...otherFilters } = filters;
  // Remove valores vazios, null e undefined dos filtros
  const cleanParams = Object.fromEntries(
    Object.entries(otherFilters).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined 
    )
  );
  const newClean = encodeCleanParams(cleanParams)
  // Serializa programList no formato correto (repeat para múltiplos valores)


  // const programListQuery = programList
  //   ? qs.stringify({ programList }, { arrayFormat: 'repeat' })
  //   : '';
    
  // Faz a requisição com os filtros formatados
  // const response = await axios.get(`${QUARKUS_URL}/${endpoint}${programListQuery}`, {
  //   params: { ...cleanParams },
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}&${newClean}`

    // paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
  // const response = await axios.get(`${QUARKUS_URL}/${endpoint}`, {
  //   params: programListQuery,
  );
  return response.data;
};

const fetchDataJServer = async (endpoint: string) => { // fetch para API do JSON Server
  const response = await axios.get(`${API_URL}/${endpoint}`);
  // console.log("response: ", response.data);
  // console.log('endpoint', endpoint);    
  return response.data;
};

// =================================RESULTS==================================

// faz a requisição com paginação na NOVA API (DADOS DA TABELA)
export function useResultPaginateNew(page: number, limit: number, amount: number, filters: any) { 
  const queryClient = useQueryClient();
  const query = useQuery({
    // queryFn: () => fetchData(`results?page=${page+1}&pageSize=${limit}&${filter_NOVA_API}`),
    queryFn: () => {
      // if (isEmptyFilter) {
        if (filters.blockSearch) {
        return Promise.resolve([]); // Retorna um array vazio 
      } 
        return fetchDataParams(`results?page=${page+1}&pageSize=${limit}`, filters)
    }, 
    queryKey: ['resultsFilterPg-data', page, limit, amount],     
  });  
  if (amount && (page + 1) * limit < amount ) { // Verifique se há dados e se não está na última página
    queryClient.prefetchQuery({
      queryFn: () => fetchDataParams(`results?page=${page + 2}&pageSize=${limit}`, filters),
      queryKey: ['resultsFilterPg-data', page + 1, limit, amount],
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

export function useProgramsData(filters: any) {
  const isEmptyFilter = Object.keys(filters).length === 0 || Object.values(filters).every(value => value === '' || value === null || value === undefined);
  // console.log('filters.toolList2', JSON.stringify(filters));
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
  // const isEmptyFilter = Object.keys(
  //   filters.toolList).length === 0 || 
  //   Object.values(filters.toolList).every(value => value === '' || 
  //   value === null || 
  //   value === undefined);
  const query = useQuery({
    // queryFn: () => fetchData(`results/amount?${filter_NOVA_API}`), 
    queryFn: () => {
      // if (isEmptyFilter) {
      if (filters.blockSearch) {        
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

// ==========================================DASHBOARD================================================
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

// ==========================================DETAILS================================================

export function useDetailData() { // Retorna os dados de um aperto específico vindo do JSON Server
  const query = useQuery({
    queryFn: () => fetchDataJServer('detail'), 
    queryKey: ['detail-data'], 
  });
  return query;
}

function encodeCleanParams(cleanParams: any) {
  let encodedParams = "";

  for (const key in cleanParams) {
    if (Array.isArray(cleanParams[key])) { // Verifica se o valor é um array (toolList)
      cleanParams[key].forEach(item => {
        const encodedItem = encodeURIComponent(JSON.stringify(item));
        encodedParams += `&${key}=${encodedItem}`;
      });
    } else {
      encodedParams += `&${key}=${cleanParams[key]}`; // Outros parâmetros
    }
  }

  return encodedParams.substring(1); // Remove o primeiro '&'
}
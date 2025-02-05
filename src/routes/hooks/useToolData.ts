import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = 'http://localhost:3001';
const NOVA_API_URL = 'http://127.0.0.1:8080/msh/spc/v1';
const filter_NOVA_API = '&generalStatus=0&toolList=%7B%0A%20%20%22id%22%3A%201%2C%0A%20%20%22revision%22%3A%209%0A%7D'

const fetchDataNew = async (endpoint: string) => {
  const response = await axios.get(`${NOVA_API_URL}/${endpoint}`);
  // console.log("response: ", response.data);
  // console.log('endpoint', endpoint);    
  return response.data;
};

export function useResultPaginateNew(page: number, limit: number) { // faz a requisição por paginação na NOVA API
  const query = useQuery({
    queryFn: () => fetchDataNew(`results?page=${page+1}&pageSize=${limit}${filter_NOVA_API}`), 
    queryKey: ['resultsFilterPg-data', page, limit], 
  });
  
  return query;
}

export function useResultAmount() { // retorna a quantidade de itens da busca
  const query = useQuery({
    queryFn: () => fetchDataNew(`results/amount?${filter_NOVA_API}`), 
    queryKey: ['resultsFilterPg-data'], 
  });  
  return query;
}

const fetchData = async (endpoint: string) => {
  const response = await axios.get(`${API_URL}/${endpoint}`);
  // console.log("response: ", response.data);
  // console.log('endpoint', endpoint);    
  return response.data;
};

export function useToolListData() {
  const query = useQuery({
    queryFn: () => fetchData('toolList'), 
    queryKey: ['toolList-data'], 
  });
  return query;
}

export function useToolData() {
  const query = useQuery({
    queryFn: () => fetchData('tool'), 
    queryKey: ['tool-data'], 
  });
  return query;
}

export function useTopFiveData() {
  return useQuery({
    queryFn: () => fetchData('topFive'),
    queryKey: ['topfive_data'], 
  });
}

export async function resultPgLength() { // retorna o total de itens
  try {
    const response = await axios.get(`${API_URL}/results`, {
      params: { _limit: 0, StartPoint: 0 },
      responseType: 'text' // Adiciona o responseType para texto
    });

    if (response.status !== 200) {
      throw new Error('Erro ao buscar os dados');
    }
    return response.headers["x-total-count"];
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

export function useResultData() {
  const query = useQuery({
    queryFn: () => fetchData('results'), 
    queryKey: ['results-data'], 
  });
  return query;
}

export function useResultPaginate(page: number, limit: number) { // faz a requisição por paginação
  const query = useQuery({
    queryFn: () => fetchData(`results?_page=${page+1}&_limit=${limit}`), 
    queryKey: ['resultsPg-data', page, limit], 
  });
  
  return query;
}

export function useDetailData() {
  const query = useQuery({
    queryFn: () => fetchData('detail'), 
    queryKey: ['detail-data'], 
  });
  return query;
}
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const QUARKUS_URL = 'http://localhost:8080';
const DATA_RESOURCE = 'http://localhost:8080/msh/spc/v1';

const fetchData = async (endpoint: string) => {
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`);
  // console.log("response: ", response.data);

  return response.data;
};

const fetchDataQuarkus = async (endpoint: string, filters: URLSearchParams) => {
  const cleanParams = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  );
  const response = await axios.get(`${DATA_RESOURCE}/${endpoint}`, { params: cleanParams });
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

export function useResultData(filters: any) {
  const query = useQuery({
    queryFn: () => fetchDataQuarkus('results', filters),
    queryKey: ['results-data'],
    enabled: false,
  });
  return query;
}

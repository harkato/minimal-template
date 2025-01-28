import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3001';
const QUARKUS_URL = 'http://localhost:8080';

const fetchData = async (endpoint: string) => {
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`);
  // console.log("response: ", response.data);

  return response.data;
};

const fetchDataQuarkus = async (endpoint: string, filters: URLSearchParams) => {
  const params = new URLSearchParams(filters);
  const response = await axios.get(`${QUARKUS_URL}/${endpoint}`, { params });
  return response.data;
};

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
    queryFn: () => fetchDataQuarkus('results/report', filters),
    queryKey: ['results-data'],
    enabled: false,
  });
  return query;
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = 'http://localhost:3001';

const fetchData = async (endpoint: string) => {
  const response = await axios.get(`${API_URL}/${endpoint}`);
  // console.log("response: ", response.data);
  
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

export function useResultData() {
  const query = useQuery({
    queryFn: () => fetchData('results'), 
    queryKey: ['results-data'], 
  });
  return query;
}
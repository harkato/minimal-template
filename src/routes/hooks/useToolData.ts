import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = 'http://localhost:3001';

const fetchData = async (endpoint: string) => {
  const response = await axios.get(`${API_URL}/${endpoint}`);
  console.log("response: ", response.data);
  
  return response.data;
};


export function useToolData() {
  const query = useQuery({
    queryFn: () => fetchData('tool'), 
    queryKey: ['tool-data'], 
  });
  return query;
}

export function useTopFiveData() {
    const query = useQuery({
      // queryFn: () => fetchData(), 
      queryFn: () => getTopFiveData(), 
      queryKey: ['topfive_data'] 
    });
    // console.log ('useTopFiveData: ', query.data)
    return query;
}

export async function getTopFiveData() {
  const url = 'http://localhost:3001/topFive'
  const response = await fetch(url)
  const task = await response.json()
  if(!response.ok){
    throw new Error(task.error)
  }
  return task
}
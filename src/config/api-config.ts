const apiConfig = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/msh/spc/v1',
  SSE_URL: import.meta.env.VITE_SSE_URL || 'http://192.168.1.146:8082/results?toolIds=',
  DASHBOARD_URL: import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:8080/msh/spc/v1/dashboard',
  API_KEY: import.meta.env.VITE_API_KEY || '0000',
  TIMEOUT: parseInt(import.meta.env.VITE_TIMEOUT || '10000', 10),
  MODE: import.meta.env.MODE, // Modo de execução (development, production, etc.)
};

export default apiConfig;

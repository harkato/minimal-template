import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Define o tipo do valor do contexto
export interface DashboardContextProps {
  pendingValue: any[];
  setPendingValue: React.Dispatch<React.SetStateAction<any[]>>;
}

// Cria o contexto
const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

// Provedor do contexto
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingValue, setPendingValue] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('pendingValue') || '[]')
  );

  // Use useMemo para memorizar o valor
  const contextValue = useMemo(
    () => ({
      pendingValue,
      setPendingValue,
    }),
    [pendingValue] // Dependências que afetam o valor do contexto
  );

  useEffect(() => {
    localStorage.setItem('pendingValue', JSON.stringify(pendingValue));
  }, [pendingValue]);

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
};

// Hook para consumir o contexto
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

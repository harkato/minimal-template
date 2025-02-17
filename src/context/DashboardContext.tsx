import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Props } from 'src/sections/overview/analytics-dashboard-card';
import { initialData } from 'src/sections/overview/view/initial-data';
import { useToolData } from 'src/routes/hooks/useToolData';

// Define o tipo do valor do contexto
export interface DashboardContextProps {
  cardData: Array<Props>;
  pendingValue: any[];
  setPendingValue: React.Dispatch<React.SetStateAction<any[]>>;
  selectedCards: string[];
  setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteCard: (id: string) => void;
}

// Cria o contexto
const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

// Provedor do contexto
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [cardData, setCardData] = useState(initialData);

  // const [selectedCards, setSelectedCards] = useState<string[]>(
  //   cardData?.map((card: { id: any; }) => card.id)
  // );

  const {
    isLoading: isLoadingTools,
    isError: isErrorTools,
    data: toolData,
    error: errorTools,
  } = useToolData();
  const [cardData, setCardData] = useState([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  useEffect(() => {
    if (toolData) {
      setCardData(toolData);
      setSelectedCards(toolData.map((card: { id: any }) => card.id));
    }
  }, [toolData]);

  const [pendingValue, setPendingValue] = useState<string[]>([]);
  // (() =>
  //   JSON.parse(localStorage.getItem('pendingValue') || '[]')
  // );

  const handleDeleteCard = (id: string) => {
    setPendingValue((prevPending) => prevPending.filter((item) => item !== id));
    setSelectedCards((prevSelected) => prevSelected.filter((cardId) => cardId !== id));
  };

  // Use useMemo para memorizar o valor
  const contextValue = useMemo(
    () => ({
      cardData,
      setCardData,
      pendingValue,
      setPendingValue,
      selectedCards,
      setSelectedCards,
      handleDeleteCard,
    }),
    [cardData, pendingValue, selectedCards] // Dependências que afetam o valor do contexto
  );

  // useEffect(() => {
  //   localStorage.setItem('pendingValue', JSON.stringify(pendingValue));
  // }, [pendingValue]);

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

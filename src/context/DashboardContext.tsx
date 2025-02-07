import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Props } from 'src/sections/overview/analytics-dashboard-card';
import { initialData } from 'src/sections/overview/view/initial-data';

// Define o tipo do valor do contexto
export interface DashboardContextProps {
  cardData: Array<Props>;
  pendingValue: LabelType[];
  setPendingValue: React.Dispatch<React.SetStateAction<LabelType[]>>;
  selectedCards: string[];
  setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteCard: (id: string) => void;
}

interface LabelType {
  name: string;
  color: string;
  description?: string;
}

// Cria o contexto
const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

// Provedor do contexto
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cardData, setCardData] = useState(initialData);
  const [pendingValue, setPendingValue] = useState<LabelType[]>(
    () => JSON.parse(localStorage.getItem("pendingValue") || '[]')
  );
  const [selectedCards, setSelectedCards] = useState<string[]>(cardData.map((card) => card.id));

  const handleDeleteCard = (id: string) => {
    setPendingValue((prevPending) => prevPending.filter((item) => item.name !== id));
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
  
  useEffect(() => {
    localStorage.setItem("pendingValue", JSON.stringify(pendingValue));
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

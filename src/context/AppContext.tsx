// src/context/AppContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useEntities } from '../hooks/useEntities';
import { Entity, Attribute, EntityFilter } from '../types/entity';

interface AppContextType {
  entities: Entity[];
  filteredEntities: Entity[];
  loading: boolean;
  error: string | null;
  filter: EntityFilter;
  setEntities: (entities: Entity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: EntityFilter) => void;
  addEntity: (entityData: Partial<Entity>) => Entity;
  updateEntity: (entityId: string, updates: Partial<Entity>) => void;
  deleteEntity: (entityId: string) => void;
  addAttribute: (entityId: string, attributeData: Partial<Attribute>) => Attribute;
  updateAttribute: (entityId: string, attributeId: string, updates: Partial<Attribute>) => void;
  deleteAttribute: (entityId: string, attributeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const entityState = useEntities();

  return (
    <AppContext.Provider value={entityState}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
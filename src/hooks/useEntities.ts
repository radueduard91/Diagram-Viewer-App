// src/hooks/useEntities.ts
import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Entity, Attribute, EntityFilter, EntitySystem } from '../types/entity';
import { validateEntity, validateAttribute } from '../utils/validation/schemas';

export interface EntityState {
  entities: Entity[];
  loading: boolean;
  error: string | null;
  filter: EntityFilter;
}

export const useEntities = () => {
  const [state, setState] = useState<EntityState>({
    entities: [],
    loading: false,
    error: null,
    filter: {}
  });

  const setEntities = useCallback((entities: Entity[]) => {
    setState(prev => ({ ...prev, entities }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setFilter = useCallback((filter: EntityFilter) => {
    setState(prev => ({ ...prev, filter }));
  }, []);

  const addEntity = useCallback((entityData: Partial<Entity>) => {
    const newEntity: Entity = {
      id: uuidv4(),
      'Entity ID': Math.max(0, ...state.entities.map(e => e['Entity ID'])) + 1,
      'Entity Name': entityData['Entity Name'] || '',
      'Entity Description': entityData['Entity Description'] || null,
      'Entity System': entityData['Entity System'] || 'EAM',
      'Entity Type': entityData['Entity Type'] || null,
      'Entity Hierarchy Level': entityData['Entity Hierarchy Level'] || 1,
      'Entity parent ID': entityData['Entity parent ID'] || null,
      'Entity child ID': entityData['Entity child ID'] || [],
      Attributes: entityData.Attributes || []
    };

    const validation = validateEntity(newEntity);
    if (!validation.success) {
      throw new Error('Invalid entity data');
    }

    setState(prev => ({
      ...prev,
      entities: [...prev.entities, newEntity]
    }));

    return newEntity;
  }, [state.entities]);

  const updateEntity = useCallback((entityId: string, updates: Partial<Entity>) => {
    setState(prev => ({
      ...prev,
      entities: prev.entities.map(entity => 
        entity.id === entityId ? { ...entity, ...updates } : entity
      )
    }));
  }, []);

  const deleteEntity = useCallback((entityId: string) => {
    setState(prev => ({
      ...prev,
      entities: prev.entities.filter(entity => entity.id !== entityId)
    }));
  }, []);

  const addAttribute = useCallback((entityId: string, attributeData: Partial<Attribute>) => {
    const newAttribute: Attribute = {
      id: uuidv4(),
      'Attribute ID': Math.max(0, ...state.entities.flatMap(e => e.Attributes.map(a => a['Attribute ID']))) + 1,
      'Attribute Name': attributeData['Attribute Name'] || '',
      'Attribute Description': attributeData['Attribute Description'] || null,
      'PrimaryKey': attributeData['PrimaryKey'] || 'No',
      'Part Of Parent ID': attributeData['Part Of Parent ID'] || 0,
      'Attribute System': attributeData['Attribute System'] || 'EAM'
    };

    const validation = validateAttribute(newAttribute);
    if (!validation.success) {
      throw new Error('Invalid attribute data');
    }

    setState(prev => ({
      ...prev,
      entities: prev.entities.map(entity => 
        entity.id === entityId
          ? { ...entity, Attributes: [...entity.Attributes, newAttribute] }
          : entity
      )
    }));

    return newAttribute;
  }, [state.entities]);

  const updateAttribute = useCallback((entityId: string, attributeId: string, updates: Partial<Attribute>) => {
    setState(prev => ({
      ...prev,
      entities: prev.entities.map(entity => 
        entity.id === entityId
          ? {
              ...entity,
              Attributes: entity.Attributes.map(attr =>
                attr.id === attributeId ? { ...attr, ...updates } : attr
              )
            }
          : entity
      )
    }));
  }, []);

  const deleteAttribute = useCallback((entityId: string, attributeId: string) => {
    setState(prev => ({
      ...prev,
      entities: prev.entities.map(entity => 
        entity.id === entityId
          ? {
              ...entity,
              Attributes: entity.Attributes.filter(attr => attr.id !== attributeId)
            }
          : entity
      )
    }));
  }, []);

  const filteredEntities = useMemo(() => {
    let result = state.entities;

    if (state.filter.system && state.filter.system !== 'All') {
      result = result.filter(entity => {
        if (state.filter.system === 'Both') {
          return entity['Entity System'].includes(',') || 
                 entity['Entity System'].toLowerCase() === 'both';
        }
        return entity['Entity System'].includes(state.filter.system as string);
      });
    }

    if (state.filter.searchTerm) {
      const term = state.filter.searchTerm.toLowerCase();
      result = result.filter(entity => 
        entity['Entity Name'].toLowerCase().includes(term) ||
        entity['Entity Description']?.toLowerCase().includes(term) ||
        entity.Attributes.some(attr => 
          attr['Attribute Name'].toLowerCase().includes(term) ||
          attr['Attribute Description']?.toLowerCase().includes(term)
        )
      );
    }

    return result;
  }, [state.entities, state.filter]);

  return {
    entities: state.entities,
    filteredEntities,
    loading: state.loading,
    error: state.error,
    filter: state.filter,
    setEntities,
    setLoading,
    setError,
    setFilter,
    addEntity,
    updateEntity,
    deleteEntity,
    addAttribute,
    updateAttribute,
    deleteAttribute
  };
};
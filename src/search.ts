// src/utils/search.ts
import { Entity } from '../types';

export const searchInEntity = (entity: Entity, query: string): boolean => {
  query = query.toLowerCase();
  
  // Check entity properties
  if (entity['Entity Name'].toLowerCase().includes(query)) return true;
  if (entity['Entity System'].toLowerCase().includes(query)) return true;
  if (entity['Entity Type']?.toLowerCase().includes(query)) return true;
  if (entity['Entity Description']?.toLowerCase().includes(query)) return true;
  
  // Check attributes
  return entity.Attributes.some(attr => 
    attr['Attribute Name'].toLowerCase().includes(query) ||
    attr['Attribute System'].toLowerCase().includes(query) ||
    attr['Attribute Description']?.toLowerCase().includes(query)
  );
};

export const findMatchingEntities = (entities: Entity[], query: string): Entity[] => {
  if (!query.trim()) return [];
  return entities.filter(entity => searchInEntity(entity, query));
};
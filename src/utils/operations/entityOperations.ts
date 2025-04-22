// src/utils/operations/entityOperations.ts
import { v4 as uuidv4 } from 'uuid';
import { Entity, Attribute } from '../../types';

// Helper function to generate a unique ID
export const generateUniqueId = (entities: Entity[], prefix = ''): number => {
  const existingIds = entities.map(e => e['Entity ID']);
  let maxId = Math.max(...existingIds, 0);
  return maxId + 1;
};

// Helper function to generate a unique attribute ID
export const generateUniqueAttributeId = (entities: Entity[]): number => {
  const allAttributeIds = entities.flatMap(e => e.Attributes.map(a => a['Attribute ID']));
  let maxId = Math.max(...allAttributeIds, 0);
  return maxId + 1;
};

// Add a new entity
export const addEntity = (entities: Entity[], parentId: number | null): Entity => {
  const newId = generateUniqueId(entities);
  
  // Determine hierarchy level
  let hierarchyLevel = 1;
  if (parentId !== null) {
    const parent = entities.find(e => e['Entity ID'] === parentId);
    if (parent) {
      hierarchyLevel = parent['Entity Hierarchy Level'] + 1;
    }
  }
  
  const newEntity: Entity = {
    id: uuidv4(),
    'Entity ID': newId,
    'Entity Name': 'New Entity',
    'Entity Description': null,
    'Entity System': '',
    'Entity Type': '',
    'Entity Hierarchy Level': hierarchyLevel,
    'Entity parent ID': parentId,
    'Entity child ID': [],
    Attributes: []
  };
  
  // Update parent's child ID array if there's a parent
  if (parentId !== null) {
    const parentIndex = entities.findIndex(e => e['Entity ID'] === parentId);
    if (parentIndex !== -1) {
      entities[parentIndex]['Entity child ID'].push(newId);
    }
  }
  
  return newEntity;
};

// Copy an entity
export const copyEntity = (entities: Entity[], entityId: number): Entity | null => {
  const entity = entities.find(e => e['Entity ID'] === entityId);
  if (!entity) return null;
  
  const newId = generateUniqueId(entities);
  const parentId = entity['Entity parent ID'];
  
  // Create a deep copy of the entity
  const copiedEntity: Entity = {
    ...entity,
    id: uuidv4(),
    'Entity ID': newId,
    'Entity Name': `${entity['Entity Name']} (Copy)`,
    'Entity child ID': [], // Don't copy children
    Attributes: entity.Attributes.map(attr => ({
      ...attr,
      id: uuidv4(),
      'Attribute ID': generateUniqueAttributeId(entities),
      'Part Of Parent ID': newId // Update parent reference
    }))
  };
  
  // Update parent's child ID array if there's a parent
  if (parentId !== null) {
    const parentIndex = entities.findIndex(e => e['Entity ID'] === parentId);
    if (parentIndex !== -1) {
      entities[parentIndex]['Entity child ID'].push(newId);
    }
  }
  
  return copiedEntity;
};

// Delete an entity and its children
export const deleteEntity = (entities: Entity[], entityId: number): Entity[] => {
  const entityToDelete = entities.find(e => e['Entity ID'] === entityId);
  if (!entityToDelete) return entities;
  
  // Recursively collect all child entity IDs
  const collectChildIds = (id: number): number[] => {
    const entity = entities.find(e => e['Entity ID'] === id);
    if (!entity) return [];
    
    let childIds = [...entity['Entity child ID']];
    entity['Entity child ID'].forEach(childId => {
      childIds = [...childIds, ...collectChildIds(childId)];
    });
    
    return childIds;
  };
  
  const allIdsToDelete = [entityId, ...collectChildIds(entityId)];
  
  // Remove entity from parent's child ID list
  if (entityToDelete['Entity parent ID'] !== null) {
    const parentIndex = entities.findIndex(e => e['Entity ID'] === entityToDelete['Entity parent ID']);
    if (parentIndex !== -1) {
      const parent = entities[parentIndex];
      parent['Entity child ID'] = parent['Entity child ID'].filter(id => id !== entityId);
    }
  }
  
  // Filter out the entities to delete
  return entities.filter(entity => !allIdsToDelete.includes(entity['Entity ID']));
};

// Update an entity
export const updateEntity = (entities: Entity[], entityId: number, updates: Partial<Entity>): Entity[] => {
  const index = entities.findIndex(e => e['Entity ID'] === entityId);
  if (index === -1) return entities;
  
  // Create a new array with the updated entity
  const updatedEntities = [...entities];
  updatedEntities[index] = {
    ...entities[index],
    ...updates
  };
  
  return updatedEntities;
};

// Add an attribute to an entity
export const addAttribute = (entity: Entity, entities: Entity[]): Attribute => {
  const newAttributeId = generateUniqueAttributeId(entities);
  
  return {
    id: uuidv4(),
    'Attribute ID': newAttributeId,
    'Attribute Name': 'New Attribute',
    'Attribute Description': null,
    'PrimaryKey': 'No',
    'Part Of Parent ID': entity['Entity ID'],
    'Attribute System': entity['Entity System']
  };
};

// Delete an attribute from an entity
export const deleteAttribute = (entity: Entity, attributeId: number): Attribute[] => {
  return entity.Attributes.filter(attr => attr['Attribute ID'] !== attributeId);
};

// Update an attribute
export const updateAttribute = (
  entity: Entity,
  attributeId: number,
  updates: Partial<Attribute>
): Attribute[] => {
  return entity.Attributes.map(attr => 
    attr['Attribute ID'] === attributeId ? { ...attr, ...updates } : attr
  );
};

// Copy an attribute
export const copyAttribute = (
  entity: Entity,
  attributeId: number,
  entities: Entity[]
): Attribute | null => {
  const attribute = entity.Attributes.find(attr => attr['Attribute ID'] === attributeId);
  if (!attribute) return null;
  
  const newAttributeId = generateUniqueAttributeId(entities);
  
  return {
    ...attribute,
    id: uuidv4(),
    'Attribute ID': newAttributeId,
    'Attribute Name': `${attribute['Attribute Name']} (Copy)`
  };
};

// Export functions for JSON export
export const exportToJSON = (entities: Entity[]): string => {
  // Create a clean copy without UUID fields for export
  const exportData = entities.map(entity => {
    const { id, ...entityData } = entity;
    const attributes = entity.Attributes.map(attr => {
      const { id, ...attrData } = attr;
      return attrData;
    });
    return { ...entityData, Attributes: attributes };
  });
  
  return JSON.stringify(exportData, null, 2);
};
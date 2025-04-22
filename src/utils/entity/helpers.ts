// src/utils/entity/helpers.ts
import { Entity, EntityRelationship } from '../../types/entity';

export const buildEntityRelationships = (entities: Entity[]): EntityRelationship[] => {
  const relationships: EntityRelationship[] = [];
  
  entities.forEach(entity => {
    if (entity['Entity parent ID'] !== null) {
      const parentEntity = entities.find(e => e['Entity ID'] === entity['Entity parent ID']);
      if (parentEntity) {
        relationships.push({
          parentId: parentEntity.id,
          childId: entity.id
        });
      }
    }
  });
  
  return relationships;
};

export const findEntityChildren = (entity: Entity, entities: Entity[]): Entity[] => {
  return entities.filter(e => e['Entity parent ID'] === entity['Entity ID']);
};

export const findEntityParent = (entity: Entity, entities: Entity[]): Entity | undefined => {
  return entities.find(e => e['Entity ID'] === entity['Entity parent ID']);
};

export const getEntityPath = (entity: Entity, entities: Entity[]): Entity[] => {
  const path: Entity[] = [entity];
  let currentEntity: Entity | undefined = entity;
  
  while (currentEntity && currentEntity['Entity parent ID'] !== null) {
    currentEntity = findEntityParent(currentEntity, entities);
    if (currentEntity) {
      path.unshift(currentEntity);
    }
  }
  
  return path;
};

export const calculateEntityLevel = (entity: Entity, entities: Entity[]): number => {
  return getEntityPath(entity, entities).length;
};

export const exportEntitiesToJSON = (entities: Entity[]): string => {
  return JSON.stringify(entities, null, 2);
};

export const downloadJSON = (data: string, filename: string) => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
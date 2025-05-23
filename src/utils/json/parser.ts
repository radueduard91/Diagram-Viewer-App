// src/utils/json/parser.ts
import { v4 as uuidv4 } from 'uuid';
import { Entity, Attribute } from '../../types/entity';

export interface RawEntityData {
  'Entity ID': number;
  'Entity Name': string;
  'Entity Description': string | null;
  'Entity System': string;
  'Entity Type': string | null;
  'Entity Hierarchy Level': number;
  'Entity parent ID': number | null;
  'Entity child ID': number[];
  'Attributes': Array<{
    'Attribute ID': number;
    'Attribute Name': string;
    'Attribute Description': string | null;
    'PrimaryKey': string;
    'Part Of Parent ID': number;
    'Attribute System': string;
  }>;
}

export class EntityParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EntityParseError';
  }
}

export const parseEntityHierarchy = async (file: File): Promise<Entity[]> => {
  try {
    let text = await file.text();
    
    // Replace NaN values with null, handling both NaN in JSON and as a property value
    text = text.replace(/:\s*NaN/g, ': null');
    
    const rawData = JSON.parse(text) as RawEntityData[];
    
    if (!Array.isArray(rawData)) {
      throw new EntityParseError('Invalid JSON format: Expected an array of entities');
    }
    
    return rawData.map(parseEntityData);
  } catch (error) {
    if (error instanceof EntityParseError) {
      throw error;
    }
    if (error instanceof SyntaxError) {
      throw new EntityParseError('Invalid JSON format');
    }
    if (error instanceof Error) {
      throw new EntityParseError(`Failed to parse file: ${error.message}`);
    }
    throw new EntityParseError('Failed to parse file: Unknown error');
  }
};

const parseEntityData = (raw: RawEntityData): Entity => {
  if (!raw['Entity ID'] || !raw['Entity Name']) {
    throw new EntityParseError('Missing required entity fields');
  }
  
  const attributes: Attribute[] = raw.Attributes.map(attr => ({
    id: uuidv4(),
    'Attribute ID': attr['Attribute ID'],
    'Attribute Name': attr['Attribute Name'],
    'Attribute Description': attr['Attribute Description'] === null || typeof attr['Attribute Description'] === 'object' ? null : attr['Attribute Description'],
    'PrimaryKey': attr['PrimaryKey'] as 'Yes' | 'No',
    'Part Of Parent ID': attr['Part Of Parent ID'],
    'Attribute System': attr['Attribute System']
  }));
  
  return {
    id: uuidv4(),
    'Entity ID': raw['Entity ID'],
    'Entity Name': raw['Entity Name'],
    'Entity Description': raw['Entity Description'] === null || typeof raw['Entity Description'] === 'object' ? null : raw['Entity Description'],
    'Entity System': raw['Entity System'],
    'Entity Type': raw['Entity Type'],
    'Entity Hierarchy Level': raw['Entity Hierarchy Level'],
    'Entity parent ID': raw['Entity parent ID'],
    'Entity child ID': raw['Entity child ID'] || [],
    Attributes: attributes
  };
};

export const serializeEntities = (entities: Entity[]): string => {
  const rawData: RawEntityData[] = entities.map(entity => ({
    'Entity ID': entity['Entity ID'],
    'Entity Name': entity['Entity Name'],
    'Entity Description': entity['Entity Description'],
    'Entity System': entity['Entity System'],
    'Entity Type': entity['Entity Type'],
    'Entity Hierarchy Level': entity['Entity Hierarchy Level'],
    'Entity parent ID': entity['Entity parent ID'],
    'Entity child ID': entity['Entity child ID'],
    Attributes: entity.Attributes.map(attr => ({
      'Attribute ID': attr['Attribute ID'],
      'Attribute Name': attr['Attribute Name'],
      'Attribute Description': attr['Attribute Description'],
      'PrimaryKey': attr['PrimaryKey'],
      'Part Of Parent ID': attr['Part Of Parent ID'],
      'Attribute System': attr['Attribute System']
    }))
  }));
  
  return JSON.stringify(rawData, null, 2);
};
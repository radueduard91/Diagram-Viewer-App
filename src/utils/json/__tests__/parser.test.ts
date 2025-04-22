// src/utils/json/__tests__/parser.test.ts
import { parseEntityHierarchy, serializeEntities, EntityParseError } from '../parser';
import { Entity } from '../../../types/entity';

describe('JSON Parser', () => {
  const validEntityData = [{
    "Entity ID": 1,
    "Entity Name": "Test Entity",
    "Entity Description": "Test Description",
    "Entity System": "EAM",
    "Entity Type": "Standard Entity",
    "Entity Hierarchy Level": 1,
    "Entity parent ID": null,
    "Entity child ID": [],
    "Attributes": [
      {
        "Attribute ID": 10000,
        "Attribute Name": "Test Attribute",
        "Attribute Description": "Test Attribute Description",
        "PrimaryKey": "Yes",
        "Part Of Parent ID": 1,
        "Attribute System": "EAM"
      }
    ]
  }];

  it('should parse valid JSON file', async () => {
    const file = new File([JSON.stringify(validEntityData)], 'test.json', { type: 'application/json' });
    const result = await parseEntityHierarchy(file);
    
    expect(result).toHaveLength(1);
    expect(result[0]['Entity Name']).toBe('Test Entity');
    expect(result[0].Attributes).toHaveLength(1);
    expect(result[0].Attributes[0]['Attribute Name']).toBe('Test Attribute');
  });

  it('should throw error for invalid JSON', async () => {
    const file = new File(['invalid json'], 'test.json', { type: 'application/json' });
    
    await expect(parseEntityHierarchy(file)).rejects.toThrow(EntityParseError);
  });

  it('should throw error for non-array JSON', async () => {
    const file = new File(['{"not": "an array"}'], 'test.json', { type: 'application/json' });
    
    await expect(parseEntityHierarchy(file)).rejects.toThrow('Invalid JSON format: Expected an array of entities');
  });

  it('should serialize entities correctly', () => {
    const entities: Entity[] = [{
      id: 'test-id',
      'Entity ID': 1,
      'Entity Name': 'Test Entity',
      'Entity Description': null,
      'Entity System': 'EAM',
      'Entity Type': null,
      'Entity Hierarchy Level': 1,
      'Entity parent ID': null,
      'Entity child ID': [],
      Attributes: []
    }];
    
    const serialized = serializeEntities(entities);
    const parsed = JSON.parse(serialized);
    
    expect(parsed[0]['Entity Name']).toBe('Test Entity');
  });
});
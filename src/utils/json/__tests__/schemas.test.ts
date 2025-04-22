// src/utils/validation/__tests__/schemas.test.ts
import { validateEntity, validateAttribute, validateEntityForm, validateAttributeForm } from '../schemas';

describe('Validation Schemas', () => {
  describe('Entity Validation', () => {
    const validEntity = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      'Entity ID': 1,
      'Entity Name': 'Test Entity',
      'Entity Description': null,
      'Entity System': 'EAM',
      'Entity Type': null,
      'Entity Hierarchy Level': 1,
      'Entity parent ID': null,
      'Entity child ID': [],
      Attributes: []
    };

    it('should validate a valid entity', () => {
      const result = validateEntity(validEntity);
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid entity', () => {
      const invalidEntity = { ...validEntity, 'Entity Name': '' };
      const result = validateEntity(invalidEntity);
      expect(result.success).toBe(false);
    });
  });

  describe('Attribute Validation', () => {
    const validAttribute = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      'Attribute ID': 1,
      'Attribute Name': 'Test Attribute',
      'Attribute Description': null,
      'PrimaryKey': 'Yes',
      'Part Of Parent ID': 1,
      'Attribute System': 'EAM'
    };

    it('should validate a valid attribute', () => {
      const result = validateAttribute(validAttribute);
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid attribute', () => {
      const invalidAttribute = { ...validAttribute, 'PrimaryKey': 'Maybe' };
      const result = validateAttribute(invalidAttribute);
      expect(result.success).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should validate entity form data', () => {
      const formData = {
        'Entity Name': 'Test Entity',
        'Entity Description': null,
        'Entity System': 'EAM',
        'Entity Type': null,
        'Entity parent ID': null
      };
      const result = validateEntityForm(formData);
      expect(result.success).toBe(true);
    });

    it('should validate attribute form data', () => {
      const formData = {
        'Attribute Name': 'Test Attribute',
        'Attribute Description': null,
        'PrimaryKey': 'No',
        'Attribute System': 'EAM',
        'Part Of Parent ID': 1
      };
      const result = validateAttributeForm(formData);
      expect(result.success).toBe(true);
    });
  });
});
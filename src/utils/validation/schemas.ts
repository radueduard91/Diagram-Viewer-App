// src/utils/validation/schemas.ts
import { z } from 'zod';

export const AttributeSchema = z.object({
  id: z.string().uuid(),
  'Attribute ID': z.number(),
  'Attribute Name': z.string().min(1, 'Attribute name is required'),
  'Attribute Description': z.string().nullable(),
  'PrimaryKey': z.enum(['Yes', 'No']),
  'Part Of Parent ID': z.number(),
  'Attribute System': z.string()
});

export const EntitySchema = z.object({
  id: z.string().uuid(),
  'Entity ID': z.number(),
  'Entity Name': z.string().min(1, 'Entity name is required'),
  'Entity Description': z.string().nullable(),
  'Entity System': z.string(),
  'Entity Type': z.string().nullable(),
  'Entity Hierarchy Level': z.number(),
  'Entity parent ID': z.number().nullable(),
  'Entity child ID': z.array(z.number()),
  Attributes: z.array(AttributeSchema)
});

export const EntityFormSchema = z.object({
  'Entity Name': z.string().min(1, 'Entity name is required'),
  'Entity Description': z.string().nullable(),
  'Entity System': z.enum(['EAM', 'iPen', 'GIS-WN', 'Both']),
  'Entity Type': z.string().nullable(),
  'Entity parent ID': z.number().nullable()
});

export const AttributeFormSchema = z.object({
  'Attribute Name': z.string().min(1, 'Attribute name is required'),
  'Attribute Description': z.string().nullable(),
  'PrimaryKey': z.enum(['Yes', 'No']),
  'Attribute System': z.string(),
  'Part Of Parent ID': z.number()
});

export const validateEntity = (data: unknown) => {
  return EntitySchema.safeParse(data);
};

export const validateEntityForm = (data: unknown) => {
  return EntityFormSchema.safeParse(data);
};

export const validateAttribute = (data: unknown) => {
  return AttributeSchema.safeParse(data);
};

export const validateAttributeForm = (data: unknown) => {
  return AttributeFormSchema.safeParse(data);
};
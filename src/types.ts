// src/types.ts
export interface Attribute {
  id: string;
  'Attribute ID': number;
  'Attribute Name': string;
  'Attribute Description': string | null;
  'PrimaryKey': 'Yes' | 'No';
  'Part Of Parent ID': number;
  'Attribute System': string;
}

export interface Entity {
  id: string;
  'Entity ID': number;
  'Entity Name': string;
  'Entity Description': string | null;
  'Entity System': string;
  'Entity Type': string;
  'Entity Hierarchy Level': number;
  'Entity parent ID': number | null;
  'Entity child ID': number[];
  Attributes: Attribute[];
}

export type EntityHierarchyEditorProps = {
  initialData?: Entity[];
};
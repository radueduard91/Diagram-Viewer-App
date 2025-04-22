// src/types/diagram.ts
import { Node, Edge, XYPosition } from '@reactflow/core';
import { Entity, Attribute } from './entity';

export interface EntityNodeData {
  entity: Entity;
  attributes: Attribute[];
  onEdit: (entity: Entity) => void;
  onDelete: (entityId: string) => void;
  onAddAttribute: (entityId: string) => void;
  onEditAttribute: (attribute: Attribute) => void;
  onDeleteAttribute: (attributeId: string) => void;
}

export type EntityNode = Node<EntityNodeData>;

export type EntityRelationEdge = Edge & {
  source: string;
  target: string;
};

export interface DiagramLayout {
  hierarchical: boolean;
  spacing: {
    horizontal: number;
    vertical: number;
  };
}

export interface DiagramState {
  nodes: EntityNode[];
  edges: EntityRelationEdge[];
  filter: {
    system: string;
    searchTerm: string;
  };
}
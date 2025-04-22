// src/components/diagram/EntityNode/index.tsx
import React, { useState } from 'react';
import { Handle, Position } from '@reactflow/core';
import styled from 'styled-components';
import { EntityNodeData } from '../../../types/diagram';
import Button from '../../common/Button';

interface SystemColors {
  [key: string]: {
    backgroundColor: string;
    borderColor: string;
    badgeColor: string;
    textColor: string;
  };
}

const systemColors: SystemColors = {
  EAM: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
    badgeColor: '#22c55e',
    textColor: '#15803d'
  },
  iPen: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    badgeColor: '#3b82f6',
    textColor: '#1d4ed8'
  },
  'GIS-WN': {
    backgroundColor: '#fefce8',
    borderColor: '#eab308',
    badgeColor: '#eab308',
    textColor: '#854d0e'
  },
  Both: {
    backgroundColor: '#fff7ed',
    borderColor: '#f97316',
    badgeColor: '#f97316',
    textColor: '#c2410c'
  },
  default: {
    backgroundColor: '#f9fafb',
    borderColor: '#9ca3af',
    badgeColor: '#9ca3af',
    textColor: '#4b5563'
  }
};

const NodeContainer = styled.div<{ system: string }>`
  background-color: ${props => (systemColors[props.system] || systemColors.default).backgroundColor};
  border: 2px solid ${props => (systemColors[props.system] || systemColors.default).borderColor};
  border-radius: ${props => props.theme.borderRadius.lg};
  min-width: 280px;
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
`;

const NodeHeader = styled.div<{ system: string }>`
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  background-color: ${props => (systemColors[props.system] || systemColors.default).borderColor}10;
  border-bottom: 1px solid ${props => (systemColors[props.system] || systemColors.default).borderColor}40;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NodeTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  flex: 1;
`;

const SystemBadge = styled.span<{ system: string }>`
  background-color: ${props => (systemColors[props.system] || systemColors.default).badgeColor};
  color: white;
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
`;

const NodeContent = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const AttributeList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const AttributeItem = styled.li<{ isHovered: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  margin: ${props => `${props.theme.spacing.xs} 0`};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.isHovered ? props.theme.colors.background.hover : 'transparent'};
  transition: ${props => props.theme.transitions.default};
`;

const AttributeInfo = styled.div`
  flex: 1;
`;

const AttributeName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const AttributeType = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const PrimaryKeyBadge = styled.span`
  background-color: ${props => props.theme.colors.status.warning};
  color: white;
  padding: ${props => `2px ${props.theme.spacing.xs}`};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: ${props => props.theme.spacing.xs};
`;

const Actions = styled.div<{ $isVisible: boolean }>`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: ${props => props.theme.transitions.default};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.xs};
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  border-radius: ${props => props.theme.borderRadius.sm};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.hover};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AddAttributeButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing.md};
`;

const EntityNode: React.FC<EntityNodeData> = ({
  entity,
  attributes,
  onEdit,
  onDelete,
  onAddAttribute,
  onEditAttribute,
  onDeleteAttribute
}) => {
  const [hoveredAttribute, setHoveredAttribute] = useState<string | null>(null);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(entity);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(entity.id);
  };

  const handleAddAttribute = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddAttribute(entity.id);
  };

  return (
    <NodeContainer system={entity['Entity System']}>
      <Handle type="target" position={Position.Top} />
      
      <NodeHeader system={entity['Entity System']}>
        <NodeTitle>{entity['Entity Name']}</NodeTitle>
        <SystemBadge system={entity['Entity System']}>
          {entity['Entity System']}
        </SystemBadge>
      </NodeHeader>
      
      <NodeContent>
        {entity['Entity Description'] && (
          <Description>{entity['Entity Description']}</Description>
        )}
        
        <AttributeList>
          {attributes.map(attr => (
            <AttributeItem
              key={attr.id}
              isHovered={hoveredAttribute === attr.id}
              onMouseEnter={() => setHoveredAttribute(attr.id)}
              onMouseLeave={() => setHoveredAttribute(null)}
            >
              <AttributeInfo>
                <AttributeName>
                  {attr['Attribute Name']}
                  {attr['PrimaryKey'] === 'Yes' && (
                    <PrimaryKeyBadge>PK</PrimaryKeyBadge>
                  )}
                </AttributeName>
                {attr['Attribute Description'] && (
                  <AttributeType>{attr['Attribute Description']}</AttributeType>
                )}
              </AttributeInfo>
              
              <Actions $isVisible={hoveredAttribute === attr.id}>
                <ActionButton onClick={(e) => {
                  e.stopPropagation();
                  onEditAttribute(attr);
                }}>
                  ✏️
                </ActionButton>
                <ActionButton onClick={(e) => {
                  e.stopPropagation();
                  onDeleteAttribute(attr.id);
                }}>
                  🗑️
                </ActionButton>
              </Actions>
            </AttributeItem>
          ))}
        </AttributeList>
        
        <AddAttributeButton
          variant="secondary"
          size="small"
          onClick={handleAddAttribute}
        >
          + Add Attribute
        </AddAttributeButton>
      </NodeContent>
      
      <Handle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default EntityNode;
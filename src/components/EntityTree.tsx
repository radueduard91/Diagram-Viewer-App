// src/components/EntityTree.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Layers, PlusCircle, Copy, Trash2 } from 'lucide-react';
import { Entity } from '../types/entity';

interface EntityTreeProps {
  entities: Entity[];
  selectedEntity: Entity | null;
  onSelect: (entity: Entity) => void;
  searchQuery?: string;
  onAdd?: (parentId: number | null) => void;
  onCopy?: (entityId: number) => void;
  onDelete?: (entityId: number) => void;
}

const highlightMatch = (text: string, query: string): string | boolean => {
  if (!query) return false;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) return false;
  
  return (
    text.substring(0, index) +
    '<span class="bg-yellow-200">' +
    text.substring(index, index + query.length) +
    '</span>' +
    text.substring(index + query.length)
  );
};

const EntityTreeNode: React.FC<{
  entity: Entity;
  entities: Entity[];
  level: number;
  selectedEntity: Entity | null;
  onSelect: (entity: Entity) => void;
  searchQuery?: string;
  expandedNodes: Set<number>;
  onToggleExpand: (entityId: number) => void;
  onAdd?: (parentId: number | null) => void;
  onCopy?: (entityId: number) => void;
  onDelete?: (entityId: number) => void;
}> = ({ 
  entity, 
  entities, 
  level, 
  selectedEntity, 
  onSelect, 
  searchQuery, 
  expandedNodes, 
  onToggleExpand,
  onAdd,
  onCopy,
  onDelete
}) => {
  const children = entities.filter(e => e['Entity parent ID'] === entity['Entity ID']);
  const hasChildren = children.length > 0;
  const isExpanded = expandedNodes.has(entity['Entity ID']);
  const isSelected = selectedEntity?.['Entity ID'] === entity['Entity ID'];
  const isHighlighted = searchQuery ? highlightMatch(entity['Entity Name'], searchQuery) || 
                                     highlightMatch(entity['Entity System'], searchQuery) : false;

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 rounded-md cursor-pointer mb-1 group ${
          isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
        } ${isHighlighted ? 'bg-yellow-100' : ''}`}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(entity['Entity ID']);
            }}
            className="mr-1 text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <div 
          className="flex-1 flex items-center" 
          onClick={() => onSelect(entity)}
        >
          <Layers size={16} className="mr-2 text-gray-500" />
          <span className="font-medium" dangerouslySetInnerHTML={{ 
            __html: searchQuery ? highlightMatch(entity['Entity Name'], searchQuery) : entity['Entity Name'] 
          }} />
          <span className="ml-2 text-sm text-gray-500" dangerouslySetInnerHTML={{
            __html: searchQuery ? highlightMatch(entity['Entity System'], searchQuery) : entity['Entity System']
          }} />
        </div>
        <div className="hidden group-hover:flex items-center gap-1">
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(entity['Entity ID']);
              }}
              className="p-1 text-blue-500 hover:text-blue-700"
              title="Add child entity"
            >
              <PlusCircle size={16} />
            </button>
          )}
          {onCopy && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopy(entity['Entity ID']);
              }}
              className="p-1 text-green-500 hover:text-green-700"
              title="Copy entity"
            >
              <Copy size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entity['Entity ID']);
              }}
              className="p-1 text-red-500 hover:text-red-700"
              title="Delete entity"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      {isExpanded && children.map(child => (
        <EntityTreeNode
          key={child['Entity ID']}
          entity={child}
          entities={entities}
          level={level + 1}
          selectedEntity={selectedEntity}
          onSelect={onSelect}
          searchQuery={searchQuery}
          expandedNodes={expandedNodes}
          onToggleExpand={onToggleExpand}
          onAdd={onAdd}
          onCopy={onCopy}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const EntityTree: React.FC<EntityTreeProps> = ({ 
  entities, 
  selectedEntity, 
  onSelect, 
  searchQuery,
  onAdd,
  onCopy,
  onDelete
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (searchQuery) {
      // Expand all nodes when searching
      const allEntityIds = entities.map(e => e['Entity ID']);
      setExpandedNodes(new Set(allEntityIds));
    }
  }, [searchQuery, entities]);

  const toggleExpand = (entityId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(entityId)) {
      newExpanded.delete(entityId);
    } else {
      newExpanded.add(entityId);
    }
    setExpandedNodes(newExpanded);
  };

  const rootEntities = entities.filter(e => e['Entity parent ID'] === null);

  return (
    <div className="mt-4">
      {rootEntities.map(entity => (
        <EntityTreeNode
          key={entity['Entity ID']}
          entity={entity}
          entities={entities}
          level={0}
          selectedEntity={selectedEntity}
          onSelect={onSelect}
          searchQuery={searchQuery}
          expandedNodes={expandedNodes}
          onToggleExpand={toggleExpand}
          onAdd={onAdd}
          onCopy={onCopy}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EntityTree;
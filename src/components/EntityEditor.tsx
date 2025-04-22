// src/components/EntityEditor.tsx
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Entity } from '../types/entity';

interface EntityEditorProps {
  entity: Entity;
  onUpdate: (updates: Partial<Entity>) => void;
}

const EntityEditor: React.FC<EntityEditorProps> = ({ entity, onUpdate }) => {
  const [editedEntity, setEditedEntity] = useState(entity);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedEntity(entity);
    setHasChanges(false);
  }, [entity]);

  const handleChange = (field: keyof Entity, value: any) => {
    setEditedEntity({ ...editedEntity, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // Only send the changed fields
    const changes: Partial<Entity> = {};
    
    if (editedEntity['Entity Name'] !== entity['Entity Name']) {
      changes['Entity Name'] = editedEntity['Entity Name'];
    }
    if (editedEntity['Entity Description'] !== entity['Entity Description']) {
      changes['Entity Description'] = editedEntity['Entity Description'];
    }
    if (editedEntity['Entity System'] !== entity['Entity System']) {
      changes['Entity System'] = editedEntity['Entity System'];
    }
    if (editedEntity['Entity Type'] !== entity['Entity Type']) {
      changes['Entity Type'] = editedEntity['Entity Type'];
    }
    
    if (Object.keys(changes).length > 0) {
      onUpdate(changes);
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entity ID</label>
          <input
            type="text"
            value={editedEntity['Entity ID']}
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
          <input
            type="text"
            value={editedEntity['Entity Name']}
            onChange={(e) => handleChange('Entity Name', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={editedEntity['Entity Description'] || ''}
          onChange={(e) => handleChange('Entity Description', e.target.value || null)}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entity System</label>
          <input
            type="text"
            value={editedEntity['Entity System']}
            onChange={(e) => handleChange('Entity System', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
          <input
            type="text"
            value={editedEntity['Entity Type'] || ''}
            onChange={(e) => handleChange('Entity Type', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hierarchy Level</label>
          <input
            type="number"
            value={editedEntity['Entity Hierarchy Level']}
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent ID</label>
          <input
            type="text"
            value={editedEntity['Entity parent ID'] || 'None'}
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
            disabled
          />
        </div>
      </div>

      {hasChanges && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default EntityEditor;
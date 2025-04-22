// src/AttributeEditor.tsx
import React, { useState, useEffect } from 'react';
import { Key, Copy, Trash2, Save } from 'lucide-react';
import { Attribute } from './types';

interface AttributeEditorProps {
  attributes: Attribute[];
  selectedAttribute: Attribute | null;
  onSelect: (attribute: Attribute | null) => void;
  onUpdate: (attributeId: number, updates: Partial<Attribute>) => void;
  onDelete: (attributeId: number) => void;
  onCopy: (attributeId: number) => void;
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({
  attributes,
  selectedAttribute,
  onSelect,
  onUpdate,
  onDelete,
  onCopy
}) => {
  const [editedAttribute, setEditedAttribute] = useState<Attribute | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (selectedAttribute) {
      setEditedAttribute(selectedAttribute);
      setHasChanges(false);
    } else {
      setEditedAttribute(null);
    }
  }, [selectedAttribute]);

  const handleChange = (field: keyof Attribute, value: any) => {
    if (editedAttribute) {
      setEditedAttribute({ ...editedAttribute, [field]: value });
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    if (editedAttribute && selectedAttribute) {
      const changes: Partial<Attribute> = {};
      
      if (editedAttribute['Attribute Name'] !== selectedAttribute['Attribute Name']) {
        changes['Attribute Name'] = editedAttribute['Attribute Name'];
      }
      if (editedAttribute['Attribute Description'] !== selectedAttribute['Attribute Description']) {
        changes['Attribute Description'] = editedAttribute['Attribute Description'];
      }
      if (editedAttribute['PrimaryKey'] !== selectedAttribute['PrimaryKey']) {
        changes['PrimaryKey'] = editedAttribute['PrimaryKey'];
      }
      if (editedAttribute['Attribute System'] !== selectedAttribute['Attribute System']) {
        changes['Attribute System'] = editedAttribute['Attribute System'];
      }
      
      if (Object.keys(changes).length > 0) {
        onUpdate(selectedAttribute['Attribute ID'], changes);
        setHasChanges(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Key</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attributes.map((attribute) => (
              <tr
                key={attribute['Attribute ID']}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedAttribute?.['Attribute ID'] === attribute['Attribute ID'] ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelect(attribute)}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{attribute['Attribute ID']}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{attribute['Attribute Name']}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{attribute['Attribute System'] || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  {attribute['PrimaryKey'] === 'Yes' ? (
                    <Key className="inline-block h-4 w-4 text-yellow-500" />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy(attribute['Attribute ID']);
                    }}
                    className="text-green-600 hover:text-green-900 mr-2"
                    title="Copy attribute"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(attribute['Attribute ID']);
                    }}
                    className="text-red-600 hover:text-red-900"
                    title="Delete attribute"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editedAttribute && (
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="text-lg font-medium">Edit Attribute</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attribute ID</label>
              <input
                type="text"
                value={editedAttribute['Attribute ID']}
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attribute Name</label>
              <input
                type="text"
                value={editedAttribute['Attribute Name']}
                onChange={(e) => handleChange('Attribute Name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editedAttribute['Attribute Description'] || ''}
              onChange={(e) => handleChange('Attribute Description', e.target.value || null)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attribute System</label>
              <input
                type="text"
                value={editedAttribute['Attribute System']}
                onChange={(e) => handleChange('Attribute System', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Key</label>
              <select
                value={editedAttribute['PrimaryKey']}
                onChange={(e) => handleChange('PrimaryKey', e.target.value as 'Yes' | 'No')}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
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
      )}
    </div>
  );
};

export default AttributeEditor;
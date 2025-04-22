// src/components/EntityHierarchyEditor.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileDown, PlusCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { parseEntityHierarchy, EntityParseError } from '../../utils/json/parser';
import { 
  addEntity, 
  copyEntity, 
  deleteEntity, 
  updateEntity,
  addAttribute,
  deleteAttribute,
  updateAttribute,
  copyAttribute,
  exportToJSON
} from '../../utils/operations/entityOperations';
import { Entity, Attribute } from '../../types/entity';
import EntityTree from './EntityTree';
import EntityEditor from './EntityEditor';
import AttributeEditor from './AttributeEditor';
import SearchComponent from './SearchComponent';
import { findMatchingEntities } from '../../utils/search';

interface EntityHierarchyEditorProps {
  initialData?: Entity[];
}

const EntityHierarchyEditor: React.FC<EntityHierarchyEditorProps> = ({ initialData = [] }) => {
  const [entities, setEntities] = useState<Entity[]>(initialData);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Entity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Search logic
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = findMatchingEntities(entities, searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, entities]);

  // File handling
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsedData = await parseEntityHierarchy(file);
      setEntities(parsedData);
      setError(null);
      setUnsavedChanges(false);
    } catch (err) {
      if (err instanceof EntityParseError) {
        setError(err.message);
      } else {
        setError('Failed to load file');
      }
    }
  };

  // Drag and drop handling
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      try {
        const parsedData = await parseEntityHierarchy(file);
        setEntities(parsedData);
        setError(null);
        setUnsavedChanges(false);
      } catch (err) {
        if (err instanceof EntityParseError) {
          setError(err.message);
        } else {
          setError('Failed to load file');
        }
      }
    } else {
      setError('Please upload a JSON file');
    }
  }, []);

  // Entity operations
  const handleAddEntity = (parentId: number | null) => {
    const newEntity = addEntity(entities, parentId);
    setEntities([...entities, newEntity]);
    setSelectedEntity(newEntity);
    setUnsavedChanges(true);
  };

  const handleCopyEntity = (entityId: number) => {
    const copiedEntity = copyEntity(entities, entityId);
    if (copiedEntity) {
      setEntities([...entities, copiedEntity]);
      setSelectedEntity(copiedEntity);
      setUnsavedChanges(true);
    }
  };

  const handleDeleteEntity = (entityId: number) => {
    if (window.confirm('Are you sure you want to delete this entity and all its children?')) {
      const updatedEntities = deleteEntity(entities, entityId);
      setEntities(updatedEntities);
      if (selectedEntity?.['Entity ID'] === entityId) {
        setSelectedEntity(null);
      }
      setUnsavedChanges(true);
    }
  };

  const handleUpdateEntity = (entityId: number, updates: Partial<Entity>) => {
    const updatedEntities = updateEntity(entities, entityId, updates);
    setEntities(updatedEntities);
    if (selectedEntity?.['Entity ID'] === entityId) {
      setSelectedEntity({ ...selectedEntity, ...updates });
    }
    setUnsavedChanges(true);
  };

  // Attribute operations
  const handleAddAttribute = () => {
    if (!selectedEntity) return;
    const newAttribute = addAttribute(selectedEntity, entities);
    const updatedAttributes = [...selectedEntity.Attributes, newAttribute];
    handleUpdateEntity(selectedEntity['Entity ID'], { Attributes: updatedAttributes });
  };

  const handleDeleteAttribute = (attributeId: number) => {
    if (!selectedEntity) return;
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      const updatedAttributes = deleteAttribute(selectedEntity, attributeId);
      handleUpdateEntity(selectedEntity['Entity ID'], { Attributes: updatedAttributes });
    }
  };

  const handleUpdateAttribute = (attributeId: number, updates: Partial<Attribute>) => {
    if (!selectedEntity) return;
    const updatedAttributes = updateAttribute(selectedEntity, attributeId, updates);
    handleUpdateEntity(selectedEntity['Entity ID'], { Attributes: updatedAttributes });
  };

  const handleCopyAttribute = (attributeId: number) => {
    if (!selectedEntity) return;
    const copiedAttribute = copyAttribute(selectedEntity, attributeId, entities);
    if (copiedAttribute) {
      const updatedAttributes = [...selectedEntity.Attributes, copiedAttribute];
      handleUpdateEntity(selectedEntity['Entity ID'], { Attributes: updatedAttributes });
    }
  };

  // Export functionality
  const handleExport = () => {
    const jsonString = exportToJSON(entities);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'entity_hierarchy.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setUnsavedChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Entity Hierarchy Editor</h1>
          <p className="text-gray-600">Manage and edit your entity hierarchy structure</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {unsavedChanges && (
          <Alert className="mb-6">
            <AlertTitle>Unsaved Changes</AlertTitle>
            <AlertDescription>
              You have unsaved changes. Don't forget to export your data.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Entity Tree and Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Entity Structure</h2>
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Load JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {entities.length > 0 && (
                    <button
                      onClick={handleExport}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  )}
                </div>
              </div>
              
              {entities.length === 0 ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDragIn}
                  onDragLeave={handleDragOut}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your JSON file here, or click to browse
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-blue-500 hover:text-blue-600">Choose a file</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <SearchComponent onSearch={setSearchQuery} />
                  </div>
                  <div className="mb-4">
                    <button
                      onClick={() => handleAddEntity(null)}
                      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Root Entity
                    </button>
                  </div>
                  <EntityTree
                    entities={entities}
                    selectedEntity={selectedEntity}
                    onSelect={setSelectedEntity}
                    searchQuery={searchQuery}
                    onAdd={handleAddEntity}
                    onCopy={handleCopyEntity}
                    onDelete={handleDeleteEntity}
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Right Panel - Entity Details and Attributes */}
          <div className="lg:col-span-2">
            {selectedEntity && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-6">Entity Details</h2>
                  <EntityEditor
                    entity={selectedEntity}
                    onUpdate={(updates) => handleUpdateEntity(selectedEntity['Entity ID'], updates)}
                  />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Attributes</h2>
                    <button
                      onClick={handleAddAttribute}
                      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Attribute
                    </button>
                  </div>
                  <AttributeEditor
                    attributes={selectedEntity.Attributes}
                    selectedAttribute={selectedAttribute}
                    onSelect={setSelectedAttribute}
                    onUpdate={handleUpdateAttribute}
                    onDelete={handleDeleteAttribute}
                    onCopy={handleCopyAttribute}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityHierarchyEditor;
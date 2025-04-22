// src/components/forms/EntityForm/index.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Entity, EntitySystem } from '../../../types/entity';
import { EntityFormSchema } from '../../../utils/validation/schemas';
import { useAppContext } from '../../../context/AppContext';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import {
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  CheckboxLabel,
  Checkbox,
  ErrorMessage,
  FormActions
} from '../../common/Form/FormElements';

interface EntityFormProps {
  isOpen: boolean;
  onClose: () => void;
  entity?: Entity;
}

interface EntityFormData {
  'Entity Name': string;
  'Entity Description': string | null;
  'Entity System': EntitySystem;
  'Entity Type': string | null;
  'Entity parent ID': number | null;
  'referenceData'?: boolean;
}

const EntityForm: React.FC<EntityFormProps> = ({ isOpen, onClose, entity }) => {
  const { entities, addEntity, updateEntity } = useAppContext();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EntityFormData>({
    resolver: zodResolver(EntityFormSchema),
    defaultValues: entity ? {
      'Entity Name': entity['Entity Name'],
      'Entity Description': entity['Entity Description'],
      'Entity System': entity['Entity System'] as EntitySystem,
      'Entity Type': entity['Entity Type'],
      'Entity parent ID': entity['Entity parent ID'],
      'referenceData': entity['Entity Type'] === 'Reference Data Table'
    } : {
      'Entity Name': '',
      'Entity Description': '',
      'Entity System': 'EAM' as EntitySystem,
      'Entity Type': 'Standard Entity',
      'Entity parent ID': null,
      'referenceData': false
    }
  });

  const onSubmit = handleSubmit((data: EntityFormData) => {
    if (entity) {
      updateEntity(entity.id, data);
    } else {
      addEntity({
        ...data,
        'Entity Hierarchy Level': data['Entity parent ID'] 
          ? (entities.find(e => e['Entity ID'] === data['Entity parent ID'])?.['Entity Hierarchy Level'] || 0) + 1 
          : 1,
        'Entity child ID': []
      });
    }
    reset();
    onClose();
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={entity ? 'Edit Entity' : 'Add Entity'}
    >
      <form onSubmit={onSubmit}>
        <FormGroup>
          <Label htmlFor="entityName">Entity Name</Label>
          <Input
            id="entityName"
            {...register('Entity Name')}
            placeholder="Enter entity name"
          />
          {errors['Entity Name'] && (
            <ErrorMessage>{errors['Entity Name'].message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="entityDescription">Description</Label>
          <TextArea
            id="entityDescription"
            {...register('Entity Description')}
            placeholder="Enter entity description"
          />
          {errors['Entity Description'] && (
            <ErrorMessage>{errors['Entity Description'].message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="entitySystem">System</Label>
          <Select id="entitySystem" {...register('Entity System')}>
            <option value="EAM">EAM</option>
            <option value="iPen">iPen</option>
            <option value="GIS-WN">GIS-WN</option>
            <option value="Both">Both</option>
          </Select>
          {errors['Entity System'] && (
            <ErrorMessage>{errors['Entity System'].message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="parentEntity">Parent Entity</Label>
          <Select id="parentEntity" {...register('Entity parent ID', { valueAsNumber: true })}>
            <option value="">None</option>
            {entities.map(e => (
              <option key={e.id} value={e['Entity ID']}>
                {e['Entity Name']}
              </option>
            ))}
          </Select>
          {errors['Entity parent ID'] && (
            <ErrorMessage>{errors['Entity parent ID'].message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <CheckboxLabel>
            <Checkbox {...register('referenceData')} />
            Reference Data
          </CheckboxLabel>
        </FormGroup>

        <FormActions>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            {entity ? 'Update' : 'Create'}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
};

export default EntityForm;
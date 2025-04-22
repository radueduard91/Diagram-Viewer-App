// src/components/forms/AttributeForm/index.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Attribute } from '../../../types/entity';
import { AttributeFormSchema } from '../../../utils/validation/schemas';
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

interface AttributeFormProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  attribute?: Attribute;
}

interface AttributeFormData {
  'Attribute Name': string;
  'Attribute Description': string | null;
  'PrimaryKey': 'Yes' | 'No';
  'Attribute System': string;
  'Part Of Parent ID': number;
  'Data Type'?: string;
  'Nullable'?: boolean;
}

const AttributeForm: React.FC<AttributeFormProps> = ({
  isOpen,
  onClose,
  entityId,
  attribute
}) => {
  const { entities, addAttribute, updateAttribute } = useAppContext();
  const entity = entities.find(e => e.id === entityId);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AttributeFormData>({
    resolver: zodResolver(AttributeFormSchema),
    defaultValues: attribute || {
      'Attribute Name': '',
      'Attribute Description': '',
      'PrimaryKey': 'No',
      'Attribute System': entity?.['Entity System'] || 'EAM',
      'Part Of Parent ID': entity?.['Entity ID'] || 0,
      'Data Type': 'String',
      'Nullable': true
    }
  });

  const onSubmit = (data: AttributeFormData) => {
    if (attribute) {
      updateAttribute(entityId, attribute.id, data);
    } else {
      addAttribute(entityId, data);
    }
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={attribute ? 'Edit Attribute' : 'Add Attribute'}
      size="small"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="attributeName">Attribute Name</Label>
          <Input
            id="attributeName"
            {...register('Attribute Name')}
            placeholder="Enter attribute name"
          />
          {errors['Attribute Name'] && (
            <ErrorMessage>{errors['Attribute Name'].message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="attributeDescription">Description</Label>
          <TextArea
            id="attributeDescription"
            {...register('Attribute Description')}
            placeholder="Enter attribute description"
          />
          {errors['Attribute Description'] && (
            <ErrorMessage>{errors['Attribute Description'].message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="attributeSystem">System</Label>
          <Select id="attributeSystem" {...register('Attribute System')}>
            <option value="EAM">EAM</option>
            <option value="iPen">iPen</option>
            <option value="GIS-WN">GIS-WN</option>
            <option value="attribute missmatch">Attribute Mismatch</option>
          </Select>
          {errors['Attribute System'] && (
            <ErrorMessage>{errors['Attribute System'].message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="primaryKey">Primary Key</Label>
          <Select id="primaryKey" {...register('PrimaryKey')}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </Select>
          {errors['PrimaryKey'] && (
            <ErrorMessage>{errors['PrimaryKey'].message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="dataType">Data Type</Label>
          <Select id="dataType" {...register('Data Type')}>
            <option value="String">String</option>
            <option value="Number">Number</option>
            <option value="Boolean">Boolean</option>
            <option value="Date">Date</option>
            <option value="Object">Object</option>
            <option value="Array">Array</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <CheckboxLabel>
            <Checkbox {...register('Nullable')} />
            Nullable
          </CheckboxLabel>
        </FormGroup>

        <FormActions>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            {attribute ? 'Update' : 'Create'}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
};

export default AttributeForm;
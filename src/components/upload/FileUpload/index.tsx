// src/components/upload/FileUpload/index.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { useAppContext } from '../../../context/AppContext';
import { parseEntityHierarchy, EntityParseError } from '../../../utils/json/parser';
import Button from '../../common/Button';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xxl};
  height: 100%;
`;

const DropzoneArea = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive 
    ? props.theme.colors.status.info 
    : props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xxl};
  width: 100%;
  max-width: 600px;
  text-align: center;
  background-color: ${props => props.isDragActive 
    ? props.theme.colors.ipen.light 
    : props.theme.colors.background.secondary};
  transition: ${props => props.theme.transitions.default};
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.status.info};
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.status.info};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const Title = styled.h2`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.type === 'success' 
    ? props.theme.colors.status.success 
    : props.theme.colors.status.error}20;
  color: ${props => props.type === 'success' 
    ? props.theme.colors.status.success 
    : props.theme.colors.status.error};
`;

const FileUpload: React.FC = () => {
  const { setEntities, setLoading, setError } = useAppContext();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.type !== 'application/json') {
      setMessage({ type: 'error', text: 'Please upload a JSON file' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const entities = await parseEntityHierarchy(file);
      setEntities(entities);
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
    } catch (error) {
      if (error instanceof EntityParseError) {
        setError(error.message);
        setMessage({ type: 'error', text: error.message });
      } else {
        setError('Failed to parse file');
        setMessage({ type: 'error', text: 'Failed to parse file' });
      }
    } finally {
      setLoading(false);
    }
  }, [setEntities, setLoading, setError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: false
  });

  return (
    <UploadContainer>
      <DropzoneArea {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <UploadIcon>📤</UploadIcon>
        <Title>Upload Entity Hierarchy</Title>
        <Description>
          {isDragActive
            ? 'Drop the JSON file here...'
            : 'Drag and drop a JSON file here, or click to select'}
        </Description>
        <Button variant="secondary">Select File</Button>
      </DropzoneArea>
      {message && (
        <Message type={message.type}>{message.text}</Message>
      )}
    </UploadContainer>
  );
};

export default FileUpload;
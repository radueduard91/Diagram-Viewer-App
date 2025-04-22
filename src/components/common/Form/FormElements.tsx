// src/components/common/Form/FormElements.tsx
import styled from 'styled-components';

export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.border.focus};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.border.focus}40;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.light};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.border.focus};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.border.focus}40;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.light};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};
  background-color: ${props => props.theme.colors.background.primary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.border.focus};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.border.focus}40;
  }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: ${props => props.theme.spacing.sm};
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
`;

export const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.status.error};
  font-size: 0.875rem;
  margin-top: ${props => props.theme.spacing.xs};
  display: block;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
  padding-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border.default};
`;
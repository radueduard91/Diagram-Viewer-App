// src/components/common/Button/index.tsx
import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const getVariantStyles = (variant: ButtonVariant, theme: any) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.status.info};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.ipen.secondary};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.background.secondary};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.border.default};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.background.hover};
        }
      `;
    case 'danger':
      return css`
        background-color: ${theme.colors.status.error};
        color: white;
        &:hover:not(:disabled) {
          background-color: #dc2626;
        }
      `;
    case 'warning':
      return css`
        background-color: ${theme.colors.status.warning};
        color: white;
        &:hover:not(:disabled) {
          background-color: #d97706;
        }
      `;
    case 'info':
      return css`
        background-color: ${theme.colors.status.info};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.ipen.secondary};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize, theme: any) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: 0.875rem;
      `;
    case 'medium':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: 1rem;
      `;
    case 'large':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: 1.125rem;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  transition: ${props => props.theme.transitions.default};
  cursor: pointer;
  position: relative;
  
  ${props => getVariantStyles(props.variant || 'primary', props.theme)}
  ${props => getSizeStyles(props.size || 'medium', props.theme)}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.border.focus}40;
  }
`;

const LoadingSpinner = styled.span`
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      <span style={{ opacity: isLoading ? 0 : 1 }}>{children}</span>
    </StyledButton>
  );
};

export default Button;
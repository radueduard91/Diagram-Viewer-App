// src/pages/NotFound/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
`;

const Message = styled.p`
  font-size: 1.25rem;
  margin-bottom: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

const HomeLink = styled(Link)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.status.info};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: ${props => props.theme.transitions.default};

  &:hover {
    background-color: ${props => props.theme.colors.ipen.secondary};
  }
`;

const NotFound: React.FC = () => {
  return (
    <Container>
      <Title>404</Title>
      <Message>Page not found</Message>
      <HomeLink to="/">Return to Dashboard</HomeLink>
    </Container>
  );
};

export default NotFound;
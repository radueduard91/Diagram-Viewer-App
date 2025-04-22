// src/pages/Dashboard/index.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import FileUpload from '../../components/upload/FileUpload';
import Button from '../../components/common/Button';
import { Entity, Attribute } from '../../types/entity';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: 300px;
  height: 100%;
  background-color: ${props => props.theme.colors.background.primary};
  border-right: 1px solid ${props => props.theme.colors.border.default};
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const MainContent = styled.main`
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const SidebarHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h2`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Stats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatItem = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  flex: 1;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Dashboard: React.FC = () => {
  const { entities, loading, error } = useAppContext();
  const [showEntityForm, setShowEntityForm] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();

  // Calculate statistics
  const entityCount = entities.length;
  const attributeCount = entities.reduce((acc, entity) => acc + entity.Attributes.length, 0);

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <Title>Entity Explorer</Title>
        </SidebarHeader>

        {entities.length > 0 && (
          <>
            <Stats>
              <StatItem>
                <StatValue>{entityCount}</StatValue>
                <StatLabel>Entities</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{attributeCount}</StatValue>
                <StatLabel>Attributes</StatLabel>
              </StatItem>
            </Stats>

            <Actions>
              <Button onClick={() => setShowEntityForm(true)}>
                Add Entity
              </Button>
              <Button variant="secondary">
                Export JSON
              </Button>
            </Actions>
          </>
        )}
      </Sidebar>

      <MainContent>
        {entities.length === 0 ? (
          <FileUpload />
        ) : (
          <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <p>Entity diagram will be displayed here.</p>
          </div>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
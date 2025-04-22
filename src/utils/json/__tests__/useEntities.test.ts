// src/hooks/__tests__/useEntities.test.ts
import { renderHook, act } from '@testing-library/react';
import { useEntities } from '../useEntities';

describe('useEntities Hook', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useEntities());
    
    expect(result.current.entities).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.filter).toEqual({});
  });

  it('should add an entity', () => {
    const { result } = renderHook(() => useEntities());
    
    act(() => {
      result.current.addEntity({
        'Entity Name': 'Test Entity',
        'Entity System': 'EAM'
      });
    });
    
    expect(result.current.entities).toHaveLength(1);
    expect(result.current.entities[0]['Entity Name']).toBe('Test Entity');
  });

  it('should update an entity', () => {
    const { result } = renderHook(() => useEntities());
    
    act(() => {
      const entity = result.current.addEntity({
        'Entity Name': 'Test Entity',
        'Entity System': 'EAM'
      });
      result.current.updateEntity(entity.id, { 'Entity Name': 'Updated Entity' });
    });
    
    expect(result.current.entities[0]['Entity Name']).toBe('Updated Entity');
  });

  it('should delete an entity', () => {
    const { result } = renderHook(() => useEntities());
    
    act(() => {
      const entity = result.current.addEntity({
        'Entity Name': 'Test Entity',
        'Entity System': 'EAM'
      });
      result.current.deleteEntity(entity.id);
    });
    
    expect(result.current.entities).toHaveLength(0);
  });

  it('should filter entities by system', () => {
    const { result } = renderHook(() => useEntities());
    
    act(() => {
      result.current.addEntity({
        'Entity Name': 'EAM Entity',
        'Entity System': 'EAM'
      });
      result.current.addEntity({
        'Entity Name': 'iPen Entity',
        'Entity System': 'iPen'
      });
      result.current.setFilter({ system: 'EAM' });
    });
    
    expect(result.current.filteredEntities).toHaveLength(1);
    expect(result.current.filteredEntities[0]['Entity System']).toBe('EAM');
  });

  it('should filter entities by search term', () => {
    const { result } = renderHook(() => useEntities());
    
    act(() => {
      result.current.addEntity({
        'Entity Name': 'Test Entity One',
        'Entity System': 'EAM'
      });
      result.current.addEntity({
        'Entity Name': 'Test Entity Two',
        'Entity System': 'iPen'
      });
      result.current.setFilter({ searchTerm: 'One' });
    });
    
    expect(result.current.filteredEntities).toHaveLength(1);
    expect(result.current.filteredEntities[0]['Entity Name']).toBe('Test Entity One');
  });
});
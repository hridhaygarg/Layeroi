import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProspects, useCreateProspect, useUpdateProspect, useDeleteProspect, useBulkImportProspects } from '../useProspects';
import * as prospectApi from '../../api/prospectApi';

// Mock the API module
jest.mock('../../api/prospectApi');

// Setup QueryClient wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProspects Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('useProspects Query', () => {
    it('should fetch prospects with default parameters', async () => {
      const mockData = {
        prospects: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        ],
        total: 2,
      };

      prospectApi.fetchProspects.mockResolvedValueOnce(mockData);

      const { result } = renderHook(
        () => useProspects({ page: 1, limit: 10 }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(prospectApi.fetchProspects).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: {},
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    });

    it('should handle errors when fetching prospects', async () => {
      const error = new Error('Network error');
      prospectApi.fetchProspects.mockRejectedValueOnce(error);

      const { result } = renderHook(
        () => useProspects({ page: 1, limit: 10 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error.message).toBe('Network error');
    });

    it('should fetch prospects with filters and sorting', async () => {
      const mockData = {
        prospects: [{ id: 1, name: 'John Doe', status: 'active' }],
        total: 1,
      };

      prospectApi.fetchProspects.mockResolvedValueOnce(mockData);

      const { result } = renderHook(
        () =>
          useProspects({
            page: 1,
            limit: 20,
            filters: { status: 'active' },
            sortBy: 'name',
            sortOrder: 'asc',
          }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(prospectApi.fetchProspects).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        filters: { status: 'active' },
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });
  });

  describe('useCreateProspect Mutation', () => {
    it('should create a prospect', async () => {
      const newProspect = { name: 'John Doe', email: 'john@example.com' };
      const createdProspect = { id: 1, ...newProspect };

      prospectApi.createProspect.mockResolvedValueOnce(createdProspect);

      const { result } = renderHook(() => useCreateProspect(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      act(() => {
        result.current.mutate(newProspect);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdProspect);
      expect(prospectApi.createProspect).toHaveBeenCalledWith(newProspect);
    });

    it('should handle creation error', async () => {
      const error = new Error('Validation error');
      prospectApi.createProspect.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateProspect(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ name: 'John' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error.message).toBe('Validation error');
    });
  });

  describe('useUpdateProspect Mutation', () => {
    it('should update a prospect', async () => {
      const updates = { id: 1, name: 'Jane Doe', email: 'jane@example.com' };
      prospectApi.updateProspect.mockResolvedValueOnce(updates);

      const { result } = renderHook(() => useUpdateProspect(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(updates);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updates);
      expect(prospectApi.updateProspect).toHaveBeenCalledWith(updates);
    });

    it('should handle update error', async () => {
      const error = new Error('Update failed');
      prospectApi.updateProspect.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateProspect(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ id: 1, name: 'Jane' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error.message).toBe('Update failed');
    });
  });

  describe('useDeleteProspect Mutation', () => {
    it('should delete a prospect', async () => {
      prospectApi.deleteProspect.mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() => useDeleteProspect(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(prospectApi.deleteProspect).toHaveBeenCalledWith(1);
    });

    it('should handle deletion error', async () => {
      const error = new Error('Delete failed');
      prospectApi.deleteProspect.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteProspect(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error.message).toBe('Delete failed');
    });
  });

  describe('useBulkImportProspects Mutation', () => {
    it('should bulk import prospects', async () => {
      const bulkData = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
      ];
      const response = { imported: 2, failed: 0 };

      prospectApi.bulkImportProspects.mockResolvedValueOnce(response);

      const { result } = renderHook(() => useBulkImportProspects(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(bulkData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(response);
      expect(prospectApi.bulkImportProspects).toHaveBeenCalledWith(bulkData);
    });

    it('should handle bulk import error', async () => {
      const error = new Error('Import failed');
      prospectApi.bulkImportProspects.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useBulkImportProspects(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate([]);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error.message).toBe('Import failed');
    });
  });
});

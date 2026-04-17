import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as prospectApi from '../api/prospectApi';
import { useProspectStore } from '../stores/prospectStore';

const STALE_TIME = 20 * 1000; // 20 seconds
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * useProspects - Query hook for fetching prospects with pagination, filters, and sorting
 */
export const useProspects = ({
  page = 1,
  limit = 10,
  filters = {},
  sortBy = 'createdAt',
  sortOrder = 'desc',
  enabled = true,
} = {}) => {
  return useQuery({
    queryKey: ['prospects', { page, limit, filters, sortBy, sortOrder }],
    queryFn: () =>
      prospectApi.fetchProspects({
        page,
        limit,
        filters,
        sortBy,
        sortOrder,
      }),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
};

/**
 * useProspect - Query hook for fetching a single prospect
 */
export const useProspect = (id, enabled = true) => {
  return useQuery({
    queryKey: ['prospect', id],
    queryFn: () => prospectApi.getProspect(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!id && enabled,
  });
};

/**
 * useCreateProspect - Mutation hook for creating a prospect
 */
export const useCreateProspect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => prospectApi.createProspect(data),
    onSuccess: (data) => {
      // Invalidate prospects list query
      queryClient.invalidateQueries({ queryKey: ['prospects'] });

      return data;
    },
    onError: (error) => {
      console.error('Failed to create prospect:', error);
      throw error;
    },
  });
};

/**
 * useUpdateProspect - Mutation hook for updating a prospect
 */
export const useUpdateProspect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => prospectApi.updateProspect(data),
    onSuccess: (data) => {
      // Invalidate prospects list query
      queryClient.invalidateQueries({ queryKey: ['prospects'] });

      // Invalidate single prospect query
      queryClient.invalidateQueries({
        queryKey: ['prospect', data.id],
      });

      return data;
    },
    onError: (error) => {
      console.error('Failed to update prospect:', error);
      throw error;
    },
  });
};

/**
 * useDeleteProspect - Mutation hook for deleting a prospect
 */
export const useDeleteProspect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => prospectApi.deleteProspect(id),
    onSuccess: () => {
      // Invalidate prospects list query
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
    onError: (error) => {
      console.error('Failed to delete prospect:', error);
      throw error;
    },
  });
};

/**
 * useBulkImportProspects - Mutation hook for bulk importing prospects
 */
export const useBulkImportProspects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => prospectApi.bulkImportProspects(data),
    onSuccess: (data) => {
      // Invalidate prospects list query
      queryClient.invalidateQueries({ queryKey: ['prospects'] });

      return data;
    },
    onError: (error) => {
      console.error('Failed to bulk import prospects:', error);
      throw error;
    },
  });
};

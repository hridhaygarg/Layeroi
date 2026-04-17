import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as outreachApi from '../api/outreachApi';

const STALE_TIME = 20 * 1000; // 20 seconds
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * useOutreach - Query hook for fetching outreach records
 */
export const useOutreach = ({
  page = 1,
  limit = 10,
  filters = {},
  sortBy = 'createdAt',
  sortOrder = 'desc',
  enabled = true,
} = {}) => {
  return useQuery({
    queryKey: ['outreach', { page, limit, filters, sortBy, sortOrder }],
    queryFn: () =>
      outreachApi.fetchOutreach({
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
 * useOutreachItem - Query hook for fetching a single outreach record
 */
export const useOutreachItem = (id, enabled = true) => {
  return useQuery({
    queryKey: ['outreach', id],
    queryFn: () => outreachApi.getOutreach(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!id && enabled,
  });
};

/**
 * useCreateOutreach - Mutation hook for creating outreach
 */
export const useCreateOutreach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => outreachApi.createOutreach(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
    },
    onError: (error) => {
      console.error('Failed to create outreach:', error);
      throw error;
    },
  });
};

/**
 * useUpdateOutreach - Mutation hook for updating outreach
 */
export const useUpdateOutreach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => outreachApi.updateOutreach(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
      queryClient.invalidateQueries({ queryKey: ['outreach', data.id] });
    },
    onError: (error) => {
      console.error('Failed to update outreach:', error);
      throw error;
    },
  });
};

/**
 * useDeleteOutreach - Mutation hook for deleting outreach
 */
export const useDeleteOutreach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => outreachApi.deleteOutreach(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
    },
    onError: (error) => {
      console.error('Failed to delete outreach:', error);
      throw error;
    },
  });
};

/**
 * useBulkCreateOutreach - Mutation hook for bulk creating outreach
 */
export const useBulkCreateOutreach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => outreachApi.bulkCreateOutreach(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
    },
    onError: (error) => {
      console.error('Failed to bulk create outreach:', error);
      throw error;
    },
  });
};

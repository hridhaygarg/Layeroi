import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as integrationsApi from '../api/integrationsApi';

const STALE_TIME = 30 * 1000; // 30 seconds
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * useIntegrations - Query hook for fetching all integrations
 */
export const useIntegrations = (enabled = true) => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => integrationsApi.fetchIntegrations(),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
};

/**
 * useIntegration - Query hook for fetching a single integration
 */
export const useIntegration = (id, enabled = true) => {
  return useQuery({
    queryKey: ['integration', id],
    queryFn: () => integrationsApi.getIntegration(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!id && enabled,
  });
};

/**
 * useCreateIntegration - Mutation hook for creating an integration
 */
export const useCreateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => integrationsApi.createIntegration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: (error) => {
      console.error('Failed to create integration:', error);
      throw error;
    },
  });
};

/**
 * useUpdateIntegration - Mutation hook for updating an integration
 */
export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => integrationsApi.updateIntegration(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['integration', data.id] });
    },
    onError: (error) => {
      console.error('Failed to update integration:', error);
      throw error;
    },
  });
};

/**
 * useDeleteIntegration - Mutation hook for deleting an integration
 */
export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => integrationsApi.deleteIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: (error) => {
      console.error('Failed to delete integration:', error);
      throw error;
    },
  });
};

/**
 * useTestIntegration - Mutation hook for testing an integration
 */
export const useTestIntegration = () => {
  return useMutation({
    mutationFn: (id) => integrationsApi.testIntegration(id),
    onError: (error) => {
      console.error('Failed to test integration:', error);
      throw error;
    },
  });
};

/**
 * useSyncIntegration - Mutation hook for syncing an integration
 */
export const useSyncIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => integrationsApi.syncIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: (error) => {
      console.error('Failed to sync integration:', error);
      throw error;
    },
  });
};

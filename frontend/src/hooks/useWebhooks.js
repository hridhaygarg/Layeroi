import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as webhooksApi from '../api/webhooksApi';

const STALE_TIME = 30 * 1000; // 30 seconds
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * useWebhooks - Query hook for fetching all webhooks
 */
export const useWebhooks = (enabled = true) => {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: () => webhooksApi.fetchWebhooks(),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
};

/**
 * useWebhook - Query hook for fetching a single webhook
 */
export const useWebhook = (id, enabled = true) => {
  return useQuery({
    queryKey: ['webhook', id],
    queryFn: () => webhooksApi.getWebhook(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!id && enabled,
  });
};

/**
 * useCreateWebhook - Mutation hook for creating a webhook
 */
export const useCreateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => webhooksApi.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
    onError: (error) => {
      console.error('Failed to create webhook:', error);
      throw error;
    },
  });
};

/**
 * useUpdateWebhook - Mutation hook for updating a webhook
 */
export const useUpdateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => webhooksApi.updateWebhook(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      queryClient.invalidateQueries({ queryKey: ['webhook', data.id] });
    },
    onError: (error) => {
      console.error('Failed to update webhook:', error);
      throw error;
    },
  });
};

/**
 * useDeleteWebhook - Mutation hook for deleting a webhook
 */
export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => webhooksApi.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
    onError: (error) => {
      console.error('Failed to delete webhook:', error);
      throw error;
    },
  });
};

/**
 * useTestWebhook - Mutation hook for testing a webhook
 */
export const useTestWebhook = () => {
  return useMutation({
    mutationFn: (id) => webhooksApi.testWebhook(id),
    onError: (error) => {
      console.error('Failed to test webhook:', error);
      throw error;
    },
  });
};

/**
 * useWebhookLogs - Query hook for fetching webhook logs
 */
export const useWebhookLogs = (id, enabled = true) => {
  return useQuery({
    queryKey: ['webhookLogs', id],
    queryFn: () => webhooksApi.getWebhookLogs(id),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: CACHE_TIME,
    enabled: !!id && enabled,
  });
};

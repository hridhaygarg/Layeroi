import apiClient from './client';

export const fetchWebhooks = async () => {
  const response = await apiClient.get('/webhooks');
  return response.data;
};

export const getWebhook = async (id) => {
  const response = await apiClient.get(`/webhooks/${id}`);
  return response.data;
};

export const createWebhook = async (data) => {
  const response = await apiClient.post('/webhooks', data);
  return response.data;
};

export const updateWebhook = async (data) => {
  const { id, ...updateData } = data;
  const response = await apiClient.put(`/webhooks/${id}`, updateData);
  return response.data;
};

export const deleteWebhook = async (id) => {
  const response = await apiClient.delete(`/webhooks/${id}`);
  return response.data;
};

export const testWebhook = async (id) => {
  const response = await apiClient.post(`/webhooks/${id}/test`);
  return response.data;
};

export const getWebhookLogs = async (id) => {
  const response = await apiClient.get(`/webhooks/${id}/logs`);
  return response.data;
};

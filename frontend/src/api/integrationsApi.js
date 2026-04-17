import apiClient from './client';

export const fetchIntegrations = async () => {
  const response = await apiClient.get('/integrations');
  return response.data;
};

export const getIntegration = async (id) => {
  const response = await apiClient.get(`/integrations/${id}`);
  return response.data;
};

export const createIntegration = async (data) => {
  const response = await apiClient.post('/integrations', data);
  return response.data;
};

export const updateIntegration = async (data) => {
  const { id, ...updateData } = data;
  const response = await apiClient.put(`/integrations/${id}`, updateData);
  return response.data;
};

export const deleteIntegration = async (id) => {
  const response = await apiClient.delete(`/integrations/${id}`);
  return response.data;
};

export const testIntegration = async (id) => {
  const response = await apiClient.post(`/integrations/${id}/test`);
  return response.data;
};

export const syncIntegration = async (id) => {
  const response = await apiClient.post(`/integrations/${id}/sync`);
  return response.data;
};

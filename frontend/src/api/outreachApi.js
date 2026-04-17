import apiClient from './client';

export const fetchOutreach = async ({
  page = 1,
  limit = 10,
  filters = {},
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(`filter[${key}]`, value);
    }
  });

  const response = await apiClient.get(`/outreach?${params.toString()}`);
  return response.data;
};

export const getOutreach = async (id) => {
  const response = await apiClient.get(`/outreach/${id}`);
  return response.data;
};

export const createOutreach = async (data) => {
  const response = await apiClient.post('/outreach', data);
  return response.data;
};

export const updateOutreach = async (data) => {
  const { id, ...updateData } = data;
  const response = await apiClient.put(`/outreach/${id}`, updateData);
  return response.data;
};

export const deleteOutreach = async (id) => {
  const response = await apiClient.delete(`/outreach/${id}`);
  return response.data;
};

export const bulkCreateOutreach = async (data) => {
  const response = await apiClient.post('/outreach/bulk', { outreach: data });
  return response.data;
};

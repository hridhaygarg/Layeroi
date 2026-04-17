import apiClient from './client';

export const fetchProspects = async ({
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

  const response = await apiClient.get(`/prospects?${params.toString()}`);
  return response.data;
};

export const getProspect = async (id) => {
  const response = await apiClient.get(`/prospects/${id}`);
  return response.data;
};

export const createProspect = async (data) => {
  const response = await apiClient.post('/prospects', data);
  return response.data;
};

export const updateProspect = async (data) => {
  const { id, ...updateData } = data;
  const response = await apiClient.put(`/prospects/${id}`, updateData);
  return response.data;
};

export const deleteProspect = async (id) => {
  const response = await apiClient.delete(`/prospects/${id}`);
  return response.data;
};

export const bulkImportProspects = async (data) => {
  const response = await apiClient.post('/prospects/bulk-import', { prospects: data });
  return response.data;
};

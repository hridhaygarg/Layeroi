import apiClient from './client';

export const fetchAnalytics = async ({
  startDate,
  endDate,
  filters = {},
}) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate.toISOString());
  if (endDate) params.append('endDate', endDate.toISOString());

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(`filter[${key}]`, value);
    }
  });

  const response = await apiClient.get(`/analytics?${params.toString()}`);
  return response.data;
};

export const fetchAnalyticsSummary = async ({
  startDate,
  endDate,
}) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate.toISOString());
  if (endDate) params.append('endDate', endDate.toISOString());

  const response = await apiClient.get(`/analytics/summary?${params.toString()}`);
  return response.data;
};

export const fetchProspectMetrics = async ({
  startDate,
  endDate,
  prospectId,
}) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate.toISOString());
  if (endDate) params.append('endDate', endDate.toISOString());
  if (prospectId) params.append('prospectId', prospectId);

  const response = await apiClient.get(`/analytics/prospect-metrics?${params.toString()}`);
  return response.data;
};

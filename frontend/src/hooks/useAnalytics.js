import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '../api/analyticsApi';

const STALE_TIME = 30 * 1000; // 30 seconds
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

// Legacy hook for backward compatibility
export default function useAnalytics(dateRange = '30d') {
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [topCompanies, setTopCompanies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRealTime, setIsRealTime] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock API response - replace with actual API call
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              metrics: {
                totalProspects: 1250,
                emailsSent: 850,
                openRate: 32.5,
                clickRate: 8.2,
              },
              chartData: [
                { date: '2024-04-10', opens: 45, clicks: 12, sends: 120 },
                { date: '2024-04-11', opens: 52, clicks: 15, sends: 135 },
                { date: '2024-04-12', opens: 48, clicks: 11, sends: 125 },
                { date: '2024-04-13', opens: 61, clicks: 18, sends: 145 },
                { date: '2024-04-14', opens: 55, clicks: 14, sends: 130 },
              ],
              topCompanies: [
                { id: 1, name: 'Acme Corp', opens: 42, clicks: 8 },
                { id: 2, name: 'TechStart Inc', opens: 38, clicks: 7 },
                { id: 3, name: 'Global Solutions', opens: 35, clicks: 6 },
              ],
            });
          }, 500);
        });

        setMetrics(response.metrics);
        setChartData(response.chartData);
        setTopCompanies(response.topCompanies);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  return {
    metrics,
    chartData,
    topCompanies,
    loading,
    error,
    isRealTime,
  };
}

/**
 * useAnalyticsData - TanStack Query hook for fetching analytics data
 */
export const useAnalyticsData = ({
  startDate,
  endDate,
  filters = {},
  enabled = true,
} = {}) => {
  return useQuery({
    queryKey: ['analytics', { startDate, endDate, filters }],
    queryFn: () =>
      analyticsApi.fetchAnalytics({
        startDate,
        endDate,
        filters,
      }),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!startDate && !!endDate && enabled,
  });
};

/**
 * useAnalyticsSummary - TanStack Query hook for fetching analytics summary
 */
export const useAnalyticsSummary = ({
  startDate,
  endDate,
  enabled = true,
} = {}) => {
  return useQuery({
    queryKey: ['analyticsSummary', { startDate, endDate }],
    queryFn: () =>
      analyticsApi.fetchAnalyticsSummary({
        startDate,
        endDate,
      }),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!startDate && !!endDate && enabled,
  });
};

/**
 * useProspectMetrics - TanStack Query hook for fetching prospect-specific metrics
 */
export const useProspectMetrics = ({
  startDate,
  endDate,
  prospectId,
  enabled = true,
} = {}) => {
  return useQuery({
    queryKey: ['prospectMetrics', { startDate, endDate, prospectId }],
    queryFn: () =>
      analyticsApi.fetchProspectMetrics({
        startDate,
        endDate,
        prospectId,
      }),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!startDate && !!endDate && !!prospectId && enabled,
  });
};

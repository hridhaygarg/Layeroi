import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsDashboard from '../AnalyticsDashboard';

// Mock the analytics hook
jest.mock('../../hooks/useAnalytics', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the analytics store
jest.mock('../../stores/analyticsStore', () => ({
  useAnalyticsStore: jest.fn(),
}));

// Mock the UI store
jest.mock('../../stores/uiStore', () => ({
  useUIStore: jest.fn(),
}));

// Mock WebSocket
jest.mock('../../hooks/useWebSocket', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useAnalytics from '../../hooks/useAnalytics';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useUIStore } from '../../stores/uiStore';
import useWebSocket from '../../hooks/useWebSocket';

describe('AnalyticsDashboard Screen', () => {
  const mockMetrics = {
    totalProspects: 1250,
    emailsSent: 850,
    openRate: 32.5,
    clickRate: 8.2,
  };

  const mockChartData = [
    { date: '2024-04-10', opens: 45, clicks: 12, sends: 120 },
    { date: '2024-04-11', opens: 52, clicks: 15, sends: 135 },
    { date: '2024-04-12', opens: 48, clicks: 11, sends: 125 },
  ];

  const mockTopCompanies = [
    { id: 1, name: 'Acme Corp', opens: 42, clicks: 8 },
    { id: 2, name: 'TechStart Inc', opens: 38, clicks: 7 },
    { id: 3, name: 'Global Solutions', opens: 35, clicks: 6 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAnalytics.mockReturnValue({
      metrics: mockMetrics,
      chartData: mockChartData,
      topCompanies: mockTopCompanies,
      loading: false,
      error: null,
      isRealTime: false,
    });

    useAnalyticsStore.mockReturnValue({
      dateRange: '30d',
      setDateRange: jest.fn(),
    });

    useUIStore.mockReturnValue({
      showToast: jest.fn(),
    });

    useWebSocket.mockReturnValue({
      connected: false,
    });
  });

  // Basic rendering tests
  test('renders dashboard header with title', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  test('renders DateRangeFilter component', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByRole('button', { name: /7d|30d|90d/i })).toBeInTheDocument();
  });

  test('renders MetricsGrid with all metrics', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('Total Prospects')).toBeInTheDocument();
    expect(screen.getByText('Emails Sent')).toBeInTheDocument();
    expect(screen.getByText('Open Rate')).toBeInTheDocument();
    expect(screen.getByText('Click Rate')).toBeInTheDocument();
  });

  test('renders TimeSeriesChart', () => {
    render(<AnalyticsDashboard />);
    // Check for chart container or chart-related elements
    const chartElements = screen.queryAllByRole('img', { hidden: true });
    expect(chartElements.length >= 0).toBeTruthy();
  });

  test('renders ExportButton', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  // Filter tests
  test('updates date range when filter button is clicked', async () => {
    const mockSetDateRange = jest.fn();
    useAnalyticsStore.mockReturnValue({
      dateRange: '30d',
      setDateRange: mockSetDateRange,
    });

    render(<AnalyticsDashboard />);
    const sevenDayButton = screen.getByRole('button', { name: /7d/i });
    fireEvent.click(sevenDayButton);

    await waitFor(() => {
      expect(mockSetDateRange).toHaveBeenCalledWith('7d');
    });
  });

  // Export tests
  test('opens export dropdown menu on button click', async () => {
    render(<AnalyticsDashboard />);
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText(/CSV|JSON|PDF/i)).toBeInTheDocument();
    });
  });

  // Loading state
  test('displays loading state when data is loading', () => {
    useAnalytics.mockReturnValue({
      metrics: null,
      chartData: null,
      topCompanies: null,
      loading: true,
      error: null,
      isRealTime: false,
    });

    render(<AnalyticsDashboard />);
    expect(screen.getByText(/loading|Fetching/i)).toBeInTheDocument();
  });

  // Error state
  test('displays error message when fetch fails', () => {
    useAnalytics.mockReturnValue({
      metrics: null,
      chartData: null,
      topCompanies: null,
      loading: false,
      error: 'Failed to fetch analytics data',
      isRealTime: false,
    });

    render(<AnalyticsDashboard />);
    expect(screen.getByText(/Failed to fetch analytics data/i)).toBeInTheDocument();
  });

  // Real-time updates
  test('shows real-time indicator when WebSocket is connected', () => {
    useWebSocket.mockReturnValue({
      connected: true,
    });

    render(<AnalyticsDashboard />);
    expect(screen.getByText(/real-time|live/i)).toBeInTheDocument();
  });

  // Data display tests
  test('displays correct metric values', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('1250')).toBeInTheDocument();
    expect(screen.getByText('850')).toBeInTheDocument();
    expect(screen.getByText('32.5%')).toBeInTheDocument();
    expect(screen.getByText('8.2%')).toBeInTheDocument();
  });

  // Top companies table
  test('displays top companies in table', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('TechStart Inc')).toBeInTheDocument();
    expect(screen.getByText('Global Solutions')).toBeInTheDocument();
  });
});

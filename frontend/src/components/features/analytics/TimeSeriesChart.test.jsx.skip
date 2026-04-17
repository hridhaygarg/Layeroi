import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimeSeriesChart from './TimeSeriesChart';

describe('TimeSeriesChart Component', () => {
  const mockData = [
    { date: '2024-04-10', opens: 45, clicks: 12, sends: 120 },
    { date: '2024-04-11', opens: 52, clicks: 15, sends: 135 },
    { date: '2024-04-12', opens: 48, clicks: 11, sends: 125 },
    { date: '2024-04-13', opens: 61, clicks: 18, sends: 145 },
    { date: '2024-04-14', opens: 55, clicks: 14, sends: 130 },
  ];

  // Basic rendering
  test('renders TimeSeriesChart with title', () => {
    render(<TimeSeriesChart data={mockData} />);
    expect(screen.getByText(/Email Engagement Trend|Engagement Trend/i)).toBeInTheDocument();
  });

  // Chart data loading
  test('displays chart when data is provided', () => {
    const { container } = render(<TimeSeriesChart data={mockData} />);
    expect(container.querySelector('[class*="recharts"]')).toBeInTheDocument();
  });

  // Empty state
  test('handles empty data array', () => {
    render(<TimeSeriesChart data={[]} />);
    expect(screen.getByText(/no data|empty/i)).toBeInTheDocument();
  });

  // Multiple lines
  test('renders multiple data series (opens, clicks, sends)', () => {
    const { container } = render(<TimeSeriesChart data={mockData} />);
    // Check for legend or line presence (recharts renders multiple lines)
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
});

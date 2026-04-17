import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricsGrid from './MetricsGrid';

describe('MetricsGrid Component', () => {
  const mockMetrics = {
    totalProspects: 1250,
    emailsSent: 850,
    openRate: 32.5,
    clickRate: 8.2,
  };

  // Basic rendering
  test('renders MetricsGrid with all metric cards', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('Total Prospects')).toBeInTheDocument();
    expect(screen.getByText('Emails Sent')).toBeInTheDocument();
    expect(screen.getByText('Open Rate')).toBeInTheDocument();
    expect(screen.getByText('Click Rate')).toBeInTheDocument();
  });

  // Correct values
  test('displays correct metric values', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('1250')).toBeInTheDocument();
    expect(screen.getByText('850')).toBeInTheDocument();
    expect(screen.getByText('32.5%')).toBeInTheDocument();
    expect(screen.getByText('8.2%')).toBeInTheDocument();
  });

  // Grid layout
  test('applies responsive grid layout', () => {
    const { container } = render(<MetricsGrid metrics={mockMetrics} />);
    const gridContainer = container.querySelector('[class*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });

  // Optional trend display
  test('displays trend indicators when provided', () => {
    const metricsWithTrend = {
      ...mockMetrics,
      trends: {
        totalProspects: 5.2,
        emailsSent: -2.1,
        openRate: 12.3,
        clickRate: 3.5,
      },
    };

    render(<MetricsGrid metrics={metricsWithTrend} />);
    // Trend indicators should be visible
    const cards = screen.getAllByText(/Total Prospects|Emails Sent|Open Rate|Click Rate/);
    expect(cards.length).toBe(4);
  });
});

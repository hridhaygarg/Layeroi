import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateRangeFilter from './DateRangeFilter';

describe('DateRangeFilter Component', () => {
  // Button selection
  test('renders filter buttons (7d, 30d, 90d)', () => {
    render(<DateRangeFilter value="30d" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: /7d/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /30d/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /90d/i })).toBeInTheDocument();
  });

  // onChange callback
  test('calls onChange when button is clicked', async () => {
    const onChange = jest.fn();
    render(<DateRangeFilter value="30d" onChange={onChange} />);

    const sevenDayButton = screen.getByRole('button', { name: /7d/i });
    fireEvent.click(sevenDayButton);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('7d');
    });
  });

  // Active button highlight
  test('highlights active button with primary color', () => {
    const { container } = render(<DateRangeFilter value="30d" onChange={jest.fn()} />);
    const thirtyDayButton = screen.getByRole('button', { name: /30d/i });

    // Check if the active button has a special class or style
    expect(thirtyDayButton).toHaveClass('active');
  });

  // Custom date range button
  test('renders custom date range button', () => {
    render(<DateRangeFilter value="30d" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: /custom|range|date/i })).toBeInTheDocument();
  });

  // Multiple clicks
  test('updates active state on subsequent clicks', async () => {
    const onChange = jest.fn();
    const { rerender } = render(<DateRangeFilter value="30d" onChange={onChange} />);

    const ninetyDayButton = screen.getByRole('button', { name: /90d/i });
    fireEvent.click(ninetyDayButton);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('90d');
    });

    // Rerender with new value
    rerender(<DateRangeFilter value="90d" onChange={onChange} />);
    expect(ninetyDayButton).toHaveClass('active');
  });
});

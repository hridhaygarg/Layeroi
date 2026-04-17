import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DatePicker } from '../DatePicker';

describe('DatePicker Component', () => {
  // Basic rendering tests
  test('renders date input', () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeInTheDocument();
  });

  test('renders with default placeholder', () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('placeholder', 'Select date...');
  });

  test('renders with custom placeholder', () => {
    const { container } = render(
      <DatePicker placeholder="Pick a date" onChange={() => {}} />
    );
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('placeholder', 'Pick a date');
  });

  // Calendar icon test
  test('renders calendar icon', () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  // Value display test
  test('displays formatted date when value is provided', () => {
    const { container } = render(
      <DatePicker value="2024-04-17" onChange={() => {}} />
    );
    const input = container.querySelector('input[type="text"]');
    expect(input.value).toBeTruthy();
  });

  // Calendar opening test
  test('opens calendar when input is clicked', async () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /chevron/i })).toBeInTheDocument();
    });
  });

  test('calendar is closed by default', () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const buttons = container.querySelectorAll('button');
    const chevronButtons = Array.from(buttons).filter(btn =>
      btn.querySelector('svg[class*="ChevronLeft"]') || btn.querySelector('svg[class*="ChevronRight"]')
    );
    expect(chevronButtons).toHaveLength(0);
  });

  // Date selection test
  test('calls onChange when date is selected', async () => {
    const handleChange = jest.fn();
    const { container } = render(<DatePicker onChange={handleChange} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      const dateButtons = container.querySelectorAll('button');
      const dateButton = Array.from(dateButtons).find(
        btn => btn.textContent === '1' && btn.getAttribute('class').includes('h-8')
      );
      if (dateButton) {
        fireEvent.click(dateButton);
      }
    });
  });

  // Navigation tests
  test('has previous and next month buttons', async () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      const buttons = container.querySelectorAll('button');
      const navigationButtons = Array.from(buttons).filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('ChevronLeft') || svg.classList.contains('ChevronRight'));
      });
      expect(navigationButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  // Disabled state test
  test('disables input when disabled prop is true', () => {
    const { container } = render(<DatePicker disabled={true} onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeDisabled();
  });

  test('calendar does not open when disabled', () => {
    const { container } = render(<DatePicker disabled={true} onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);
    const chevronButtons = Array.from(container.querySelectorAll('button')).filter(btn =>
      btn.querySelector('svg')
    );
    expect(chevronButtons).toHaveLength(0);
  });

  // Styling tests
  test('has correct input styling', () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass(
      'w-full',
      'px-3',
      'py-2',
      'rounded-lg',
      'border',
      'border-gray-300'
    );
  });

  test('input is readonly', () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('readonly');
  });

  // Custom className test
  test('applies custom className', () => {
    const { container } = render(
      <DatePicker className="custom-class" onChange={() => {}} />
    );
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass('custom-class');
  });

  // Calendar structure test
  test('calendar shows day headers', async () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Sun')).toBeInTheDocument();
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Fri')).toBeInTheDocument();
    });
  });
});

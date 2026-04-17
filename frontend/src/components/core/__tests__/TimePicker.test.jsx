import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimePicker } from '../TimePicker';

describe('TimePicker Component', () => {
  // Basic rendering tests
  test('renders time input', () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeInTheDocument();
  });

  test('renders with default placeholder', () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('placeholder', 'Select time...');
  });

  test('renders with custom placeholder', () => {
    const { container } = render(
      <TimePicker placeholder="Pick a time" onChange={() => {}} />
    );
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('placeholder', 'Pick a time');
  });

  // Clock icon test
  test('renders clock icon', () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  // Value display test
  test('displays time when value is provided', () => {
    const { container } = render(
      <TimePicker value="14:30" onChange={() => {}} />
    );
    const input = container.querySelector('input[type="text"]');
    expect(input.value).toBe('14:30');
  });

  // Picker opening test
  test('opens time picker when input is clicked', async () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Hours')).toBeInTheDocument();
      expect(screen.getByText('Minutes')).toBeInTheDocument();
    });
  });

  test('picker is closed by default', () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    expect(screen.queryByText('Hours')).not.toBeInTheDocument();
  });

  // Hour selection test
  test('hour select renders with 24 options', async () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      const hourSelects = container.querySelectorAll('select');
      expect(hourSelects[0].querySelectorAll('option')).toHaveLength(24);
    });
  });

  // Minute selection test
  test('minute select renders with 60 options', async () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      const minuteSelects = container.querySelectorAll('select');
      expect(minuteSelects[1].querySelectorAll('option')).toHaveLength(60);
    });
  });

  // Disabled state test
  test('disables input when disabled prop is true', () => {
    const { container } = render(<TimePicker disabled={true} onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeDisabled();
  });

  test('picker does not open when disabled', () => {
    const { container } = render(<TimePicker disabled={true} onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);
    expect(screen.queryByText('Hours')).not.toBeInTheDocument();
  });

  // Styling tests
  test('has correct input styling', () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
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
    const { container } = render(<TimePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('readonly');
  });

  // Done button test
  test('renders done button', async () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });

  test('closes picker when done button is clicked', async () => {
    const { container } = render(<TimePicker onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      const doneButton = screen.getByText('Done');
      fireEvent.click(doneButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Hours')).not.toBeInTheDocument();
    });
  });

  // Custom className test
  test('applies custom className', () => {
    const { container } = render(
      <TimePicker className="custom-class" onChange={() => {}} />
    );
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass('custom-class');
  });

  // Hour and minute change test
  test('calls onChange when hour is changed', async () => {
    const handleChange = jest.fn();
    const { container } = render(<TimePicker value="12:00" onChange={handleChange} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.click(input);

    await waitFor(() => {
      const hourSelect = container.querySelectorAll('select')[0];
      fireEvent.change(hourSelect, { target: { value: '14' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toggle } from '../Toggle';

describe('Toggle Component', () => {
  // Basic rendering tests
  test('renders toggle input', () => {
    const { container } = render(<Toggle />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeInTheDocument();
  });

  test('renders toggle with label', () => {
    render(<Toggle label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  // Checked state tests
  test('renders unchecked by default', () => {
    const { container } = render(<Toggle />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).not.toBeChecked();
  });

  test('renders checked when checked prop is true', () => {
    const { container } = render(<Toggle checked={true} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeChecked();
  });

  test('handles onChange callback', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <Toggle onChange={handleChange} />
    );
    const input = container.querySelector('input[type="checkbox"]');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Disabled state tests
  test('disables toggle when disabled prop is true', () => {
    const { container } = render(<Toggle disabled={true} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeDisabled();
  });

  test('applies opacity when disabled', () => {
    render(<Toggle disabled={true} label="Disabled" />);
    const label = screen.getByText('Disabled');
    expect(label).toHaveClass('opacity-50');
  });

  // Styling tests
  test('has correct styling classes', () => {
    const { container } = render(<Toggle />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('relative', 'inline-block', 'h-6', 'w-11', 'rounded-full', 'cursor-pointer', 'transition-colors', 'duration-200');
  });

  test('applies checked styling when checked', () => {
    const { container } = render(<Toggle checked={true} />);
    const toggleLabel = container.querySelector('label');
    expect(toggleLabel).toHaveClass('bg-blue-600');
  });

  test('applies unchecked styling when not checked', () => {
    const { container } = render(<Toggle checked={false} />);
    const toggleLabel = container.querySelector('label');
    expect(toggleLabel).toHaveClass('bg-gray-300');
  });

  // Slider indicator test
  test('slider moves right when checked', () => {
    const { container } = render(<Toggle checked={true} />);
    const slider = container.querySelector('span');
    expect(slider).toHaveClass('translate-x-5');
  });

  test('slider is at left when unchecked', () => {
    const { container } = render(<Toggle checked={false} />);
    const slider = container.querySelector('span');
    expect(slider).toHaveClass('translate-x-0');
  });

  // ID tests
  test('generates unique id when not provided', () => {
    const { container } = render(<Toggle />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input.id).toBeTruthy();
    expect(input.id.startsWith('toggle-')).toBe(true);
  });

  test('uses provided id', () => {
    const { container } = render(<Toggle id="custom-id" />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input.id).toBe('custom-id');
  });

  // ARIA attributes tests
  test('has role="switch"', () => {
    const { container } = render(<Toggle />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveAttribute('role', 'switch');
  });

  test('has aria-checked attribute', () => {
    const { container } = render(<Toggle checked={true} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveAttribute('aria-checked', 'true');
  });

  test('aria-checked is false when unchecked', () => {
    const { container } = render(<Toggle checked={false} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveAttribute('aria-checked', 'false');
  });

  test('has aria-label when label is provided', () => {
    const { container } = render(<Toggle label="Dark mode" />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveAttribute('aria-label', 'Dark mode');
  });

  // Custom className test
  test('applies custom className', () => {
    const { container } = render(<Toggle className="custom-class" />);
    const toggleLabel = container.querySelector('label');
    expect(toggleLabel).toHaveClass('custom-class');
  });

  // Input is hidden
  test('hides toggle input with sr-only', () => {
    const { container } = render(<Toggle />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveClass('sr-only');
  });

  // Slider styling
  test('slider has correct base classes', () => {
    const { container } = render(<Toggle />);
    const slider = container.querySelector('span');
    expect(slider).toHaveClass('absolute', 'left-0.5', 'top-0.5', 'h-5', 'w-5', 'rounded-full', 'bg-white', 'transition-transform', 'duration-200');
  });
});

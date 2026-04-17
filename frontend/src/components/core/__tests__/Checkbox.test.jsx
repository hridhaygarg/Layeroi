import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Checkbox } from '../Checkbox';

describe('Checkbox Component', () => {
  // Basic rendering tests
  test('renders checkbox input', () => {
    const { container } = render(<Checkbox />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeInTheDocument();
  });

  test('renders checkbox with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  // Checked state tests
  test('renders unchecked by default', () => {
    const { container } = render(<Checkbox />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).not.toBeChecked();
  });

  test('renders checked when checked prop is true', () => {
    const { container } = render(<Checkbox checked={true} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeChecked();
  });

  test('handles onChange callback', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <Checkbox onChange={handleChange} />
    );
    const input = container.querySelector('input[type="checkbox"]');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Disabled state tests
  test('disables checkbox when disabled prop is true', () => {
    const { container } = render(<Checkbox disabled={true} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeDisabled();
  });

  test('applies opacity when disabled', () => {
    render(<Checkbox disabled={true} label="Disabled" />);
    const label = screen.getByText('Disabled');
    expect(label).toHaveClass('opacity-50');
  });

  test('does not trigger onChange when disabled', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <Checkbox disabled={true} onChange={handleChange} />
    );
    const input = container.querySelector('input[type="checkbox"]');
    fireEvent.click(input);
    expect(handleChange).not.toHaveBeenCalled();
  });

  // Styling tests
  test('has correct styling classes', () => {
    const { container } = render(<Checkbox />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('rounded', 'border-2', 'cursor-pointer', 'transition-colors', 'duration-200');
  });

  test('applies checked styling when checked', () => {
    const { container } = render(<Checkbox checked={true} />);
    const checkboxLabel = container.querySelector('label');
    expect(checkboxLabel).toHaveClass('bg-blue-600', 'border-blue-600');
  });

  test('applies unchecked styling when not checked', () => {
    const { container } = render(<Checkbox checked={false} />);
    const checkboxLabel = container.querySelector('label');
    expect(checkboxLabel).toHaveClass('border-gray-300');
  });

  // ID tests
  test('generates unique id when not provided', () => {
    const { container } = render(<Checkbox />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input.id).toBeTruthy();
    expect(input.id.startsWith('checkbox-')).toBe(true);
  });

  test('uses provided id', () => {
    const { container } = render(<Checkbox id="custom-id" />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input.id).toBe('custom-id');
  });

  test('associates label with checkbox using id', () => {
    const { container } = render(
      <Checkbox id="test-checkbox" label="Test" />
    );
    const checkboxInput = container.querySelector('input#test-checkbox');
    const checkboxLabel = container.querySelector('label[for="test-checkbox"]');
    expect(checkboxInput).toBeInTheDocument();
    expect(checkboxLabel).toBeInTheDocument();
  });

  // ARIA tests
  test('has aria-label when label is provided', () => {
    const { container } = render(<Checkbox label="Accept" />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveAttribute('aria-label', 'Accept');
  });

  // Custom className test
  test('applies custom className', () => {
    const { container } = render(<Checkbox className="custom-class" />);
    const checkboxLabel = container.querySelector('label');
    expect(checkboxLabel).toHaveClass('custom-class');
  });

  // Input is hidden
  test('hides checkbox input with sr-only', () => {
    const { container } = render(<Checkbox />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveClass('sr-only');
  });

  // Check icon test
  test('shows check icon when checked', () => {
    const { container } = render(<Checkbox checked={true} />);
    const checkIcon = container.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('does not show check icon when unchecked', () => {
    const { container } = render(<Checkbox checked={false} />);
    const checkIcon = container.querySelector('svg');
    expect(checkIcon).not.toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Radio } from '../Radio';

describe('Radio Component', () => {
  // Basic rendering tests
  test('renders radio input', () => {
    const { container } = render(<Radio />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toBeInTheDocument();
  });

  test('renders radio with label', () => {
    render(<Radio label="Option 1" />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  // Checked state tests
  test('renders unchecked by default', () => {
    const { container } = render(<Radio />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).not.toBeChecked();
  });

  test('renders checked when checked prop is true', () => {
    const { container } = render(<Radio checked={true} />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toBeChecked();
  });

  test('handles onChange callback', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <Radio onChange={handleChange} />
    );
    const input = container.querySelector('input[type="radio"]');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Disabled state tests
  test('disables radio when disabled prop is true', () => {
    const { container } = render(<Radio disabled={true} />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toBeDisabled();
  });

  test('applies opacity when disabled', () => {
    render(<Radio disabled={true} label="Disabled" />);
    const label = screen.getByText('Disabled');
    expect(label).toHaveClass('opacity-50');
  });

  // Styling tests
  test('has correct styling classes', () => {
    const { container } = render(<Radio />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('rounded-full', 'border-2', 'cursor-pointer', 'transition-colors', 'duration-200');
  });

  test('applies checked styling when checked', () => {
    const { container } = render(<Radio checked={true} />);
    const radioLabel = container.querySelector('label');
    expect(radioLabel).toHaveClass('bg-blue-600', 'border-blue-600');
  });

  test('applies unchecked styling when not checked', () => {
    const { container } = render(<Radio checked={false} />);
    const radioLabel = container.querySelector('label');
    expect(radioLabel).toHaveClass('border-gray-300');
  });

  // ID tests
  test('generates unique id when not provided', () => {
    const { container } = render(<Radio />);
    const input = container.querySelector('input[type="radio"]');
    expect(input.id).toBeTruthy();
    expect(input.id.startsWith('radio-')).toBe(true);
  });

  test('uses provided id', () => {
    const { container } = render(<Radio id="custom-id" />);
    const input = container.querySelector('input[type="radio"]');
    expect(input.id).toBe('custom-id');
  });

  // Name and value tests
  test('applies provided name attribute', () => {
    const { container } = render(<Radio name="options" />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toHaveAttribute('name', 'options');
  });

  test('applies provided value attribute', () => {
    const { container } = render(<Radio value="option-1" />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toHaveAttribute('value', 'option-1');
  });

  // ARIA tests
  test('has aria-label when label is provided', () => {
    const { container } = render(<Radio label="Choice" />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toHaveAttribute('aria-label', 'Choice');
  });

  // Custom className test
  test('applies custom className', () => {
    const { container } = render(<Radio className="custom-class" />);
    const radioLabel = container.querySelector('label');
    expect(radioLabel).toHaveClass('custom-class');
  });

  // Input is hidden
  test('hides radio input with sr-only', () => {
    const { container } = render(<Radio />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toHaveClass('sr-only');
  });

  // Dot indicator test
  test('shows dot indicator when checked', () => {
    const { container } = render(<Radio checked={true} />);
    const dot = container.querySelector('div.bg-white');
    expect(dot).toBeInTheDocument();
  });

  test('does not show dot indicator when unchecked', () => {
    const { container } = render(<Radio checked={false} />);
    const dot = container.querySelector('div.bg-white');
    expect(dot).not.toBeInTheDocument();
  });

  // Group behavior test
  test('can be used in a group with same name', () => {
    const { container } = render(
      <div>
        <Radio name="size" value="small" label="Small" />
        <Radio name="size" value="large" label="Large" />
      </div>
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios).toHaveLength(2);
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', 'size');
    });
  });
});

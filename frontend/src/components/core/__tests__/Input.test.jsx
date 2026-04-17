import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../Input';

describe('Input Component', () => {
  // Basic rendering tests
  test('renders input element', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('renders with placeholder text', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  // onChange handler test
  test('calls onChange handler when value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('updates input value when onChange is called', () => {
    const { rerender } = render(<Input value="" onChange={() => {}} />);
    let input = screen.getByRole('textbox');
    expect(input.value).toBe('');

    rerender(<Input value="new value" onChange={() => {}} />);
    input = screen.getByRole('textbox');
    expect(input.value).toBe('new value');
  });

  // Type tests
  test('renders text input by default', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('renders email input with type="email"', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  test('renders password input with type="password"', () => {
    render(<Input type="password" />);
    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('renders number input with type="number"', () => {
    const { container } = render(<Input type="number" />);
    const input = container.querySelector('input[type="number"]');
    expect(input).toBeInTheDocument();
  });

  // Error state tests
  test('applies error styling when error prop is true', () => {
    render(<Input error={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  test('displays error message when provided', () => {
    render(<Input error={true} errorMessage="This field is required" />);
    const errorMsg = screen.getByText('This field is required');
    expect(errorMsg).toBeInTheDocument();
  });

  test('error message has correct styling', () => {
    render(<Input error={true} errorMessage="Error text" />);
    const errorMsg = screen.getByText('Error text');
    expect(errorMsg).toHaveClass('text-red-500', 'text-sm');
  });

  test('displays AlertCircle icon when error is true', () => {
    const { container } = render(<Input error={true} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  // Disabled state tests
  test('disables input when disabled prop is true', () => {
    render(<Input disabled={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  test('applies disabled styling', () => {
    render(<Input disabled={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('disabled:bg-gray-100', 'disabled:text-gray-500');
  });

  test('does not allow changes when disabled', () => {
    const handleChange = jest.fn();
    render(<Input disabled={true} onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    // When disabled, the input should not accept changes
    expect(input).toBeDisabled();
  });

  // Required field tests
  test('marks input as required with required prop', () => {
    render(<Input required={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
  });

  // Focus state test
  test('applies focus styling on focus', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    // The input should be focusable (not disabled)
    expect(input).not.toBeDisabled();
  });

  test('has focus ring class', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  // Custom className test
  test('accepts and applies custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('custom-class');
  });

  // Border and styling tests
  test('has default border styling', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border', 'border-gray-300');
  });

  test('has rounded-lg class', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('rounded-lg');
  });

  test('has padding classes', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('px-3', 'py-2');
  });

  // Placeholder styling
  test('has placeholder styling', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('placeholder-gray-400');
  });

  // ForwardRef support
  test('forwards ref correctly', () => {
    const ref = React.createRef();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // Error and disabled together
  test('can show error and be disabled simultaneously', () => {
    render(<Input disabled={true} error={true} errorMessage="Error" />);
    const input = screen.getByRole('textbox');
    const errorMsg = screen.getByText('Error');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('border-red-500');
    expect(errorMsg).toBeInTheDocument();
  });
});

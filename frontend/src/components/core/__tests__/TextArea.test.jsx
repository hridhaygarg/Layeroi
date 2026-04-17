import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextArea } from '../TextArea';

describe('TextArea Component', () => {
  // Basic rendering tests
  test('renders textarea element', () => {
    const { container } = render(<TextArea />);
    expect(container.querySelector('textarea')).toBeInTheDocument();
  });

  test('renders with placeholder', () => {
    const { container } = render(<TextArea placeholder="Enter text..." />);
    expect(container.querySelector('textarea')).toHaveAttribute(
      'placeholder',
      'Enter text...'
    );
  });

  // Value handling tests
  test('displays value when provided', () => {
    const { container } = render(
      <TextArea value="test content" onChange={() => {}} />
    );
    expect(container.querySelector('textarea')).toHaveValue('test content');
  });

  test('handles onChange callback', () => {
    const handleChange = jest.fn();
    const { container } = render(<TextArea onChange={handleChange} />);
    const textarea = container.querySelector('textarea');
    fireEvent.change(textarea, { target: { value: 'new content' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Rows test
  test('applies default rows attribute', () => {
    const { container } = render(<TextArea />);
    expect(container.querySelector('textarea')).toHaveAttribute('rows', '3');
  });

  test('applies custom rows attribute', () => {
    const { container } = render(<TextArea rows={5} />);
    expect(container.querySelector('textarea')).toHaveAttribute('rows', '5');
  });

  // Error state tests
  test('does not show error styling by default', () => {
    const { container } = render(<TextArea />);
    const textarea = container.querySelector('textarea');
    expect(textarea).not.toHaveClass('border-red-500');
  });

  test('shows error styling when error is true', () => {
    const { container } = render(<TextArea error={true} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('border-red-500');
  });

  test('shows error message when provided', () => {
    render(
      <TextArea error={true} errorMessage="This field is required" />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('does not show error message when error is false', () => {
    render(
      <TextArea error={false} errorMessage="This field is required" />
    );
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  // Disabled state test
  test('disables textarea when disabled prop is true', () => {
    const { container } = render(<TextArea disabled={true} />);
    expect(container.querySelector('textarea')).toBeDisabled();
  });

  // Required test
  test('applies required attribute', () => {
    const { container } = render(<TextArea required={true} />);
    expect(container.querySelector('textarea')).toHaveAttribute('required');
  });

  // Styling tests
  test('has correct base classes', () => {
    const { container } = render(<TextArea />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass(
      'w-full',
      'px-3',
      'py-2',
      'rounded-lg',
      'border',
      'border-gray-300'
    );
  });

  test('has focus styles', () => {
    const { container } = render(<TextArea />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  test('has resize-none class', () => {
    const { container } = render(<TextArea />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('resize-none');
  });

  // Custom className test
  test('applies custom className', () => {
    const { container } = render(<TextArea className="custom-class" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('custom-class');
  });

  // Error icon test
  test('shows error icon when error is true', () => {
    const { container } = render(<TextArea error={true} />);
    const errorIcon = container.querySelector('svg');
    expect(errorIcon).toBeInTheDocument();
  });

  test('does not show error icon when error is false', () => {
    const { container } = render(<TextArea error={false} />);
    const errorIcon = container.querySelector('svg');
    expect(errorIcon).not.toBeInTheDocument();
  });
});

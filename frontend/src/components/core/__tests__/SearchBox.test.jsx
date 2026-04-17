import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchBox } from '../SearchBox';

describe('SearchBox Component', () => {
  // Basic rendering tests
  test('renders search input', () => {
    const { container } = render(<SearchBox />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeInTheDocument();
  });

  test('renders with default placeholder', () => {
    const { container } = render(<SearchBox />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('placeholder', 'Search...');
  });

  test('renders with custom placeholder', () => {
    const { container } = render(<SearchBox placeholder="Find users..." />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('placeholder', 'Find users...');
  });

  // Search icon test
  test('renders search icon', () => {
    const { container } = render(<SearchBox />);
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  // Value handling tests
  test('displays value when provided', () => {
    const { container } = render(<SearchBox value="test" onChange={() => {}} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveValue('test');
  });

  test('handles onChange callback', () => {
    const handleChange = jest.fn();
    const { container } = render(<SearchBox onChange={handleChange} />);
    const input = container.querySelector('input[type="text"]');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Clear button tests
  test('does not show clear button when value is empty', () => {
    render(<SearchBox value="" />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  test('shows clear button when value is not empty', () => {
    render(<SearchBox value="search term" onChange={() => {}} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  test('calls onClear when clear button is clicked', () => {
    const handleClear = jest.fn();
    render(
      <SearchBox
        value="search term"
        onChange={() => {}}
        onClear={handleClear}
      />
    );
    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  test('clears value when clear button is clicked', () => {
    const handleChange = jest.fn();
    render(
      <SearchBox
        value="search term"
        onChange={handleChange}
      />
    );
    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    expect(handleChange).toHaveBeenCalled();
  });

  // Disabled state test
  test('disables input when disabled prop is true', () => {
    const { container } = render(<SearchBox disabled={true} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeDisabled();
  });

  // Styling tests
  test('has correct base classes', () => {
    const { container } = render(<SearchBox />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass(
      'w-full',
      'px-4',
      'py-2',
      'pl-10',
      'pr-10',
      'rounded-lg',
      'border',
      'border-gray-300'
    );
  });

  test('has focus styles', () => {
    const { container } = render(<SearchBox />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  // Custom className test
  test('applies custom className', () => {
    const { container } = render(<SearchBox className="custom-class" />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass('custom-class');
  });

  // Clear button styling
  test('clear button has correct styling', () => {
    render(<SearchBox value="test" onChange={() => {}} />);
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toHaveClass(
      'absolute',
      'right-3',
      'top-1/2',
      '-translate-y-1/2'
    );
  });
});

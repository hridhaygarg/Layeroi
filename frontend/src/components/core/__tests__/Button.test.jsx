import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

describe('Button Component', () => {
  // Basic rendering tests
  test('renders button with text content', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Variant tests
  test('applies primary variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveClass('bg-blue-600');
  });

  test('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('bg-gray-200');
  });

  test('applies danger variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-red-600');
  });

  // Size tests
  test('applies small size classes', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  test('applies medium size classes', () => {
    render(<Button size="md">Medium</Button>);
    const button = screen.getByRole('button', { name: /medium/i });
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  test('applies large size classes', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  // Loading state tests
  test('shows loading state with spinner', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toHaveClass('opacity-75');
  });

  test('disables button when loading is true', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
  });

  // Disabled state tests
  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button', { name: /disabled/i });
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Full width test
  test('applies full width class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button', { name: /full width/i });
    expect(button).toHaveClass('w-full');
  });

  // Custom className test
  test('accepts and applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });

  // Focus and transition classes
  test('has focus ring class for accessibility', () => {
    render(<Button>Focus Ring</Button>);
    const button = screen.getByRole('button', { name: /focus ring/i });
    expect(button).toHaveClass('ring-2');
  });

  test('has transition classes', () => {
    render(<Button>Transition</Button>);
    const button = screen.getByRole('button', { name: /transition/i });
    expect(button).toHaveClass('transition-colors', 'duration-200');
  });

  // Default variant should be primary
  test('defaults to primary variant when variant not specified', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button', { name: /default/i });
    expect(button).toHaveClass('bg-blue-600');
  });

  // Default size should be md
  test('defaults to medium size when size not specified', () => {
    render(<Button>Default Size</Button>);
    const button = screen.getByRole('button', { name: /default size/i });
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  // Rounded corner test
  test('has rounded-lg class for rounded corners', () => {
    render(<Button>Rounded</Button>);
    const button = screen.getByRole('button', { name: /rounded/i });
    expect(button).toHaveClass('rounded-lg');
  });
});

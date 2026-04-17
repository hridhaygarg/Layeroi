import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  // Basic rendering tests
  test('renders badge with label', () => {
    render(<Badge label="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  // Color tests
  test('applies primary color class', () => {
    render(<Badge label="Primary" color="primary" />);
    const badge = screen.getByText('Primary');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-200');
  });

  test('applies success color class', () => {
    render(<Badge label="Success" color="success" />);
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200');
  });

  test('applies warning color class', () => {
    render(<Badge label="Warning" color="warning" />);
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-200');
  });

  test('applies danger color class', () => {
    render(<Badge label="Danger" color="danger" />);
    const badge = screen.getByText('Danger');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'border-red-200');
  });

  test('defaults to primary color', () => {
    render(<Badge label="Default" />);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-blue-100');
  });

  // Size tests
  test('applies small size class', () => {
    render(<Badge label="Small" size="sm" />);
    const badge = screen.getByText('Small');
    expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
  });

  test('applies medium size class', () => {
    render(<Badge label="Medium" size="md" />);
    const badge = screen.getByText('Medium');
    expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  test('applies large size class', () => {
    render(<Badge label="Large" size="lg" />);
    const badge = screen.getByText('Large');
    expect(badge).toHaveClass('px-4', 'py-2', 'text-base');
  });

  test('defaults to medium size', () => {
    render(<Badge label="Default" />);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  // Styling classes
  test('has rounded-full class', () => {
    render(<Badge label="Badge" />);
    expect(screen.getByText('Badge')).toHaveClass('rounded-full');
  });

  test('has font-medium class', () => {
    render(<Badge label="Badge" />);
    expect(screen.getByText('Badge')).toHaveClass('font-medium');
  });

  test('has inline-flex class for layout', () => {
    render(<Badge label="Badge" />);
    expect(screen.getByText('Badge')).toHaveClass('inline-flex');
  });

  // Custom className test
  test('applies custom className', () => {
    render(<Badge label="Custom" className="custom-class" />);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  // Combined props test
  test('applies color and size together', () => {
    render(<Badge label="Status" color="success" size="lg" />);
    const badge = screen.getByText('Status');
    expect(badge).toHaveClass(
      'bg-green-100',
      'text-green-800',
      'px-4',
      'py-2',
      'text-base'
    );
  });
});

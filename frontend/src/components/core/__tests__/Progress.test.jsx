import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Progress } from '../Progress';

describe('Progress Component', () => {
  // Basic rendering tests
  test('renders progress bar', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders with progressbar role', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // Value tests
  test('updates width based on value', () => {
    const { container } = render(<Progress value={50} />);
    const progressBar = container.querySelector('[role="progressbar"] > div');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  test('shows 0% when value is 0', () => {
    const { container } = render(<Progress value={0} />);
    const progressBar = container.querySelector('[role="progressbar"] > div');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  test('shows 100% when value is at max', () => {
    const { container } = render(<Progress value={100} max={100} />);
    const progressBar = container.querySelector('[role="progressbar"] > div');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  test('caps value at max', () => {
    const { container } = render(<Progress value={150} max={100} />);
    const progressBar = container.querySelector('[role="progressbar"] > div');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  test('clamps negative values to 0', () => {
    const { container } = render(<Progress value={-10} max={100} />);
    const progressBar = container.querySelector('[role="progressbar"] > div');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  // Color tests
  test('applies primary color class', () => {
    const { container } = render(<Progress value={50} color="primary" />);
    const bar = container.querySelector('[role="progressbar"] > div');
    expect(bar).toHaveClass('bg-blue-600');
  });

  test('applies success color class', () => {
    const { container } = render(<Progress value={50} color="success" />);
    const bar = container.querySelector('[role="progressbar"] > div');
    expect(bar).toHaveClass('bg-green-600');
  });

  test('applies warning color class', () => {
    const { container } = render(<Progress value={50} color="warning" />);
    const bar = container.querySelector('[role="progressbar"] > div');
    expect(bar).toHaveClass('bg-yellow-600');
  });

  test('applies danger color class', () => {
    const { container } = render(<Progress value={50} color="danger" />);
    const bar = container.querySelector('[role="progressbar"] > div');
    expect(bar).toHaveClass('bg-red-600');
  });

  test('defaults to primary color', () => {
    const { container } = render(<Progress value={50} />);
    const bar = container.querySelector('[role="progressbar"] > div');
    expect(bar).toHaveClass('bg-blue-600');
  });

  // Label tests
  test('does not show label by default', () => {
    render(<Progress value={50} />);
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  test('shows label when showLabel is true', () => {
    render(<Progress value={50} showLabel={true} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  // ARIA attributes tests
  test('has correct aria-valuenow', () => {
    render(<Progress value={75} max={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '75'
    );
  });

  test('has aria-valuemin of 0', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuemin',
      '0'
    );
  });

  test('has aria-valuemax of 100 by default', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuemax',
      '100'
    );
  });

  // Styling classes
  test('has correct base classes', () => {
    render(<Progress value={50} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveClass('w-full', 'bg-gray-200', 'rounded-full', 'overflow-hidden', 'h-2');
  });

  test('has transition classes on inner bar', () => {
    const { container } = render(<Progress value={50} />);
    const bar = container.querySelector('[role="progressbar"] > div');
    expect(bar).toHaveClass('transition-all', 'duration-300', 'ease-out');
  });

  // Custom className test
  test('applies custom className', () => {
    render(<Progress value={50} className="custom-class" />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-class');
  });

  // Custom max value
  test('calculates percentage with custom max value', () => {
    const { container } = render(<Progress value={25} max={50} />);
    const progressBar = container.querySelector('[role="progressbar"] > div');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  test('shows correct percentage with custom max value', () => {
    render(<Progress value={25} max={50} showLabel={true} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});

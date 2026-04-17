import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toast } from '../Toast';

describe('Toast Component', () => {
  // Basic rendering tests
  test('renders toast with message', () => {
    render(<Toast message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('renders with alert role', () => {
    render(<Toast message="Alert message" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // Type tests
  test('renders success toast with correct styling', () => {
    render(<Toast message="Success" type="success" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
  });

  test('renders error toast with correct styling', () => {
    render(<Toast message="Error" type="error" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');
  });

  test('renders warning toast with correct styling', () => {
    render(<Toast message="Warning" type="warning" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800');
  });

  test('renders info toast with correct styling', () => {
    render(<Toast message="Info" type="info" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });

  // Dismiss button tests
  test('renders dismiss button', () => {
    render(<Toast message="Test" />);
    expect(screen.getByLabelText('Dismiss toast')).toBeInTheDocument();
  });

  test('calls onDismiss when dismiss button is clicked', () => {
    const handleDismiss = jest.fn();
    render(<Toast message="Test" onDismiss={handleDismiss} />);
    const dismissButton = screen.getByLabelText('Dismiss toast');
    fireEvent.click(dismissButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  // Auto-dismiss tests
  test('auto-dismisses after duration', async () => {
    const handleDismiss = jest.fn();
    render(
      <Toast message="Test" duration={100} onDismiss={handleDismiss} />
    );
    await waitFor(
      () => {
        expect(handleDismiss).toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  test('does not auto-dismiss when duration is 0', async () => {
    const handleDismiss = jest.fn();
    render(
      <Toast message="Test" duration={0} onDismiss={handleDismiss} />
    );
    await waitFor(
      () => {
        expect(handleDismiss).not.toHaveBeenCalled();
      },
      { timeout: 100 }
    );
  });

  // Custom className test
  test('applies custom className', () => {
    render(<Toast message="Test" className="custom-class" />);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  // Default type should be info
  test('defaults to info type when type not specified', () => {
    render(<Toast message="Test" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-blue-50');
  });

  // Styling classes
  test('has rounded-lg and shadow-lg classes', () => {
    render(<Toast message="Test" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('rounded-lg', 'shadow-lg');
  });

  test('has correct gap and padding', () => {
    render(<Toast message="Test" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('gap-3', 'p-4');
  });
});

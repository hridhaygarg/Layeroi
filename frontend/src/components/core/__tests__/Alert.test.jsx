import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert } from '../Alert';

describe('Alert Component', () => {
  // Basic rendering tests
  test('renders alert with title and description', () => {
    render(<Alert title="Alert Title" description="Alert description" />);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description')).toBeInTheDocument();
  });

  test('renders with alert role', () => {
    render(<Alert title="Test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // Type tests
  test('renders success alert with correct styling', () => {
    render(<Alert type="success" title="Success" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-50', 'border-green-200');
  });

  test('renders error alert with correct styling', () => {
    render(<Alert type="error" title="Error" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50', 'border-red-200');
  });

  test('renders warning alert with correct styling', () => {
    render(<Alert type="warning" title="Warning" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200');
  });

  test('renders info alert with correct styling', () => {
    render(<Alert type="info" title="Info" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50', 'border-blue-200');
  });

  // Close button tests
  test('renders close button by default', () => {
    render(<Alert title="Test" onClose={() => {}} />);
    expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
  });

  test('does not render close button when showCloseButton is false', () => {
    render(
      <Alert title="Test" onClose={() => {}} showCloseButton={false} />
    );
    expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Alert title="Test" onClose={handleClose} />);
    const closeButton = screen.getByLabelText('Close alert');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // Title and description tests
  test('renders title when provided', () => {
    render(<Alert title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('does not require title', () => {
    render(<Alert description="Just a description" />);
    expect(screen.getByText('Just a description')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    render(<Alert description="Test description" />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('renders both title and description', () => {
    render(
      <Alert title="Test Title" description="Test description" />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  // Custom className test
  test('applies custom className', () => {
    render(<Alert title="Test" className="custom-class" />);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  // Default type should be info
  test('defaults to info type when type not specified', () => {
    render(<Alert title="Test" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50');
  });

  // Styling classes
  test('has rounded-lg and border classes', () => {
    render(<Alert title="Test" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('rounded-lg', 'border', 'p-4');
  });

  test('title has font-semibold class', () => {
    render(<Alert title="Test Title" />);
    expect(screen.getByText('Test Title')).toHaveClass('font-semibold');
  });

  test('description has text-sm class', () => {
    render(<Alert description="Test description" />);
    expect(screen.getByText('Test description')).toHaveClass('text-sm');
  });
});

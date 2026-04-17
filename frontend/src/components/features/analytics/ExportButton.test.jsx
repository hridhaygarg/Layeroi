import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExportButton from './ExportButton';

// Mock file download
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe('ExportButton Component', () => {
  const mockData = {
    metrics: { totalProspects: 1250, emailsSent: 850 },
    chartData: [{ date: '2024-04-10', opens: 45 }],
  };

  // Basic rendering
  test('renders export button', () => {
    render(<ExportButton data={mockData} onSuccess={jest.fn()} />);
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  // Dropdown menu
  test('opens dropdown menu on click', async () => {
    render(<ExportButton data={mockData} onSuccess={jest.fn()} />);
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText(/CSV/i)).toBeInTheDocument();
      expect(screen.getByText(/JSON/i)).toBeInTheDocument();
      expect(screen.getByText(/PDF/i)).toBeInTheDocument();
    });
  });

  // CSV export
  test('exports data as CSV', async () => {
    const onSuccess = jest.fn();
    render(<ExportButton data={mockData} onSuccess={onSuccess} />);

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      const csvOption = screen.getByText(/CSV/i);
      fireEvent.click(csvOption);
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  // JSON export
  test('exports data as JSON', async () => {
    const onSuccess = jest.fn();
    render(<ExportButton data={mockData} onSuccess={onSuccess} />);

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      const jsonOption = screen.getByText(/JSON/i);
      fireEvent.click(jsonOption);
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  // PDF export
  test('exports data as PDF', async () => {
    const onSuccess = jest.fn();
    render(<ExportButton data={mockData} onSuccess={onSuccess} />);

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      const pdfOption = screen.getByText(/PDF/i);
      fireEvent.click(pdfOption);
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  // Success callback
  test('calls onSuccess callback after export', async () => {
    const onSuccess = jest.fn();
    render(<ExportButton data={mockData} onSuccess={onSuccess} />);

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      const csvOption = screen.getByText(/CSV/i);
      fireEvent.click(csvOption);
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(expect.any(String));
    });
  });
});

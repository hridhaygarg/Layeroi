import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProspectsPage from '../screens/ProspectsPage';

jest.mock('../hooks/usePageTitle', () => ({
  usePageTitle: jest.fn(),
}));

jest.mock('../components/Toast', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock('../components/AnimatedSection', () => {
  return function MockAnimatedSection({ children }) {
    return <div data-testid="animated-section">{children}</div>;
  };
});

jest.mock('../components/EmptyState', () => {
  return function MockEmptyState({ title, description }) {
    return (
      <div data-testid="empty-state">
        <div>{title}</div>
        <div>{description}</div>
      </div>
    );
  };
});

describe('ProspectsPage Screen', () => {
  test('renders prospects table with data', () => {
    render(<ProspectsPage />);
    expect(screen.getByTestId('prospects-table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  test('displays prospect columns correctly', () => {
    render(<ProspectsPage />);
    expect(screen.getByTestId('header-name')).toBeInTheDocument();
    expect(screen.getByTestId('header-email')).toBeInTheDocument();
    expect(screen.getByTestId('header-company')).toBeInTheDocument();
    expect(screen.getByTestId('header-status')).toBeInTheDocument();
    expect(screen.getByTestId('header-created')).toBeInTheDocument();
  });

  test('shows status badges for prospects', () => {
    render(<ProspectsPage />);
    expect(screen.getByTestId('status-badge-new')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge-qualified')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge-contacted')).toBeInTheDocument();
  });

  test('opens detail drawer when clicking prospect row', async () => {
    render(<ProspectsPage />);
    const row = screen.getByTestId('prospect-row-1');
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByTestId('prospect-detail-drawer')).toBeInTheDocument();
      expect(screen.getByText('Edit Prospect')).toBeInTheDocument();
    });
  });

  test('closes detail drawer when close button is clicked', async () => {
    render(<ProspectsPage />);
    const row = screen.getByTestId('prospect-row-1');
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByTestId('prospect-detail-drawer')).toBeInTheDocument();
    });

    const closeBtn = screen.getByTestId('close-prospect-drawer-btn');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('prospect-detail-drawer')).not.toBeInTheDocument();
    });
  });

  test('closes drawer when overlay is clicked', async () => {
    render(<ProspectsPage />);
    const row = screen.getByTestId('prospect-row-1');
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByTestId('prospect-drawer-overlay')).toBeInTheDocument();
    });

    const overlay = screen.getByTestId('prospect-drawer-overlay');
    fireEvent.click(overlay);

    await waitFor(() => {
      expect(screen.queryByTestId('prospect-detail-drawer')).not.toBeInTheDocument();
    });
  });

  test('allows editing prospect details', async () => {
    render(<ProspectsPage />);
    const row = screen.getByTestId('prospect-row-1');
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('input-name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    expect(nameInput.value).toBe('Updated Name');
  });

  test('saves prospect changes', async () => {
    render(<ProspectsPage />);
    const row = screen.getByTestId('prospect-row-1');
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('input-name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const saveBtn = screen.getByTestId('save-btn');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('prospect-detail-drawer')).not.toBeInTheDocument();
    });
  });

  test('creates new prospect', async () => {
    render(<ProspectsPage />);
    const createBtn = screen.getByTestId('create-prospect-btn');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.getByTestId('prospect-detail-drawer')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const companyInput = screen.getByTestId('input-company');

    fireEvent.change(nameInput, { target: { value: 'New Prospect' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(companyInput, { target: { value: 'New Company' } });

    const saveBtn = screen.getByTestId('save-btn');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText('New Prospect')).toBeInTheDocument();
    });
  });

  test('filters prospects by search term', async () => {
    render(<ProspectsPage />);
    const searchInput = screen.getByTestId('search-input');

    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  test('filters prospects by status', async () => {
    render(<ProspectsPage />);
    const statusFilter = screen.getByTestId('status-filter');

    fireEvent.change(statusFilter, { target: { value: 'qualified' } });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  test('sorts prospects by clicking header', async () => {
    render(<ProspectsPage />);
    const nameHeader = screen.getByTestId('header-name');

    fireEvent.click(nameHeader);

    await waitFor(() => {
      expect(nameHeader).toHaveTextContent('↑');
    });
  });

  test('opens bulk import modal', async () => {
    render(<ProspectsPage />);
    const bulkImportBtn = screen.getByTestId('bulk-import-btn');
    fireEvent.click(bulkImportBtn);

    await waitFor(() => {
      expect(screen.getByTestId('bulk-import-modal')).toBeInTheDocument();
      expect(screen.getByText('Import Prospects')).toBeInTheDocument();
    });
  });

  test('closes bulk import modal on cancel', async () => {
    render(<ProspectsPage />);
    const bulkImportBtn = screen.getByTestId('bulk-import-btn');
    fireEvent.click(bulkImportBtn);

    await waitFor(() => {
      expect(screen.getByTestId('bulk-import-modal')).toBeInTheDocument();
    });

    const cancelBtn = screen.getByTestId('modal-cancel-btn');
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('bulk-import-modal')).not.toBeInTheDocument();
    });
  });

  test('imports CSV file', async () => {
    render(<ProspectsPage />);
    const bulkImportBtn = screen.getByTestId('bulk-import-btn');
    fireEvent.click(bulkImportBtn);

    await waitFor(() => {
      expect(screen.getByTestId('bulk-import-modal')).toBeInTheDocument();
    });

    // Simulate file selection
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['test'], 'prospects.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const importBtn = screen.getByTestId('import-btn');
    fireEvent.click(importBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('bulk-import-modal')).not.toBeInTheDocument();
    });
  });

  test('shows correct prospect count', () => {
    render(<ProspectsPage />);
    const rows = screen.getAllByTestId(/^prospect-row-/);
    expect(rows.length).toBe(3);
  });

  test('updates prospect status in drawer', async () => {
    render(<ProspectsPage />);
    const row = screen.getByTestId('prospect-row-1');
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByTestId('input-status')).toBeInTheDocument();
    });

    const statusSelect = screen.getByTestId('input-status');
    fireEvent.change(statusSelect, { target: { value: 'qualified' } });

    expect(statusSelect.value).toBe('qualified');
  });

  test('maintains search term when opening drawer', async () => {
    render(<ProspectsPage />);
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    const row = screen.getByTestId('prospect-row-1');
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByTestId('prospect-detail-drawer')).toBeInTheDocument();
    });

    expect(searchInput.value).toBe('John');
  });

  test('resets form when creating new prospect', async () => {
    render(<ProspectsPage />);
    const createBtn = screen.getByTestId('create-prospect-btn');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.getByTestId('prospect-detail-drawer')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('input-name');
    expect(nameInput.value).toBe('');
  });

  test('displays empty state in table when no prospects match filter', async () => {
    render(<ProspectsPage />);
    const searchInput = screen.getByTestId('search-input');

    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });
});

import React, { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useToast } from '../components/Toast';
import { AnimatedSection } from '../components/AnimatedSection';
import EmptyState from '../components/EmptyState';

const colors = {
  bgPrimary: '#fafaf9',
  bgSurface: '#ffffff',
  bgSubtle: '#f5f5f4',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  borderDefault: 'rgba(0,0,0,0.08)',
  accentGreen: '#16a34a',
  accentBlue: '#0066cc',
  accentYellow: '#d97706',
  accentRed: '#dc2626',
  shadowSm: '0 1px 3px rgba(0,0,0,0.08)',
  shadowMd: '0 4px 6px rgba(0,0,0,0.06)',
};

const STATUS_COLORS = {
  new: { bg: '#eff6ff', text: '#0c4a6e' },
  contacted: { bg: '#fef3c7', text: '#78350f' },
  qualified: { bg: '#dcfce7', text: '#166534' },
  nurturing: { bg: '#f3e8ff', text: '#6b21a8' },
  closed: { bg: '#fecaca', text: '#7f1d1d' },
};

function StatusBadge({ status }) {
  const config = STATUS_COLORS[status] || STATUS_COLORS.new;
  return (
    <div
      style={{
        background: config.bg,
        color: config.text,
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        display: 'inline-block',
      }}
      data-testid={`status-badge-${status}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}

function ProspectSearch({ onFilterChange, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    onFilterChange(value);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}
      data-testid="prospect-search"
    >
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          flex: 1,
          minWidth: '200px',
          padding: '10px 12px',
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '6px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          transition: 'border 150ms ease',
        }}
        data-testid="search-input"
      />
      <select
        value={statusFilter}
        onChange={handleStatusChange}
        style={{
          padding: '10px 12px',
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '6px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: colors.bgSurface,
          cursor: 'pointer',
        }}
        data-testid="status-filter"
      >
        <option value="all">All Status</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="nurturing">Nurturing</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
}

function ProspectsTable({ prospects, onRowClick, onSort, sortConfig }) {
  const handleHeaderClick = (field) => {
    const direction =
      sortConfig.field === field && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    onSort(field, direction);
  };

  return (
    <div
      style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: colors.shadowSm,
      }}
      data-testid="prospects-table"
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        }}
      >
        <thead
          style={{
            background: colors.bgSubtle,
            borderBottom: `1px solid ${colors.borderDefault}`,
          }}
        >
          <tr>
            <th
              onClick={() => handleHeaderClick('name')}
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
                cursor: 'pointer',
                userSelect: 'none',
              }}
              data-testid="header-name"
            >
              Name{' '}
              {sortConfig.field === 'name'
                ? sortConfig.direction === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </th>
            <th
              onClick={() => handleHeaderClick('email')}
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
                cursor: 'pointer',
                userSelect: 'none',
              }}
              data-testid="header-email"
            >
              Email{' '}
              {sortConfig.field === 'email'
                ? sortConfig.direction === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </th>
            <th
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
              }}
              data-testid="header-company"
            >
              Company
            </th>
            <th
              onClick={() => handleHeaderClick('status')}
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
                cursor: 'pointer',
                userSelect: 'none',
              }}
              data-testid="header-status"
            >
              Status{' '}
              {sortConfig.field === 'status'
                ? sortConfig.direction === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </th>
            <th
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
              }}
              data-testid="header-created"
            >
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {prospects.map((prospect, idx) => (
            <tr
              key={prospect.id}
              onClick={() => onRowClick(prospect)}
              style={{
                borderBottom: `1px solid ${colors.borderDefault}`,
                cursor: 'pointer',
                transition: 'background 150ms ease',
                ':hover': {
                  background: colors.bgSubtle,
                },
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = colors.bgSubtle)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
              data-testid={`prospect-row-${prospect.id}`}
            >
              <td style={{ padding: '16px', color: colors.textPrimary }}>
                {prospect.name}
              </td>
              <td style={{ padding: '16px', color: colors.textSecondary }}>
                {prospect.email}
              </td>
              <td style={{ padding: '16px', color: colors.textSecondary }}>
                {prospect.company}
              </td>
              <td style={{ padding: '16px' }}>
                <StatusBadge status={prospect.status} />
              </td>
              <td style={{ padding: '16px', color: colors.textSecondary }}>
                {new Date(prospect.created).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {prospects.length === 0 && (
        <div style={{ padding: '40px' }}>
          <EmptyState
            title="No prospects found"
            description="Create or import prospects to get started"
          />
        </div>
      )}
    </div>
  );
}

function ProspectDetailDrawer({ isOpen, prospect, onClose, onSave }) {
  const [formData, setFormData] = useState(prospect || {});

  useEffect(() => {
    if (prospect) {
      setFormData(prospect);
    }
  }, [prospect]);

  if (!isOpen || !prospect) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        height: '100vh',
        background: colors.bgSurface,
        borderLeft: `1px solid ${colors.borderDefault}`,
        boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
      data-testid="prospect-detail-drawer"
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: colors.textPrimary,
          }}
        >
          Edit Prospect
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: colors.textSecondary,
          }}
          data-testid="close-prospect-drawer-btn"
        >
          ×
        </button>
      </div>

      {/* Form Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '6px',
              }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
              data-testid="input-name"
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '6px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
              data-testid="input-email"
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '6px',
              }}
            >
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
              data-testid="input-company"
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '6px',
              }}
            >
              Status
            </label>
            <select
              name="status"
              value={formData.status || 'new'}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                backgroundColor: colors.bgSurface,
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
              data-testid="input-status"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="nurturing">Nurturing</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '20px',
          borderTop: `1px solid ${colors.borderDefault}`,
          display: 'flex',
          gap: '12px',
        }}
      >
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: `1px solid ${colors.borderDefault}`,
            background: colors.bgSurface,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            color: colors.textPrimary,
          }}
          data-testid="cancel-btn"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            background: colors.accentBlue,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            color: 'white',
          }}
          data-testid="save-btn"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function BulkImportModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (file) {
      onImport(file);
      setFile(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
      }}
      data-testid="bulk-import-modal-overlay"
      onClick={onClose}
    >
      <div
        style={{
          background: colors.bgSurface,
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '400px',
          boxShadow: colors.shadowMd,
        }}
        onClick={(e) => e.stopPropagation()}
        data-testid="bulk-import-modal"
      >
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: colors.textPrimary,
          }}
        >
          Import Prospects
        </h2>
        <p
          style={{
            margin: '0 0 20px 0',
            fontSize: '14px',
            color: colors.textSecondary,
          }}
        >
          Upload a CSV file with columns: name, email, company, status
        </p>

        <div
          style={{
            marginBottom: '20px',
            padding: '20px',
            border: `2px dashed ${colors.borderDefault}`,
            borderRadius: '6px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.bgSubtle;
            e.currentTarget.style.borderColor = colors.accentBlue;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = colors.borderDefault;
          }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{
              display: 'none',
            }}
            data-testid="file-input"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            style={{
              cursor: 'pointer',
              display: 'block',
            }}
          >
            <div style={{ fontSize: '14px', color: colors.textSecondary }}>
              {file ? file.name : 'Click to select CSV file'}
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: `1px solid ${colors.borderDefault}`,
              background: colors.bgSurface,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              color: colors.textPrimary,
            }}
            data-testid="modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              background: file ? colors.accentBlue : colors.textTertiary,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: file ? 'pointer' : 'not-allowed',
              color: 'white',
              opacity: file ? 1 : 0.6,
            }}
            data-testid="import-btn"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProspectsPage() {
  usePageTitle('Prospects');
  const { success: showSuccess, error: showError } = useToast();

  const [prospects, setProspects] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Inc',
      status: 'new',
      created: new Date(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      company: 'Tech Corp',
      status: 'qualified',
      created: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      company: 'Startup Co',
      status: 'contacted',
      created: new Date(Date.now() - 172800000),
    },
  ]);

  const [selectedProspect, setSelectedProspect] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ field: 'created', direction: 'desc' });

  const filteredProspects = prospects
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

  const handleCreateProspect = () => {
    const newProspect = {
      id: Date.now().toString(),
      name: '',
      email: '',
      company: '',
      status: 'new',
      created: new Date(),
    };
    setSelectedProspect(newProspect);
  };

  const handleRowClick = (prospect) => {
    setSelectedProspect(prospect);
  };

  const handleSaveProspect = (formData) => {
    if (prospects.find((p) => p.id === formData.id)) {
      setProspects((prev) =>
        prev.map((p) => (p.id === formData.id ? formData : p))
      );
    } else {
      setProspects((prev) => [...prev, formData]);
    }
    setSelectedProspect(null);
    showSuccess('Prospect saved successfully');
  };

  const handleBulkImport = (file) => {
    // Simulate CSV parsing
    const newProspects = [
      {
        id: Date.now().toString(),
        name: 'Imported Prospect',
        email: 'imported@example.com',
        company: 'Import Co',
        status: 'new',
        created: new Date(),
      },
    ];
    setProspects((prev) => [...prev, ...newProspects]);
    setShowBulkImport(false);
    showSuccess(`Imported ${newProspects.length} prospects`);
  };

  return (
    <div style={{ padding: '32px', background: colors.bgPrimary, minHeight: '100vh' }}>
      <AnimatedSection>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: colors.textPrimary,
                margin: '0 0 8px 0',
              }}
            >
              Prospects
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                margin: 0,
              }}
            >
              Manage your prospect database
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowBulkImport(true)}
              style={{
                padding: '10px 16px',
                border: `1px solid ${colors.borderDefault}`,
                background: colors.bgSurface,
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: colors.textPrimary,
              }}
              data-testid="bulk-import-btn"
            >
              Import CSV
            </button>
            <button
              onClick={handleCreateProspect}
              style={{
                padding: '10px 16px',
                border: 'none',
                background: colors.accentBlue,
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: 'white',
              }}
              data-testid="create-prospect-btn"
            >
              + New Prospect
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <ProspectSearch
          onFilterChange={setStatusFilter}
          onSearch={setSearchTerm}
        />

        {/* Prospects Table */}
        <ProspectsTable
          prospects={filteredProspects}
          onRowClick={handleRowClick}
          onSort={(field, direction) =>
            setSortConfig({ field, direction })
          }
          sortConfig={sortConfig}
        />

        {/* Detail Drawer */}
        {selectedProspect && (
          <>
            <ProspectDetailDrawer
              isOpen={!!selectedProspect}
              prospect={selectedProspect}
              onClose={() => setSelectedProspect(null)}
              onSave={handleSaveProspect}
            />
            <div
              onClick={() => setSelectedProspect(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.2)',
                zIndex: 999,
              }}
              data-testid="prospect-drawer-overlay"
            />
          </>
        )}

        {/* Bulk Import Modal */}
        {showBulkImport && (
          <BulkImportModal
            isOpen={showBulkImport}
            onClose={() => setShowBulkImport(false)}
            onImport={handleBulkImport}
          />
        )}
      </AnimatedSection>
    </div>
  );
}

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

const INTEGRATIONS = [
  { id: 'slack', name: 'Slack', logo: '💬' },
  { id: 'discord', name: 'Discord', logo: '👾' },
  { id: 'zapier', name: 'Zapier', logo: '⚡' },
  { id: 'google_sheets', name: 'Google Sheets', logo: '📊' },
  { id: 'hubspot', name: 'HubSpot', logo: '🔗' },
  { id: 'salesforce', name: 'Salesforce', logo: '☁️' },
  { id: 'outreach', name: 'Outreach', logo: '🎯' },
  { id: 'lemlist', name: 'Lemlist', logo: '📧' },
];

function SyncStatusBadge({ status, lastSync }) {
  const statusColors = {
    synced: { bg: '#f0fdf4', text: '#166534', label: 'Synced' },
    syncing: { bg: '#eff6ff', text: '#0c4a6e', label: 'Syncing...' },
    failed: { bg: '#fef2f2', text: '#7f1d1d', label: 'Failed' },
    idle: { bg: '#f5f5f4', text: '#525252', label: 'Not Connected' },
  };

  const config = statusColors[status] || statusColors.idle;

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
    >
      {config.label}
      {lastSync && status === 'synced' && (
        <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>
          {lastSync}
        </div>
      )}
    </div>
  );
}

function IntegrationCard({ integration, status, onConnect, onViewLogs }) {
  return (
    <div
      style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: '8px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: colors.shadowSm,
        transition: 'all 200ms ease',
        cursor: 'pointer',
        ':hover': {
          borderColor: colors.accentBlue,
          boxShadow: colors.shadowMd,
        },
      }}
      data-testid={`integration-card-${integration.id}`}
    >
      <div style={{ fontSize: '40px' }}>{integration.logo}</div>
      <div>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: colors.textPrimary,
            margin: '0 0 8px 0',
          }}
        >
          {integration.name}
        </h3>
        <SyncStatusBadge status={status.state} lastSync={status.lastSync} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {status.state === 'idle' ? (
          <button
            onClick={onConnect}
            style={{
              flex: 1,
              background: colors.accentBlue,
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = '#0052a3')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = colors.accentBlue)
            }
            data-testid={`connect-btn-${integration.id}`}
          >
            Connect
          </button>
        ) : (
          <button
            onClick={onViewLogs}
            style={{
              flex: 1,
              background: colors.bgSubtle,
              color: colors.textPrimary,
              border: `1px solid ${colors.borderDefault}`,
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.borderDefault;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.bgSubtle;
            }}
            data-testid={`logs-btn-${integration.id}`}
          >
            View Logs
          </button>
        )}
      </div>
    </div>
  );
}

function SyncLogDrawer({ isOpen, integration, logs, onClose }) {
  if (!isOpen || !integration) return null;

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
        animation: 'slideIn 300ms ease-out',
      }}
      data-testid="sync-log-drawer"
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
          {integration.name} Sync Logs
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
          data-testid="close-drawer-btn"
        >
          ×
        </button>
      </div>

      {/* Logs Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
        }}
      >
        {logs && logs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  background: colors.bgSubtle,
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  color: colors.textSecondary,
                }}
                data-testid={`log-entry-${idx}`}
              >
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {log.timestamp}
                </div>
                <div>{log.message}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No sync logs yet" description="Sync logs will appear here" />
        )}
      </div>
    </div>
  );
}

export default function IntegrationsPanel() {
  usePageTitle('Integrations');
  const { success: showSuccess, error: showError } = useToast();

  const [integrationStatus, setIntegrationStatus] = useState({});
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [syncLogs, setSyncLogs] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize integration statuses
  useEffect(() => {
    const initialStatus = {};
    INTEGRATIONS.forEach((integration) => {
      initialStatus[integration.id] = {
        state: 'idle',
        lastSync: null,
      };
    });
    setIntegrationStatus(initialStatus);
  }, []);

  // Simulate WebSocket connection for sync updates
  useEffect(() => {
    const handleSyncUpdate = (event) => {
      const { integrationId, status, timestamp } = event.detail;
      setIntegrationStatus((prev) => ({
        ...prev,
        [integrationId]: {
          state: status,
          lastSync:
            status === 'synced'
              ? new Date(timestamp).toLocaleTimeString()
              : prev[integrationId]?.lastSync,
        },
      }));
    };

    window.addEventListener('integration-sync', handleSyncUpdate);
    return () =>
      window.removeEventListener('integration-sync', handleSyncUpdate);
  }, []);

  const handleConnect = async (integrationId) => {
    try {
      setLoading(true);
      // Simulate OAuth flow
      const integration = INTEGRATIONS.find((i) => i.id === integrationId);
      showSuccess(`Connecting to ${integration.name}...`);

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIntegrationStatus((prev) => ({
        ...prev,
        [integrationId]: {
          state: 'syncing',
          lastSync: null,
        },
      }));

      // Simulate sync completion
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newLogs = [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: `Connected to ${integration.name}`,
        },
        {
          timestamp: new Date(Date.now() - 10000).toLocaleTimeString(),
          message: 'Sync started',
        },
      ];

      setSyncLogs((prev) => ({
        ...prev,
        [integrationId]: newLogs,
      }));

      setIntegrationStatus((prev) => ({
        ...prev,
        [integrationId]: {
          state: 'synced',
          lastSync: new Date().toLocaleTimeString(),
        },
      }));

      showSuccess(`${integration.name} connected successfully`);
    } catch (error) {
      console.error('Connection error:', error);
      showError('Failed to connect integration');
      setIntegrationStatus((prev) => ({
        ...prev,
        [integrationId]: {
          ...prev[integrationId],
          state: 'failed',
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleViewLogs = (integration) => {
    setSelectedIntegration(integration);
  };

  const handleCloseDrawer = () => {
    setSelectedIntegration(null);
  };

  const connectedCount = Object.values(integrationStatus).filter(
    (s) => s.state !== 'idle'
  ).length;

  return (
    <div style={{ padding: '32px', background: colors.bgPrimary, minHeight: '100vh' }}>
      <AnimatedSection>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: colors.textPrimary,
              margin: '0 0 8px 0',
            }}
          >
            Integrations
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: colors.textSecondary,
              margin: 0,
            }}
          >
            {connectedCount} of {INTEGRATIONS.length} integrations connected
          </p>
        </div>

        {/* Integration Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
          data-testid="integrations-grid"
        >
          {INTEGRATIONS.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              status={integrationStatus[integration.id] || { state: 'idle' }}
              onConnect={() => handleConnect(integration.id)}
              onViewLogs={() => handleViewLogs(integration)}
            />
          ))}
        </div>

        {/* Sync Log Drawer */}
        {selectedIntegration && (
          <SyncLogDrawer
            isOpen={!!selectedIntegration}
            integration={selectedIntegration}
            logs={syncLogs[selectedIntegration.id] || []}
            onClose={handleCloseDrawer}
          />
        )}

        {/* Overlay for drawer */}
        {selectedIntegration && (
          <div
            onClick={handleCloseDrawer}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.2)',
              zIndex: 999,
            }}
            data-testid="drawer-overlay"
          />
        )}
      </AnimatedSection>
    </div>
  );
}

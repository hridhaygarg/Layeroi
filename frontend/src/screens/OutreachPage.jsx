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
  pending: { bg: '#fef3c7', text: '#78350f', label: 'Pending' },
  sent: { bg: '#dcfce7', text: '#166534', label: 'Sent' },
  opened: { bg: '#eff6ff', text: '#0c4a6e', label: 'Opened' },
  clicked: { bg: '#f3e8ff', text: '#6b21a8', label: 'Clicked' },
  failed: { bg: '#fecaca', text: '#7f1d1d', label: 'Failed' },
};

function QueueStatusCard({ label, value, color }) {
  return (
    <div
      style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: colors.shadowSm,
      }}
      data-testid={`status-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div
        style={{
          fontSize: '12px',
          fontFamily: 'IBM Plex Mono, monospace',
          color: colors.textTertiary,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: color || colors.accentBlue,
          marginBottom: '8px',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function QueueTable({ items, onSendNow }) {
  return (
    <div
      style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: colors.shadowSm,
      }}
      data-testid="queue-table"
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
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
              }}
              data-testid="header-recipient"
            >
              Recipient
            </th>
            <th
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
              }}
              data-testid="header-status"
            >
              Status
            </th>
            <th
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
              }}
              data-testid="header-send-time"
            >
              Send Time
            </th>
            <th
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
              }}
              data-testid="header-open-time"
            >
              Open Time
            </th>
            <th
              style={{
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: colors.textPrimary,
              }}
              data-testid="header-action"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const statusConfig = STATUS_COLORS[item.status];
            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: `1px solid ${colors.borderDefault}`,
                }}
                data-testid={`queue-item-${item.id}`}
              >
                <td style={{ padding: '16px', color: colors.textPrimary }}>
                  {item.recipient}
                </td>
                <td style={{ padding: '16px' }}>
                  <div
                    style={{
                      background: statusConfig.bg,
                      color: statusConfig.text,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                    data-testid={`status-badge-${item.status}`}
                  >
                    {statusConfig.label}
                  </div>
                </td>
                <td style={{ padding: '16px', color: colors.textSecondary }}>
                  {item.sendTime || '-'}
                </td>
                <td style={{ padding: '16px', color: colors.textSecondary }}>
                  {item.openTime || '-'}
                </td>
                <td style={{ padding: '16px' }}>
                  {item.status === 'pending' ? (
                    <button
                      onClick={() => onSendNow(item.id)}
                      style={{
                        padding: '6px 12px',
                        background: colors.accentGreen,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background 150ms ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = '#15803d')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = colors.accentGreen)
                      }
                      data-testid={`send-now-btn-${item.id}`}
                    >
                      Send Now
                    </button>
                  ) : (
                    <span
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                      }}
                    >
                      -
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {items.length === 0 && (
        <div style={{ padding: '40px' }}>
          <EmptyState
            title="Queue is empty"
            description="No outreach items in queue"
          />
        </div>
      )}
    </div>
  );
}

function SequenceBuilder({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    steps: [{ delay: 0, subject: '', body: '' }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStepChange = (idx, field, value) => {
    const newSteps = [...formData.steps];
    newSteps[idx] = { ...newSteps[idx], [field]: value };
    setFormData((prev) => ({
      ...prev,
      steps: newSteps,
    }));
  };

  const handleAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, { delay: 1, subject: '', body: '' }],
    }));
  };

  const handleRemoveStep = (idx) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== idx),
    }));
  };

  const handleCreate = () => {
    if (formData.name && formData.steps.length > 0) {
      onCreate(formData);
      setFormData({ name: '', steps: [{ delay: 0, subject: '', body: '' }] });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '500px',
        height: '100vh',
        background: colors.bgSurface,
        borderLeft: `1px solid ${colors.borderDefault}`,
        boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
      data-testid="sequence-builder"
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: colors.bgSurface,
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
          Create Sequence
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
          data-testid="close-sequence-builder-btn"
        >
          ×
        </button>
      </div>

      {/* Form Content */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sequence Name */}
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
              Sequence Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Cold Outreach v2"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
              data-testid="sequence-name-input"
            />
          </div>

          {/* Steps */}
          <div>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.textPrimary,
                margin: '0 0 16px 0',
              }}
            >
              Sequence Steps
            </h3>

            {formData.steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  background: colors.bgSubtle,
                  borderRadius: '6px',
                  marginBottom: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
                data-testid={`sequence-step-${idx}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: colors.textPrimary,
                    }}
                  >
                    Step {idx + 1}
                  </div>
                  {formData.steps.length > 1 && (
                    <button
                      onClick={() => handleRemoveStep(idx)}
                      style={{
                        marginLeft: 'auto',
                        background: colors.accentRed,
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                      data-testid={`remove-step-btn-${idx}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: colors.textSecondary,
                      marginBottom: '4px',
                    }}
                  >
                    Delay (days)
                  </label>
                  <input
                    type="number"
                    value={step.delay}
                    onChange={(e) =>
                      handleStepChange(idx, 'delay', parseInt(e.target.value) || 0)
                    }
                    min="0"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: `1px solid ${colors.borderDefault}`,
                      borderRadius: '4px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                    data-testid={`step-delay-input-${idx}`}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: colors.textSecondary,
                      marginBottom: '4px',
                    }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    value={step.subject}
                    onChange={(e) =>
                      handleStepChange(idx, 'subject', e.target.value)
                    }
                    placeholder="Email subject"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: `1px solid ${colors.borderDefault}`,
                      borderRadius: '4px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                    data-testid={`step-subject-input-${idx}`}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: colors.textSecondary,
                      marginBottom: '4px',
                    }}
                  >
                    Body
                  </label>
                  <textarea
                    value={step.body}
                    onChange={(e) =>
                      handleStepChange(idx, 'body', e.target.value)
                    }
                    placeholder="Email body"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: `1px solid ${colors.borderDefault}`,
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      minHeight: '80px',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                    data-testid={`step-body-input-${idx}`}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddStep}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: `2px dashed ${colors.borderDefault}`,
                background: 'transparent',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: colors.accentBlue,
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.accentBlue;
                e.currentTarget.style.background = colors.bgSubtle;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.borderDefault;
                e.currentTarget.style.background = 'transparent';
              }}
              data-testid="add-step-btn"
            >
              + Add Step
            </button>
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
          position: 'sticky',
          bottom: 0,
          background: colors.bgSurface,
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
          data-testid="cancel-sequence-btn"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!formData.name || formData.steps.some((s) => !s.subject)}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            background:
              formData.name && formData.steps.every((s) => s.subject)
                ? colors.accentBlue
                : colors.textTertiary,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor:
              formData.name && formData.steps.every((s) => s.subject)
                ? 'pointer'
                : 'not-allowed',
            color: 'white',
            opacity:
              formData.name && formData.steps.every((s) => s.subject)
                ? 1
                : 0.6,
          }}
          data-testid="create-sequence-btn"
        >
          Create Sequence
        </button>
      </div>
    </div>
  );
}

export default function OutreachPage() {
  usePageTitle('Outreach');
  const { success: showSuccess, error: showError } = useToast();

  const [queueItems, setQueueItems] = useState([
    {
      id: '1',
      recipient: 'john@example.com',
      status: 'pending',
      sendTime: null,
      openTime: null,
    },
    {
      id: '2',
      recipient: 'jane@example.com',
      status: 'sent',
      sendTime: '2 hours ago',
      openTime: null,
    },
    {
      id: '3',
      recipient: 'bob@example.com',
      status: 'opened',
      sendTime: 'Yesterday',
      openTime: '30 minutes ago',
    },
  ]);

  const [sequences, setSequences] = useState([]);
  const [showSequenceBuilder, setShowSequenceBuilder] = useState(false);

  const stats = {
    pending: queueItems.filter((i) => i.status === 'pending').length,
    sent: queueItems.filter((i) => i.status === 'sent').length,
    opened: queueItems.filter((i) => i.status === 'opened').length,
  };

  const handleSendNow = async (itemId) => {
    try {
      const item = queueItems.find((i) => i.id === itemId);
      setQueueItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, status: 'sent', sendTime: 'Just now' }
            : i
        )
      );
      showSuccess(`Email sent to ${item.recipient}`);
    } catch (error) {
      showError('Failed to send email');
    }
  };

  const handleCreateSequence = (sequenceData) => {
    const newSequence = {
      id: Date.now().toString(),
      ...sequenceData,
      createdAt: new Date(),
    };
    setSequences((prev) => [...prev, newSequence]);
    setShowSequenceBuilder(false);
    showSuccess('Sequence created successfully');
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
              Outreach Queue
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                margin: 0,
              }}
            >
              Manage your email outreach and automation sequences
            </p>
          </div>
          <button
            onClick={() => setShowSequenceBuilder(true)}
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
            data-testid="create-sequence-btn-header"
          >
            + Create Sequence
          </button>
        </div>

        {/* Status Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <QueueStatusCard
            label="Pending"
            value={stats.pending}
            color={colors.accentYellow}
          />
          <QueueStatusCard
            label="Sent"
            value={stats.sent}
            color={colors.accentGreen}
          />
          <QueueStatusCard
            label="Opened"
            value={stats.opened}
            color={colors.accentBlue}
          />
        </div>

        {/* Queue Table */}
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors.textPrimary,
              marginBottom: '16px',
              margin: '0 0 16px 0',
            }}
          >
            Queue Items
          </h2>
          <QueueTable items={queueItems} onSendNow={handleSendNow} />
        </div>

        {/* Sequences */}
        {sequences.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '16px',
              }}
            >
              Active Sequences
            </h2>
            <div
              style={{
                display: 'grid',
                gap: '12px',
              }}
            >
              {sequences.map((seq) => (
                <div
                  key={seq.id}
                  style={{
                    background: colors.bgSurface,
                    border: `1px solid ${colors.borderDefault}`,
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  data-testid={`sequence-card-${seq.id}`}
                >
                  <div>
                    <h3
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: colors.textPrimary,
                      }}
                    >
                      {seq.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: colors.textSecondary,
                      }}
                    >
                      {seq.steps.length} steps
                    </p>
                  </div>
                  <button
                    style={{
                      padding: '6px 12px',
                      background: colors.accentGreen,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                    data-testid={`apply-sequence-btn-${seq.id}`}
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sequence Builder */}
        {showSequenceBuilder && (
          <>
            <SequenceBuilder
              isOpen={showSequenceBuilder}
              onClose={() => setShowSequenceBuilder(false)}
              onCreate={handleCreateSequence}
            />
            <div
              onClick={() => setShowSequenceBuilder(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.2)',
                zIndex: 999,
              }}
              data-testid="sequence-builder-overlay"
            />
          </>
        )}
      </AnimatedSection>
    </div>
  );
}

describe('Integrations & Webhooks', () => {
  beforeEach(() => {
    cy.login();
    cy.navigateToScreen('integrations');
  });

  it('should display available integrations', () => {
    cy.get('[data-testid="integrations-list"]').should('exist');
    cy.get('[data-testid="integration-card"]').should('have.length.greaterThan', 0);
  });

  it('should connect to integration', () => {
    cy.get('[data-testid="integration-card"]').first().click();
    cy.get('[data-testid="connect-button"]').click();
    cy.get('[data-testid="api-key-input"]').type('test-api-key-123');
    cy.get('[data-testid="save-integration-button"]').click();
    cy.contains('connected').should('be.visible');
  });

  it('should display sync logs', () => {
    cy.get('[data-testid="integration-card"]').first().click();
    cy.get('[data-testid="sync-logs-tab"]').click();
    cy.get('[data-testid="sync-log-entry"]').should('have.length.greaterThan', 0);
  });

  it('should filter sync logs by status', () => {
    cy.get('[data-testid="integration-card"]').first().click();
    cy.get('[data-testid="sync-logs-tab"]').click();
    cy.get('[data-testid="filter-status"]').click();
    cy.contains('Success').click();
    cy.get('[data-testid="sync-log-entry"]').each(($log) => {
      cy.wrap($log).should('contain', 'Success');
    });
  });

  it('should view sync details', () => {
    cy.get('[data-testid="integration-card"]').first().click();
    cy.get('[data-testid="sync-logs-tab"]').click();
    cy.get('[data-testid="sync-log-entry"]').first().click();
    cy.get('[data-testid="sync-details"]').should('be.visible');
    cy.contains('Records Synced').should('be.visible');
    cy.contains('Errors').should('be.visible');
  });

  it('should trigger manual sync', () => {
    cy.get('[data-testid="integration-card"]').first().click();
    cy.get('[data-testid="manual-sync-button"]').click();
    cy.contains('syncing').should('be.visible');
    cy.contains('completed').should('be.visible');
  });

  it('should handle sync errors gracefully', () => {
    cy.intercept('/api/integrations/*/sync', {
      statusCode: 500,
      body: { error: 'Sync failed' }
    });
    cy.get('[data-testid="integration-card"]').first().click();
    cy.get('[data-testid="manual-sync-button"]').click();
    cy.contains('error').should('be.visible');
  });

  it('should disconnect integration', () => {
    cy.get('[data-testid="integration-card"]').first().click();
    cy.get('[data-testid="disconnect-button"]').click();
    cy.contains('Confirm').click();
    cy.contains('disconnected').should('be.visible');
  });

  it('should create and test webhook', () => {
    cy.get('[data-testid="webhooks-tab"]').click();
    cy.get('[data-testid="create-webhook-button"]').click();
    cy.get('input[name="webhookUrl"]').type('https://example.com/webhook');
    cy.get('[data-testid="event-select"]').click();
    cy.contains('sync_completed').click();
    cy.get('[data-testid="create-button"]').click();
    cy.contains('created').should('be.visible');
  });

  it('should view webhook delivery history', () => {
    cy.get('[data-testid="webhooks-tab"]').click();
    cy.get('[data-testid="webhook-card"]').first().click();
    cy.get('[data-testid="delivery-history"]').should('be.visible');
    cy.get('[data-testid="delivery-entry"]').should('have.length.greaterThan', 0);
  });

  it('should retry failed webhook delivery', () => {
    cy.get('[data-testid="webhooks-tab"]').click();
    cy.get('[data-testid="webhook-card"]').first().click();
    cy.get('[data-testid="failed-delivery"]').first().click();
    cy.get('[data-testid="retry-button"]').click();
    cy.contains('retrying').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.verifyResponsive('mobile');
    cy.get('[data-testid="integrations-list"]').should('exist');
  });
});

describe('Settings & Account Management', () => {
  beforeEach(() => {
    cy.login();
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Settings').click();
  });

  it('should display settings tabs', () => {
    cy.get('[data-testid="settings-tabs"]').should('exist');
    cy.contains('Profile').should('be.visible');
    cy.contains('Security').should('be.visible');
    cy.contains('Integrations').should('be.visible');
    cy.contains('Webhooks').should('be.visible');
  });

  it('should update user profile', () => {
    cy.contains('Profile').click();
    cy.get('input[name="firstName"]').clear().type('John');
    cy.get('input[name="lastName"]').clear().type('Doe');
    cy.get('input[name="email"]').should('have.value', 'test@example.com');
    cy.get('[data-testid="save-button"]').click();
    cy.contains('saved').should('be.visible');
  });

  it('should upload profile picture', () => {
    cy.contains('Profile').click();
    cy.get('[data-testid="upload-avatar"]').selectFile('cypress/fixtures/avatar.jpg');
    cy.get('[data-testid="save-button"]').click();
    cy.contains('saved').should('be.visible');
  });

  it('should change password', () => {
    cy.contains('Security').click();
    cy.get('input[name="currentPassword"]').type('OldPassword123!');
    cy.get('input[name="newPassword"]').type('NewPassword123!');
    cy.get('input[name="confirmPassword"]').type('NewPassword123!');
    cy.get('[data-testid="change-password-button"]').click();
    cy.contains('changed').should('be.visible');
  });

  it('should setup MFA', () => {
    cy.contains('Security').click();
    cy.get('[data-testid="enable-mfa-button"]').click();
    cy.get('[data-testid="mfa-modal"]').should('be.visible');
    cy.get('[data-testid="qr-code"]').should('exist');
    cy.get('input[name="mfaCode"]').type('123456');
    cy.get('[data-testid="verify-mfa-button"]').click();
    cy.contains('enabled').should('be.visible');
  });

  it('should disable MFA', () => {
    cy.contains('Security').click();
    cy.get('[data-testid="disable-mfa-button"]').click();
    cy.get('input[name="password"]').type('Password123!');
    cy.get('[data-testid="confirm-disable-button"]').click();
    cy.contains('disabled').should('be.visible');
  });

  it('should manage connected integrations', () => {
    cy.contains('Integrations').click();
    cy.get('[data-testid="integration-card"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="connect-integration-button"]').first().click();
  });

  it('should view integration status', () => {
    cy.contains('Integrations').click();
    cy.get('[data-testid="integration-status"]').should('contain', /connected|disconnected/i);
  });

  it('should create webhook', () => {
    cy.contains('Webhooks').click();
    cy.get('[data-testid="create-webhook-button"]').click();
    cy.get('input[name="webhookUrl"]').type('https://example.com/webhook');
    cy.get('[data-testid="event-select"]').click();
    cy.contains('prospect_updated').click();
    cy.get('[data-testid="create-button"]').click();
    cy.contains('created').should('be.visible');
  });

  it('should test webhook delivery', () => {
    cy.contains('Webhooks').click();
    cy.get('[data-testid="webhook-row"]').first().click();
    cy.get('[data-testid="test-webhook-button"]').click();
    cy.contains(/success|failed/i).should('be.visible');
  });

  it('should delete webhook', () => {
    cy.contains('Webhooks').click();
    cy.get('[data-testid="webhook-row"]').first().click();
    cy.get('[data-testid="delete-webhook-button"]').click();
    cy.contains('Confirm').click();
    cy.contains('deleted').should('be.visible');
  });

  it('should validate email change', () => {
    cy.contains('Profile').click();
    cy.get('input[name="email"]').clear().type('invalid-email');
    cy.get('[data-testid="save-button"]').click();
    cy.contains('invalid').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.verifyResponsive('mobile');
    cy.get('[data-testid="settings-tabs"]').should('exist');
  });
});

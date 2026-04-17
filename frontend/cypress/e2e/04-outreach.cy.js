describe('Outreach Campaign Management', () => {
  beforeEach(() => {
    cy.login();
    cy.navigateToScreen('outreach');
  });

  it('should display outreach campaigns', () => {
    cy.get('[data-testid="campaigns-list"]').should('exist');
    cy.get('[data-testid="campaign-card"]').should('have.length.greaterThan', 0);
  });

  it('should create new campaign', () => {
    cy.get('[data-testid="create-campaign-button"]').click();
    cy.get('[data-testid="campaign-form"]').should('be.visible');
    cy.get('input[name="campaignName"]').type('Q2 Outreach');
    cy.get('textarea[name="message"]').type('Hello, interested in our services?');
    cy.get('[data-testid="select-recipients"]').click();
    cy.get('[data-testid="recipient-checkbox"]').first().click();
    cy.get('button[type="submit"]').click();
    cy.contains('Campaign created').should('be.visible');
  });

  it('should view campaign details', () => {
    cy.get('[data-testid="campaign-card"]').first().click();
    cy.get('[data-testid="campaign-details"]').should('be.visible');
    cy.contains('Message').should('be.visible');
    cy.contains('Recipients').should('be.visible');
  });

  it('should view queue status', () => {
    cy.get('[data-testid="campaign-card"]').first().click();
    cy.get('[data-testid="queue-status"]').should('be.visible');
    cy.get('[data-testid="sent-count"]').should('exist');
    cy.get('[data-testid="pending-count"]').should('exist');
  });

  it('should pause campaign', () => {
    cy.get('[data-testid="campaign-card"]').first().click();
    cy.get('[data-testid="pause-button"]').click();
    cy.contains('paused').should('be.visible');
  });

  it('should resume campaign', () => {
    cy.get('[data-testid="campaign-card"]').first().click();
    cy.get('[data-testid="resume-button"]').click();
    cy.contains('resumed').should('be.visible');
  });

  it('should view campaign analytics', () => {
    cy.get('[data-testid="campaign-card"]').first().click();
    cy.get('[data-testid="analytics-tab"]').click();
    cy.get('[data-testid="open-rate"]').should('exist');
    cy.get('[data-testid="click-rate"]').should('exist');
    cy.get('[data-testid="response-rate"]').should('exist');
  });

  it('should filter campaigns by status', () => {
    cy.get('[data-testid="filter-status"]').click();
    cy.contains('Active').click();
    cy.get('[data-testid="campaign-card"]').each(($card) => {
      cy.wrap($card).should('contain', 'Active');
    });
  });

  it('should schedule campaign', () => {
    cy.get('[data-testid="create-campaign-button"]').click();
    cy.get('input[name="campaignName"]').type('Scheduled Campaign');
    cy.get('[data-testid="schedule-toggle"]').click();
    cy.get('input[type="datetime-local"]').type('2024-05-01T09:00');
    cy.get('button[type="submit"]').click();
    cy.contains('scheduled').should('be.visible');
  });

  it('should handle real-time queue updates', () => {
    cy.get('[data-testid="campaign-card"]').first().click();
    const initialSentCount = cy.get('[data-testid="sent-count"]').invoke('text');
    cy.wait(3000);
    cy.get('[data-testid="sent-count"]').should('exist');
  });

  it('should delete campaign', () => {
    cy.get('[data-testid="campaign-card"]').first().click();
    cy.get('[data-testid="delete-button"]').click();
    cy.contains('Confirm').click();
    cy.contains('deleted').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.verifyResponsive('mobile');
    cy.get('[data-testid="campaigns-list"]').should('exist');
    cy.get('[data-testid="create-campaign-button"]').should('be.visible');
  });
});

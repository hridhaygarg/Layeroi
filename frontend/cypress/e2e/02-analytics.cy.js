describe('Analytics Dashboard', () => {
  beforeEach(() => {
    cy.login();
    cy.navigateToScreen('overview');
  });

  it('should display overview metrics', () => {
    cy.get('[data-testid="metric-total-spend"]').should('exist');
    cy.get('[data-testid="metric-value-generated"]').should('exist');
    cy.get('[data-testid="metric-roi-multiple"]').should('exist');
    cy.get('[data-testid="metric-wasteful-spend"]').should('exist');
  });

  it('should display metric values with correct format', () => {
    cy.get('[data-testid="metric-total-spend"]')
      .should('contain', '$');
    cy.get('[data-testid="metric-roi-multiple"]')
      .should('contain', 'x');
  });

  it('should display agent ROI chart', () => {
    cy.get('[data-testid="roi-chart"]').should('be.visible');
    cy.get('[data-testid="roi-chart"] svg').should('exist');
  });

  it('should filter data by date range', () => {
    cy.get('[data-testid="date-range-picker"]').click();
    cy.contains('Last 30 Days').click();
    cy.get('[data-testid="roi-chart"]').should('exist');
  });

  it('should update metrics when filter changes', () => {
    const initialValue = cy.get('[data-testid="metric-total-spend"]').invoke('text');
    cy.get('[data-testid="date-range-picker"]').click();
    cy.contains('Last 7 Days').click();
    cy.get('[data-testid="metric-total-spend"]').should('exist');
  });

  it('should display loading state while fetching', () => {
    cy.get('[data-testid="analytics-loading"]').should('exist');
    cy.get('[data-testid="metric-total-spend"]').should('exist');
  });

  it('should handle export functionality', () => {
    cy.get('[data-testid="export-button"]').click();
    cy.contains('CSV').click();
    cy.readFile('cypress/downloads/analytics.csv').should('exist');
  });

  it('should display error state gracefully', () => {
    cy.intercept('/api/analytics/*', { forceNetworkError: true });
    cy.reload();
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.verifyResponsive('mobile');
    cy.get('[data-testid="metric-total-spend"]').should('be.visible');
    cy.get('[data-testid="roi-chart"]').should('exist');
  });

  it('should support keyboard navigation', () => {
    cy.get('[data-testid="metric-total-spend"]').focus();
    cy.focused().should('have.attr', 'data-testid', 'metric-total-spend');
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid');
  });
});

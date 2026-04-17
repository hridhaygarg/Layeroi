describe('Prospects Management', () => {
  beforeEach(() => {
    cy.login();
    cy.navigateToScreen('agents');
  });

  it('should display prospects list', () => {
    cy.get('[data-testid="prospects-table"]').should('exist');
    cy.get('[data-testid="prospect-row"]').should('have.length.greaterThan', 0);
  });

  it('should create new prospect', () => {
    cy.get('[data-testid="create-prospect-button"]').click();
    cy.get('[data-testid="prospect-form"]').should('be.visible');
    cy.get('input[name="name"]').type('Acme Corp');
    cy.get('input[name="email"]').type('contact@acme.com');
    cy.get('input[name="company"]').type('Acme Inc');
    cy.get('button[type="submit"]').click();
    cy.contains('Prospect created').should('be.visible');
  });

  it('should view prospect details', () => {
    cy.get('[data-testid="prospect-row"]').first().click();
    cy.get('[data-testid="prospect-details"]').should('be.visible');
    cy.contains('Edit').should('be.visible');
    cy.contains('Delete').should('be.visible');
  });

  it('should update prospect status', () => {
    cy.get('[data-testid="prospect-row"]').first().click();
    cy.get('[data-testid="status-select"]').click();
    cy.contains('Contacted').click();
    cy.contains('saved').should('be.visible');
  });

  it('should filter prospects by status', () => {
    cy.get('[data-testid="filter-status"]').click();
    cy.contains('Active').click();
    cy.get('[data-testid="prospect-row"]').each(($row) => {
      cy.wrap($row).should('contain', 'Active');
    });
  });

  it('should search prospects', () => {
    cy.get('[data-testid="search-input"]').type('Acme');
    cy.get('[data-testid="prospect-row"]').should('contain', 'Acme');
  });

  it('should sort prospects by column', () => {
    cy.get('[data-testid="sort-by-name"]').click();
    cy.get('[data-testid="prospect-row"]').first().should('contain', 'A');
  });

  it('should handle bulk actions', () => {
    cy.get('[data-testid="select-all-checkbox"]').click();
    cy.get('[data-testid="bulk-action-menu"]').click();
    cy.contains('Change Status').click();
    cy.contains('Contacted').click();
    cy.contains('selected').should('be.visible');
  });

  it('should export prospects data', () => {
    cy.get('[data-testid="export-button"]').click();
    cy.contains('CSV').click();
    cy.readFile('cypress/downloads/prospects.csv').should('exist');
  });

  it('should delete prospect', () => {
    cy.get('[data-testid="prospect-row"]').first().click();
    cy.get('[data-testid="delete-button"]').click();
    cy.contains('Confirm').click();
    cy.contains('deleted').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="create-prospect-button"]').click();
    cy.get('button[type="submit"]').click();
    cy.contains('required').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.verifyResponsive('mobile');
    cy.get('[data-testid="prospects-table"]').should('exist');
    cy.get('[data-testid="create-prospect-button"]').should('be.visible');
  });
});

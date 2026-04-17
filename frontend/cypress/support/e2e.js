// E2E test support file

// Helper command: login
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Helper command: logout
Cypress.Commands.add('logout', () => {
  cy.get('[aria-label="user-menu"]').click();
  cy.contains('Logout').click();
  cy.url().should('include', '/login');
});

// Helper command: navigate to screen
Cypress.Commands.add('navigateToScreen', (screenName) => {
  cy.get(`[data-screen="${screenName}"]`).click();
  cy.get(`[data-current-screen="${screenName}"]`).should('exist');
});

// Helper command: check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Helper command: verify responsive
Cypress.Commands.add('verifyResponsive', (viewport) => {
  const viewports = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1280, 720],
  };
  const [width, height] = viewports[viewport];
  cy.viewport(width, height);
});

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

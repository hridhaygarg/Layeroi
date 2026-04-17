describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login page', () => {
    cy.visit('/login');
    cy.contains('Login').should('be.visible');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should validate email format', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    cy.contains('email').should('exist');
  });

  it('should validate password requirement', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should handle login with valid credentials', () => {
    cy.login('demo@layeroi.com', 'DemoPassword123!');
    cy.get('[data-testid="dashboard-header"]').should('exist');
    cy.url().should('include', '/dashboard');
  });

  it('should display error on invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains(/invalid|incorrect|failed/i).should('be.visible');
  });

  it('should handle signup flow', () => {
    cy.visit('/signup');
    cy.contains('Sign Up').should('be.visible');
    cy.get('input[placeholder*="email"]').type('newuser@example.com');
    cy.get('input[placeholder*="password"]').type('SecurePass123!');
    cy.get('input[placeholder*="confirm"]').type('SecurePass123!');
    cy.get('button[type="submit"]').click();
  });

  it('should logout successfully', () => {
    cy.login();
    cy.logout();
    cy.url().should('include', '/login');
  });

  it('should maintain session on page refresh', () => {
    cy.login();
    cy.reload();
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="dashboard-header"]').should('exist');
  });

  it('should redirect to login when accessing protected route', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});

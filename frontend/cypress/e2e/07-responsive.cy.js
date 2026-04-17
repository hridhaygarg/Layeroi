describe('Responsive Design - All Screens', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'mobile-large', width: 414, height: 896 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'laptop', width: 1024, height: 768 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach(({ name, width, height }) => {
    describe(`${name} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.login();
        cy.viewport(width, height);
      });

      it(`should display analytics on ${name}`, () => {
        cy.navigateToScreen('overview');
        cy.get('[data-testid="metric-total-spend"]').should('be.visible');
        cy.get('[data-testid="roi-chart"]').should('exist');
      });

      it(`should display prospects on ${name}`, () => {
        cy.navigateToScreen('agents');
        cy.get('[data-testid="prospects-table"]').should('exist');
        cy.get('[data-testid="create-prospect-button"]').should('be.visible');
      });

      it(`should display outreach on ${name}`, () => {
        cy.navigateToScreen('outreach');
        cy.get('[data-testid="campaigns-list"]').should('exist');
      });

      it(`should display settings on ${name}`, () => {
        cy.get('[data-testid="user-menu"]').click();
        cy.contains('Settings').click();
        cy.get('[data-testid="settings-tabs"]').should('exist');
      });

      it(`should have touch-friendly buttons on ${name}`, () => {
        cy.get('button').each(($button) => {
          cy.wrap($button).should('have.css', 'min-height').and('be.gte', '44px');
        });
      });

      it(`should handle sidebar on ${name}`, () => {
        if (width < 768) {
          cy.get('[data-testid="hamburger-menu"]').should('be.visible');
        } else if (width < 1024) {
          cy.get('[data-testid="sidebar-collapsed"]').should('exist');
        } else {
          cy.get('[data-testid="sidebar-full"]').should('exist');
        }
      });

      it(`should stack forms vertically on ${name}`, () => {
        cy.navigateToScreen('agents');
        cy.get('[data-testid="create-prospect-button"]').click();
        cy.get('[data-testid="prospect-form"]').should('exist');
        cy.get('input').each(($input) => {
          cy.wrap($input).should('have.css', 'display').and('not.equal', 'inline');
        });
      });

      it(`should handle modals on ${name}`, () => {
        cy.navigateToScreen('agents');
        cy.get('[data-testid="create-prospect-button"]').click();
        cy.get('[data-testid="modal-content"]').should('be.visible');
        if (width < 768) {
          cy.get('[data-testid="modal-content"]')
            .should('have.css', 'width')
            .and('be.gte', '375px');
        }
      });

      it(`should have readable text on ${name}`, () => {
        cy.get('body').should('have.css', 'font-size');
        cy.get('h1, h2, h3').each(($heading) => {
          cy.wrap($heading).should('be.visible');
        });
      });

      it(`should not have horizontal overflow on ${name}`, () => {
        cy.get('body').should('not.have.css', 'overflow-x', 'auto');
        cy.get('[data-testid="layout"]').invoke('outerWidth').should('be.lte', width);
      });

      it(`should have proper spacing on ${name}`, () => {
        cy.get('[data-testid="content-area"]').should('have.css', 'padding');
      });

      it(`should display navigation on ${name}`, () => {
        if (width < 768) {
          cy.get('[data-testid="hamburger-menu"]').should('exist');
        } else {
          cy.get('[data-testid="sidebar"]').should('exist');
        }
      });
    });
  });
});

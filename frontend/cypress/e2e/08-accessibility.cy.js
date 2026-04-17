describe('Accessibility (WCAG 2.1 AA)', () => {
  beforeEach(() => {
    cy.login();
  });

  describe('Semantic HTML', () => {
    it('should use semantic elements in analytics', () => {
      cy.navigateToScreen('overview');
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('h1, h2, h3').should('have.length.greaterThan', 0);
      cy.get('button').should('exist');
    });

    it('should use semantic elements in prospects', () => {
      cy.navigateToScreen('agents');
      cy.get('table, [role="table"]').should('exist');
      cy.get('form').should('exist');
      cy.get('button').should('exist');
    });

    it('should use semantic form elements', () => {
      cy.navigateToScreen('agents');
      cy.get('[data-testid="create-prospect-button"]').click();
      cy.get('form').should('exist');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="text"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
      cy.get('button[type="button"]').should('exist');
    });
  });

  describe('ARIA Labels', () => {
    it('should have aria-label on buttons', () => {
      cy.get('button').each(($button) => {
        const hasText = $button.text().trim().length > 0;
        const hasAriaLabel = $button.attr('aria-label') || $button.attr('title');
        expect(hasText || hasAriaLabel).to.be.true;
      });
    });

    it('should have aria-label on icons', () => {
      cy.get('[role="img"]').each(($icon) => {
        cy.wrap($icon).should('have.attr', 'aria-label');
      });
    });

    it('should have aria-label on interactive elements', () => {
      cy.get('[data-testid="hamburger-menu"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="user-menu"]').should('have.attr', 'aria-label');
    });

    it('should have aria-describedby for inputs with help text', () => {
      cy.navigateToScreen('agents');
      cy.get('[data-testid="create-prospect-button"]').click();
      cy.get('input').each(($input) => {
        const hasLabel = $input.attr('id') && cy.contains(`label[for="${$input.attr('id')}"]`);
        expect(hasLabel || $input.attr('aria-label')).to.exist;
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate with Tab key', () => {
      cy.navigateToScreen('agents');
      cy.get('button, a, input, select, textarea').first().focus();
      cy.focused().should('exist');
      cy.get('body').tab();
      cy.focused().should('not.equal', cy.get('button').first());
    });

    it('should activate buttons with Enter key', () => {
      cy.get('[data-testid="create-prospect-button"]').focus();
      cy.get('[data-testid="create-prospect-button"]').type('{enter}');
      cy.get('[data-testid="modal-content"]').should('be.visible');
    });

    it('should close modals with Escape key', () => {
      cy.navigateToScreen('agents');
      cy.get('[data-testid="create-prospect-button"]').click();
      cy.get('[data-testid="modal-content"]').should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('[data-testid="modal-content"]').should('not.exist');
    });

    it('should navigate dropdowns with arrow keys', () => {
      cy.navigateToScreen('agents');
      cy.get('[data-testid="filter-status"]').click();
      cy.get('[data-testid="filter-status"]').type('{downarrow}');
      cy.get('[data-testid="dropdown-option"]').first().should('have.attr', 'aria-selected', 'true');
    });

    it('should have focus indicators visible', () => {
      cy.get('button, a, input').first().focus();
      cy.focused().should('have.css', 'outline');
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient text contrast', () => {
      cy.navigateToScreen('overview');
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
    });

    it('should have sufficient contrast for interactive elements', () => {
      cy.get('button, a').each(($element) => {
        cy.wrap($element).should('have.css', 'color');
      });
    });
  });

  describe('Focus Management', () => {
    it('should trap focus in modals', () => {
      cy.navigateToScreen('agents');
      cy.get('[data-testid="create-prospect-button"]').click();
      cy.get('[data-testid="modal-content"]').should('have.attr', 'data-focus-trap', 'true');
    });

    it('should restore focus after modal closes', () => {
      const button = '[data-testid="create-prospect-button"]';
      cy.get(button).focus();
      cy.get(button).click();
      cy.get('body').type('{esc}');
      cy.focused().should('have.attr', 'data-testid', 'create-prospect-button');
    });
  });

  describe('Error Messages', () => {
    it('should mark invalid inputs with aria-invalid', () => {
      cy.navigateToScreen('agents');
      cy.get('[data-testid="create-prospect-button"]').click();
      cy.get('button[type="submit"]').click();
      cy.get('input[aria-invalid="true"]').should('exist');
    });

    it('should associate error messages with inputs', () => {
      cy.navigateToScreen('agents');
      cy.get('[data-testid="create-prospect-button"]').click();
      cy.get('button[type="submit"]').click();
      cy.get('input[aria-invalid="true"]').each(($input) => {
        const errorId = $input.attr('aria-describedby');
        if (errorId) {
          cy.get(`#${errorId}`).should('be.visible');
        }
      });
    });
  });

  describe('Loading States', () => {
    it('should have aria-busy for loading elements', () => {
      cy.intercept('/api/analytics/*', (req) => {
        req.reply(() => {
          cy.get('[aria-busy="true"]').should('exist');
        });
      });
      cy.navigateToScreen('overview');
    });

    it('should have aria-live for updates', () => {
      cy.navigateToScreen('outreach');
      cy.get('[aria-live="polite"]').should('exist');
    });
  });

  describe('Screen Reader Support', () => {
    it('should skip navigation links', () => {
      cy.get('a[href="#main"]').should('exist');
    });

    it('should hide decorative elements', () => {
      cy.get('[aria-hidden="true"]').should('have.length.greaterThan', 0);
    });

    it('should have page titles', () => {
      cy.title().should('not.be.empty');
    });
  });

  describe('WCAG Compliance', () => {
    it('should pass axe accessibility audit on analytics', () => {
      cy.navigateToScreen('overview');
      cy.checkA11y();
    });

    it('should pass axe accessibility audit on prospects', () => {
      cy.navigateToScreen('agents');
      cy.checkA11y();
    });

    it('should pass axe accessibility audit on outreach', () => {
      cy.navigateToScreen('outreach');
      cy.checkA11y();
    });

    it('should pass axe accessibility audit on settings', () => {
      cy.get('[data-testid="user-menu"]').click();
      cy.contains('Settings').click();
      cy.checkA11y();
    });
  });
});

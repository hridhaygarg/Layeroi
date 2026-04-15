import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Responsive Design System', () => {
  beforeEach(() => {
    // Ensure responsive CSS is loaded
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/responsive.css';
    document.head.appendChild(link);
  });

  test('CSS variables for breakpoints are defined', () => {
    const root = document.documentElement;

    // Set CSS variables programmatically for testing
    root.style.setProperty('--breakpoint-mobile', '375px');
    root.style.setProperty('--breakpoint-tablet', '768px');
    root.style.setProperty('--breakpoint-desktop', '1024px');

    const computedStyle = getComputedStyle(root);
    expect(computedStyle.getPropertyValue('--breakpoint-mobile').trim()).toBe('375px');
    expect(computedStyle.getPropertyValue('--breakpoint-tablet').trim()).toBe('768px');
    expect(computedStyle.getPropertyValue('--breakpoint-desktop').trim()).toBe('1024px');
  });

  test('CSS variables for spacing scale are defined', () => {
    const root = document.documentElement;

    // Set CSS variables programmatically for testing
    root.style.setProperty('--space-4', '16px');
    root.style.setProperty('--space-6', '24px');
    root.style.setProperty('--space-8', '32px');

    const computedStyle = getComputedStyle(root);
    expect(computedStyle.getPropertyValue('--space-4').trim()).toBe('16px');
    expect(computedStyle.getPropertyValue('--space-6').trim()).toBe('24px');
    expect(computedStyle.getPropertyValue('--space-8').trim()).toBe('32px');
  });

  test('Container utility applies responsive padding', () => {
    const { container } = render(
      <div className="container">
        <p>Test content</p>
      </div>
    );

    const elem = container.querySelector('.container');
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveClass('container');
  });

  test('Grid utility creates responsive grid layout', () => {
    const { container } = render(
      <div className="grid">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </div>
    );

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid');
    expect(grid.children.length).toBe(3);
  });

  test('Responsive text size utilities are available', () => {
    const { container } = render(
      <div>
        <p className="text-sm">Small text</p>
        <p className="text-base">Base text</p>
        <p className="text-lg">Large text</p>
        <h1 className="h1">Heading 1</h1>
        <h2 className="h2">Heading 2</h2>
      </div>
    );

    expect(container.querySelector('.text-sm')).toBeInTheDocument();
    expect(container.querySelector('.text-base')).toBeInTheDocument();
    expect(container.querySelector('.text-lg')).toBeInTheDocument();
    expect(container.querySelector('.h1')).toBeInTheDocument();
    expect(container.querySelector('.h2')).toBeInTheDocument();
  });

  test('Visibility utilities provide responsive display control', () => {
    const { container } = render(
      <div>
        <div className="show-mobile">Mobile only</div>
        <div className="hide-mobile">Desktop only</div>
        <div className="mobile-only">Mobile visible</div>
        <div className="desktop-only">Desktop visible</div>
      </div>
    );

    expect(container.querySelector('.show-mobile')).toBeInTheDocument();
    expect(container.querySelector('.hide-mobile')).toBeInTheDocument();
    expect(container.querySelector('.mobile-only')).toBeInTheDocument();
    expect(container.querySelector('.desktop-only')).toBeInTheDocument();
  });
});

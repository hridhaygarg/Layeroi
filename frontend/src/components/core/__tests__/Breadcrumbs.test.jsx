import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumbs } from '../Breadcrumbs';

describe('Breadcrumbs Component', () => {
  // Basic rendering tests
  test('renders breadcrumbs nav', () => {
    render(<Breadcrumbs items={[]} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeInTheDocument();
  });

  test('renders empty breadcrumbs when no items', () => {
    const { container } = render(<Breadcrumbs items={[]} />);
    expect(container.querySelectorAll('span')).toHaveLength(0);
  });

  // Single item test
  test('renders single breadcrumb item', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }]}
      />
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  // Multiple items test
  test('renders multiple breadcrumb items', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Electronics' },
        ]}
      />
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  // Link test
  test('renders links for items with href', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
        ]}
      />
    );
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  // Non-link test
  test('renders text for items without href', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Current Page' },
        ]}
      />
    );
    const textSpan = container.querySelector('span.text-gray-700');
    expect(textSpan).toHaveTextContent('Current Page');
  });

  // Separator test
  test('renders default separator between items', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
        ]}
      />
    );
    const separators = Array.from(
      document.querySelectorAll('span.text-gray-500')
    ).filter(el => el.textContent === '/');
    expect(separators.length).toBeGreaterThanOrEqual(1);
  });

  test('renders custom separator', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
        ]}
        separator=">"
      />
    );
    const separators = Array.from(
      document.querySelectorAll('span.text-gray-500')
    ).filter(el => el.textContent === '>');
    expect(separators.length).toBeGreaterThanOrEqual(1);
  });

  // Styling tests for links
  test('links have correct styling', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }]}
      />
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('text-blue-600', 'text-sm', 'font-medium');
  });

  // Styling tests for non-links
  test('non-link items have correct styling', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Current' },
        ]}
      />
    );
    const textSpan = container.querySelector('span.text-gray-700');
    expect(textSpan).toHaveClass('text-sm', 'font-medium');
  });

  // Separator styling
  test('separators have correct styling', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
        ]}
      />
    );
    const separators = Array.from(
      document.querySelectorAll('span.text-gray-500')
    );
    expect(separators[0]).toHaveClass('text-gray-500', 'text-sm');
  });

  // Custom className test
  test('applies custom className', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }]}
        className="custom-class"
      />
    );
    expect(screen.getByRole('navigation')).toHaveClass('custom-class');
  });

  // No separator between first and second item should be incorrect
  test('first item does not have separator before it', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
        ]}
      />
    );
    const nav = container.querySelector('[role="navigation"]');
    const firstChild = nav.firstChild;
    expect(firstChild.textContent).toContain('Home');
  });

  // Multiple separators test
  test('renders correct number of separators', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Electronics', href: '/electronics' },
          { label: 'Laptops' },
        ]}
      />
    );
    const separators = Array.from(
      document.querySelectorAll('span.text-gray-500')
    ).filter(el => el.textContent === '/');
    expect(separators.length).toBe(3);
  });

  // Link hover styling
  test('links have hover styling', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }]}
      />
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('hover:text-blue-800');
  });
});

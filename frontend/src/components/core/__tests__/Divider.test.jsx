import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Divider } from '../Divider';

describe('Divider Component', () => {
  // Basic rendering tests
  test('renders divider', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  // Orientation tests
  test('renders horizontal divider by default', () => {
    render(<Divider />);
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('border-t', 'w-full');
  });

  test('renders vertical divider', () => {
    render(<Divider orientation="vertical" />);
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('border-l', 'h-6');
  });

  test('uses horizontal by default', () => {
    render(<Divider />);
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('w-full');
  });

  // Margin tests
  test('applies default margin', () => {
    render(<Divider />);
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('my-4');
  });

  test('applies custom margin', () => {
    render(<Divider margin="my-8" />);
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('my-8');
  });

  test('applies no margin when provided', () => {
    render(<Divider margin="" />);
    const divider = screen.getByRole('separator');
    expect(divider).not.toHaveClass('my-4');
  });

  // Color test
  test('has gray-200 border color', () => {
    render(<Divider />);
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('border-gray-200');
  });

  // Custom className test
  test('applies custom className', () => {
    render(<Divider className="custom-class" />);
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('custom-class');
  });

  // Separator role test
  test('has separator role for accessibility', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  // Vertical with custom margin
  test('applies custom margin to vertical divider', () => {
    render(<Divider orientation="vertical" margin="mx-4" />);
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mx-4');
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar } from '../Avatar';

describe('Avatar Component', () => {
  // Image rendering tests
  test('renders image avatar when src is provided', () => {
    render(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="User Avatar"
      />
    );
    const img = screen.getByAltText('User Avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('renders image with rounded-full class', () => {
    render(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="User"
      />
    );
    const img = screen.getByAltText('User');
    expect(img).toHaveClass('rounded-full', 'object-cover');
  });

  // Initials rendering tests
  test('renders initials when src is not provided', () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('renders fallback ? when no src and no initials', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  test('prefers initials over default when src is not provided', () => {
    render(<Avatar initials="AB" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.queryByText('?')).not.toBeInTheDocument();
  });

  // Size tests
  test('applies small size class to initials', () => {
    render(<Avatar initials="SM" size="sm" />);
    const avatar = screen.getByText('SM');
    expect(avatar).toHaveClass('h-8', 'w-8', 'text-xs');
  });

  test('applies medium size class to initials', () => {
    render(<Avatar initials="MD" size="md" />);
    const avatar = screen.getByText('MD');
    expect(avatar).toHaveClass('h-10', 'w-10', 'text-sm');
  });

  test('applies large size class to initials', () => {
    render(<Avatar initials="LG" size="lg" />);
    const avatar = screen.getByText('LG');
    expect(avatar).toHaveClass('h-12', 'w-12', 'text-base');
  });

  test('defaults to medium size', () => {
    render(<Avatar initials="MD" />);
    const avatar = screen.getByText('MD');
    expect(avatar).toHaveClass('h-10', 'w-10', 'text-sm');
  });

  test('applies size class to image', () => {
    render(
      <Avatar
        src="https://example.com/avatar.jpg"
        size="lg"
        alt="User"
      />
    );
    const img = screen.getByAltText('User');
    expect(img).toHaveClass('h-12', 'w-12', 'text-base');
  });

  // Styling tests
  test('has rounded-full class for initials', () => {
    render(<Avatar initials="AB" />);
    expect(screen.getByText('AB')).toHaveClass('rounded-full');
  });

  test('has correct background and text colors for initials', () => {
    render(<Avatar initials="AB" />);
    const avatar = screen.getByText('AB');
    expect(avatar).toHaveClass('bg-gray-300', 'text-gray-700');
  });

  test('has font-semibold class for initials', () => {
    render(<Avatar initials="AB" />);
    expect(screen.getByText('AB')).toHaveClass('font-semibold');
  });

  // Custom className test
  test('applies custom className to initials avatar', () => {
    render(<Avatar initials="AB" className="custom-class" />);
    expect(screen.getByText('AB')).toHaveClass('custom-class');
  });

  test('applies custom className to image avatar', () => {
    render(
      <Avatar
        src="https://example.com/avatar.jpg"
        className="custom-class"
        alt="User"
      />
    );
    expect(screen.getByAltText('User')).toHaveClass('custom-class');
  });

  // Alt text test
  test('uses provided alt text for image', () => {
    render(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="John Doe Avatar"
      />
    );
    expect(screen.getByAltText('John Doe Avatar')).toBeInTheDocument();
  });

  test('defaults to "Avatar" alt text', () => {
    render(<Avatar src="https://example.com/avatar.jpg" />);
    expect(screen.getByAltText('Avatar')).toBeInTheDocument();
  });

  // Priority test
  test('prefers image over initials when both provided', () => {
    render(
      <Avatar
        src="https://example.com/avatar.jpg"
        initials="JD"
        alt="User"
      />
    );
    expect(screen.getByAltText('User')).toBeInTheDocument();
    expect(screen.queryByText('JD')).not.toBeInTheDocument();
  });
});

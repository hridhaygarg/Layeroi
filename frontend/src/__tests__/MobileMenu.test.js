import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MobileMenu } from '../components/MobileMenu';

describe('MobileMenu Component', () => {
  const mockItems = [
    {
      id: '1',
      label: 'Dashboard',
      submenu: null,
    },
    {
      id: '2',
      label: 'Settings',
      submenu: [
        { id: '2-1', label: 'Account' },
        { id: '2-2', label: 'Privacy' },
      ],
    },
    {
      id: '3',
      label: 'Logout',
      submenu: null,
    },
  ];

  test('renders menu toggle button', () => {
    render(
      <MobileMenu items={mockItems} isOpen={false} onToggle={() => {}} />
    );

    const toggleButton = screen.getByRole('button', { name: /open menu/i });
    expect(toggleButton).toBeInTheDocument();
  });

  test('toggles menu visibility on button click', () => {
    const onToggle = jest.fn();
    const { rerender } = render(
      <MobileMenu items={mockItems} isOpen={false} onToggle={onToggle} />
    );

    const toggleButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(toggleButton);

    expect(onToggle).toHaveBeenCalled();
  });

  test('renders menu items when open', () => {
    render(
      <MobileMenu items={mockItems} isOpen={true} onToggle={() => {}} />
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls onItemClick when menu item is clicked', () => {
    const onItemClick = jest.fn();
    render(
      <MobileMenu
        items={mockItems}
        isOpen={true}
        onToggle={() => {}}
        onItemClick={onItemClick}
      />
    );

    const dashboardItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardItem);

    expect(onItemClick).toHaveBeenCalled();
  });

  test('renders submenu items for menu items with submenu', () => {
    render(
      <MobileMenu items={mockItems} isOpen={true} onToggle={() => {}} />
    );

    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);

    // Submenu items should be rendered
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  test('handles empty items list gracefully', () => {
    render(
      <MobileMenu items={[]} isOpen={true} onToggle={() => {}} />
    );

    expect(screen.getByText('No menu items')).toBeInTheDocument();
  });
});

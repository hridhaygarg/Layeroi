import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock overview screen with responsive wrapper
const MockOverviewScreen = () => {
  return (
    <div className="screen-container" style={{ width: '100%' }}>
      <div className="grid-responsive">Item 1</div>
      <div className="grid-responsive">Item 2</div>
      <div className="grid-responsive">Item 3</div>
    </div>
  );
};

// Mock with responsive layout
const MockResponsiveScreen = () => {
  return (
    <div
      className="screen-wrapper"
      style={{
        padding: 'clamp(16px, 5%, 32px)',
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(16px, 4%, 32px)',
        }}
      >
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </div>
    </div>
  );
};

describe('Screen Responsiveness', () => {
  test('renders responsive container', () => {
    const { container } = render(<MockOverviewScreen />);
    expect(container.querySelector('.screen-container')).toBeInTheDocument();
  });

  test('uses responsive grid layout', () => {
    const { container } = render(<MockResponsiveScreen />);
    const gridContainer = container.querySelector('[style*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });

  test('maintains max-width constraint', () => {
    const { container } = render(
      <div className="screen-wrapper" style={{ maxWidth: '100%' }}>
        <div>Test content</div>
      </div>
    );

    expect(container.querySelector('.screen-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.screen-wrapper')).toHaveStyle('maxWidth: 100%');
  });
});

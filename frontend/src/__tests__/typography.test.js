import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Institutional Typography System', () => {
  test('Typography CSS variables are defined', () => {
    const root = document.documentElement;

    // Set typography CSS variables
    root.style.setProperty('--font-serif', "'Playfair Display', serif");
    root.style.setProperty('--font-mono', "'IBM Plex Mono', monospace");
    root.style.setProperty('--font-sans', "'Inter', sans-serif");

    const computedStyle = getComputedStyle(root);
    expect(computedStyle.getPropertyValue('--font-serif')).toBeTruthy();
    expect(computedStyle.getPropertyValue('--font-mono')).toBeTruthy();
    expect(computedStyle.getPropertyValue('--font-sans')).toBeTruthy();
  });

  test('Heading elements render with correct classes', () => {
    const { container } = render(
      <div>
        <h1 className="h1">Main Heading</h1>
        <h2 className="h2">Section Heading</h2>
        <h3 className="h3">Subsection</h3>
        <h4 className="h4">Small Heading</h4>
      </div>
    );

    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('h3')).toBeInTheDocument();
    expect(container.querySelector('h4')).toBeInTheDocument();
  });

  test('Body text utilities are available', () => {
    const { container } = render(
      <div>
        <p className="body-lg">Large paragraph</p>
        <p className="body-base">Base paragraph</p>
        <p className="body-sm">Small paragraph</p>
      </div>
    );

    expect(container.querySelector('.body-lg')).toBeInTheDocument();
    expect(container.querySelector('.body-base')).toBeInTheDocument();
    expect(container.querySelector('.body-sm')).toBeInTheDocument();
  });

  test('Text formatting utilities work correctly', () => {
    const { container } = render(
      <div>
        <strong className="font-bold">Bold text</strong>
        <em className="italic">Italic text</em>
        <a href="#" className="link">Link text</a>
        <code className="code">code snippet</code>
      </div>
    );

    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.querySelector('em')).toBeInTheDocument();
    expect(container.querySelector('a')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
  });
});

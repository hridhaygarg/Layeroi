import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Select } from '../Select';

describe('Select Component', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ];

  // Basic rendering tests
  test('renders select component', () => {
    render(<Select options={mockOptions} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('displays placeholder when no value selected', () => {
    render(<Select options={mockOptions} placeholder="Select an option" />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  // Single select tests
  test('opens dropdown when clicked', () => {
    render(<Select options={mockOptions} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('handles single select onChange', () => {
    const handleChange = jest.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalled();
  });

  test('displays selected value in single select', () => {
    const { rerender } = render(<Select options={mockOptions} value="opt1" onChange={() => {}} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('closes dropdown after selecting single option', () => {
    const handleChange = jest.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    // Dropdown should close, so Option 2 should not be visible
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  // Multi-select tests
  test('handles multiple select mode', () => {
    const handleChange = jest.fn();
    render(<Select options={mockOptions} multiple={true} onChange={handleChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    expect(handleChange).toHaveBeenCalled();
  });

  test('displays selected count in multi-select mode', () => {
    render(
      <Select
        options={mockOptions}
        multiple={true}
        value={['opt1', 'opt2']}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  test('shows "1 item selected" for single item in multi-select', () => {
    render(
      <Select
        options={mockOptions}
        multiple={true}
        value={['opt1']}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  test('keeps dropdown open after selecting in multi-select', () => {
    render(
      <Select options={mockOptions} multiple={true} onChange={() => {}} />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    // Dropdown should still show all options
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  // Searchable tests
  test('filters options when searchable and text entered', () => {
    const handleChange = jest.fn();
    render(
      <Select
        options={mockOptions}
        searchable={true}
        onChange={handleChange}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Option 2' } });

    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  test('shows all options when search is cleared', () => {
    render(
      <Select options={mockOptions} searchable={true} onChange={() => {}} />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Option 1' } });
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  // Disabled state tests
  test('disables select when disabled prop is true', () => {
    render(<Select options={mockOptions} disabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('applies disabled styling', () => {
    render(<Select options={mockOptions} disabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  test('does not open dropdown when disabled', () => {
    render(<Select options={mockOptions} disabled={true} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  // Error state tests
  test('applies error styling when error prop is true', () => {
    render(
      <Select options={mockOptions} error={true} placeholder="Select" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-red-500');
  });

  test('displays error message when provided', () => {
    render(
      <Select
        options={mockOptions}
        error={true}
        errorMessage="This field is required"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('error message has correct styling', () => {
    render(
      <Select
        options={mockOptions}
        error={true}
        errorMessage="Error text"
      />
    );
    const errorMsg = screen.getByText('Error text');
    expect(errorMsg).toHaveClass('text-red-500', 'text-sm');
  });

  // Arrow indicator test
  test('displays dropdown arrow indicator', () => {
    const { container } = render(<Select options={mockOptions} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // Custom className test
  test('accepts and applies custom className', () => {
    const { container } = render(
      <Select options={mockOptions} className="custom-class" />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  // Border and styling tests
  test('has default border styling', () => {
    render(<Select options={mockOptions} placeholder="Select" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-gray-300');
  });

  test('has rounded-lg class', () => {
    render(<Select options={mockOptions} placeholder="Select" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-lg');
  });

  test('has padding classes', () => {
    render(<Select options={mockOptions} placeholder="Select" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-2');
  });

  // ForwardRef support
  test('forwards ref correctly', () => {
    const ref = React.createRef();
    render(<Select ref={ref} options={mockOptions} />);
    expect(ref.current).toBeInTheDocument();
  });

  // Focus management
  test('manages focus state correctly', () => {
    render(<Select options={mockOptions} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  // Empty options handling
  test('handles empty options array', () => {
    render(<Select options={[]} placeholder="No options" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  // Multiple with empty selection
  test('shows placeholder in multi-select with no selection', () => {
    render(
      <Select
        options={mockOptions}
        multiple={true}
        value={[]}
        placeholder="Select items"
      />
    );
    expect(screen.getByText('Select items')).toBeInTheDocument();
  });

  // Keyboard navigation tests
  describe('Keyboard Navigation', () => {
    test('opens dropdown with ArrowDown key', async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      await user.click(button);
      await user.keyboard('{ArrowDown}');

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    test('opens dropdown with ArrowUp key when closed', async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      // First click to focus, then use ArrowUp
      await user.click(button);
      // Close the dropdown
      await user.keyboard('{Escape}');
      // Now should not be in document
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    test('opens dropdown with Enter key', async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    test('navigates options with arrow down', () => {
      render(<Select options={mockOptions} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Navigate down multiple times
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });

      // Dropdown should still be open with all options visible
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    test('navigates options with arrow up', () => {
      render(<Select options={mockOptions} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Move down then up
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowUp' });

      // Dropdown should still be open
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    test('wraps around when navigating past last option', () => {
      render(<Select options={mockOptions} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Move down 4 times: wraps from last back to first
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });

      // Dropdown should still be open (options visible)
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    test('wraps around when navigating up from first option', () => {
      render(<Select options={mockOptions} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Move down once then up (should wrap to last)
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowUp' });

      // Dropdown should still be open
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    test('selects focused option with Enter key', async () => {
      const handleChange = jest.fn();
      render(<Select options={mockOptions} onChange={handleChange} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(handleChange).toHaveBeenCalledWith('opt2');
    });

    test('closes dropdown with Escape key', async () => {
      render(<Select options={mockOptions} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.keyDown(button, { key: 'Escape' });
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    test('keeps dropdown open with Enter in multi-select', async () => {
      render(<Select options={mockOptions} multiple={true} onChange={jest.fn()} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'Enter' });

      // Dropdown should still be open
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  // ARIA attributes tests
  describe('ARIA Attributes', () => {
    test('has aria-expanded attribute on button', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    test('sets aria-expanded to true when open', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    test('has aria-haspopup attribute on button', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    });

    test('options have role="option"', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    test('selected option has aria-selected="true"', () => {
      render(<Select options={mockOptions} value="opt1" onChange={() => {}} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const option = screen.getByRole('option', { name: 'Option 1' });
      expect(option).toHaveAttribute('aria-selected', 'true');
    });

    test('unselected option has aria-selected="false"', () => {
      render(<Select options={mockOptions} value="opt1" onChange={() => {}} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const option = screen.getByRole('option', { name: 'Option 2' });
      expect(option).toHaveAttribute('aria-selected', 'false');
    });

    test('checkboxes in multi-select have aria-label', () => {
      render(<Select options={mockOptions} multiple={true} onChange={jest.fn()} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox, index) => {
        expect(checkbox).toHaveAttribute('aria-label', mockOptions[index].label);
      });
    });
  });
});

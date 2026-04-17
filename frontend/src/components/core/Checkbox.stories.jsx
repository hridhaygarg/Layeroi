import { useState } from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Core/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Checkbox checked state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the checkbox',
    },
    label: {
      control: { type: 'text' },
      description: 'Checkbox label text',
    },
  },
};

export const Default = {
  args: {
    label: 'Accept terms and conditions',
    checked: false,
  },
};

export const Checked = {
  args: {
    label: 'Option is selected',
    checked: true,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked = {
  args: {
    label: 'Disabled and checked',
    disabled: true,
    checked: true,
  },
};

export const NoLabel = {
  args: {
    checked: false,
  },
};

export const Controlled = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="space-y-2">
        <Checkbox
          {...args}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-gray-600">
          Checkbox is {checked ? 'checked' : 'unchecked'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Toggle me',
  },
};

export const Group = {
  render: (args) => {
    const [selected, setSelected] = useState(new Set());

    const handleChange = (id, checked) => {
      const newSelected = new Set(selected);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      setSelected(newSelected);
    };

    return (
      <div className="space-y-3">
        {['option1', 'option2', 'option3'].map((id) => (
          <Checkbox
            key={id}
            label={`Option ${id.replace('option', '')}`}
            checked={selected.has(id)}
            onChange={(e) => handleChange(id, e.target.checked)}
          />
        ))}
      </div>
    );
  },
};

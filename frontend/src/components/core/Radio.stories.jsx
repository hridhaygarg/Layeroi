import { useState } from 'react';
import { Radio } from './Radio';

export default {
  title: 'Core/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Radio button checked state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the radio button',
    },
    label: {
      control: { type: 'text' },
      description: 'Radio button label text',
    },
  },
};

export const Unchecked = {
  args: {
    label: 'Option A',
    checked: false,
  },
};

export const Checked = {
  args: {
    label: 'Option B',
    checked: true,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled option',
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

export const Group = {
  render: (args) => {
    const [selected, setSelected] = useState('option1');

    return (
      <div className="space-y-3">
        <Radio
          name="choice"
          value="option1"
          label="Option 1"
          checked={selected === 'option1'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Radio
          name="choice"
          value="option2"
          label="Option 2"
          checked={selected === 'option2'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Radio
          name="choice"
          value="option3"
          label="Option 3"
          checked={selected === 'option3'}
          onChange={(e) => setSelected(e.target.value)}
        />
      </div>
    );
  },
};

export const Size = {
  render: (args) => {
    const [selected, setSelected] = useState('small');

    return (
      <div className="space-y-3">
        <Radio
          name="size"
          value="small"
          label="Small"
          checked={selected === 'small'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Radio
          name="size"
          value="medium"
          label="Medium"
          checked={selected === 'medium'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <Radio
          name="size"
          value="large"
          label="Large"
          checked={selected === 'large'}
          onChange={(e) => setSelected(e.target.value)}
        />
      </div>
    );
  },
};

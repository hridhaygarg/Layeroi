import { useState } from 'react';
import { TextArea } from './TextArea';

export default {
  title: 'Core/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    rows: {
      control: { type: 'number' },
      description: 'Number of rows',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the textarea',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Show error state',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Error message text',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Mark as required',
    },
  },
};

export const Default = {
  args: {
    placeholder: 'Enter your message...',
    rows: 3,
  },
};

export const Small = {
  args: {
    placeholder: 'Short message',
    rows: 2,
  },
};

export const Large = {
  args: {
    placeholder: 'Enter detailed content...',
    rows: 6,
  },
};

export const WithValue = {
  args: {
    placeholder: 'Enter your message...',
    value: 'This is some pre-filled content in the textarea.',
    rows: 4,
  },
};

export const WithError = {
  args: {
    placeholder: 'Enter your message...',
    rows: 3,
    error: true,
    errorMessage: 'This field is required and must be filled',
  },
};

export const Disabled = {
  args: {
    placeholder: 'This textarea is disabled',
    rows: 3,
    disabled: true,
  },
};

export const Required = {
  args: {
    placeholder: 'Required field *',
    rows: 3,
    required: true,
  },
};

export const Controlled = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="space-y-2">
        <TextArea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-gray-600">
          Character count: {value.length}
        </p>
      </div>
    );
  },
  args: {
    placeholder: 'Start typing...',
    rows: 4,
  },
};

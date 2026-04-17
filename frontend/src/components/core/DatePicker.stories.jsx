import { useState } from 'react';
import { DatePicker } from './DatePicker';

export default {
  title: 'Core/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the date picker',
    },
  },
};

export const Default = {
  render: (args) => {
    const [date, setDate] = useState('');
    return (
      <DatePicker
        {...args}
        value={date}
        onChange={setDate}
      />
    );
  },
  args: {
    placeholder: 'Select a date...',
  },
};

export const WithInitialValue = {
  render: (args) => {
    const [date, setDate] = useState('2024-04-17');
    return (
      <DatePicker
        {...args}
        value={date}
        onChange={setDate}
      />
    );
  },
  args: {
    placeholder: 'Select a date...',
  },
};

export const Disabled = {
  render: (args) => {
    const [date, setDate] = useState('2024-04-17');
    return (
      <DatePicker
        {...args}
        value={date}
        onChange={setDate}
        disabled={true}
      />
    );
  },
  args: {
    placeholder: 'Select a date...',
  },
};

export const CustomPlaceholder = {
  render: (args) => {
    const [date, setDate] = useState('');
    return (
      <DatePicker
        {...args}
        value={date}
        onChange={setDate}
      />
    );
  },
  args: {
    placeholder: 'Pick your birthday...',
  },
};

export const Controlled = {
  render: (args) => {
    const [date, setDate] = useState('');
    return (
      <div className="space-y-4">
        <DatePicker
          {...args}
          value={date}
          onChange={setDate}
        />
        {date && (
          <p className="text-sm text-gray-600">
            Selected date: {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </div>
    );
  },
  args: {
    placeholder: 'Select a date...',
  },
};

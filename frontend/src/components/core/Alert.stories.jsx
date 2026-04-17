import { useState } from 'react';
import { Alert } from './Alert';

export default {
  title: 'Core/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['success', 'error', 'warning', 'info'],
      description: 'Alert type',
    },
    title: {
      control: { type: 'text' },
      description: 'Alert title',
    },
    description: {
      control: { type: 'text' },
      description: 'Alert description',
    },
    showCloseButton: {
      control: { type: 'boolean' },
      description: 'Show close button',
    },
  },
};

export const Success = {
  args: {
    type: 'success',
    title: 'Success!',
    description: 'Your action was completed successfully.',
    showCloseButton: true,
  },
};

export const Error = {
  args: {
    type: 'error',
    title: 'Error!',
    description: 'Something went wrong. Please try again.',
    showCloseButton: true,
  },
};

export const Warning = {
  args: {
    type: 'warning',
    title: 'Warning!',
    description: 'Please be careful with this action.',
    showCloseButton: true,
  },
};

export const Info = {
  args: {
    type: 'info',
    title: 'Information',
    description: 'This is an informational message.',
    showCloseButton: true,
  },
};

export const TitleOnly = {
  args: {
    type: 'info',
    title: 'Important Notice',
    showCloseButton: false,
  },
};

export const DescriptionOnly = {
  args: {
    type: 'success',
    description: 'Operation completed without a title.',
    showCloseButton: true,
  },
};

export const Dismissible = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    if (!visible) {
      return (
        <button
          onClick={() => setVisible(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Show Alert
        </button>
      );
    }
    return (
      <Alert
        {...args}
        onClose={() => setVisible(false)}
      />
    );
  },
  args: {
    type: 'info',
    title: 'Dismissible Alert',
    description: 'Click the X button to dismiss this alert.',
    showCloseButton: true,
  },
};

import { useState } from 'react';
import { Toast } from './Toast';

export default {
  title: 'Core/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: { type: 'text' },
      description: 'Toast message text',
    },
    type: {
      control: { type: 'select' },
      options: ['success', 'error', 'warning', 'info'],
      description: 'Toast type',
    },
    duration: {
      control: { type: 'number' },
      description: 'Duration in milliseconds (0 for no auto-dismiss)',
    },
  },
};

export const Success = {
  args: {
    message: 'Operation completed successfully!',
    type: 'success',
    duration: 3000,
  },
};

export const Error = {
  args: {
    message: 'An error occurred. Please try again.',
    type: 'error',
    duration: 3000,
  },
};

export const Warning = {
  args: {
    message: 'Please be careful with this action.',
    type: 'warning',
    duration: 3000,
  },
};

export const Info = {
  args: {
    message: 'This is an informational message.',
    type: 'info',
    duration: 3000,
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
          Show Toast
        </button>
      );
    }
    return (
      <Toast
        {...args}
        onDismiss={() => setVisible(false)}
      />
    );
  },
  args: {
    message: 'This toast can be dismissed by clicking the X button.',
    type: 'info',
    duration: 0,
  },
};

export const NoPersist = {
  args: {
    message: 'This toast will auto-dismiss in 3 seconds.',
    type: 'success',
    duration: 3000,
  },
};

export const AllTypes = {
  render: (args) => (
    <div className="space-y-4">
      <Toast
        message="Success message"
        type="success"
        duration={0}
        onDismiss={() => {}}
      />
      <Toast
        message="Error message"
        type="error"
        duration={0}
        onDismiss={() => {}}
      />
      <Toast
        message="Warning message"
        type="warning"
        duration={0}
        onDismiss={() => {}}
      />
      <Toast
        message="Info message"
        type="info"
        duration={0}
        onDismiss={() => {}}
      />
    </div>
  ),
};

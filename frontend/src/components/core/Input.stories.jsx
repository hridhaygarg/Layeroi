import { useState } from 'react';
import { Input } from './Input';

export default {
  title: 'Core/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number'],
      description: 'Input type',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the input',
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

export const TextInput = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

export const EmailInput = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
  },
};

export const PasswordInput = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const NumberInput = {
  args: {
    type: 'number',
    placeholder: 'Enter number...',
  },
};

export const WithError = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    error: true,
    errorMessage: 'This field is required',
  },
};

export const Disabled = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Required = {
  args: {
    type: 'text',
    placeholder: 'Required field',
    required: true,
  },
};

import { useState } from 'react';
import { Select } from './Select';

export default {
  title: 'Core/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    multiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple selections',
    },
    searchable: {
      control: { type: 'boolean' },
      description: 'Enable search functionality',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the select',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Show error state',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Error message text',
    },
  },
};

const defaultOptions = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4' },
];

export const SingleSelect = {
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
  },
};

export const MultiSelect = {
  args: {
    options: defaultOptions,
    multiple: true,
    placeholder: 'Select options',
  },
};

export const Searchable = {
  args: {
    options: defaultOptions,
    searchable: true,
    placeholder: 'Search and select',
  },
};

export const SearchableMultiple = {
  args: {
    options: defaultOptions,
    searchable: true,
    multiple: true,
    placeholder: 'Search and select multiple',
  },
};

export const WithError = {
  args: {
    options: defaultOptions,
    error: true,
    errorMessage: 'This field is required',
    placeholder: 'Select an option',
  },
};

export const Disabled = {
  args: {
    options: defaultOptions,
    disabled: true,
    placeholder: 'Disabled select',
  },
};

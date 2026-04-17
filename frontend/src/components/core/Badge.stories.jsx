import { Badge } from './Badge';

export default {
  title: 'Core/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Badge label text',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'danger', 'gray'],
      description: 'Badge color',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
  },
};

export const Primary = {
  args: {
    label: 'Primary',
    color: 'primary',
    size: 'md',
  },
};

export const Success = {
  args: {
    label: 'Success',
    color: 'success',
    size: 'md',
  },
};

export const Warning = {
  args: {
    label: 'Warning',
    color: 'warning',
    size: 'md',
  },
};

export const Danger = {
  args: {
    label: 'Danger',
    color: 'danger',
    size: 'md',
  },
};

export const Gray = {
  args: {
    label: 'Gray',
    color: 'gray',
    size: 'md',
  },
};

export const Small = {
  args: {
    label: 'Small',
    color: 'primary',
    size: 'sm',
  },
};

export const Large = {
  args: {
    label: 'Large Badge',
    color: 'primary',
    size: 'lg',
  },
};

export const AllColors = {
  render: (args) => (
    <div className="flex gap-3 flex-wrap">
      <Badge label="Primary" color="primary" size="md" />
      <Badge label="Success" color="success" size="md" />
      <Badge label="Warning" color="warning" size="md" />
      <Badge label="Danger" color="danger" size="md" />
      <Badge label="Gray" color="gray" size="md" />
    </div>
  ),
};

export const AllSizes = {
  render: (args) => (
    <div className="flex gap-3 flex-wrap items-center">
      <Badge label="Small" color="primary" size="sm" />
      <Badge label="Medium" color="primary" size="md" />
      <Badge label="Large" color="primary" size="lg" />
    </div>
  ),
};

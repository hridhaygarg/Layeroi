import { Avatar } from './Avatar';

export default {
  title: 'Core/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    initials: {
      control: { type: 'text' },
      description: 'Initials to display',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Avatar size',
    },
    alt: {
      control: { type: 'text' },
      description: 'Alt text for image',
    },
    src: {
      control: { type: 'text' },
      description: 'Image source URL',
    },
  },
};

export const WithInitials = {
  args: {
    initials: 'JD',
    size: 'md',
  },
};

export const Small = {
  args: {
    initials: 'AB',
    size: 'sm',
  },
};

export const Medium = {
  args: {
    initials: 'CD',
    size: 'md',
  },
};

export const Large = {
  args: {
    initials: 'EF',
    size: 'lg',
  },
};

export const WithImage = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    alt: 'John Doe',
    size: 'md',
  },
};

export const AllSizes = {
  render: (args) => (
    <div className="flex gap-6 items-center">
      <Avatar initials="SM" size="sm" />
      <Avatar initials="MD" size="md" />
      <Avatar initials="LG" size="lg" />
    </div>
  ),
};

export const DefaultInitials = {
  args: {
    size: 'md',
  },
};

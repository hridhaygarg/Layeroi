import { useState } from 'react';
import { Modal } from './Modal';

export default {
  title: 'Core/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
      description: 'Modal open state',
    },
    title: {
      control: { type: 'text' },
      description: 'Modal title',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Modal size',
    },
    children: {
      control: { type: 'text' },
      description: 'Modal content',
    },
  },
};

export const Default = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Open Modal
        </button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  },
  args: {
    title: 'Modal Title',
    size: 'md',
    children: <p>This is the modal content.</p>,
  },
};

export const Small = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Open Modal
        </button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  },
  args: {
    title: 'Confirmation',
    size: 'sm',
    children: <p>Are you sure you want to proceed?</p>,
  },
};

export const Large = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Open Modal
        </button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  },
  args: {
    title: 'Large Modal',
    size: 'lg',
    children: (
      <div className="space-y-4">
        <p>This is a large modal with more content.</p>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
          />
          <textarea
            placeholder="Message"
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
            rows="4"
          />
        </form>
      </div>
    ),
  },
};

export const NoTitle = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Open Modal
        </button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  },
  args: {
    title: undefined,
    size: 'md',
    children: <p>Modal without a title</p>,
  },
};

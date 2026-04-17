import { useState } from 'react';
import { Accordion } from './Accordion';

export default {
  title: 'Core/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    exclusive: {
      control: { type: 'boolean' },
      description: 'Only one section open at a time',
    },
  },
};

const sectionsData = [
  {
    id: 'section1',
    title: 'Section 1',
    content: 'This is the content for section 1.',
  },
  {
    id: 'section2',
    title: 'Section 2',
    content: 'This is the content for section 2.',
  },
  {
    id: 'section3',
    title: 'Section 3',
    content: 'This is the content for section 3.',
  },
];

export const Default = {
  args: {
    sections: sectionsData,
    exclusive: true,
  },
};

export const MultipleOpen = {
  args: {
    sections: sectionsData,
    exclusive: false,
  },
};

export const ControlledAccordion = {
  render: (args) => {
    const [openSections, setOpenSections] = useState(['section1']);
    return (
      <Accordion
        {...args}
        openSections={openSections}
        onToggle={(id) => {
          setOpenSections((prev) => {
            if (prev.includes(id)) {
              return prev.filter((s) => s !== id);
            } else if (args.exclusive) {
              return [id];
            } else {
              return [...prev, id];
            }
          });
        }}
      />
    );
  },
  args: {
    sections: sectionsData,
    exclusive: true,
  },
};

const faqData = [
  {
    id: 'faq1',
    title: 'What is this?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'faq2',
    title: 'How do I use it?',
    content:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    id: 'faq3',
    title: 'What are the features?',
    content:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
];

export const FAQ = {
  args: {
    sections: faqData,
    exclusive: true,
  },
};

import { Card } from './Card';

export default {
  title: 'Core/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Card padding size',
    },
    children: {
      control: { type: 'text' },
      description: 'Card content',
    },
  },
};

export const Default = {
  args: {
    children: 'This is a card with default padding and styling.',
    padding: 'md',
  },
};

export const SmallPadding = {
  args: {
    children: 'Card with small padding',
    padding: 'sm',
  },
};

export const LargePadding = {
  args: {
    children: 'Card with large padding',
    padding: 'lg',
  },
};

export const WithHeader = {
  args: {
    padding: 'md',
    children: (
      <div>
        <Card.Header>
          <h2 className="text-lg font-semibold">Card Header</h2>
        </Card.Header>
        <Card.Body>
          <p>This is the card body content.</p>
        </Card.Body>
        <Card.Footer>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Action
          </button>
        </Card.Footer>
      </div>
    ),
  },
};

export const ComplexLayout = {
  args: {
    padding: 'md',
    children: (
      <div>
        <Card.Header>
          <h2 className="text-lg font-semibold">User Profile</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">John Doe</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">john@example.com</p>
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Edit
          </button>
        </Card.Footer>
      </div>
    ),
  },
};

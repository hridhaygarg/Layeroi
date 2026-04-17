import { Divider } from './Divider';

export default {
  title: 'Core/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation',
    },
    margin: {
      control: { type: 'text' },
      description: 'Margin classes',
    },
  },
};

export const Horizontal = {
  args: {
    orientation: 'horizontal',
    margin: 'my-4',
  },
};

export const Vertical = {
  args: {
    orientation: 'vertical',
    margin: 'mx-4',
  },
};

export const SmallMargin = {
  args: {
    orientation: 'horizontal',
    margin: 'my-2',
  },
};

export const LargeMargin = {
  args: {
    orientation: 'horizontal',
    margin: 'my-8',
  },
};

export const InContext = {
  render: (args) => (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Section 1</h3>
        <p className="text-sm text-gray-600">Some content here</p>
      </div>
      <Divider orientation="horizontal" margin="my-4" />
      <div>
        <h3 className="font-semibold mb-2">Section 2</h3>
        <p className="text-sm text-gray-600">More content here</p>
      </div>
    </div>
  ),
};

export const VerticalInContext = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-sm text-gray-600">Left content</p>
      </div>
      <Divider orientation="vertical" margin="h-6" />
      <div>
        <p className="text-sm text-gray-600">Right content</p>
      </div>
    </div>
  ),
};

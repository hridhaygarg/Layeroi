import { Progress } from './Progress';

export default {
  title: 'Core/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Progress value',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'danger', 'gray'],
      description: 'Progress bar color',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Show percentage label',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
    },
  },
};

export const Default = {
  args: {
    value: 50,
    color: 'primary',
    max: 100,
  },
};

export const Zero = {
  args: {
    value: 0,
    color: 'primary',
    max: 100,
  },
};

export const Quarter = {
  args: {
    value: 25,
    color: 'primary',
    max: 100,
  },
};

export const Half = {
  args: {
    value: 50,
    color: 'primary',
    max: 100,
  },
};

export const ThreeQuarters = {
  args: {
    value: 75,
    color: 'primary',
    max: 100,
  },
};

export const Complete = {
  args: {
    value: 100,
    color: 'success',
    max: 100,
  },
};

export const Primary = {
  args: {
    value: 60,
    color: 'primary',
  },
};

export const Success = {
  args: {
    value: 100,
    color: 'success',
  },
};

export const Warning = {
  args: {
    value: 75,
    color: 'warning',
  },
};

export const Danger = {
  args: {
    value: 40,
    color: 'danger',
  },
};

export const WithLabel = {
  args: {
    value: 65,
    color: 'primary',
    showLabel: true,
  },
};

export const AllColors = {
  render: (args) => (
    <div className="space-y-4 w-full">
      <div>
        <p className="text-sm text-gray-600 mb-2">Primary</p>
        <Progress value={60} color="primary" />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Success</p>
        <Progress value={100} color="success" />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Warning</p>
        <Progress value={75} color="warning" />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Danger</p>
        <Progress value={40} color="danger" />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Gray</p>
        <Progress value={50} color="gray" />
      </div>
    </div>
  ),
};

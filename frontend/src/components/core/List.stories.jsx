import { List } from './List';

export default {
  title: 'Core/List',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: { type: 'object' },
      description: 'List items',
    },
    selectable: {
      control: { type: 'select' },
      options: [false, 'single', 'multi'],
      description: 'Selection mode',
    },
  },
};

const itemsData = [
  { id: 1, label: 'Home', icon: 'Home' },
  { id: 2, label: 'Settings', icon: 'Settings' },
  { id: 3, label: 'Profile', icon: 'User' },
  { id: 4, label: 'Notifications', icon: 'Bell' },
];

const itemsWithActions = [
  {
    id: 1,
    label: 'Item 1',
    icon: 'Archive',
    action: { label: 'Archive', handler: (item) => console.log('Archive', item) },
  },
  {
    id: 2,
    label: 'Item 2',
    icon: 'Trash2',
    action: { label: 'Delete', handler: (item) => console.log('Delete', item) },
  },
  {
    id: 3,
    label: 'Item 3',
    icon: 'Download',
    action: { label: 'Download', handler: (item) => console.log('Download', item) },
  },
];

export const Default = {
  args: {
    items: itemsData,
  },
};

export const SingleSelect = {
  args: {
    items: itemsData,
    selectable: 'single',
  },
};

export const MultiSelect = {
  args: {
    items: itemsData,
    selectable: 'multi',
  },
};

export const WithActions = {
  args: {
    items: itemsWithActions,
  },
};

export const Empty = {
  args: {
    items: [],
  },
};

export const CustomItems = {
  args: {
    items: [
      { id: 'nav1', label: 'Dashboard', icon: 'BarChart2' },
      { id: 'nav2', label: 'Analytics', icon: 'TrendingUp' },
      { id: 'nav3', label: 'Reports', icon: 'FileText' },
      { id: 'nav4', label: 'Data', icon: 'Database' },
    ],
  },
};

export const LongList = {
  args: {
    items: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      label: `List Item ${i + 1}`,
      icon: 'File',
    })),
  },
};

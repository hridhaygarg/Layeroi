import { EmptyState } from './EmptyState';

export default {
  title: 'Core/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: { type: 'text' },
      description: 'Icon name from lucide-react',
    },
    title: {
      control: { type: 'text' },
      description: 'Empty state title',
    },
    description: {
      control: { type: 'text' },
      description: 'Empty state description',
    },
    action: {
      control: { type: 'object' },
      description: 'Action button config',
    },
  },
};

export const Default = {
  args: {
    icon: 'inbox',
    title: 'No items yet',
    description: 'Get started by creating your first item.',
    action: {
      label: 'Create Item',
      handler: () => console.log('Create action'),
    },
  },
};

export const NoResults = {
  args: {
    icon: 'Search',
    title: 'No results found',
    description: 'Try adjusting your search filters or try a different search term.',
  },
};

export const Empty = {
  args: {
    icon: 'Inbox',
    title: 'Your inbox is empty',
    description: 'All caught up! Check back later for new messages.',
  },
};

export const NoData = {
  args: {
    icon: 'BarChart2',
    title: 'No data available',
    description: 'There is no data to display at the moment.',
    action: {
      label: 'Learn More',
      handler: () => console.log('Learn more clicked'),
    },
  },
};

export const LoadingFailed = {
  args: {
    icon: 'AlertCircle',
    title: 'Failed to load',
    description: 'Something went wrong while loading the data. Please try again.',
    action: {
      label: 'Retry',
      handler: () => console.log('Retry clicked'),
    },
  },
};

export const Unauthorized = {
  args: {
    icon: 'Lock',
    title: 'Access denied',
    description: "You don't have permission to view this content.",
  },
};

export const NotFound = {
  args: {
    icon: 'FileQuestion',
    title: 'Page not found',
    description: 'The page you are looking for does not exist.',
    action: {
      label: 'Go Home',
      handler: () => console.log('Go home clicked'),
    },
  },
};

export const Minimal = {
  args: {
    title: 'No items',
    description: 'Create your first item to get started.',
  },
};

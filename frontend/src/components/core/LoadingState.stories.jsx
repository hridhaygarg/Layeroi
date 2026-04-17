import { LoadingState } from './LoadingState';

export default {
  title: 'Core/LoadingState',
  component: LoadingState,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['table', 'list', 'card'],
      description: 'Loading state variant',
    },
    count: {
      control: { type: 'number' },
      description: 'Number of skeleton items',
    },
  },
};

export const Table = {
  args: {
    variant: 'table',
    count: 3,
  },
};

export const List = {
  args: {
    variant: 'list',
    count: 4,
  },
};

export const Card = {
  args: {
    variant: 'card',
    count: 2,
  },
};

export const TableWithFewRows = {
  args: {
    variant: 'table',
    count: 2,
  },
};

export const ListWithManyItems = {
  args: {
    variant: 'list',
    count: 8,
  },
};

export const CardWithManyCards = {
  args: {
    variant: 'card',
    count: 6,
  },
};

export const TableWithManyRows = {
  args: {
    variant: 'table',
    count: 6,
  },
};

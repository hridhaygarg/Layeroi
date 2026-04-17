import { Table } from './Table';

export default {
  title: 'Core/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'object' },
      description: 'Table columns configuration',
    },
    data: {
      control: { type: 'object' },
      description: 'Table data',
    },
    selectable: {
      control: { type: 'boolean' },
      description: 'Enable row selection',
    },
    expandable: {
      control: { type: 'boolean' },
      description: 'Enable row expansion',
    },
    pagination: {
      control: { type: 'boolean' },
      description: 'Show pagination',
    },
  },
};

const columnsData = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Role', accessor: 'role' },
];

const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin' },
];

export const Default = {
  args: {
    columns: columnsData,
    data: tableData,
  },
};

export const WithSelection = {
  args: {
    columns: columnsData,
    data: tableData,
    selectable: true,
  },
};

export const WithSorting = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id', sortable: true },
      { header: 'Name', accessor: 'name', sortable: true },
      { header: 'Email', accessor: 'email' },
      { header: 'Role', accessor: 'role', sortable: true },
    ],
    data: tableData,
  },
};

export const WithExpansion = {
  args: {
    columns: columnsData,
    data: tableData,
    expandable: true,
  },
};

export const WithPagination = {
  args: {
    columns: columnsData,
    data: tableData,
    pagination: true,
    currentPage: 1,
    totalPages: 2,
  },
};

export const Empty = {
  args: {
    columns: columnsData,
    data: [],
  },
};

export const Sortable = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id', sortable: true },
      { header: 'Name', accessor: 'name', sortable: true },
      { header: 'Email', accessor: 'email' },
      { header: 'Role', accessor: 'role', sortable: true },
    ],
    data: tableData,
  },
};

export const SelectableAndSortable = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id', sortable: true },
      { header: 'Name', accessor: 'name', sortable: true },
      { header: 'Email', accessor: 'email' },
      { header: 'Role', accessor: 'role', sortable: true },
    ],
    data: tableData,
    selectable: true,
  },
};

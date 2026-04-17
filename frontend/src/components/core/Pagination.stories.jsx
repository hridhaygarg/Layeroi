import { useState } from 'react';
import { Pagination } from './Pagination';

export default {
  title: 'Core/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    totalPages: {
      control: { type: 'number' },
      description: 'Total number of pages',
    },
    currentPage: {
      control: { type: 'number' },
      description: 'Currently active page',
    },
  },
};

export const Default = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        {...args}
        totalPages={10}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const FirstPage = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        {...args}
        totalPages={10}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const MiddlePage = {
  render: (args) => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        {...args}
        totalPages={10}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const LastPage = {
  render: (args) => {
    const [page, setPage] = useState(10);
    return (
      <Pagination
        {...args}
        totalPages={10}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const SinglePage = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        {...args}
        totalPages={1}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const TwoPages = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        {...args}
        totalPages={2}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const ManyPages = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        {...args}
        totalPages={100}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

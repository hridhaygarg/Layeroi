import { useState } from 'react';
import { SearchBox } from './SearchBox';

export default {
  title: 'Core/SearchBox',
  component: SearchBox,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the search box',
    },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <SearchBox
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    placeholder: 'Search...',
  },
};

export const WithValue = {
  render: (args) => {
    const [value, setValue] = useState('sample search');
    return (
      <SearchBox
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    placeholder: 'Search...',
  },
};

export const Disabled = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <SearchBox
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={true}
      />
    );
  },
  args: {
    placeholder: 'Search disabled...',
  },
};

export const CustomPlaceholder = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <SearchBox
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    placeholder: 'Find users by name or email...',
  },
};

export const Clearable = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="space-y-4">
        <SearchBox
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
        />
        {value && (
          <p className="text-sm text-gray-600">
            Searching for: {value}
          </p>
        )}
      </div>
    );
  },
  args: {
    placeholder: 'Search and clear...',
  },
};

export const SearchWithResults = {
  render: (args) => {
    const [value, setValue] = useState('');
    const sampleResults = ['User 1', 'User 2', 'Admin User', 'Support User'];
    const filteredResults = sampleResults.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <SearchBox
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
        />
        {value && (
          <div className="border border-gray-200 rounded-lg p-3 space-y-2">
            {filteredResults.length > 0 ? (
              filteredResults.map((result, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                >
                  {result}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">No results found</div>
            )}
          </div>
        )}
      </div>
    );
  },
  args: {
    placeholder: 'Search users...',
  },
};

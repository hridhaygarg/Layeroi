import { useState } from 'react';
import { Tabs } from './Tabs';

export default {
  title: 'Core/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

const tabsConfig = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

export const Default = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
      <Tabs
        {...args}
        tabs={tabsConfig}
        activeTab={activeTab}
        onChange={setActiveTab}
      >
        <div>Content for Tab 1</div>
        <div>Content for Tab 2</div>
        <div>Content for Tab 3</div>
      </Tabs>
    );
  },
};

export const MultipleTabs = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState('overview');
    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'details', label: 'Details' },
      { id: 'activity', label: 'Activity' },
      { id: 'settings', label: 'Settings' },
    ];
    return (
      <Tabs
        {...args}
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      >
        <div>
          <h3 className="font-semibold mb-2">Overview</h3>
          <p>This is the overview tab content.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Details</h3>
          <p>This is the details tab content.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Activity</h3>
          <p>This is the activity tab content.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Settings</h3>
          <p>This is the settings tab content.</p>
        </div>
      </Tabs>
    );
  },
};

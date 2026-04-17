import { useState } from 'react';
import { Toggle } from './Toggle';

export default {
  title: 'Core/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Toggle checked state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the toggle',
    },
    label: {
      control: { type: 'text' },
      description: 'Toggle label text',
    },
  },
};

export const Unchecked = {
  args: {
    label: 'Enable notifications',
    checked: false,
  },
};

export const Checked = {
  args: {
    label: 'Notifications enabled',
    checked: true,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled toggle',
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked = {
  args: {
    label: 'Disabled and checked',
    disabled: true,
    checked: true,
  },
};

export const NoLabel = {
  args: {
    checked: false,
  },
};

export const Controlled = {
  render: (args) => {
    const [enabled, setEnabled] = useState(false);
    return (
      <div className="space-y-4">
        <Toggle
          {...args}
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <p className="text-sm text-gray-600">
          Feature is {enabled ? 'enabled' : 'disabled'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Toggle feature',
  },
};

export const FeatureToggles = {
  render: (args) => {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      twoFactor: true,
    });

    const handleChange = (key) => {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    return (
      <div className="space-y-4">
        <Toggle
          label="Enable Notifications"
          checked={settings.notifications}
          onChange={() => handleChange('notifications')}
        />
        <Toggle
          label="Dark Mode"
          checked={settings.darkMode}
          onChange={() => handleChange('darkMode')}
        />
        <Toggle
          label="Two-Factor Authentication"
          checked={settings.twoFactor}
          onChange={() => handleChange('twoFactor')}
        />
      </div>
    );
  },
};

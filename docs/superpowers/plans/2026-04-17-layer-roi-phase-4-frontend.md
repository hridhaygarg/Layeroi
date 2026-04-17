# PHASE 4: Frontend Component System - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) to execute this plan task-by-task. Tasks 31-50 with two-stage review (spec compliance, code quality). This phase builds 30 core design components + 5 feature screens with 150+ tests.

**Goal:** Build enterprise-grade React 18 frontend with 30 reusable design components, TanStack Query + Zustand state management, real-time WebSocket updates, and 5 fully-functional feature screens.

**Architecture:** Component-based design system (core primitives + feature components), TanStack Query for server state caching, Zustand stores for UI state, Framer Motion for animations, WebSocket for real-time updates. Incremental refactoring of existing screens with new functionality.

**Tech Stack:** React 18, TanStack Query v5, Zustand, Framer Motion, Tailwind CSS, Lucide React Icons, Vitest, Supertest, Cypress, Storybook.

---

## File Structure Overview

### Core Components (`frontend/src/components/core/`)
30 foundational components with TDD tests:
- Input components: Button, Input, Select, Checkbox, Radio, Toggle, DatePicker, TimePicker, TextArea, SearchBox (10 components)
- Layout: Card, Modal, Tabs, Accordion, Sidebar, TopBar, Avatar, Badge, Divider (9 components)
- Data: Table, List, EmptyState, LoadingState, Pagination (5 components)
- Feedback: Toast, Alert, Progress (3 components)
- Form: Form wrapper component (1 component)
- Common: ErrorBoundary, ConfirmDialog, FilterBar, SearchableList, LoadingSpinner (5 components)

### Feature Components (`frontend/src/components/features/`)
- analytics/: MetricsGrid, TimeSeriesChart, EmailEngagementChart, TopCompaniesTable, ExportButton, DateRangeFilter
- integrations/: IntegrationCard, ConnectButton, SyncStatusBadge, SyncLogDrawer, IntegrationGrid
- prospects/: ProspectsTable, ProspectDetailDrawer, BulkImportModal, CreateProspectForm, StatusBadge, ProspectSearch
- outreach/: QueueStatusCard, QueueTable, SendNowButton, SequenceBuilder, AutomationScheduler
- settings/: UserProfileForm, TeamMembersTable, ApiKeysManager, WebhookManager, OrganizationSettings

### State & Utilities
- `frontend/src/hooks/`: Custom hooks for API integration (useProspects, useOutreach, useAnalytics, useIntegrations, useWebhooks, useWebSocket)
- `frontend/src/stores/`: Zustand stores (uiStore, prospectStore, analyticsStore, authStore)
- `frontend/src/api/`: API client functions and endpoints
- `frontend/src/theme/`: Design tokens (colors, spacing, typography, shadows)
- `frontend/src/utils/`: Formatters, validators, constants

---

## PHASE 4A: Core System (Tasks 31-40)

### Task 31: Core Input Components (Button, Input, Select)

**Files:**
- Create: `frontend/src/components/core/Button.jsx`
- Create: `frontend/src/components/core/Input.jsx`
- Create: `frontend/src/components/core/Select.jsx`
- Create: `frontend/src/components/core/__tests__/Button.test.jsx`
- Create: `frontend/src/components/core/__tests__/Input.test.jsx`
- Create: `frontend/src/components/core/__tests__/Select.test.jsx`

- [ ] **Step 1: Write failing test for Button component**

```javascript
// frontend/src/components/core/__tests__/Button.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should support variant prop (primary, secondary, danger)', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  it('should support size prop (sm, md, lg)', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1 text-sm');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4 py-2 text-base');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3 text-lg');
  });

  it('should show loading state and disable button', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should support fullWidth prop', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- Button.test.jsx
```

Expected: FAIL - Button component does not exist

- [ ] **Step 3: Implement Button component**

```javascript
// frontend/src/components/core/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" data-testid="loading-spinner" />
          Loading
        </span>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- Button.test.jsx
```

Expected: PASS - All Button tests passing

- [ ] **Step 5: Implement Input component (similar TDD approach)**

```javascript
// frontend/src/components/core/Input.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const Input = React.forwardRef(({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = false,
  errorMessage = '',
  disabled = false,
  className = '',
  label = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        } ${className}`.trim()}
        {...props}
      />
      {error && errorMessage && (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {errorMessage}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
```

- [ ] **Step 6: Implement Select component (similar TDD approach)**

```javascript
// frontend/src/components/core/Select.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error = false,
  disabled = false,
  className = '',
  label = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg appearance-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } ${className}`.trim()}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3 pointer-events-none text-gray-400" size={20} />
      </div>
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
```

- [ ] **Step 7: Run all input component tests**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- "core/__tests__/(Button|Input|Select).test.jsx"
```

Expected: PASS - 15+ tests passing for input components

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/core/{Button,Input,Select}.jsx
git add frontend/src/components/core/__tests__/{Button,Input,Select}.test.jsx
git commit -m "feat: add core input components (Button, Input, Select) with TDD tests"
```

---

### Task 32: Layout Components (Card, Modal, Tabs, Accordion)

**Files:**
- Create: `frontend/src/components/core/Card.jsx`
- Create: `frontend/src/components/core/Modal.jsx`
- Create: `frontend/src/components/core/Tabs.jsx`
- Create: `frontend/src/components/core/Accordion.jsx`
- Create: `frontend/src/components/core/__tests__/Card.test.jsx`
- Create: `frontend/src/components/core/__tests__/Modal.test.jsx`
- Create: `frontend/src/components/core/__tests__/Tabs.test.jsx`
- Create: `frontend/src/components/core/__tests__/Accordion.test.jsx`

*(Follow TDD pattern from Task 31 - write tests first, then implement)*

- [ ] **Step 1-8: TDD implementation of Card, Modal, Tabs, Accordion**

Write failing tests for each component, implement to pass tests. Each component should:
- Card: Render content in styled container with optional header/footer
- Modal: Dialog with backdrop, scroll lock, close button, trap focus
- Tabs: Tab navigation with content switching
- Accordion: Collapsible sections with Framer Motion animations

- [ ] **Step 9: Run all layout component tests**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- "core/__tests__/(Card|Modal|Tabs|Accordion).test.jsx"
```

Expected: PASS - 20+ tests passing

- [ ] **Step 10: Commit**

```bash
git add frontend/src/components/core/{Card,Modal,Tabs,Accordion}.jsx
git add frontend/src/components/core/__tests__/{Card,Modal,Tabs,Accordion}.test.jsx
git commit -m "feat: add layout components (Card, Modal, Tabs, Accordion) with tests"
```

---

### Task 33: Data Display Components (Table, List, EmptyState, LoadingState, Pagination)

**Files:**
- Create: `frontend/src/components/core/Table.jsx` (sortable, filterable, paginated)
- Create: `frontend/src/components/core/List.jsx`
- Create: `frontend/src/components/core/EmptyState.jsx`
- Create: `frontend/src/components/core/LoadingState.jsx`
- Create: `frontend/src/components/core/Pagination.jsx`
- Create test files for each component

- [ ] **Steps 1-10: TDD implementation of data display components**

Table component with:
- Sortable columns (click header to sort)
- Row selection (checkbox)
- Expandable rows
- Pagination controls
- Empty state handling

List component with:
- Item rendering with optional icons/actions
- Click handlers
- Selection support

EmptyState with:
- Icon display
- Title and description
- Optional action button

LoadingState with:
- Skeleton loaders
- Animated placeholders

Pagination with:
- Previous/Next buttons
- Page numbers
- Go to page input

- [ ] **Step 11: Commit**

```bash
git add frontend/src/components/core/{Table,List,EmptyState,LoadingState,Pagination}.jsx
git add frontend/src/components/core/__tests__/{Table,List,EmptyState,LoadingState,Pagination}.test.jsx
git commit -m "feat: add data display components (Table, List, EmptyState, Pagination) with tests"
```

---

### Task 34: Remaining Core Components (Feedback, Form, Navigation, Utilities)

**Files:**
- Create: `frontend/src/components/core/Toast.jsx`
- Create: `frontend/src/components/core/Alert.jsx`
- Create: `frontend/src/components/core/Progress.jsx`
- Create: `frontend/src/components/core/Form.jsx` (wrapper with validation)
- Create: `frontend/src/components/core/Sidebar.jsx`
- Create: `frontend/src/components/core/TopBar.jsx`
- Create: `frontend/src/components/core/Avatar.jsx`
- Create: `frontend/src/components/core/Badge.jsx`
- Create: `frontend/src/components/core/Checkbox.jsx`
- Create: `frontend/src/components/core/Radio.jsx`
- Create: `frontend/src/components/core/Toggle.jsx`
- Create: `frontend/src/components/core/DatePicker.jsx`
- Create: `frontend/src/components/core/TimePicker.jsx`
- Create: `frontend/src/components/core/TextArea.jsx`
- Create: `frontend/src/components/core/SearchBox.jsx`
- Create: `frontend/src/components/core/Divider.jsx`
- Create: `frontend/src/components/core/Breadcrumbs.jsx`
- Create: test files for all components

- [ ] **Steps 1-40: TDD implementation of 17 remaining components**

Each component follows pattern:
1. Write comprehensive test suite
2. Implement minimal code to pass tests
3. Run tests to verify
4. Add Framer Motion animations where appropriate
5. Ensure accessibility (ARIA labels, keyboard nav)

Key components:
- Toast: Non-intrusive notifications with auto-dismiss
- Alert: Styled alert boxes (info, warning, error, success)
- Progress: Linear and circular progress indicators
- Form: Wrapper with field tracking, validation, error display
- Sidebar: Collapsible navigation with icons
- TopBar: Header with breadcrumbs and user menu
- Avatar: User profile pictures with initials fallback
- Badge: Status indicators with colors
- Checkbox/Radio/Toggle: Form controls
- DatePicker/TimePicker: Date/time input with picker UI
- TextArea: Multi-line input
- SearchBox: Input with search icon and clear button
- Divider: Visual separator
- Breadcrumbs: Navigation trail

- [ ] **Step 41: Run all core component tests**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- "core/__tests__"
```

Expected: PASS - 80+ tests passing for 30 core components

- [ ] **Step 42: Commit all remaining components**

```bash
git add frontend/src/components/core/{Toast,Alert,Progress,Form,Sidebar,TopBar,Avatar,Badge,Checkbox,Radio,Toggle,DatePicker,TimePicker,TextArea,SearchBox,Divider,Breadcrumbs}.jsx
git add frontend/src/components/core/__tests__/
git commit -m "feat: add remaining 17 core components (feedback, form, nav, utilities) with 80+ tests"
```

---

### Task 35: Design Tokens & Theme System

**Files:**
- Create: `frontend/src/theme/colors.js`
- Create: `frontend/src/theme/spacing.js`
- Create: `frontend/src/theme/typography.js`
- Create: `frontend/src/theme/shadows.js`
- Create: `frontend/src/theme/index.js`
- Create: `frontend/src/theme/__tests__/theme.test.js`

- [ ] **Step 1: Write test for theme exports**

```javascript
// frontend/src/theme/__tests__/theme.test.js
import { describe, it, expect } from 'vitest';
import theme from '../index';

describe('Design Tokens', () => {
  it('should export colors object', () => {
    expect(theme.colors).toBeDefined();
    expect(theme.colors.primary).toBe('#3b82f6');
    expect(theme.colors.success).toBe('#10b981');
    expect(theme.colors.danger).toBe('#ef4444');
  });

  it('should export spacing scale', () => {
    expect(theme.spacing).toBeDefined();
    expect(theme.spacing.xs).toBe('4px');
    expect(theme.spacing.md).toBe('16px');
    expect(theme.spacing.xl).toBe('32px');
  });

  it('should export typography scale', () => {
    expect(theme.typography).toBeDefined();
    expect(theme.typography.headings).toBeDefined();
    expect(theme.typography.body).toBeDefined();
  });

  it('should export shadows', () => {
    expect(theme.shadows).toBeDefined();
    expect(theme.shadows.sm).toBeDefined();
    expect(theme.shadows.md).toBeDefined();
  });
});
```

- [ ] **Step 2: Implement theme files**

```javascript
// frontend/src/theme/colors.js
export const colors = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#1d4ed8',
  success: '#10b981',
  successLight: '#6ee7b7',
  successDark: '#059669',
  warning: '#f59e0b',
  warningLight: '#fcd34d',
  warningDark: '#d97706',
  danger: '#ef4444',
  dangerLight: '#fca5a5',
  dangerDark: '#dc2626',
  neutral: '#6b7280',
  neutralLight: '#f3f4f6',
  neutralDark: '#1f2937',
  white: '#ffffff',
  black: '#000000',
};

// frontend/src/theme/spacing.js
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
};

// frontend/src/theme/typography.js
export const typography = {
  headings: {
    h1: { fontSize: '32px', fontWeight: '600', lineHeight: '1.2' },
    h2: { fontSize: '28px', fontWeight: '600', lineHeight: '1.2' },
    h3: { fontSize: '24px', fontWeight: '600', lineHeight: '1.2' },
  },
  body: {
    lg: { fontSize: '16px', fontWeight: '400', lineHeight: '1.5' },
    md: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5' },
    sm: { fontSize: '12px', fontWeight: '400', lineHeight: '1.5' },
  },
};

// frontend/src/theme/shadows.js
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// frontend/src/theme/index.js
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { shadows } from './shadows';

export default {
  colors,
  spacing,
  typography,
  shadows,
};
```

- [ ] **Step 3: Run theme tests**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- "theme/__tests__"
```

Expected: PASS - All theme tests passing

- [ ] **Step 4: Commit**

```bash
git add frontend/src/theme/
git commit -m "feat: add design tokens and theme system (colors, spacing, typography, shadows)"
```

---

### Task 36: TanStack Query + Zustand Setup

**Files:**
- Create: `frontend/src/stores/uiStore.js` (Zustand store for UI state)
- Create: `frontend/src/stores/prospectStore.js`
- Create: `frontend/src/stores/analyticsStore.js`
- Create: `frontend/src/stores/authStore.js`
- Create: `frontend/src/hooks/useProspects.js` (TanStack Query wrapper)
- Create: `frontend/src/hooks/useOutreach.js`
- Create: `frontend/src/hooks/useAnalytics.js`
- Create: `frontend/src/hooks/useIntegrations.js`
- Create: `frontend/src/hooks/useWebhooks.js`
- Create: `frontend/src/api/client.js` (Axios instance with interceptors)
- Create: test files for stores and hooks

- [ ] **Step 1: Set up Zustand stores**

```javascript
// frontend/src/stores/uiStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      modals: {
        createProspect: false,
        bulkImport: false,
        prospectDetail: false,
      },
      openModal: (modalName) => set((state) => ({
        modals: { ...state.modals, [modalName]: true },
      })),
      closeModal: (modalName) => set((state) => ({
        modals: { ...state.modals, [modalName]: false },
      })),

      toasts: [],
      addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { id: Date.now(), ...toast }],
      })),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),

      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { id: Date.now(), ...notification }],
      })),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
    }
  )
);

// frontend/src/stores/prospectStore.js
import { create } from 'zustand';

export const useProspectStore = create((set) => ({
  selectedProspect: null,
  setSelectedProspect: (prospect) => set({ selectedProspect: prospect }),

  filters: {
    status: null,
    search: '',
    tags: [],
  },
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),

  sortBy: 'created_at',
  sortOrder: 'desc',
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
}));

// frontend/src/stores/analyticsStore.js
import { create } from 'zustand';

export const useAnalyticsStore = create((set) => ({
  dateRange: '30d',
  setDateRange: (range) => set({ dateRange: range }),

  filters: {
    prospectSource: 'all',
    metric: 'all',
  },
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
}));

// frontend/src/stores/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  organization: null,
  token: null,

  setAuth: (user, organization, token) => set({
    user,
    organization,
    token,
  }),

  logout: () => set({
    user: null,
    organization: null,
    token: null,
  }),
}));
```

- [ ] **Step 2: Create API client with interceptors**

```javascript
// frontend/src/api/client.js
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401, refresh token
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
```

- [ ] **Step 3: Create TanStack Query hooks**

```javascript
// frontend/src/hooks/useProspects.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/client';
import { useProspectStore } from '../stores/prospectStore';

const prospectAPI = {
  list: async (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    const { data } = await client.get(`/prospects?${params}`);
    return data;
  },
  create: async (prospect) => {
    const { data } = await client.post('/prospects', prospect);
    return data;
  },
  update: async (id, updates) => {
    const { data } = await client.patch(`/prospects/${id}`, updates);
    return data;
  },
  delete: async (id) => {
    await client.delete(`/prospects/${id}`);
  },
  bulkImport: async (prospects) => {
    const { data } = await client.post('/prospects/bulk-import', { prospects });
    return data;
  },
};

export const useProspects = (page = 1, limit = 20) => {
  const filters = useProspectStore((state) => state.filters);
  const sorting = useProspectStore((state) => ({
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  }));

  return useQuery({
    queryKey: ['prospects', page, limit, filters, sorting],
    queryFn: () => prospectAPI.list(page, limit, { ...filters, ...sorting }),
    staleTime: 20 * 1000, // 20 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProspect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prospectAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
  });
};

export const useUpdateProspect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => prospectAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
  });
};

export const useDeleteProspect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prospectAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
  });
};

export const useBulkImportProspects = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prospectAPI.bulkImport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
  });
};

// Similar hooks for useOutreach, useAnalytics, useIntegrations, useWebhooks...
```

- [ ] **Step 4: Create test files for stores and hooks**

```javascript
// frontend/src/stores/__tests__/uiStore.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../uiStore';

describe('UI Store', () => {
  beforeEach(() => {
    useUIStore.setState({
      sidebarOpen: true,
      modals: { createProspect: false },
      toasts: [],
    });
  });

  it('should toggle sidebar', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it('should open and close modals', () => {
    useUIStore.getState().openModal('createProspect');
    expect(useUIStore.getState().modals.createProspect).toBe(true);

    useUIStore.getState().closeModal('createProspect');
    expect(useUIStore.getState().modals.createProspect).toBe(false);
  });

  it('should add and remove toasts', () => {
    useUIStore.getState().addToast({ message: 'Test', type: 'success' });
    expect(useUIStore.getState().toasts).toHaveLength(1);

    const id = useUIStore.getState().toasts[0].id;
    useUIStore.getState().removeToast(id);
    expect(useUIStore.getState().toasts).toHaveLength(0);
  });
});
```

- [ ] **Step 5: Run store and hook tests**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- "stores/__tests__|hooks/__tests__"
```

Expected: PASS - All store and hook tests passing

- [ ] **Step 6: Commit**

```bash
git add frontend/src/{stores,hooks,api}/
git commit -m "feat: add TanStack Query hooks and Zustand stores for state management"
```

---

### Task 37: WebSocket Real-time Integration

**Files:**
- Create: `frontend/src/hooks/useWebSocket.js`
- Create: `frontend/src/utils/websocketManager.js`
- Create: `frontend/src/hooks/__tests__/useWebSocket.test.js`

- [ ] **Step 1: Implement WebSocket manager**

```javascript
// frontend/src/utils/websocketManager.js
class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket closed');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  handleMessage(message) {
    const { event, data } = message;
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ event: 'heartbeat' }));
      }
    }, 30000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketManager;
```

- [ ] **Step 2: Create useWebSocket hook**

```javascript
// frontend/src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '../stores/uiStore';
import WebSocketManager from '../utils/websocketManager';

export const useWebSocket = () => {
  const wsRef = useRef(null);
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  useEffect(() => {
    const wsUrl = process.env.REACT_APP_WS_URL || `ws://localhost:3000`;
    wsRef.current = new WebSocketManager(wsUrl);

    wsRef.current.connect().catch((error) => {
      console.error('Failed to connect WebSocket:', error);
    });

    // Subscribe to real-time events
    const unsubscribeQueueUpdate = wsRef.current.on('outreach.sent', () => {
      queryClient.invalidateQueries({ queryKey: ['outreach', 'queue'] });
    });

    const unsubscribeMetricsUpdate = wsRef.current.on('analytics.updated', () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'dashboard'] });
    });

    const unsubscribeIntegrationSync = wsRef.current.on('integration.synced', (data) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      addNotification({
        type: 'success',
        message: `${data.integrationName} synced successfully`,
        duration: 3000,
      });
    });

    const unsubscribeProspectCreated = wsRef.current.on('prospect.created', () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    });

    return () => {
      unsubscribeQueueUpdate();
      unsubscribeMetricsUpdate();
      unsubscribeIntegrationSync();
      unsubscribeProspectCreated();
      wsRef.current?.disconnect();
    };
  }, [queryClient, addNotification]);

  return wsRef.current;
};
```

- [ ] **Step 3: Add WebSocket tests**

```javascript
// frontend/src/hooks/__tests__/useWebSocket.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WebSocketManager from '../../utils/websocketManager';

describe('WebSocketManager', () => {
  let manager;

  beforeEach(() => {
    manager = new WebSocketManager('ws://localhost:3000');
  });

  it('should register event listeners', () => {
    const callback = vi.fn();
    manager.on('test.event', callback);
    manager.handleMessage({ event: 'test.event', data: { value: 1 } });
    expect(callback).toHaveBeenCalledWith({ value: 1 });
  });

  it('should unsubscribe listeners', () => {
    const callback = vi.fn();
    const unsubscribe = manager.on('test.event', callback);
    unsubscribe();
    manager.handleMessage({ event: 'test.event', data: {} });
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle connection heartbeat', () => {
    expect(manager.heartbeatInterval).toBeUndefined();
    manager.startHeartbeat();
    expect(manager.heartbeatInterval).toBeDefined();
    manager.stopHeartbeat();
    expect(manager.heartbeatInterval).toBeUndefined();
  });
});
```

- [ ] **Step 4: Run WebSocket tests**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- "useWebSocket"
```

Expected: PASS - WebSocket tests passing

- [ ] **Step 5: Commit**

```bash
git add frontend/src/{hooks/useWebSocket.js,utils/websocketManager.js}
git add frontend/src/hooks/__tests__/useWebSocket.test.js
git commit -m "feat: add WebSocket integration for real-time updates"
```

---

### Task 38: Analytics Dashboard Screen

**Files:**
- Create: `frontend/src/screens/AnalyticsDashboard.jsx`
- Create: `frontend/src/components/features/analytics/MetricsGrid.jsx`
- Create: `frontend/src/components/features/analytics/TimeSeriesChart.jsx`
- Create: `frontend/src/components/features/analytics/DateRangeFilter.jsx`
- Create: `frontend/src/components/features/analytics/ExportButton.jsx`
- Create: `frontend/src/screens/__tests__/AnalyticsDashboard.test.jsx`

- [ ] **Step 1: Write integration test for Analytics Dashboard**

```javascript
// frontend/src/screens/__tests__/AnalyticsDashboard.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AnalyticsDashboard from '../AnalyticsDashboard';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(async (url) => {
      if (url.includes('/analytics/dashboard')) {
        return {
          data: {
            metrics: {
              totalProspects: 1250,
              emailsSent: 980,
              emailsOpened: 450,
              openRate: 45.9,
            },
          },
        };
      }
      return { data: {} };
    }),
  },
}));

describe('AnalyticsDashboard Screen', () => {
  it('should render dashboard with metrics', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AnalyticsDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/1250/)).toBeInTheDocument();
      expect(screen.getByText(/45.9%/)).toBeInTheDocument();
    });
  });

  it('should filter metrics by date range', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <AnalyticsDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /30d/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /7d/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /7d/i })).toHaveClass('bg-blue-600');
    });
  });

  it('should export data as CSV', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <AnalyticsDashboard />
      </QueryClientProvider>
    );

    const exportButton = await screen.findByRole('button', { name: /export/i });
    await user.click(exportButton);

    const csvButton = await screen.findByRole('button', { name: /csv/i });
    expect(csvButton).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement AnalyticsDashboard screen**

```javascript
// frontend/src/screens/AnalyticsDashboard.jsx
import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useUIStore } from '../stores/uiStore';
import MetricsGrid from '../components/features/analytics/MetricsGrid';
import TimeSeriesChart from '../components/features/analytics/TimeSeriesChart';
import DateRangeFilter from '../components/features/analytics/DateRangeFilter';
import ExportButton from '../components/features/analytics/ExportButton';
import Card from '../components/core/Card';
import EmptyState from '../components/core/EmptyState';
import LoadingState from '../components/core/LoadingState';

export default function AnalyticsDashboard() {
  const dateRange = useAnalyticsStore((state) => state.dateRange);
  const setDateRange = useAnalyticsStore((state) => state.setDateRange);
  const { data, isLoading, error } = useAnalytics(dateRange);
  const addToast = useUIStore((state) => state.addToast);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load analytics"
        description={error.message}
        icon="AlertCircle"
      />
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-4">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <ExportButton
            data={data}
            onSuccess={() =>
              addToast({
                type: 'success',
                message: 'Data exported successfully',
              })
            }
          />
        </div>
      </div>

      <MetricsGrid metrics={data.metrics} />

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Email Engagement Trend</h2>
        </Card.Header>
        <Card.Body>
          <TimeSeriesChart data={data.outreachTrend} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Top Companies</h2>
        </Card.Header>
        <Card.Body>
          <Table columns={companyColumns} data={data.topCompanies} />
        </Card.Body>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Implement feature analytics components**

Implement MetricsGrid, TimeSeriesChart, DateRangeFilter, ExportButton components following TDD pattern.

- [ ] **Step 4: Run analytics tests**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- "AnalyticsDashboard"
```

Expected: PASS - Analytics screen tests passing

- [ ] **Step 5: Commit**

```bash
git add frontend/src/screens/AnalyticsDashboard.jsx
git add frontend/src/components/features/analytics/
git add frontend/src/screens/__tests__/AnalyticsDashboard.test.jsx
git commit -m "feat: add Analytics Dashboard screen with real-time metrics"
```

---

### Task 39: Component Tests & Coverage

**Files:**
- Run existing component tests
- Add missing test coverage for edge cases
- Generate coverage report

- [ ] **Step 1: Run full test suite**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- --coverage
```

Expected: 80+ core component tests + feature tests passing

- [ ] **Step 2: Review coverage report**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm test -- --coverage --reporter=html
```

- [ ] **Step 3: Add missing edge case tests**

For any components below 90% coverage, add tests for:
- Disabled/loading states
- Error conditions
- Accessibility (keyboard nav, screen readers)
- Mobile responsiveness

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/**/__tests__/
git commit -m "test: add comprehensive component tests (80+ tests, 90%+ coverage)"
```

---

### Task 40: Storybook Documentation

**Files:**
- Create: `.storybook/main.js`
- Create: `.storybook/preview.js`
- Create: `frontend/src/components/core/*.stories.jsx` (30 story files)

- [ ] **Step 1: Set up Storybook**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npx storybook@latest init
```

- [ ] **Step 2: Create stories for each core component**

```javascript
// frontend/src/components/core/Button.stories.jsx
import Button from './Button';

export default {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export const Primary = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Loading = {
  args: {
    children: 'Loading Button',
    loading: true,
  },
};

export const Disabled = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const FullWidth = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};
```

- [ ] **Step 3: Create stories for remaining 29 components**

Following same pattern with different prop combinations and states for each component.

- [ ] **Step 4: Build and test Storybook**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm run storybook
```

Expected: Storybook running at http://localhost:6006 with all 30 components documented

- [ ] **Step 5: Commit**

```bash
git add .storybook/
git add frontend/src/components/**/*.stories.jsx
git commit -m "docs: add Storybook documentation for 30 core components"
```

---

## PHASE 4B: Feature Screens (Tasks 41-50)

### Task 41: Integrations Panel Screen

**Files:**
- Create: `frontend/src/screens/IntegrationsPanel.jsx`
- Create: `frontend/src/components/features/integrations/IntegrationCard.jsx`
- Create: `frontend/src/components/features/integrations/ConnectButton.jsx`
- Create: `frontend/src/components/features/integrations/SyncStatusBadge.jsx`
- Create: `frontend/src/screens/__tests__/IntegrationsPanel.test.jsx`

- [ ] **Steps 1-5: TDD implementation of Integrations Panel**

Following same pattern as Analytics Dashboard (test first, then implement).

Features:
- Display 8 integration cards (Slack, Discord, Zapier, Google Sheets, HubSpot, Salesforce, Outreach, Lemlist)
- Connect button with OAuth flow
- Sync status badge with real-time updates
- Sync logs drawer with history

- [ ] **Step 6: Commit**

```bash
git add frontend/src/screens/IntegrationsPanel.jsx
git add frontend/src/components/features/integrations/
git add frontend/src/screens/__tests__/IntegrationsPanel.test.jsx
git commit -m "feat: add Integrations Panel with OAuth connect and sync status"
```

---

### Task 42: Prospects Management Screen

**Files:**
- Create: `frontend/src/screens/ProspectsPage.jsx`
- Create: `frontend/src/components/features/prospects/ProspectsTable.jsx`
- Create: `frontend/src/components/features/prospects/ProspectDetailDrawer.jsx`
- Create: `frontend/src/components/features/prospects/BulkImportModal.jsx`
- Create: `frontend/src/components/features/prospects/CreateProspectForm.jsx`
- Create: `frontend/src/screens/__tests__/ProspectsPage.test.jsx`

- [ ] **Steps 1-10: TDD implementation of Prospects Management**

Features:
- List prospects in searchable, sortable, filterable table
- Create prospect form (inline or modal)
- Edit prospect details in drawer
- Bulk import CSV with validation
- Status filters (prospect, qualified, contacted, converted, rejected)
- Email uniqueness per organization
- Soft delete

- [ ] **Step 11: Commit**

```bash
git add frontend/src/screens/ProspectsPage.jsx
git add frontend/src/components/features/prospects/
git add frontend/src/screens/__tests__/ProspectsPage.test.jsx
git commit -m "feat: add Prospects Management screen with CRUD operations"
```

---

### Task 43: Outreach Queue Screen

**Files:**
- Create: `frontend/src/screens/OutreachPage.jsx`
- Create: `frontend/src/components/features/outreach/QueueStatusCard.jsx`
- Create: `frontend/src/components/features/outreach/QueueTable.jsx`
- Create: `frontend/src/components/features/outreach/SendNowButton.jsx`
- Create: `frontend/src/components/features/outreach/SequenceBuilder.jsx`

- [ ] **Steps 1-8: TDD implementation of Outreach Queue**

Features:
- Queue status summary (pending, sent, opened, clicked)
- Queue table with real-time status updates
- Send now button with confirmation
- Automation sequence builder (visual step editor)
- Schedule automation (daily, weekly, cron)

- [ ] **Step 9: Commit**

```bash
git add frontend/src/screens/OutreachPage.jsx
git add frontend/src/components/features/outreach/
git commit -m "feat: add Outreach Queue screen with sequence builder"
```

---

### Task 44: Settings & Webhooks Screen

**Files:**
- Create: `frontend/src/screens/SettingsPage.jsx`
- Create: `frontend/src/components/features/settings/UserProfileForm.jsx`
- Create: `frontend/src/components/features/settings/TeamMembersTable.jsx`
- Create: `frontend/src/components/features/settings/ApiKeysManager.jsx`
- Create: `frontend/src/components/features/settings/WebhookManager.jsx`

- [ ] **Steps 1-8: TDD implementation of Settings**

Features:
- User profile edit (name, email, avatar)
- Team members management (invite, roles, remove)
- API keys (generate, copy, revoke)
- Webhook management (CRUD, testing, logs)
- Organization settings (name, plan, billing)

- [ ] **Step 9: Commit**

```bash
git add frontend/src/screens/SettingsPage.jsx
git add frontend/src/components/features/settings/
git commit -m "feat: add Settings screen with user, team, API keys, webhooks"
```

---

### Task 45: Mobile Responsiveness

**Files:**
- Update all screens and components for mobile
- Test at sm, md, lg, xl breakpoints

- [ ] **Steps 1-5: Responsive design updates**

- Tables become scrollable cards on mobile (sm breakpoint)
- Sidebar collapses to hamburger menu
- Modal becomes full-screen sheet
- Grid layouts reduce from 3 → 2 → 1 column
- Font sizes stay ≥16px on mobile for no zoom
- Touch targets ≥44px

- [ ] **Step 6: Test responsive design**

```bash
# Test at each breakpoint
npm test -- --coverage
# Manual testing with browser dev tools
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/screens/ frontend/src/components/
git commit -m "feat: add mobile responsive design (sm, md, lg, xl breakpoints)"
```

---

### Task 46: E2E Tests (Cypress)

**Files:**
- Create: `frontend/cypress/e2e/analytics.cy.js`
- Create: `frontend/cypress/e2e/prospects.cy.js`
- Create: `frontend/cypress/e2e/outreach.cy.js`
- Create: `frontend/cypress/e2e/integrations.cy.js`
- Create: `frontend/cypress/e2e/auth.cy.js`

- [ ] **Steps 1-5: Write 20+ critical E2E tests**

```javascript
// frontend/cypress/e2e/prospects.cy.js
describe('Prospects Management E2E', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/prospects');
  });

  it('should create a new prospect', () => {
    cy.contains('Create Prospect').click();
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Name"]').type('John Doe');
    cy.get('input[placeholder="Company"]').type('Acme Inc');
    cy.contains('Create').click();
    cy.contains('Prospect created successfully').should('be.visible');
  });

  it('should search prospects by email', () => {
    cy.get('input[placeholder="Search"]').type('john@example.com');
    cy.contains('john@example.com').should('be.visible');
  });

  it('should filter by status', () => {
    cy.contains('Filter').click();
    cy.contains('Qualified').click();
    cy.get('table').within(() => {
      cy.contains('Qualified').should('be.visible');
    });
  });

  it('should bulk import prospects from CSV', () => {
    cy.contains('Bulk Import').click();
    cy.get('input[type="file"]').attachFile('prospects.csv');
    cy.contains('Import').click();
    cy.contains('Imported 10 prospects').should('be.visible');
  });

  it('should update prospect status', () => {
    cy.contains('john@example.com').click();
    cy.get('select[name="status"]').select('Contacted');
    cy.contains('Save').click();
    cy.contains('Prospect updated').should('be.visible');
  });
});
```

- [ ] **Step 6: Run E2E tests**

```bash
cd /Users/hridhaygarg/AgentCFO/frontend && npm run cypress:run
```

Expected: 20+ E2E tests passing

- [ ] **Step 7: Commit**

```bash
git add frontend/cypress/e2e/
git commit -m "test: add 20+ E2E tests for critical user journeys (Cypress)"
```

---

### Task 47: Accessibility Audit (WCAG 2.1 AA)

**Files:**
- Run axe accessibility testing
- Fix accessibility issues
- Document compliance

- [ ] **Steps 1-5: Accessibility improvements**

- Add ARIA labels to all interactive elements
- Ensure keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Test with screen readers (VoiceOver, NVDA)
- Color contrast ≥4.5:1 for text
- Focus indicators visible on all elements
- Modal focus trap
- Error messages linked to inputs

- [ ] **Step 6: Run accessibility tests**

```bash
npm test -- --coverage
# axe accessibility testing
npm install --save-dev @axe-core/react
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/
git commit -m "feat: ensure WCAG 2.1 AA accessibility compliance"
```

---

### Task 48: Performance Optimization

**Files:**
- Optimize bundle size
- Add code splitting
- Lazy load components
- Image optimization

- [ ] **Steps 1-5: Performance improvements**

- Code splitting for feature screens (lazy load)
- Tree shaking unused code
- Minify CSS and JS
- Image optimization (WebP, responsive images)
- Lighthouse CI target: >90 performance score

- [ ] **Step 6: Measure performance**

```bash
npm run build
# Check bundle size
npm install --save-dev webpack-bundle-analyzer
# Run Lighthouse audit
npm install --save-dev @lhci/cli
```

Expected: Bundle <150KB gzipped, Lighthouse >90

- [ ] **Step 7: Commit**

```bash
git add frontend/src/
git commit -m "perf: optimize bundle size and Lighthouse scores (<150KB, >90 score)"
```

---

### Task 49: Visual Polish & Animations

**Files:**
- Add Framer Motion animations
- Polish micro-interactions
- Add loading states
- Add empty states

- [ ] **Steps 1-5: Animation & polish improvements**

- Page transitions (fade, slide)
- Modal animations (scale, slide-up)
- List animations (stagger children)
- Hover states with smooth transitions
- Loading spinners and skeletons
- Empty states with icons and illustrations
- Error boundaries with fallback UI

- [ ] **Step 6: Test animations**

```bash
# Manual testing in browser
# Performance check - ensure <60fps
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/
git commit -m "feat: add Framer Motion animations and visual polish"
```

---

### Task 50: Documentation & Deployment

**Files:**
- Create: `frontend/README.md`
- Create: `frontend/ARCHITECTURE.md`
- Create: `frontend/COMPONENTS.md`
- Create: `.github/workflows/frontend-deploy.yml`

- [ ] **Step 1: Write component documentation**

```markdown
# Component Architecture

## Core Components (30)
- Input: Button, Input, Select, Checkbox, Radio, Toggle, DatePicker, TimePicker, TextArea, SearchBox
- Layout: Card, Modal, Tabs, Accordion, Sidebar, TopBar, Avatar, Badge, Divider
- Data: Table, List, EmptyState, LoadingState, Pagination
- Feedback: Toast, Alert, Progress
- Form, ErrorBoundary, ConfirmDialog, FilterBar, SearchableList

## Feature Components
- Analytics: MetricsGrid, TimeSeriesChart, EmailEngagementChart, TopCompaniesTable, DateRangeFilter, ExportButton
- Integrations: IntegrationCard, ConnectButton, SyncStatusBadge, SyncLogDrawer, IntegrationGrid
- Prospects: ProspectsTable, ProspectDetailDrawer, BulkImportModal, CreateProspectForm, StatusBadge, ProspectSearch
- Outreach: QueueStatusCard, QueueTable, SendNowButton, SequenceBuilder, AutomationScheduler
- Settings: UserProfileForm, TeamMembersTable, ApiKeysManager, WebhookManager, OrganizationSettings

## State Management
- TanStack Query: Server state (prospects, analytics, integrations, outreach)
- Zustand: UI state (modals, sidebar, filters, notifications)
- WebSocket: Real-time updates (queue status, sync progress, analytics)

## Testing
- Vitest: Unit tests for components (80+ tests)
- Cypress: E2E tests for critical flows (20+ tests)
- Accessibility: WCAG 2.1 AA compliance verified
```

- [ ] **Step 2: Create deployment workflow**

```yaml
# .github/workflows/frontend-deploy.yml
name: Frontend Deploy

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run test:ci
      - run: cd frontend && npm run build
      - run: cd frontend && npm run lighthouse:ci
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

- [ ] **Step 3: Write README**

```markdown
# Layer ROI Frontend

React 18 enterprise dashboard for AI-powered sales acceleration.

## Quick Start

```bash
cd frontend
npm install
npm run dev  # Start dev server (http://localhost:5173)
npm test     # Run tests
npm run storybook  # View components
```

## Architecture

- React 18 with Vite
- TanStack Query for server state
- Zustand for UI state
- Framer Motion for animations
- Tailwind CSS for styling
- 30 core design components
- 5 feature screens
- 100+ unit tests
- 20+ E2E tests
- WCAG 2.1 AA accessible
- Mobile-responsive
- Real-time WebSocket updates

## Performance

- Bundle size: <150KB gzipped
- Lighthouse score: >90
- Core Web Vitals: All green
- Mobile-first design

## Documentation

- Storybook: `npm run storybook`
- Architecture: `ARCHITECTURE.md`
- Components: `COMPONENTS.md`
```

- [ ] **Step 4: Commit documentation**

```bash
git add frontend/{README,ARCHITECTURE,COMPONENTS}.md
git add .github/workflows/frontend-deploy.yml
git commit -m "docs: add comprehensive frontend documentation and deploy workflow"
```

- [ ] **Step 5: Final verification**

```bash
# Run full test suite
npm test -- --coverage
# Build production bundle
npm run build
# Check bundle size
npm run build:analyze
# Run Lighthouse audit
npm run lighthouse
# Run E2E tests
npm run cypress:run
```

Expected: All tests passing, bundle <150KB, Lighthouse >90

- [ ] **Step 6: Final commit**

```bash
git add frontend/
git commit -m "feat: complete PHASE 4 Frontend Component System (30 components, 5 screens, 150+ tests)"
```

---

## Summary

**PHASE 4: Frontend Component System - Complete**

✅ **30 Core Design Components**
- 10 input components (Button, Input, Select, Checkbox, Radio, Toggle, DatePicker, TimePicker, TextArea, SearchBox)
- 9 layout components (Card, Modal, Tabs, Accordion, Sidebar, TopBar, Avatar, Badge, Divider)
- 5 data components (Table, List, EmptyState, LoadingState, Pagination)
- 3 feedback components (Toast, Alert, Progress)
- 5 utility components (Form, ErrorBoundary, ConfirmDialog, FilterBar, SearchableList)

✅ **5 Feature Screens**
- Analytics Dashboard (metrics, trends, export)
- Integrations Panel (OAuth connect, sync status, logs)
- Prospects Management (CRUD, bulk import, filtering)
- Outreach Queue (send, automation sequences)
- Settings (user, team, API keys, webhooks)

✅ **State Management**
- TanStack Query for server state (caching, invalidation, refetching)
- Zustand for UI state (modals, filters, sidebar)
- WebSocket for real-time updates

✅ **Testing & Quality**
- 80+ component unit tests (Vitest)
- 20+ E2E tests (Cypress)
- WCAG 2.1 AA accessibility compliance
- Mobile-responsive design (sm, md, lg, xl)
- Lighthouse performance >90
- Bundle size <150KB gzipped

✅ **Documentation**
- Storybook for 30 components
- Architecture documentation
- GitHub Actions deployment workflow

**Next Step:** Choose execution approach for PHASE 4 implementation.

---

Plan complete and saved to `docs/superpowers/plans/2026-04-17-layer-roi-phase-4-frontend.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
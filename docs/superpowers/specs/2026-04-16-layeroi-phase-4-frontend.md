# PHASE 4: Frontend Component System - Design Specification

> **For agentic workers:** Execute using superpowers:writing-plans to create task breakdown. This phase builds 30 core design components + 5 feature screens connecting to PHASE 2 backend APIs. Target: 50 tasks, 150+ component tests, fully responsive mobile-first design.

**Goal:** Build enterprise-grade React 18 frontend with world-class component library, seamless API integration, and real-time updates.

**Architecture:** Hybrid component system (30 core + feature-specific), TanStack Query for server state, Zustand for UI state, Framer Motion for animations, WebSocket for real-time updates.

**Tech Stack:** React 18, TanStack Query v5, Zustand, Framer Motion, Tailwind CSS, Lucide Icons, Vitest, Supertest, Cypress.

---

## Design System Overview

### 1. Component Architecture

**Three-tier component system:**

1. **Core Design Components (30)** - Foundational UI primitives with zero business logic
   - Input components: Button, Input, Select, Checkbox, Radio, Toggle, DatePicker, TimePicker, TextArea, SearchBox
   - Layout components: Card, Modal, Tabs, Accordion, Sidebar, TopBar, Avatar, Badge, Divider
   - Data components: Table, List, EmptyState, LoadingState, Pagination
   - Feedback components: Toast, Alert, Progress
   - Form wrapper component with validation

2. **Feature Components** - Composed from core components, contain business logic
   - Analytics: MetricsGrid, TimeSeriesChart, EmailEngagementChart, TopCompaniesTable, ExportButton, DateRangeFilter
   - Integrations: IntegrationCard, ConnectButton, SyncStatusBadge, SyncLogDrawer, IntegrationGrid
   - Prospects: ProspectsTable, ProspectDetailDrawer, BulkImportModal, CreateProspectForm, StatusBadge, ProspectSearch
   - Outreach: QueueStatusCard, QueueTable, SendNowButton, SequenceBuilder, AutomationScheduler
   - Settings: UserProfileForm, TeamMembersTable, ApiKeysManager, WebhookManager, OrganizationSettings

3. **Screens** - Full pages composed of feature components
   - AnalyticsDashboard
   - IntegrationsPanel
   - ProspectsPage
   - OutreachPage
   - SettingsPage

### 2. Design Aesthetic

**Blended approach combining three philosophies:**

- **Modern Minimal** (from Linear, Notion)
  - Clean, spacious layouts with generous whitespace
  - Subtle, refined animations (250ms easing)
  - Focus on clarity and simplicity
  - Minimal visual noise

- **Rich Interactive** (from Figma, Framer)
  - Smooth transitions and delightful micro-interactions
  - Hover states that provide feedback
  - Animated state changes (loading, success, error)
  - Visual sophistication without excess

- **Enterprise Professional** (from Salesforce, Stripe)
  - High information density when needed (tables, dashboards)
  - Clear visual hierarchy
  - Accessible color contrasts
  - Conservative, serious presentation

**Color Palette:**
- Primary: #3b82f6 (blue) - Actions, focus states
- Success: #10b981 (green) - Conversions, completed, opened
- Warning: #f59e0b (amber) - Pending, scheduled
- Danger: #ef4444 (red) - Failed, deleted, errors
- Neutral: #6b7280 (gray) - Secondary text, disabled states
- Background: #ffffff (light), #f9fafb (cards)

**Typography:**
- Headings: Inter SemiBold, 16px-32px
- Body: Inter Regular, 14px
- Code: Fira Code, 12px
- Line-height: 1.5 for readability

**Spacing:**
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px
- Use consistent spacing scale across all components

**Animations:**
- Framer Motion for all transitions
- Duration: 200-300ms for most interactions
- Easing: easeInOut for smoothness
- Avoid excessive animations (performance, accessibility)

### 3. State Management Strategy

**Server State (TanStack Query):**
- All backend API data managed by Query (prospects, outreach queue, analytics, integrations)
- Automatic caching with smart invalidation
- Background refetching for real-time data
- Optimistic updates for create/update operations
- Request deduplication and retry logic

**UI State (Zustand):**
- Modal open/close state
- Sidebar collapsed/expanded
- Active filters and search terms
- Selected rows in tables
- Form draft data
- Temporary UI toggles (sorting, view mode)

**Real-time State (WebSocket):**
- Connection status
- Queue status changes (prospect email sent, opened, clicked)
- Integration sync progress
- Analytics updates (emit every 30 seconds)
- Notification queue for toasts

**Local Storage:**
- User preferences (theme, sidebar collapsed, table columns visible)
- Draft forms (prospect creation, email templates)
- Last visited page

### 4. API Integration

**Endpoint Connections:**

| Endpoint | Feature | Query | Cache Strategy |
|----------|---------|-------|-----------------|
| GET /api/analytics/dashboard | Analytics | useAnalyticsDashboard | 30s stale time |
| GET /api/analytics/metrics | Analytics | useAnalyticsMetrics | 10s stale time |
| GET /api/prospects | Prospects | useProspects | 20s stale time |
| POST /api/prospects | Prospects | createProspect | Optimistic update |
| PATCH /api/prospects/:id | Prospects | updateProspect | Optimistic update |
| DELETE /api/prospects/:id | Prospects | deleteProspect | Optimistic update |
| POST /api/prospects/bulk-import | Prospects | bulkImportProspects | No cache |
| GET /api/outreach/queue | Outreach | useOutreachQueue | 10s stale time (WS updated) |
| POST /api/outreach/send | Outreach | sendOutreach | No cache |
| GET /api/integrations | Integrations | useIntegrations | 60s stale time |
| POST /api/integrations/connect | Integrations | connectIntegration | No cache |
| POST /api/integrations/sync | Integrations | syncIntegration | No cache |
| GET /api/webhooks | Settings | useWebhooks | 60s stale time |

**Error Handling:**
- All failed requests show Toast with error message
- 401 errors trigger logout redirect
- 500 errors show "Try again" button with manual retry
- Network errors show offline indicator
- Optimistic updates rollback on failure with toast explaining action failed

**Loading States:**
- Skeleton loaders for initial page loads
- Subtle spinners for background fetches
- Table rows show loading animation during operations
- Buttons show loading state during submission

### 5. Real-time Updates via WebSocket

**Connection:**
- Establish on app init, reconnect on disconnect with exponential backoff
- Send heartbeat every 30 seconds to keep connection alive
- Close after 5 minutes of inactivity

**Events:**
- `outreach.sent` - Queue item sent, update queue table
- `outreach.opened` - Email opened, update metrics
- `outreach.clicked` - Link clicked, update metrics
- `prospect.created` - New prospect added by another user, refetch list
- `integration.syncing` - Show progress badge
- `integration.synced` - Update sync status and data
- `analytics.updated` - Refresh dashboard metrics

**Handling:**
- Invalidate relevant TanStack Query caches on event
- Show non-intrusive Toast notification for important events
- Update local state for immediate UI feedback
- Debounce rapid events (e.g., multiple clicks in 5 seconds)

### 6. Mobile-Responsive Design

**Breakpoints:**
- sm: 640px (small phones)
- md: 768px (tablets)
- lg: 1024px (laptops)
- xl: 1280px (desktops)

**Mobile-First Strategy:**
- Design all components mobile-first
- Tables become scrollable cards on mobile
- Sidebar collapses to hamburger menu
- Modal becomes full-screen sheet on mobile
- Grid layouts reduce columns (3 → 2 → 1)
- Forms become single column

**Touch-Friendly:**
- Minimum 44px touch targets
- 16px minimum font size on mobile (prevents zoom)
- Adequate spacing between clickable elements
- No hover states on mobile (use click instead)

### 7. Accessibility

**WCAG 2.1 AA Compliance:**
- Semantic HTML (button, form, input, etc.)
- ARIA labels for all interactive elements
- Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Screen reader support (role, aria-label, aria-describedby)
- Color contrast ≥ 4.5:1 for text
- Focus indicators visible on all interactive elements
- Error messages associated with inputs (aria-invalid, aria-describedby)
- Loading states announced (aria-busy, aria-live)
- Modal traps focus inside dialog

### 8. Testing Strategy

**Component Testing (Vitest + Supertest):**
- 80+ tests for 30 core components
- Happy paths (renders, accepts props, calls callbacks)
- Error states (validation, disabled, loading)
- Accessibility (keyboard nav, screen reader, focus)
- Edge cases (empty data, very long content, special characters)

**Integration Testing:**
- Feature components with mocked TanStack Query
- Form submission flows
- Filter/sort/pagination behavior
- Table expand/collapse
- Modal open/close

**E2E Testing (Cypress):**
- 20+ critical user journeys
- Login → view dashboard → filter → export
- Create prospect → view details → update status
- Connect integration → view sync logs
- Send outreach → view queue status

**Visual Regression:**
- Playwright screenshots at breakpoints (sm, md, lg)
- Compare against baseline after component changes
- Coverage for all states (default, hover, active, disabled, loading, error)

**Performance Testing:**
- Lighthouse CI on all pages (target: >90 performance score)
- Core Web Vitals monitoring
- Bundle size analysis (target: <150KB gzipped)

### 9. File Structure

```
frontend/src/
├── components/
│   ├── core/                           # 30 foundation components
│   │   ├── Button.jsx                  # Primary, secondary, danger, sizes, loading
│   │   ├── Input.jsx                   # Text, email, password, number, validation
│   │   ├── Select.jsx                  # Single, multi-select, searchable
│   │   ├── Checkbox.jsx
│   │   ├── Radio.jsx
│   │   ├── Toggle.jsx
│   │   ├── DatePicker.jsx
│   │   ├── TimePicker.jsx
│   │   ├── TextArea.jsx
│   │   ├── SearchBox.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx                   # Dialog, sheet, drawer
│   │   ├── Tabs.jsx
│   │   ├── Accordion.jsx
│   │   ├── Badge.jsx
│   │   ├── Chip.jsx
│   │   ├── Avatar.jsx
│   │   ├── AvatarGroup.jsx
│   │   ├── Divider.jsx
│   │   ├── Table.jsx                   # Sortable, filterable, paginated, expandable
│   │   ├── List.jsx
│   │   ├── EmptyState.jsx
│   │   ├── LoadingState.jsx
│   │   ├── Toast.jsx
│   │   ├── Alert.jsx
│   │   ├── Progress.jsx
│   │   ├── Pagination.jsx
│   │   ├── Form.jsx                    # With validation
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   └── Breadcrumbs.jsx
│   ├── features/
│   │   ├── analytics/
│   │   │   ├── MetricsGrid.jsx
│   │   │   ├── TimeSeriesChart.jsx
│   │   │   ├── EmailEngagementChart.jsx
│   │   │   ├── TopCompaniesTable.jsx
│   │   │   ├── ExportButton.jsx
│   │   │   └── DateRangeFilter.jsx
│   │   ├── integrations/
│   │   │   ├── IntegrationCard.jsx
│   │   │   ├── ConnectButton.jsx
│   │   │   ├── SyncStatusBadge.jsx
│   │   │   ├── SyncLogDrawer.jsx
│   │   │   └── IntegrationGrid.jsx
│   │   ├── prospects/
│   │   │   ├── ProspectsTable.jsx
│   │   │   ├── ProspectDetailDrawer.jsx
│   │   │   ├── BulkImportModal.jsx
│   │   │   ├── CreateProspectForm.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── ProspectSearch.jsx
│   │   ├── outreach/
│   │   │   ├── QueueStatusCard.jsx
│   │   │   ├── QueueTable.jsx
│   │   │   ├── SendNowButton.jsx
│   │   │   ├── SequenceBuilder.jsx
│   │   │   └── AutomationScheduler.jsx
│   │   └── settings/
│   │       ├── UserProfileForm.jsx
│   │       ├── TeamMembersTable.jsx
│   │       ├── ApiKeysManager.jsx
│   │       ├── WebhookManager.jsx
│   │       └── OrganizationSettings.jsx
│   └── common/
│       ├── ErrorBoundary.jsx
│       ├── ConfirmDialog.jsx
│       ├── FilterBar.jsx
│       ├── SearchableList.jsx
│       └── LoadingSpinner.jsx
├── screens/
│   ├── AnalyticsDashboard.jsx
│   ├── IntegrationsPanel.jsx
│   ├── ProspectsPage.jsx
│   ├── OutreachPage.jsx
│   ├── SettingsPage.jsx
│   └── __tests__/
│       ├── AnalyticsDashboard.test.jsx
│       ├── IntegrationsPanel.test.jsx
│       └── ... (screen tests)
├── hooks/
│   ├── useProspects.js                 # TanStack Query wrapper
│   ├── useOutreach.js
│   ├── useAnalytics.js
│   ├── useIntegrations.js
│   ├── useWebhooks.js
│   ├── useWebSocket.js                 # Real-time connection
│   ├── useLocalStorage.js              # Persist preferences
│   └── useAsync.js                     # Generic async handler
├── stores/
│   ├── uiStore.js                      # Modal, sidebar, notifications
│   ├── prospectStore.js                # Selected, search, filters
│   ├── analyticsStore.js               # Date range, metric filters
│   ├── authStore.js                    # User, org, permissions
│   └── __tests__/
│       ├── uiStore.test.js
│       └── ... (store tests)
├── api/
│   ├── client.js                       # Axios instance with interceptors
│   ├── prospectAPI.js
│   ├── outreachAPI.js
│   ├── analyticsAPI.js
│   ├── integrationsAPI.js
│   ├── webhooksAPI.js
│   └── authAPI.js
├── utils/
│   ├── formatters.js                   # formatDate, formatCurrency, etc.
│   ├── validators.js                   # validateEmail, validateUrl, etc.
│   ├── constants.js                    # Status enums, colors, etc.
│   ├── localStorageManager.js
│   └── __tests__/
│       └── formatters.test.js
├── theme/
│   ├── colors.js
│   ├── spacing.js
│   ├── typography.js
│   ├── shadows.js
│   └── index.js                        # Combines all theme tokens
├── App.jsx
├── main.jsx
└── index.css
```

### 10. Implementation Phases (50 Tasks)

**Phase 4A: Core System (Tasks 31-40)**
- Tasks 31-35: Core design components (30 components total)
- Task 36: TanStack Query + Zustand setup
- Task 37: WebSocket integration
- Task 38: Analytics dashboard screens
- Task 39: Component tests (80+ tests)
- Task 40: Storybook documentation

**Phase 4B: Feature Screens (Tasks 41-50)**
- Task 41: Integrations panel
- Task 42: Prospects management (list, detail, create, bulk import)
- Task 43: Outreach queue screen
- Task 44: Settings & webhooks
- Task 45: Mobile responsiveness (all screens)
- Task 46: E2E tests (20+ critical journeys)
- Task 47: Accessibility audit (WCAG 2.1 AA)
- Task 48: Performance optimization
- Task 49: Visual polish (animations, micro-interactions)
- Task 50: Documentation & deployment

### 11. Success Criteria

- ✅ 30 core components with 80+ tests (>90% coverage)
- ✅ 5 feature screens fully functional with API integration
- ✅ Real-time updates via WebSocket for queue, integrations, analytics
- ✅ Mobile-responsive design (sm, md, lg, xl breakpoints)
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Lighthouse performance score >90 on all pages
- ✅ 20+ E2E tests covering critical user journeys
- ✅ Zero console errors or warnings in production build
- ✅ Bundle size <150KB gzipped (js + css)
- ✅ Storybook with all 30 core components documented

---

**Next Step:** Invoke writing-plans skill to create detailed 50-task implementation breakdown.

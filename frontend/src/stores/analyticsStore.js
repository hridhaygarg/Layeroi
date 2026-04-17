import { create } from 'zustand';

export const useAnalyticsStore = create((set) => ({
  // Date range
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
  },
  setDateRange: (startDate, endDate) =>
    set({
      dateRange: {
        startDate,
        endDate,
      },
    }),

  // Filters
  filters: {
    prospectSource: null,
    metric: 'roi',
  },
  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
  resetFilters: () =>
    set({
      filters: {
        prospectSource: null,
        metric: 'roi',
      },
    }),
}));

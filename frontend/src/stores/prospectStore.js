import { create } from 'zustand';

export const useProspectStore = create((set) => ({
  // Selected prospect
  selectedProspect: null,
  setSelectedProspect: (prospect) => set({ selectedProspect: prospect }),

  // Filters
  filters: {
    status: null,
    search: '',
    tags: [],
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
        status: null,
        search: '',
        tags: [],
      },
    }),

  // Sorting
  sorting: {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  setSorting: (sortBy, sortOrder) =>
    set({
      sorting: {
        sortBy,
        sortOrder,
      },
    }),

  // Bulk selection
  selectedIds: [],
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id],
    })),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
}));

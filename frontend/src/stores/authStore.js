import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // Auth state
  user: null,
  organization: null,
  token: null,
  isAuthenticated: false,

  // Set auth
  setAuth: (user, organization, token) =>
    set({
      user,
      organization,
      token,
      isAuthenticated: !!token,
    }),

  // Update user
  setUser: (user) => set({ user }),

  // Update organization
  setOrganization: (organization) => set({ organization }),

  // Set token
  setToken: (token) =>
    set({
      token,
      isAuthenticated: !!token,
    }),

  // Logout
  logout: () =>
    set({
      user: null,
      organization: null,
      token: null,
      isAuthenticated: false,
    }),
}));

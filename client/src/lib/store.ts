import { create } from 'zustand';
import { AuthUserPayload, Organization } from '@bizbot/shared-types';

export type NavModule =
  | 'intro'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'chat'
  | 'agenda'
  | 'crm'
  | 'documents'
  | 'call-center'
  | 'workflows'
  | 'analytics'
  | 'billing'
  | 'settings';

interface AppState {
  currentModule: NavModule;
  user: AuthUserPayload | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isSidebarOpen: boolean;
  setCurrentModule: (module: NavModule) => void;
  setAuth: (user: AuthUserPayload, org?: Organization, accessToken?: string, refreshToken?: string) => void;
  logout: () => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentModule: 'intro',
  user: null,
  organization: null,
  isAuthenticated: !!localStorage.getItem('bizbot_access_token'),
  isSidebarOpen: false,

  setCurrentModule: (module) =>
    set({
      currentModule: module,
      isSidebarOpen: false,
    }),

  setAuth: (user, org, accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('bizbot_access_token', accessToken);
    if (refreshToken) localStorage.setItem('bizbot_refresh_token', refreshToken);
    set({
      user,
      organization: org || null,
      isAuthenticated: true,
      currentModule: 'dashboard',
    });
  },

  logout: () => {
    localStorage.removeItem('bizbot_access_token');
    localStorage.removeItem('bizbot_refresh_token');
    set({
      user: null,
      organization: null,
      isAuthenticated: false,
      currentModule: 'intro',
    });
  },

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

import { create } from 'zustand';

export type UserRole = 'admin' | 'operator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  login: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  theme: 'dark',
  login: (user) => {
    set({ user, isAuthenticated: true });
    // Store in localStorage
    localStorage.setItem('auth', JSON.stringify({ user, isAuthenticated: true }));
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth');
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    localStorage.setItem('theme', newTheme);
  },
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
  },
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('auth');
  const storedTheme = localStorage.getItem('theme');
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.user && parsed.isAuthenticated) {
        useAuthStore.setState(parsed);
      }
    } catch (e) {
      console.error('Error parsing stored auth:', e);
    }
  }
  
  if (storedTheme) {
    useAuthStore.setState({ theme: storedTheme as 'light' | 'dark' });
  }
}
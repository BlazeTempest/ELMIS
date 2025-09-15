import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useAuthStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
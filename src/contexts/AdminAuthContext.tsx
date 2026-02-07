"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const authData = localStorage.getItem('admin_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(parsed.username);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setUsername(null);
    router.push('/admin/login');
  };

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = pathname === '/admin/login';

      if (!isAuthenticated && !isLoginPage) {
        router.push('/admin/login');
      } else if (isAuthenticated && isLoginPage) {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, username, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

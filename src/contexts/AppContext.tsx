import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('login-user', {
        body: { email, password },
      });

      if (error) {
        toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
        return false;
      }

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({ title: 'Login successful', description: 'Welcome back!' });
        return true;
      }

      return false;
    } catch (error) {
      toast({ title: 'Login failed', description: 'An error occurred', variant: 'destructive' });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({ title: 'Logged out', description: 'You have been logged out successfully' });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
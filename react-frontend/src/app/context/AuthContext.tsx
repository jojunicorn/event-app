'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotificationsForUser } from '@/apiCalls/notification';
import { Notification } from '@/models/notification';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  userId: string | null;
  login: (token: string, role: string, userId: string) => void;
  logout: () => void;
  notifications: Notification[]; // Add this
  hasUnreadNotifications: boolean; // And this
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('userId');

    if (token && role && id) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserId(id);

      getNotificationsForUser(id).then(data => {
        setNotifications(data);
        setHasUnreadNotifications(data.some((n: Notification) => !n.readStatus));
      }).catch(err => console.error("Error fetching notifications:", err));
    }
  }, []);

  const login = (token: string, role: string, userId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);

    setIsLoggedIn(true);
    setUserRole(role);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');

    setIsLoggedIn(false);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userRole,
      userId,
      login,
      logout,
      notifications,
      hasUnreadNotifications
    }}>
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from './types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('PROCUREMENT_OFFICER');

  useEffect(() => {
    const savedRole = localStorage.getItem('demo-role') as UserRole;
    if (savedRole) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('demo-role', newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

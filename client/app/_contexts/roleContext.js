"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);

  const login = (role, email) => {
    setRole(role);
    setEmail(email)
    Cookies.set('role', role, { expires: 30 });
    Cookies.set('email', email, { expires: 30 })
  };

  const roleLogout = () => {
    setRole(null);
    setEmail(null);
    console.log('Before logout:', Cookies.get('role'), Cookies.get('email'));
    Cookies.remove('role', { path: '/' });
    Cookies.remove('email', { path: '/' });
    console.log('After logout:', Cookies.get('role'), Cookies.get('email'));
  };

  useEffect(() => {
    const roleFromCookie = Cookies.get('role');
    const emailFromCookie = Cookies.get('email')
    if (roleFromCookie) {
      setRole(roleFromCookie);
    }
    if (emailFromCookie) {
      setEmail(emailFromCookie);
    }
  }, []);

  return (
    <RoleContext.Provider value={{ role, email, login, roleLogout }}>
      {children}
    </RoleContext.Provider>
  );
};

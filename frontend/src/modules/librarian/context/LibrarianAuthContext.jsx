import React, { createContext, useState, useContext, useEffect } from 'react';
import { SCHOOL } from '../../../shared/data/school';
import { findStaffByName } from '../../../shared/data/staff';

const LibrarianAuthContext = createContext();

export const LibrarianAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('librarian_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'librarian' && password === 'lib123') {
          const identity = findStaffByName('Sanjay Kumar');
          const mockUser = {
            id: identity.id,
            username: 'librarian',
            name: identity.name,
            email: identity.email,
            role: identity.designation,
            schoolName: SCHOOL.name,
            academicSession: SCHOOL.academicSession,
            photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
          };
          localStorage.setItem('librarian_user', JSON.stringify(mockUser));
          setUser(mockUser);
          resolve(mockUser);
        } else {
          reject(new Error('Invalid username or password.'));
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('librarian_user');
    setUser(null);
  };

  return (
    <LibrarianAuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </LibrarianAuthContext.Provider>
  );
};

export const useLibrarianAuth = () => {
  const context = useContext(LibrarianAuthContext);
  if (!context) {
    throw new Error('useLibrarianAuth must be used within a LibrarianAuthProvider');
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect } from 'react';

const SchoolAdminAuthContext = createContext();

export const SchoolAdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('school-admin-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username.toLowerCase() === 'admin' && password === 'admin123') {
      const mockUser = {
        id: 'ADM-001',
        name: 'Principal S. Chatterjee',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'School Admin',
        schoolId: 'SCH-2026-09',
        schoolName: 'Greenfield Public School',
        academicSession: '2026-2027',
        email: 'admin@greenfield.edu',
        phone: '+91 99999 88888'
      };
      setUser(mockUser);
      localStorage.setItem('school-admin-user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Credentials (Use admin / admin123)' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('school-admin-user');
  };

  const updateProfile = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
    localStorage.setItem('school-admin-user', JSON.stringify(newUser));
  };

  return (
    <SchoolAdminAuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </SchoolAdminAuthContext.Provider>
  );
};

export const useSchoolAdminAuth = () => useContext(SchoolAdminAuthContext);

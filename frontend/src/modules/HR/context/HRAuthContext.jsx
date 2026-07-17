import React, { createContext, useState, useContext, useEffect } from 'react';

const HRAuthContext = createContext();

export const HRAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('hr-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username.toLowerCase() === 'hr' && password === 'hr123') {
      const mockUser = {
        id: 'HR-001',
        name: 'Mr. Suresh Kumar',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'HR & Admin Manager',
        employeeId: 'HR-001',
        department: 'Human Resources',
        schoolId: 'SCH-2026-09',
        schoolName: 'Greenfield Public School',
        academicSession: '2026-2027',
        email: 'suresh.kumar@greenfield.edu',
        phone: '+91 99999 00000'
      };
      setUser(mockUser);
      localStorage.setItem('hr-user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid HR Credentials (Use username: hr, password: hr123)' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hr-user');
  };

  const updateProfile = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
    localStorage.setItem('hr-user', JSON.stringify(newUser));
  };

  return (
    <HRAuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </HRAuthContext.Provider>
  );
};

export const useHRAuth = () => useContext(HRAuthContext);
export default HRAuthContext;

import React, { createContext, useState, useContext, useEffect } from 'react';

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('student-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (studentId, password) => {
    if (studentId && password) {
      const mockUser = {
        id: studentId.toUpperCase(),
        name: "Aarav Sharma",
        photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
        admissionNo: "ADM-2024-8902",
        class: "Class 10",
        section: "A",
        rollNo: "12",
        academicSession: "2025-2026",
        email: "aarav.sharma@school.edu",
        phone: "+91 98765 43210",
        dob: "2010-05-14",
        bloodGroup: "O+",
        gender: "Male",
        category: "General",
        religion: "Hinduism",
        admissionDate: "2024-04-10",
        guardian: {
          name: "Rajesh Sharma",
          relation: "Father",
          phone: "+91 98765 01234",
          email: "rajesh.sharma@gmail.com",
          occupation: "Software Engineer",
          address: "Flat 402, Pine Crest Apartments, Sector 15, Dwarka, New Delhi - 110075"
        },
        medical: {
          allergies: "Dust, Pollen",
          conditions: "None",
          medications: "None",
          emergencyContact: "Rajesh Sharma (+91 98765 01234)"
        }
      };
      setUser(mockUser);
      localStorage.setItem('student-user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid Credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('student-user');
  };

  const updateProfile = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
    localStorage.setItem('student-user', JSON.stringify(newUser));
  };

  return (
    <StudentAuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => useContext(StudentAuthContext);

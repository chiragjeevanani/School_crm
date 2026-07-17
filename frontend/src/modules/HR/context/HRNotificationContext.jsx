import React, { createContext, useState, useContext } from 'react';

const HRNotificationContext = createContext();

export const HRNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Leave Request', message: 'Mrs. Priya Nair applied for a 2-day Sick Leave starting July 20th.', type: 'Leave Update', read: false, time: '10 mins ago' },
    { id: '2', title: 'Document Expiry Warning', message: 'Employment contract for GFS-EMP-001 is set to expire soon.', type: 'Document Expiry', read: false, time: '1 hour ago' },
    { id: '3', title: 'Payroll Draft Generated', message: 'Monthly payroll spreadsheet generated for July 2026. Awaiting approval review.', type: 'Payroll Notification', read: true, time: '1 day ago' },
    { id: '4', title: 'New Joining Registered', message: 'Rajesh Kumar joined as Sports Instructor on August 1st contract basis.', type: 'Joining Alert', read: true, time: '2 days ago' }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (n) => {
    setNotifications(prev => [
      { id: Date.now().toString(), read: false, time: 'Just now', ...n },
      ...prev
    ]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <HRNotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead, addNotification }}>
      {children}
    </HRNotificationContext.Provider>
  );
};

export const useHRNotifications = () => useContext(HRNotificationContext);
export default HRNotificationContext;

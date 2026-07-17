import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { BookList } from '../pages/books/BookList';
import { BookDetail } from '../pages/books/BookDetail';
import { CategoryManagement } from '../pages/categories/CategoryManagement';
import { InventoryManagement } from '../pages/inventory/InventoryManagement';
import { BookIssue } from '../pages/issue/BookIssue';
import { BookReturn } from '../pages/return/BookReturn';
import { BookReservation } from '../pages/reservation/BookReservation';
import { FineManagement } from '../pages/fines/FineManagement';
import { MemberManagement } from '../pages/members/MemberManagement';
import { Reports } from '../pages/reports/Reports';
import { Notifications } from '../pages/notifications/Notifications';
import { AuditLogs } from '../pages/audit/AuditLogs';
import { Settings } from '../pages/settings/Settings';

export const LibrarianRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="books" element={<BookList />} />
      <Route path="books/:id" element={<BookDetail />} />
      <Route path="categories" element={<CategoryManagement />} />
      <Route path="inventory" element={<InventoryManagement />} />
      <Route path="issue" element={<BookIssue />} />
      <Route path="return" element={<BookReturn />} />
      <Route path="reservation" element={<BookReservation />} />
      <Route path="fines" element={<FineManagement />} />
      <Route path="members" element={<MemberManagement />} />
      <Route path="reports" element={<Reports />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="audit" element={<AuditLogs />} />
      <Route path="settings" element={<Settings />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

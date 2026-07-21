import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import Dashboard from '../pages/dashboard/Dashboard';
import SchoolsIndex from '../pages/schools/SchoolsIndex';
import SubscriptionsIndex from '../pages/subscriptions/SubscriptionsIndex';
import LicensesIndex from '../pages/licenses/LicensesIndex';
import ModulesIndex from '../pages/modules/ModulesIndex';
import TenantsIndex from '../pages/tenants/TenantsIndex';
import StorageIndex from '../pages/storage/StorageIndex';
import RevenueIndex from '../pages/revenue/RevenueIndex';
import SupportIndex from '../pages/support/SupportIndex';
import BroadcastIndex from '../pages/broadcast/BroadcastIndex';
import MonitoringIndex from '../pages/monitoring/MonitoringIndex';
import AuditLogsIndex from '../pages/audit/AuditLogsIndex';
import BackupIndex from '../pages/backup/BackupIndex';
import SecurityIndex from '../pages/security/SecurityIndex';
import IntegrationsIndex from '../pages/integrations/IntegrationsIndex';
import PlatformSettingsIndex from '../pages/platform-settings/PlatformSettingsIndex';
import ReportsIndex from '../pages/reports/ReportsIndex';
import NotificationsIndex from '../pages/notifications/NotificationsIndex';
import SettingsIndex from '../pages/settings/SettingsIndex';

// Protected Route Shield wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSuperAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Authenticating Secure Channel Node...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
};

export const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="schools"
        element={
          <ProtectedRoute>
            <SchoolsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="subscriptions"
        element={
          <ProtectedRoute>
            <SubscriptionsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="licenses"
        element={
          <ProtectedRoute>
            <LicensesIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="modules"
        element={
          <ProtectedRoute>
            <ModulesIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="tenants"
        element={
          <ProtectedRoute>
            <TenantsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="storage"
        element={
          <ProtectedRoute>
            <StorageIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="revenue"
        element={
          <ProtectedRoute>
            <RevenueIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="billing"
        element={
          <ProtectedRoute>
            <RevenueIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="support"
        element={
          <ProtectedRoute>
            <SupportIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="broadcast"
        element={
          <ProtectedRoute>
            <BroadcastIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="monitoring"
        element={
          <ProtectedRoute>
            <MonitoringIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="audit-logs"
        element={
          <ProtectedRoute>
            <AuditLogsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="backup"
        element={
          <ProtectedRoute>
            <BackupIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="security"
        element={
          <ProtectedRoute>
            <SecurityIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="integrations"
        element={
          <ProtectedRoute>
            <IntegrationsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="platform-settings"
        element={
          <ProtectedRoute>
            <PlatformSettingsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="reports"
        element={
          <ProtectedRoute>
            <ReportsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="notifications"
        element={
          <ProtectedRoute>
            <NotificationsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="settings"
        element={
          <ProtectedRoute>
            <SettingsIndex />
          </ProtectedRoute>
        }
      />

      {/* Redirect nested root path to Dashboard */}
      <Route path="" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

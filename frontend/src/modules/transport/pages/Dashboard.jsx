import React from 'react';
import { useTransportAuth } from '../context/TransportAuthContext';
import { useTransportNotifications } from '../context/TransportNotificationContext';
import { 
  Bus, 
  UserCheck, 
  Route, 
  MapPin, 
  Users, 
  Wrench, 
  Fuel, 
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  CalendarDays,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { AreaChart } from '../components/ui/Charts/AreaChart';
import { BarChart } from '../components/ui/Charts/BarChart';
import { PieChart } from '../components/ui/Charts/PieChart';
import { LineChart } from '../components/ui/Charts/LineChart';
import { formatDate, formatCurrency } from '../utils/formatters';
import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_ROUTES, MOCK_PICKUP_POINTS, MOCK_ASSIGNMENTS, MOCK_MAINTENANCE } from '../utils/constants';

export const Dashboard = () => {
  const { user } = useTransportAuth();
  const { notifications } = useTransportNotifications();
  const navigate = useNavigate();
  
  // Compute Dashboard Statistics
  const totalVehicles = MOCK_VEHICLES.length;
  const activeVehicles = MOCK_VEHICLES.filter(v => v.currentStatus === 'Active').length;
  const inactiveVehicles = MOCK_VEHICLES.filter(v => v.currentStatus === 'Inactive').length;
  const maintenanceVehicles = MOCK_VEHICLES.filter(v => v.currentStatus === 'Maintenance').length;
  
  const totalDrivers = MOCK_DRIVERS.length;
  const activeDrivers = MOCK_DRIVERS.filter(d => d.status === 'Active').length;
  const studentsCount = MOCK_ASSIGNMENTS.filter(a => a.status === 'Active' || !a.status).length;
  
  const totalRoutes = MOCK_ROUTES.length;
  const totalPickups = MOCK_PICKUP_POINTS.length;
  const pendingMaintenanceCount = MOCK_MAINTENANCE.filter(m => m.status === 'Scheduled' || m.status === 'In Progress').length;
  
  // Expiry alerts warning counts (dates comparison)
  const insuranceExpCount = MOCK_VEHICLES.filter(v => new Date(v.insuranceExpiry) < new Date('2026-10-15')).length;
  const fitnessExpCount = MOCK_VEHICLES.filter(v => new Date(v.fitnessCertificateExpiry) < new Date('2026-10-15')).length;
  const licenseExpCount = MOCK_DRIVERS.filter(d => new Date(d.licenseExpiry) < new Date('2026-10-15')).length;

  // Chart datasets
  const vehicleTypeData = [
    { name: 'Bus', value: 3 },
    { name: 'Mini Bus', value: 1 },
    { name: 'Van', value: 1 }
  ];

  const studentsPerRouteData = MOCK_ROUTES.map(r => ({
    name: r.routeCode,
    value: r.studentCount
  }));

  const maintenanceCostData = [
    { name: 'May', Cost: 12000 },
    { name: 'Jun', Cost: 25000 },
    { name: 'Jul', Cost: 18000 }
  ];

  const fuelCostData = [
    { name: 'Week 1', Cost: 15000 },
    { name: 'Week 2', Cost: 18000 },
    { name: 'Week 3', Cost: 14000 },
    { name: 'Week 4', Cost: 22000 }
  ];

  const routeOccupancyData = MOCK_ROUTES.map(r => ({
    name: r.routeCode,
    Utilization: Math.floor((r.studentCount / 40) * 100)
  }));

  const quickActions = [
    { name: 'Add Vehicle', icon: PlusCircle, path: '/transport/vehicles', state: { openAddWizard: true }, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/20' },
    { name: 'Add Driver', icon: PlusCircle, path: '/transport/drivers', state: { openAddWizard: true }, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-955/20' },
    { name: 'Create Route', icon: Route, path: '/transport/routes', state: { openAddWizard: true }, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-955/20' },
    { name: 'Assign Student', icon: Users, path: '/transport/assignments', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-955/20' },
    { name: 'Log Maintenance', icon: Wrench, path: '/transport/maintenance', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-955/20' },
    { name: 'View Reports', icon: FileText, path: '/transport/reports', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-955/20' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md shadow-cyan-900/10">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoUrl}
            alt={user?.name}
            className="h-16 w-16 rounded-full border-2 border-white/20 shrink-0"
          />
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black">Welcome back, {user?.name}!</h2>
            <p className="text-xs text-cyan-100 font-semibold flex items-center gap-1.5 opacity-90">
              <span>{user?.schoolName}</span>
              <span className="h-1 w-1 bg-white/40 rounded-full" />
              <span>Session {user?.academicSession}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl self-start md:self-auto border border-white/15">
          <CalendarDays className="h-4.5 w-4.5 text-cyan-200" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider">{formatDate(new Date())}</span>
        </div>
      </div>

      {/* Expiry warnings notification panel */}
      {(insuranceExpCount > 0 || licenseExpCount > 0 || fitnessExpCount > 0) && (
        <div className="p-4 bg-rose-50 border border-rose-100 dark:bg-rose-955/10 dark:border-rose-900/20 rounded-2xl flex gap-3 text-xs text-rose-800 dark:text-rose-400">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1 flex-1">
            <p className="font-bold">Attention Required: Critical Document Expiries Detected</p>
            <p className="text-3xs text-slate-500 dark:text-slate-400">
              You have <span className="font-bold text-rose-600">{insuranceExpCount} insurance policy</span>, <span className="font-bold text-rose-600">{fitnessExpCount} fitness certificates</span>, and <span className="font-bold text-rose-600">{licenseExpCount} driver licenses</span> expiring within 90 days. Please review alerts in Notifications immediately.
            </p>
          </div>
          <button 
            onClick={() => navigate('/transport/notifications')}
            className="text-xs font-bold underline hover:no-underline shrink-0"
          >
            Resolve Alerts
          </button>
        </div>
      )}

      {/* Grid statistics (16 Stats) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard title="Total Vehicles" value={totalVehicles} icon={Bus} />
        <StatCard title="Active Fleet" value={activeVehicles} icon={Bus} />
        <StatCard title="Fleet Inactive" value={inactiveVehicles} icon={Bus} />
        <StatCard title="Under Service" value={maintenanceVehicles} icon={Wrench} />
        <StatCard title="Total Drivers" value={totalDrivers} icon={UserCheck} />
        <StatCard title="Active Drivers" value={activeDrivers} icon={UserCheck} />
        <StatCard title="Total Students" value={studentsCount} icon={Users} />
        <StatCard title="Total Routes" value={totalRoutes} icon={Route} />
        <StatCard title="Pickup Stops" value={totalPickups} icon={MapPin} />
        <StatCard title="Pending Service" value={pendingMaintenanceCount} icon={Wrench} />
        <StatCard title="Ins. Expiring" value={insuranceExpCount} icon={ShieldAlert} />
        <StatCard title="Lic. Expiring" value={licenseExpCount} icon={ShieldAlert} />
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-3xl p-6">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Operations & Fleet Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.name}
                onClick={() => navigate(act.path, { state: act.state })}
                className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-850 hover:border-cyan-400 dark:hover:border-cyan-900/50 rounded-2xl hover:shadow-xs transition-all duration-200 group text-center"
              >
                <div className={`p-3 rounded-xl mb-3 group-hover:scale-105 transition-transform duration-205 ${act.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{act.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fuel Cost Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:col-span-2">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Weekly Fuel Cost Analysis</h3>
          <AreaChart data={fuelCostData} dataKey="Cost" xKey="name" />
        </div>

        {/* Fleet Composition Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-3xl p-6">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Fleet Composition</h3>
          <PieChart data={vehicleTypeData} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Cost Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Maintenance Spendings (INR)</h3>
          <BarChart data={maintenanceCostData} dataKey="Cost" xKey="name" />
        </div>

        {/* Route Occupancy Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-3xl p-6">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Route Utilization %</h3>
          <BarChart data={routeOccupancyData} dataKey="Utilization" xKey="name" />
        </div>

        {/* Students Per Route Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-3xl p-6">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Students per Route</h3>
          <PieChart data={studentsPerRouteData} />
        </div>
      </div>
    </div>
  );
};

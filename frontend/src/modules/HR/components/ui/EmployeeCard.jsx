import React from 'react';
import { Mail, Phone, Calendar, ArrowRight, Building, User } from 'lucide-react';
import { Badge } from './Badge';

export const EmployeeCard = ({ employee, onViewProfile, onEdit, onToggleStatus }) => {
  const isActive = employee.status === 'ACTIVE' || employee.status === 'Active';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-xs font-semibold">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {employee.photo ? (
            <img
              src={employee.photo}
              alt={employee.name}
              className={`w-12 h-12 rounded-2xl object-cover border-2 shrink-0 ${
                isActive ? 'border-emerald-500' : 'border-slate-400'
              }`}
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 border-2 shrink-0 ${
                isActive ? 'border-emerald-500' : 'border-slate-400'
              }`}
            >
              {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
            </div>
          )}
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
              {employee.employeeId}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-tight truncate">
              {employee.name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
              {employee.designation || 'Staff'} • {employee.department || 'General'}
            </p>
          </div>
        </div>

        <Badge variant={isActive ? 'success' : 'default'} className="shrink-0">
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      </div>

      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-slate-600 dark:text-slate-400">
        <p className="flex items-center gap-2 truncate">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{employee.email || 'No email provided'}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{employee.phone || 'No phone'}</span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Joined: {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 shrink-0">
        <span className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
          {employee.employeeType || 'STAFF'}
        </span>

        <div className="flex items-center gap-2">
          {onToggleStatus && (
            <button
              type="button"
              onClick={() => onToggleStatus(employee)}
              className="px-2.5 py-1 text-[11px] font-bold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
          {onViewProfile && (
            <button
              type="button"
              onClick={() => onViewProfile(employee)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs cursor-pointer"
            >
              <span>Profile</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default EmployeeCard;

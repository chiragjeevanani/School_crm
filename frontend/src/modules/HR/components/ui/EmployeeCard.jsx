import React from 'react';
import { Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from './Badge';
import { formatDate } from '../../utils/formatters';

export const EmployeeCard = ({ employee, onViewProfile, onEdit, onDeactivate }) => {
  const isActive = employee.status === 'Active';

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between text-xs font-semibold">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img 
            src={employee.photo} 
            alt={employee.name} 
            className={`w-12 h-12 rounded-2xl object-cover border-2 ${isActive ? 'border-emerald-500' : 'border-rose-500'}`} 
          />
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
              {employee.employeeId}
            </span>
            <h4 className="text-sm font-bold text-slate-905 dark:text-white mt-0.5 leading-none">
              {employee.name}
            </h4>
            <p className="text-[10px] text-slate-450 mt-1 font-semibold">
              {employee.designation} • {employee.department}
            </p>
          </div>
        </div>

        <Badge variant={isActive ? 'success' : 'danger'}>
          {employee.status}
        </Badge>
      </div>

      <div className="space-y-1.5 border-t border-slate-50 dark:border-slate-850/60 pt-3 text-slate-550 dark:text-slate-400">
        <p className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{employee.email}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>{employee.phone}</span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Joined: {formatDate(employee.joiningDate)}</span>
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-850/60 pt-3 shrink-0">
        <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">
          {employee.employmentType}
        </span>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button 
              type="button"
              onClick={() => onEdit(employee)}
              className="px-2.5 py-1 text-[10px] font-bold border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-655"
            >
              Edit
            </button>
          )}
          {onViewProfile && (
            <button
              type="button"
              onClick={() => onViewProfile(employee)}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-rose-600 hover:bg-rose-750 text-white rounded-lg shadow-sm"
            >
              <span>Profile</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default EmployeeCard;

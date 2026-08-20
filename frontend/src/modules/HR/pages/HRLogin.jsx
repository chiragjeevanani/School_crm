import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHRAuth } from '../context/HRAuthContext';
import { Lock, User as UserIcon, AlertCircle, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import BrandLogo from '../../../shared/ui/BrandLogo';

export const HRLogin = () => {
  const { login } = useHRAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate('/hr/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid HR login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">Greenfield Public School</h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Human Resources Management Portal</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-3.5 rounded-xl text-rose-700 dark:text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Email or Employee ID</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="rohan.hr@greenfield.edu or HR-201"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">HR Portal Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 focus:outline-none transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating HR credentials...</span>
            ) : (
              <>
                <span>Sign In to HRMS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Role-Isolated Secure HR Access (JWT Authenticated)</span>
        </div>
      </div>
    </div>
  );
};
export default HRLogin;

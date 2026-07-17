import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHRAuth } from '../context/HRAuthContext';
import { Users, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

export const HRLogin = () => {
  const { login } = useHRAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setLoading(false);
      if (result.success) {
        navigate('/hr/dashboard');
      } else {
        setError(result.message);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-600 dark:text-rose-405">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">Greenfield School</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">HR & Admin Staff Desk</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2.5 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/40 p-3.5 rounded-xl text-rose-650 dark:text-rose-455 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350">HR Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="hr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-955 text-slate-905 dark:text-white pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350">HR Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-955 text-slate-905 dark:text-white pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-rose-605 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-600/20 focus:outline-none transition-colors mt-2"
          >
            {loading ? 'Authenticating HR credentials...' : 'Sign In'}
          </button>
        </form>

        {/* Credentials Reminder */}
        <div className="bg-slate-50 dark:bg-slate-955 p-3.5 border border-slate-100 dark:border-slate-850 rounded-2xl text-[11px] font-medium text-slate-550 dark:text-slate-400 text-center">
          <p>Mock Credentials:</p>
          <p className="font-bold text-slate-705 dark:text-slate-300 mt-1">Username: hr | Password: hr123</p>
        </div>
      </div>
    </div>
  );
};
export default HRLogin;

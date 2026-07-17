import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransportAuth } from '../context/TransportAuthContext';
import { Bus, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

export const TransportLogin = () => {
  const { login } = useTransportAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('transport');
  const [password, setPassword] = useState('transport123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/transport/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-700/10 rounded-full blur-3xl" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative z-10 space-y-6">
        
        {/* Brand/Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-cyan-600 rounded-2xl text-white shadow-lg shadow-cyan-600/20">
            <Bus className="h-7 w-7 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mt-4">FLEET CONTROL</h2>
          <p className="text-slate-400 text-xs font-semibold">Greenwood Future School Transport Portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-550/30 rounded-2xl flex gap-2.5 text-xs text-rose-400">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-500">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-900 border border-slate-850 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-500">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-900 border border-slate-850 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white text-xs font-bold rounded-2xl transition-all duration-150 shadow-md shadow-cyan-900/20 active:scale-98"
          >
            {loading ? 'Authorizing Login...' : 'Enter Fleet Console'}
          </button>
        </form>

        {/* Guest Demo Credentials Notice */}
        <div className="pt-2 text-center">
          <span className="text-4xs text-slate-500 font-bold uppercase tracking-widest block mb-1">Demo Credentials</span>
          <span className="text-3xs font-mono text-cyan-500 bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10">
            transport / transport123
          </span>
        </div>
      </div>
    </div>
  );
};

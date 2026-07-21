import React, { useState } from 'react';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { useSuperAdminNotifications } from '../context/SuperAdminNotificationContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState(1); // 1 = Login, 2 = MFA TOTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useSuperAdminAuth();
  const { addNotification } = useSuperAdminNotifications();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (email === 'superadmin@appzeto.com' && password === 'admin123') {
        // Go to simulated MFA verification step
        setStep(2);
      } else {
        setError('Incorrect administrator credentials');
      }
    } catch (err) {
      setError('System authentication interface offline');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mfaCode === '123456' || mfaCode === '000000' || !mfaCode) {
        await login(email, password);
        addNotification('info', 'Administrator Session Initiated');
        navigate('/super-admin/dashboard');
      } else {
        setError('Invalid Multi-Factor validation key');
      }
    } catch (err) {
      setError('MFA Validation timeout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      {/* Visual background lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 border border-slate-900 bg-slate-950/80 backdrop-blur-xl space-y-6 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-wider text-slate-100 uppercase">Super Admin Gate</h2>
          <Badge variant="danger">Enterprise Isolation Sandbox</Badge>
          <p className="text-xs text-slate-500 max-w-[280px] mt-1 leading-relaxed">
            School administrators and staff are strictly forbidden from access.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Admin Root Email"
              type="email"
              placeholder="superadmin@appzeto.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Root Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 cursor-not-allowed hover:text-slate-400">
                Forgot password? Contact Security Operations
              </span>
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? 'Authenticating...' : 'Validate Signature'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div className="text-center space-y-2">
              <Lock className="h-5 w-5 text-indigo-400 mx-auto" />
              <p className="text-xs text-slate-300">Enter validation token from your authenticator app</p>
            </div>
            <Input
              label="MFA OTP Token"
              type="text"
              placeholder="123456"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              maxLength={6}
              required
            />
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? 'Validating...' : 'Unlock Portal'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Go Back
            </Button>
          </form>
        )}

        {/* Demo Credentials Hint */}
        <div className="p-3.5 bg-slate-900/40 border border-slate-900 rounded-xl text-center space-y-1 select-text">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Demo Credentials</p>
          <div className="text-[11px] text-slate-350 space-y-0.5">
            <p>Email: <span className="font-bold text-indigo-400">superadmin@appzeto.com</span></p>
            <p>Password: <span className="font-bold text-indigo-400">admin123</span></p>
            <p className="text-[10px] text-slate-500 mt-1.5">MFA Code: <span className="font-bold text-indigo-400">123456</span> (or leave blank)</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

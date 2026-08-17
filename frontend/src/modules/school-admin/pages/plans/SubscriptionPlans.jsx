import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Loader2, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useSchoolAdminAuth } from '../../context/SchoolAdminAuthContext';
import { schoolPortalApi } from '../../../../shared/api/client';

function formatInr(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const { user, hasPlan, applyUser } = useSchoolAdminAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    schoolPortalApi
      .plans()
      .then((result) => {
        if (active) setPlans(result.data || []);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || err.message || 'Unable to load plans.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSelect = async (plan) => {
    if (hasPlan) return;
    setSelectingId(plan.id);
    setError('');
    try {
      const result = await schoolPortalApi.selectPlan(plan.id);
      applyUser(result.user);
      navigate('/school-admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to select this plan.');
    } finally {
      setSelectingId('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Choose a subscription plan"
        subtitle={`${user?.schoolName || 'Your school'} needs a plan before the rest of the admin portal is unlocked. Super Admin will update billing status after you select one.`}
      />

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const selected = user?.subscriptionPlan === plan.name;
            return (
              <div
                key={plan.id}
                className={`flex flex-col rounded-3xl border bg-white p-6 shadow-sm dark:bg-slate-900 ${
                  selected
                    ? 'border-indigo-500 ring-4 ring-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {plan.planType}
                  </span>
                  {selected && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Check className="h-3.5 w-3.5" /> Current
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {formatInr(plan.price)}
                  <span className="ml-1 text-sm font-semibold text-slate-400">/ {plan.planType.toLowerCase()}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2">
                  {(plan.features || []).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={hasPlan || Boolean(selectingId)}
                  onClick={() => handleSelect(plan)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {selectingId === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  {selected ? 'Selected' : hasPlan ? 'Plan already chosen' : 'Choose this plan'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

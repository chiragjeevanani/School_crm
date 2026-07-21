import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { mockIntegrations } from '../../data/mockData';
import { Cable, ShieldAlert } from 'lucide-react';

export default function IntegrationsIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [integrations, setIntegrations] = useState(mockIntegrations);

  const handleToggleConnection = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'Connected' ? 'Disconnected' : 'Connected';
    setIntegrations((prev) =>
      prev.map((integ) => (integ.id === id ? { ...integ, status: nextStatus } : integ))
    );
    if (nextStatus === 'Connected') {
      addNotification('success', `API boundary connection established for: ${name}`);
    } else {
      addNotification('warning', `API connection pipeline severed for: ${name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">External SaaS Integrations</h1>
        <p className="text-xs text-slate-400">Configure Stripe gateway, SMS Twilio pipelines, Firebase Push notification nodes, and S3 buckets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integ) => (
          <Card key={integ.id} className="relative flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{integ.logo}</span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{integ.name}</h3>
                </div>
                <Badge variant={integ.status === 'Connected' ? 'success' : 'default'}>{integ.status}</Badge>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">{integ.category}</span>
              <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">{integ.description}</p>
            </div>

            <div className="pt-2">
              <Button
                variant={integ.status === 'Connected' ? 'secondary' : 'primary'}
                className="w-full text-xs"
                onClick={() => handleToggleConnection(integ.id, integ.name, integ.status)}
              >
                {integ.status === 'Connected' ? 'Sever Connection API' : 'Authenticate Key'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

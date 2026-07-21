import React, { useState } from 'react';
import { Card, Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { mockSchools } from '../../data/mockData';
import { Megaphone, Mail, MessageSquare, Send } from 'lucide-react';

export default function BroadcastIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [channel, setChannel] = useState('Email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('All');

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!message) return;

    addNotification(
      'success',
      `SaaS Broadcast successfully sent via ${channel} to ${targetGroup} schools`
    );

    // Reset fields
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global Broadcast Center</h1>
        <p className="text-xs text-slate-400">Send immediate Email, SMS, WhatsApp alerts, and Push notifications across school groups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-2">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Compose Announcement</h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select label="Transmission Channel" value={channel} onChange={(e) => setChannel(e.target.value)}>
                  <option value="Email">📧 Email SMTP</option>
                  <option value="SMS">💬 Twilio SMS</option>
                  <option value="Push Notification">📱 Firebase Push</option>
                  <option value="WhatsApp">🟢 WhatsApp API</option>
                </Select>

                <Select label="Recipients Target Group" value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)}>
                  <option value="All">All Registered Tenants</option>
                  <option value="Enterprise">Enterprise Tier Only</option>
                  <option value="Trial">Trial Subscriptions Only</option>
                </Select>
              </div>

              {channel === 'Email' && (
                <Input
                  label="Subject Line"
                  placeholder="System Maintenance Announcement / Schedule"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Body Message</label>
                <textarea
                  className="w-full min-h-[140px] bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  placeholder="Type official notification body content..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11">
                <Send size={14} className="mr-1.5" />
                Dispatch Message Broadcast
              </Button>
            </form>
          </Card>
        </div>

        {/* Channels Information */}
        <div className="space-y-4">
          <Card className="space-y-4 bg-slate-900/40 border-slate-900">
            <h3 className="text-sm font-bold text-slate-200">Delivery Channels</h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-400">
              <div className="flex gap-2">
                <Mail size={16} className="text-indigo-400 flex-shrink-0" />
                <p><strong>Email:</strong> Sent via Amazon SES / SendGrid configured SMTP templates.</p>
              </div>
              <div className="flex gap-2">
                <MessageSquare size={16} className="text-indigo-400 flex-shrink-0" />
                <p><strong>SMS:</strong> Sent via Twilio / MSG91 integration paths. Charges apply per SMS credits limit balance.</p>
              </div>
              <div className="flex gap-2">
                <Megaphone size={16} className="text-indigo-400 flex-shrink-0" />
                <p><strong>Push:</strong> Firebase Cloud Messaging token keys pushed to Android/iOS active client installations.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

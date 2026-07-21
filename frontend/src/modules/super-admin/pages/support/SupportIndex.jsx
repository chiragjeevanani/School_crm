import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Select, Input } from '../../components/ui/Input';
import { useSuperAdminNotifications } from '../../context/SuperAdminNotificationContext';
import { mockSupportTickets } from '../../data/mockData';
import { MessageSquare, Clock, Users, ArrowUpRight } from 'lucide-react';

export default function SupportIndex() {
  const { addNotification } = useSuperAdminNotifications();
  const [tickets, setTickets] = useState(mockSupportTickets);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleResolveTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t))
    );
    addNotification('success', `Ticket ${id} marked as Resolved`);
    setSelectedTicketId(null);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText) return;
    addNotification('info', `Reply dispatched to tenant email contact channel.`);
    setReplyText('');
  };

  const activeTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SaaS Support Operations</h1>
        <p className="text-xs text-slate-400">Manage incoming database config help request, bugs, features, and gateway tickets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Support Tickets</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Tenant School</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned team</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer" onClick={() => setSelectedTicketId(t.id)}>
                    <TableCell className="font-mono text-xs text-indigo-400">{t.id}</TableCell>
                    <TableCell className="font-semibold text-slate-100">{t.school}</TableCell>
                    <TableCell>
                      <Badge variant={t.priority === 'Critical' || t.priority === 'High' ? 'danger' : 'default'}>
                        {t.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{t.assigned}</TableCell>
                    <TableCell>
                      <Badge variant={t.status}>{t.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Ticket Chat Drawer / Details */}
        <div className="space-y-4">
          {activeTicket ? (
            <Card className="space-y-4 flex flex-col h-[480px] justify-between border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-slate-900/60">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-indigo-550 dark:text-indigo-400 block">{activeTicket.id}</span>
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100">{activeTicket.school}</h3>
                  </div>
                  <Badge variant={activeTicket.status}>{activeTicket.status}</Badge>
                </div>

                <hr className="border-slate-200 dark:border-slate-900" />

                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Issue Title</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-900">
                    {activeTicket.subject}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Assigned Node</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{activeTicket.assigned}</p>
                </div>
              </div>

              {/* Chat Reply Form */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-900">
                <form onSubmit={handleSendReply} className="space-y-2">
                  <textarea
                    placeholder="Type official admin response message..."
                    className="w-full min-h-[70px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-colors"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="w-full text-xs py-1.5">
                      Send Email Dispatch
                    </Button>
                    {activeTicket.status !== 'Resolved' && (
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-xs py-1.5"
                        onClick={() => handleResolveTicket(activeTicket.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center text-center p-8 h-[480px] bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-900">
              <MessageSquare className="h-8 w-8 text-slate-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">No ticket selected</h4>
              <p className="text-xs text-slate-500 max-w-[200px] mt-1 leading-relaxed">
                Click inspecting options inside ticket ledger list to resolve client queries.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

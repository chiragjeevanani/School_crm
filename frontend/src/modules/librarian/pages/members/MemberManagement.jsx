import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_MEMBERS } from '../../utils/constants';
import { User, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const MemberManagement = () => {
  const toast = useToast();
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [selectedMember, setSelectedMember] = useState(null);
  const [statusModal, setStatusModal] = useState(false);

  const toggleMembershipStatus = (member) => {
    const nextStatus = member.membershipStatus === 'Active' ? 'Suspended' : 'Active';
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, membershipStatus: nextStatus } : m));
    toast.success(`Membership status updated to ${nextStatus} for ${member.memberName}.`);
    setStatusModal(false);
    setSelectedMember(null);
  };

  const handleActionClick = (member) => {
    setSelectedMember(member);
    setStatusModal(true);
  };

  const columns = [
    { title: 'Member ID', key: 'memberId', sortable: true },
    { title: 'Name', key: 'memberName', sortable: true },
    { title: 'Type', key: 'memberType', filterable: true },
    { title: 'Class / Dept', key: 'class' },
    { title: 'Books Issued', key: 'booksIssued', sortable: true, render: (val, row) => `${val} / ${row.maxBooksAllowed}` },
    { title: 'Fines Due', key: 'pendingFines', sortable: true, render: (val) => formatCurrency(val) },
    { title: 'Status', key: 'membershipStatus', render: (val) => (
        <Badge variant={val === 'Active' ? 'success' : 'danger'}>
          {val}
        </Badge>
      )
    },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <button
          onClick={() => handleActionClick(row)}
          className="px-2.5 py-1 text-2xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-205 dark:border-slate-800 rounded-lg"
        >
          Manage
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Members"
        subtitle="Manage student & staff membership statuses, borrowing limit configurations, and fine blocks."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        <DataTable
          columns={columns}
          data={members}
          searchPlaceholder="Search members by name, ID or admission code..."
          searchKeys={['memberName', 'memberId', 'admissionNo']}
          csvFilename="library_membership_audit.csv"
        />
      </div>

      {/* Member Management Details Modal */}
      <Modal
        isOpen={statusModal}
        onClose={() => setStatusModal(false)}
        title="Manage Membership Account"
        size="md"
      >
        {selectedMember && (
          <div className="space-y-5">
            {/* Summary card */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedMember.memberName}</h4>
                <p className="text-3xs text-slate-450 mt-0.5">{selectedMember.class} | ID: {selectedMember.memberId}</p>
                <div className="flex gap-2 mt-1.5">
                  <Badge variant={selectedMember.membershipStatus === 'Active' ? 'success' : 'danger'}>
                    {selectedMember.membershipStatus}
                  </Badge>
                  <Badge variant="amber">
                    {selectedMember.booksIssued} Issued
                  </Badge>
                </div>
              </div>
            </div>

            {/* Config options */}
            <div className="space-y-3 pt-2">
              <p className="text-2xs font-extrabold text-slate-450 uppercase tracking-widest border-b pb-2">Membership Controls</p>
              
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Change Status</span>
                  <span className="text-slate-500 text-3xs">Block/Restore borrowing privileges.</span>
                </div>
                <button
                  onClick={() => toggleMembershipStatus(selectedMember)}
                  className={`h-9 px-3 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                    selectedMember.membershipStatus === 'Active'
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/25 dark:text-rose-400"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400"
                  }`}
                >
                  {selectedMember.membershipStatus === 'Active' ? (
                    <>
                      <ShieldAlert className="h-4 w-4" />
                      <span>Suspend Member</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Activate Member</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setStatusModal(false)}
                className="h-10 px-4 text-sm font-semibold border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl"
              >
                Close Panel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

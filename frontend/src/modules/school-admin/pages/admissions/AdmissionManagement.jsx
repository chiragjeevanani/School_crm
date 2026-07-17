import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_ADMISSIONS } from '../../utils/constants';
import { 
  Check, 
  X, 
  Eye, 
  FileCheck, 
  UserPlus, 
  IdCard, 
  Download,
  AlertTriangle
} from 'lucide-react';

export const AdmissionManagement = () => {
  const [activeTab, setActiveTab] = useState('review');
  const { showToast, ToastComponent } = useToast();

  const [admissions, setAdmissions] = useState(MOCK_ADMISSIONS);
  const [selectedAdm, setSelectedAdm] = useState(null);
  
  // Modals
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);

  // Stats
  const pendingCount = admissions.filter(a => a.status === 'Pending Review').length;
  const waitingCount = admissions.filter(a => a.status === 'Waiting List').length;
  const approvedCount = admissions.filter(a => a.status === 'Approved').length;

  const handleUpdateStatus = (id, nextStatus) => {
    let message = `Admission application ${nextStatus.toLowerCase()}`;
    if (nextStatus === 'Approved') {
      message = 'Admission approved! Student ID and admission number generated.';
      setAdmissions(prev => prev.map(a => a.id === id ? { 
        ...a, 
        status: nextStatus,
        documentsStatus: 'Verified',
        admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}` 
      } : a));
    } else {
      setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    }
    showToast(message, nextStatus === 'Rejected' ? 'warning' : 'success');
    setReviewModalOpen(false);
  };

  const handleOfflineAdmission = () => {
    const mockId = Date.now().toString();
    const newAdm = {
      id: mockId,
      name: 'Rohan Sen',
      gender: 'Male',
      dob: '2012-10-18',
      class: '10',
      parentName: 'Vikram Sen',
      phone: '+91 99000 11223',
      email: 'rohan.sen@gmail.com',
      documentsStatus: 'Verified',
      status: 'Approved',
      admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setAdmissions(prev => [newAdm, ...prev]);
    showToast('Offline Student admitted directly!', 'success');
  };

  const reviewColumns = [
    { header: 'Applicant Name', key: 'name' },
    { header: 'Target Class', key: 'class', render: (val) => `Class ${val}` },
    { header: 'Guardian', key: 'parentName' },
    { header: 'Docs Verified', key: 'documentsStatus', render: (val) => (
      <Badge variant={val === 'Verified' ? 'success' : val === 'Rejected' ? 'danger' : 'warning'}>
        {val}
      </Badge>
    )},
    { header: 'Application Status', key: 'status', render: (val) => (
      <Badge variant={val === 'Approved' ? 'success' : val === 'Rejected' ? 'danger' : val === 'Waiting List' ? 'warning' : 'info'}>
        {val}
      </Badge>
    )},
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedAdm(row);
              setReviewModalOpen(true);
            }}
            className="flex items-center gap-1 text-xs font-bold text-indigo-650 hover:underline"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review</span>
          </button>
          
          {row.status === 'Approved' && (
            <button
              onClick={() => {
                setSelectedAdm(row);
                setIdCardModalOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-emerald-650 hover:underline"
            >
              <IdCard className="w-3.5 h-3.5" />
              <span>Generate ID</span>
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admission Management" 
        subtitle="Manage prospective candidate profiles, document validations, waitlists, and admission approvals."
        actions={
          <button
            onClick={handleOfflineAdmission}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Offline Admission</span>
          </button>
        }
      />

      <Tabs
        tabs={[
          { id: 'review', label: 'Pending Review', count: pendingCount },
          { id: 'waiting', label: 'Waiting List', count: waitingCount },
          { id: 'approved', label: 'Approved Students', count: approvedCount },
          { id: 'all', label: 'All Registrations', count: admissions.length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <DataTable
          columns={reviewColumns}
          data={
            activeTab === 'review' ? admissions.filter(a => a.status === 'Pending Review') :
            activeTab === 'waiting' ? admissions.filter(a => a.status === 'Waiting List') :
            activeTab === 'approved' ? admissions.filter(a => a.status === 'Approved') :
            admissions
          }
          searchPlaceholder="Search candidates..."
        />
      </div>

      {/* REVIEW APPLICATION MODAL */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Verify Candidate Admission Details">
        {selectedAdm && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Candidate Name</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedAdm.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Target Class</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">Class {selectedAdm.class}</span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Birth Date</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 block">{selectedAdm.dob}</span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Gender</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 block">{selectedAdm.gender}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Guardian Contacts</span>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-3.5 border rounded-xl text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-slate-450 block">Name</span>
                  <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedAdm.parentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-450 block">Phone</span>
                  <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedAdm.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-455 uppercase block">Uploaded Documents Status</span>
              <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <FileCheck className="w-5 h-5 text-indigo-600" />
                  <span>Transfer Certificate, Birth Marksheet, Address Proof</span>
                </div>
                <Badge variant={selectedAdm.documentsStatus === 'Verified' ? 'success' : 'warning'}>
                  {selectedAdm.documentsStatus}
                </Badge>
              </div>
            </div>

            {selectedAdm.status === 'Pending Review' && (
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleUpdateStatus(selectedAdm.id, 'Rejected')}
                  className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
                >
                  Reject Candidate
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedAdm.id, 'Waiting List')}
                    className="px-4 py-2 border border-slate-250 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                  >
                    Move to Waitlist
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAdm.id, 'Approved')}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Approve Admission
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ID CARD MODAL */}
      <Modal isOpen={idCardModalOpen} onClose={() => setIdCardModalOpen(false)} title="Student ID Card Preview">
        {selectedAdm && (
          <div className="flex flex-col items-center py-4 space-y-6">
            {/* Front of ID Card */}
            <div className="w-80 h-[480px] bg-slate-950 border border-slate-800 text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col items-center justify-between p-6">
              {/* Card Ribbon / Accent Header */}
              <div className="absolute top-0 inset-x-0 h-4 bg-indigo-600"></div>

              {/* School branding */}
              <div className="text-center mt-3">
                <h2 className="text-base font-black tracking-tight leading-none text-white">Greenfield School</h2>
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest mt-1 block">Student Identification</span>
              </div>

              {/* Student avatar */}
              <div className="w-32 h-32 rounded-2xl border-4 border-slate-850 overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80" 
                  alt="Student Photo" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Card info */}
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white leading-none">{selectedAdm.name}</h3>
                <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wide">Class {selectedAdm.class} - A</span>
              </div>

              {/* Technical details barcodes */}
              <div className="w-full border-t border-slate-850 pt-4 space-y-2.5 text-left text-[11px] font-semibold text-slate-400">
                <div className="flex justify-between">
                  <span>Student ID:</span>
                  <span className="text-white font-bold">{selectedAdm.admissionNo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guardian:</span>
                  <span className="text-white font-bold">{selectedAdm.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency:</span>
                  <span className="text-white font-bold">{selectedAdm.phone}</span>
                </div>
              </div>

              {/* Mock Barcode pattern lines */}
              <div className="flex gap-0.5 justify-center w-full mt-2 h-7 opacity-75">
                {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 4, 2, 1, 2, 3, 1, 4].map((width, idx) => (
                  <div key={idx} className="bg-white shrink-0" style={{ width: `${width}px` }}></div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => showToast('Student ID Badge PDF Download Triggered!', 'success')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Badge PDF</span>
            </button>
          </div>
        )}
      </Modal>

      <ToastComponent />
    </div>
  );
};
export default AdmissionManagement;

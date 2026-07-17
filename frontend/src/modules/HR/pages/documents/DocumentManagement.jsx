import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { MOCK_EMPLOYEES } from '../../utils/constants';
import { FileText, ShieldCheck, Download, Trash2 } from 'lucide-react';

export const DocumentManagement = () => {
  const { showToast, ToastComponent } = useToast();
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);

  // Flattened documents list matching EmployeeDocument schema
  const flattenedDocs = employees.flatMap(emp => 
    emp.documents.map(doc => ({
      id: `${emp.id}-${doc.type}`,
      employeeId: emp.employeeId,
      employeeName: emp.name,
      documentType: doc.type,
      verified: doc.verified,
      expiryDate: doc.expiryDate || 'Permanent file',
      url: doc.url
    }))
  );

  const handleVerifyDoc = (id) => {
    showToast(`Document ${id.split('-').pop()} marked verified!`, 'success');
  };

  const columns = [
    { key: 'employeeId', title: 'Emp ID', sortable: true },
    { key: 'employeeName', title: 'Employee Name', sortable: true },
    { key: 'documentType', title: 'Document Type', sortable: true },
    { key: 'expiryDate', title: 'Expiry Timeline Limit' },
    { 
      key: 'verified', 
      title: 'Verification Status',
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <Badge variant={val ? 'success' : 'warning'}>
            {val ? 'Verified file' : 'Pending Verification'}
          </Badge>
          {!val && (
            <button
              onClick={() => handleVerifyDoc(row.id)}
              className="p-1 hover:bg-slate-50 border rounded-lg text-slate-500 font-bold text-[9px]"
            >
              Verify
            </button>
          )}
        </div>
      )
    },
    { 
      key: 'actions', 
      title: 'Actions',
      render: () => (
        <div className="flex items-center gap-1.5">
          <button className="p-1 border rounded hover:bg-slate-50 text-slate-500" title="Download">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader 
        title="Documents Locker Vault" 
        subtitle="Observe staff ID documents lists, verify Aadhaar/PAN cards, and track expiration milestones." 
      />

      {/* Expiry alerts card */}
      <div className="bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm space-y-3">
        <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider block">Document Expiry Alerts</span>
        <div className="p-3 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-center justify-between text-xs text-rose-700 dark:text-rose-455 font-bold">
          <span>Employee PRIYA NAIR's Employment Contract is set to expire on 2028-06-30.</span>
          <Badge variant="danger">Contract Expiry Warning</Badge>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={flattenedDocs} 
        searchPlaceholder="Search uploaded documents..."
        searchKey="employeeName"
      />

      <ToastComponent />
    </div>
  );
};
export default DocumentManagement;

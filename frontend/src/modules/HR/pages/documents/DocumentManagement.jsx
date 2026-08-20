import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { hrApi } from '../../../../shared/api/client';
import { FolderOpen, FileText, ExternalLink, RefreshCw, Search, ShieldCheck } from 'lucide-react';

export const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrApi.documents();
      if (res?.success) {
        setDocuments(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      (doc.employeeName || '').toLowerCase().includes(q) ||
      (doc.employeeId || '').toLowerCase().includes(q) ||
      (doc.documentType || '').toLowerCase().includes(q) ||
      (doc.documentName || '').toLowerCase().includes(q) ||
      (doc.department || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-xs font-semibold">
      <PageHeader
        title="Documents Locker & Compliance Vault"
        subtitle="Access verified staff credentials, PAN cards, identity records, and certification files from the database."
        actions={
          <button
            onClick={fetchDocuments}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        }
      />

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by employee name, ID, or document type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{documents.length} Encrypted Documents On File</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDocuments} className="underline font-bold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Documents Grid / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FolderOpen className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p>
              {searchTerm
                ? 'No documents match the search criteria.'
                : 'No uploaded staff documents found in the database.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3">Emp ID</th>
                  <th>Staff Member</th>
                  <th>Department</th>
                  <th>Document Type</th>
                  <th>Document Label</th>
                  <th>Verification</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-400">{doc.employeeId}</td>
                    <td className="font-bold text-slate-900 dark:text-white">{doc.employeeName}</td>
                    <td className="text-slate-600 dark:text-slate-400">{doc.department || 'N/A'}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="text-slate-700 dark:text-slate-300 font-semibold">{doc.documentName}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-bold text-[10px]">
                        Verified
                      </span>
                    </td>
                    <td className="text-right">
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Open Document"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Internal File</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastComponent />
    </div>
  );
};
export default DocumentManagement;

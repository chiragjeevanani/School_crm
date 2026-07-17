import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { MOCK_RESERVATIONS, MOCK_BOOKS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { Bookmark, Send, Trash2, CheckSquare } from 'lucide-react';

export const BookReservation = () => {
  const toast = useToast();
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  const handleNotify = (res) => {
    toast.success(`Availability alert notification dispatched to ${res.memberName}.`);
  };

  const handleCancel = (resId) => {
    setReservations(prev => prev.filter(x => x.id !== resId));
    toast.success('Reservation request cancelled.');
  };

  const handleComplete = (resId) => {
    setReservations(prev => prev.map(x => x.id === resId ? { ...x, status: 'Completed', queuePosition: 0 } : x));
    toast.success('Reservation completed & book issued.');
  };

  const columns = [
    { title: 'Queue Position', key: 'queuePosition', render: (val) => val > 0 ? `#${val} in Queue` : 'Ready for Pickup' },
    { title: 'Book Code / ID', key: 'bookId' },
    { title: 'Book Title', key: 'bookTitle' },
    { title: 'Reserving Member', key: 'memberName' },
    { title: 'Reservation Date', key: 'reserveDate', render: (val) => formatDate(val) },
    { title: 'Status', key: 'status', render: (val) => (
        <Badge variant={val === 'Completed' ? 'success' : 'warning'}>
          {val}
        </Badge>
      )
    },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <div className="flex gap-2">
          {row.status === 'Pending' && (
            <>
              <button
                onClick={() => handleNotify(row)}
                className="h-8 px-2.5 text-2xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 rounded-lg flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Notify Availability</span>
              </button>
              <button
                onClick={() => handleComplete(row.id)}
                className="h-8 px-2.5 text-2xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/30 rounded-lg flex items-center gap-1"
              >
                <CheckSquare className="h-3 w-3" />
                <span>Issue Book</span>
              </button>
              <button
                onClick={() => handleCancel(row.id)}
                className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                title="Cancel Request"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservations Queue"
        subtitle="Manage reservation waitlists, notify users of availability, and convert holds to issues."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        <DataTable
          columns={columns}
          data={reservations}
          searchPlaceholder="Search queue requests by book title or member..."
          searchKeys={['bookTitle', 'memberName', 'bookId']}
          csvFilename="library_hold_reservations.csv"
        />
      </div>
    </div>
  );
};

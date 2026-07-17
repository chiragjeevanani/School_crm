import { useState, useEffect } from 'react';
import { 
  MOCK_STUDENT, 
  MOCK_ATTENDANCE, 
  MOCK_HOMEWORK, 
  MOCK_EXAMS, 
  MOCK_RESULTS, 
  MOCK_ACADEMICS, 
  MOCK_TIMETABLE, 
  MOCK_FEES, 
  MOCK_TRANSPORT, 
  MOCK_HOSTEL, 
  MOCK_LIBRARY, 
  MOCK_LEAVE, 
  MOCK_ANNOUNCEMENTS, 
  MOCK_EVENTS 
} from '../data/mockData';

// Helper to initialize key in localStorage if not exists
const getOrInitialize = (key, initialValue) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage`, e);
    }
  }
  localStorage.setItem(key, JSON.stringify(initialValue));
  return initialValue;
};

export const useStudentData = () => {
  const [data, setData] = useState(MOCK_STUDENT);
  const updateStudentData = (fields) => {
    setData(prev => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('student-user', JSON.stringify(updated));
      return updated;
    });
  };
  return { data, updateStudentData };
};

export const useAttendance = () => {
  const [data, setData] = useState(() => getOrInitialize('school_attendance', MOCK_ATTENDANCE));

  // Reload attendance from localStorage periodically or when hook is invoked
  useEffect(() => {
    const handleStorageChange = () => {
      const current = localStorage.getItem('school_attendance');
      if (current) {
        setData(JSON.parse(current));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { data };
};

export const useHomework = () => {
  const [homeworkList, setHomeworkList] = useState(() => {
    // We map student's mock homework to a unified localStorage structure if not present
    return getOrInitialize('school_homework', MOCK_HOMEWORK);
  });

  const submitHomework = (id, submissionData) => {
    const updated = homeworkList.map(hw => {
      if (hw.id === id) {
        const submission = {
          fileName: submissionData.fileName || 'Assignment_Submission.pdf',
          submittedAt: new Date().toISOString().split('T')[0],
          marks: null,
          feedback: null
        };
        return {
          ...hw,
          status: 'Submitted',
          submittedAt: submission.submittedAt,
          submission
        };
      }
      return hw;
    });
    setHomeworkList(updated);
    localStorage.setItem('school_homework', JSON.stringify(updated));

    // Also notify coordination (trigger custom storage event for sync across tabs)
    window.dispatchEvent(new Event('storage'));
  };

  return { homeworkList, submitHomework };
};

export const useExams = () => {
  const [exams] = useState(MOCK_EXAMS);
  return { exams };
};

export const useResults = () => {
  const [results, setResults] = useState(() => getOrInitialize('school_results', MOCK_RESULTS));

  useEffect(() => {
    const current = localStorage.getItem('school_results');
    if (current) {
      setResults(JSON.parse(current));
    }
  }, []);

  return { results };
};

export const useAcademics = () => {
  const [academics] = useState(MOCK_ACADEMICS);
  return { academics };
};

export const useTimetable = () => {
  const [timetable] = useState(MOCK_TIMETABLE);
  return { timetable };
};

export const useFees = () => {
  const [fees, setFees] = useState(MOCK_FEES);
  
  const payFeeOnline = (installmentName) => {
    setFees(prev => {
      const updatedInstallments = prev.installments.map(inst => {
        if (inst.name === installmentName) {
          return { ...inst, status: 'Paid', receiptNo: `REC-${Math.floor(1000 + Math.random() * 9000)}` };
        }
        return inst;
      });

      const totalPaid = updatedInstallments
        .filter(i => i.status === 'Paid')
        .reduce((sum, i) => sum + i.amount, 0);

      const totalPending = prev.totalFees - totalPaid;

      const updated = {
        ...prev,
        installments: updatedInstallments,
        paidFees: totalPaid,
        pendingFees: totalPending,
        history: [
          {
            paymentId: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString().split('T')[0],
            amount: updatedInstallments.find(i => i.name === installmentName).amount,
            mode: 'UPI (Paytm)',
            receiptNo: updatedInstallments.find(i => i.name === installmentName).receiptNo
          },
          ...prev.history
        ]
      };
      return updated;
    });
  };

  return { fees, payFeeOnline };
};

export const useTransport = () => {
  const [transport] = useState(MOCK_TRANSPORT);
  return { transport };
};

export const useHostel = () => {
  const [hostel] = useState(MOCK_HOSTEL);
  return { hostel };
};

export const useLibrary = () => {
  const [library, setLibrary] = useState(MOCK_LIBRARY);

  const renewBook = (title) => {
    setLibrary(prev => ({
      ...prev,
      booksIssued: prev.booksIssued.map(book => {
        if (book.title === title) {
          const returnDate = new Date(book.returnDate);
          returnDate.setDate(returnDate.getDate() + 14); // renew for 14 days
          return {
            ...book,
            returnDate: returnDate.toISOString().split('T')[0],
            remark: 'Renewed'
          };
        }
        return book;
      })
    }));
  };

  return { library, renewBook };
};

export const useLeave = () => {
  const [leaveHistory, setLeaveHistory] = useState(() => getOrInitialize('school_student_leaves', MOCK_LEAVE));

  const applyLeave = (leaveData) => {
    const newLeave = {
      id: `lv-${Math.floor(100 + Math.random() * 900)}`,
      reason: leaveData.reason,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      status: 'Pending',
      comments: null
    };
    const updated = [newLeave, ...leaveHistory];
    setLeaveHistory(updated);
    localStorage.setItem('school_student_leaves', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  return { leaveHistory, applyLeave };
};

export const useAnnouncements = () => {
  const [announcements] = useState(() => getOrInitialize('school_announcements', MOCK_ANNOUNCEMENTS));
  return { announcements };
};

export const useEvents = () => {
  const [events, setEvents] = useState(MOCK_EVENTS);

  const registerForEvent = (title) => {
    setEvents(prev => ({
      ...prev,
      upcoming: prev.upcoming.map(ev => {
        if (ev.title === title) {
          return { ...ev, registered: true };
        }
        return ev;
      })
    }));
  };

  return { events, registerForEvent };
};

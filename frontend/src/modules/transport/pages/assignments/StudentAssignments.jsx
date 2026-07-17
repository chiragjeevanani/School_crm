import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { MOCK_STUDENTS, MOCK_ROUTES, MOCK_VEHICLES, MOCK_PICKUP_POINTS, MOCK_ASSIGNMENTS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { Search, User, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const StudentAssignments = () => {
  const toast = useToast();
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [step, setStep] = useState(1);
  
  const [studentQuery, setStudentQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  const [selectedPickup, setSelectedPickup] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Search Students
  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(studentQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(studentQuery.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(studentQuery.toLowerCase())
  );

  const handleSelectStudent = (student) => {
    // Check if already assigned
    const alreadyAssigned = assignments.some(a => a.studentId === student.id);
    if (alreadyAssigned) {
      toast.error('Student is already assigned to a transport route.');
      return;
    }
    setSelectedStudent(student);
    setStep(2);
  };

  const handleSelectRoute = (route) => {
    const veh = MOCK_VEHICLES.find(v => v.id === route.vehicleId);
    setSelectedRoute(route);
    setSelectedVehicle(veh);
    setStep(3);
  };

  const handleConfirmAssignment = () => {
    if (!selectedPickup) {
      toast.error('Please choose a Pickup Stop Location.');
      return;
    }

    const pkp = MOCK_PICKUP_POINTS.find(p => p.id === selectedPickup);

    const newAssignment = {
      id: `ASN-0${Math.floor(Math.random() * 900) + 100}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      class: selectedStudent.class,
      section: selectedStudent.section,
      admissionNumber: selectedStudent.admissionNumber,
      vehicleId: selectedVehicle?.id || '',
      vehicleNumber: selectedVehicle?.vehicleNumber || '-',
      routeId: selectedRoute.id,
      routeName: selectedRoute.routeName,
      pickupPointId: selectedPickup,
      pickupPointName: pkp?.name || 'Assigned Stop',
      startDate: startDate,
      endDate: '2027-04-30',
      feeStatus: 'Pending',
      status: 'Active'
    };

    setAssignments(prev => [newAssignment, ...prev]);
    toast.success(`Assigned ${selectedStudent.name} to route ${selectedRoute.routeName} stop.`);
    
    // Notify Parents Simulation
    toast.info(`Sent auto-route assignment notification SMS to parents of ${selectedStudent.name}.`);
    
    handleReset();
  };

  const handleRemoveAssignment = (id) => {
    setAssignments(prev => prev.filter(x => x.id !== id));
    toast.success('Transport Assignment revoked.');
  };

  const handleReset = () => {
    setStep(1);
    setSelectedStudent(null);
    setSelectedRoute(null);
    setSelectedVehicle(null);
    setSelectedPickup('');
    setStudentQuery('');
  };

  const columns = [
    { title: 'Student Name', key: 'studentName', sortable: true },
    { title: 'Admission No', key: 'admissionNumber', sortable: true },
    { title: 'Class/Sec', key: 'class', render: (_, row) => `${row.class}-${row.section}` },
    { title: 'Route Name', key: 'routeName' },
    { title: 'Pickup Stop', key: 'pickupPointName' },
    { title: 'Vehicle Plate', key: 'vehicleNumber' },
    { title: 'Start Date', key: 'startDate', render: (val) => formatDate(val) },
    { title: 'Fee Status', key: 'feeStatus', render: (val) => (
        <Badge variant={val === 'Paid' ? 'success' : val === 'Pending' ? 'warning' : 'danger'}>
          {val}
        </Badge>
      )
    },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <button
          onClick={() => handleRemoveAssignment(row.id)}
          className="px-2.5 py-1 text-2xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955 rounded-lg border border-rose-200 dark:border-rose-900/30"
        >
          Revoke
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 text-xs">
      <PageHeader
        title="Student Assignments"
        subtitle="Map students to active vehicles and stops. Automatically dispatches alerts to parents."
      />

      {/* Assignment Wizard Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 max-w-xl mx-auto">
        <h3 className="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wide border-b pb-2">Assign Student Wizard</h3>
        
        {/* Progress Line */}
        <div className="flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold">
          <span className={cn(step >= 1 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400")}>1. Student</span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className={cn(step >= 2 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400")}>2. Route</span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className={cn(step >= 3 ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400")}>3. Stop</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
              <input
                type="text"
                placeholder="Search Student Name, Admission No..."
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-850 rounded-2xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-202 dark:border-slate-850 rounded-xl overflow-hidden max-h-52 overflow-y-auto no-scrollbar bg-white dark:bg-slate-950">
              {filteredStudents.map(stud => (
                <div
                  key={stud.id}
                  onClick={() => handleSelectStudent(stud)}
                  className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="h-4 w-4 text-slate-500" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{stud.name}</span>
                      <span className="text-3xs text-slate-450 block">{stud.class}-{stud.section} | ID: {stud.admissionNumber}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedStudent && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200 rounded-xl">
              <div>
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Student Selected</span>
                <span className="font-bold text-slate-805 dark:text-slate-200 block">{selectedStudent.name}</span>
              </div>
              <button onClick={() => setStep(1)} className="text-rose-600 font-bold">Change</button>
            </div>

            <p className="font-bold text-slate-800 dark:text-slate-200">Select Circulation Route</p>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-202 dark:border-slate-850 rounded-xl overflow-hidden max-h-52 overflow-y-auto no-scrollbar bg-white dark:bg-slate-950">
              {MOCK_ROUTES.filter(r => r.status === 'Active').map(route => (
                <div
                  key={route.id}
                  onClick={() => handleSelectRoute(route)}
                  className="p-3 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-850/50 cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-905 dark:text-white block">{route.routeName}</span>
                    <span className="text-3xs text-slate-450 block">{route.routeCode} | Stops: {route.stops.length}</span>
                  </div>
                  <Badge variant="cyan">{route.studentCount} Assigned</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedStudent && selectedRoute && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 border border-slate-202 dark:border-slate-800 rounded-2xl">
                <span className="text-4xs font-bold text-slate-400 uppercase">Student</span>
                <span className="font-bold block text-slate-800 dark:text-slate-200 truncate">{selectedStudent.name}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-955 p-3 border border-slate-202 dark:border-slate-800 rounded-2xl">
                <span className="text-4xs font-bold text-slate-400 uppercase">Route</span>
                <span className="font-bold block text-slate-800 dark:text-slate-200 truncate">{selectedRoute.routeName}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-550 dark:text-slate-450">Select Pickup Stop Point <span className="text-rose-500">*</span></label>
              <select
                value={selectedPickup}
                onChange={(e) => setSelectedPickup(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950"
              >
                <option value="" disabled>Choose Stop...</option>
                {MOCK_PICKUP_POINTS.filter(p => p.routeId === selectedRoute.id).map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.pickupTime} AM)</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-550 dark:text-slate-450">Transport Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 px-3 border border-slate-202 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
              <button onClick={() => setStep(2)} className="h-10 px-4 border border-slate-200 rounded-xl">Back</button>
              <button
                onClick={handleConfirmAssignment}
                className="h-10 px-4 bg-cyan-600 hover:bg-cyan-705 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>Confirm Assignment</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Listings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-3xl p-6">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Active Assignments Log</h3>
        <DataTable
          columns={columns}
          data={assignments}
          searchPlaceholder="Search active assignments..."
          searchKeys={['studentName', 'routeName', 'pickupPointName']}
          csvFilename="student_transport_assignments.csv"
        />
      </div>
    </div>
  );
};

import {
  LayoutDashboard,
  Bus,
  UserCheck,
  Route,
  MapPin,
  Users,
  Wrench,
  Fuel,
  CreditCard,
  ShieldAlert,
  Send,
  BarChart3,
  History,
  Bell,
  Settings
} from 'lucide-react';

import { MOCK_STUDENTS as SHARED_STUDENTS } from '../../../shared/data/students';

const findSharedStudent = (id) => SHARED_STUDENTS.find((s) => s.id === id);
// Roman-numeral class labels used across this module's records, resolved
// from the shared roster's plain "Class 10" + section/stream shape.
const romanClass = (grade) => ({ 1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII' })[grade];
const classLabel = (s) => `Class ${romanClass(Number(s.class.replace(/^Class\s*/, '')))}`;
const sectionLabel = (s) => s.stream || s.section;

export const NAVIGATION_ITEMS = [
  // MAIN
  { name: 'Dashboard', path: '/transport/dashboard', icon: LayoutDashboard, category: 'Main' },
  
  // FLEET
  { name: 'Vehicle Directory', path: '/transport/vehicles', icon: Bus, category: 'Fleet' },
  { name: 'Driver Management', path: '/transport/drivers', icon: UserCheck, category: 'Fleet' },
  
  // OPERATIONS
  { name: 'Route Management', path: '/transport/routes', icon: Route, category: 'Operations' },
  { name: 'Pickup & Drop Points', path: '/transport/pickup-points', icon: MapPin, category: 'Operations' },
  { name: 'Student Assignments', path: '/transport/assignments', icon: Users, category: 'Operations' },
  
  // SERVICE
  { name: 'Maintenance Log', path: '/transport/maintenance', icon: Wrench, category: 'Service' },
  { name: 'Fuel Records', path: '/transport/fuel', icon: Fuel, category: 'Service' },
  
  // FINANCE
  { name: 'Transport Fee Status', path: '/transport/fees', icon: CreditCard, category: 'Finance' },
  
  // COMMUNICATION
  { name: 'Emergency Desk', path: '/transport/emergency', icon: ShieldAlert, category: 'Communication' },
  { name: 'Broadcast Messages', path: '/transport/communication', icon: Send, category: 'Communication' },
  
  // SYSTEM
  { name: 'Reports & Analytics', path: '/transport/reports', icon: BarChart3, category: 'System' },
  { name: 'Audit Logs', path: '/transport/audit', icon: History, category: 'System' },
  { name: 'Notifications', path: '/transport/notifications', icon: Bell, category: 'System' },
  { name: 'Transport Settings', path: '/transport/settings', icon: Settings, category: 'System' }
];

export const MOCK_VEHICLES = [
  {
    id: 'VEH-001',
    vehicleNumber: 'GJ-01-AB-1234',
    registrationNumber: 'REG-Tata-9821',
    vehicleType: 'Bus',
    capacity: 45,
    make: 'Tata',
    model: 'Starbus Ultra',
    manufacturingYear: 2022,
    color: 'Yellow',
    fuelType: 'Diesel',
    insuranceExpiry: '2027-03-15',
    fitnessCertificateExpiry: '2026-11-20',
    permitExpiry: '2027-06-10',
    pollutionCertificateExpiry: '2026-08-30',
    purchaseDate: '2022-01-20',
    currentStatus: 'Active',
    assignedDriverId: 'DRV-001',
    assignedRouteId: 'RTE-001'
  },
  {
    id: 'VEH-002',
    vehicleNumber: 'GJ-01-CD-5678',
    registrationNumber: 'REG-Leyland-4311',
    vehicleType: 'Bus',
    capacity: 50,
    make: 'Ashok Leyland',
    model: 'Midi Bus',
    manufacturingYear: 2021,
    color: 'Yellow',
    fuelType: 'CNG',
    insuranceExpiry: '2026-09-10',
    fitnessCertificateExpiry: '2026-07-28', // Soon expiring
    permitExpiry: '2026-12-05',
    pollutionCertificateExpiry: '2026-08-15', // Soon expiring
    purchaseDate: '2021-05-12',
    currentStatus: 'Active',
    assignedDriverId: 'DRV-002',
    assignedRouteId: 'RTE-002'
  },
  {
    id: 'VEH-003',
    vehicleNumber: 'GJ-01-EF-9012',
    registrationNumber: 'REG-Force-2189',
    vehicleType: 'Mini Bus',
    capacity: 26,
    make: 'Force Motors',
    model: 'Traveller 3050',
    manufacturingYear: 2023,
    color: 'Yellow',
    fuelType: 'Diesel',
    insuranceExpiry: '2027-05-18',
    fitnessCertificateExpiry: '2027-04-12',
    permitExpiry: '2027-08-20',
    pollutionCertificateExpiry: '2026-12-30',
    purchaseDate: '2023-03-10',
    currentStatus: 'Maintenance',
    assignedDriverId: 'DRV-003',
    assignedRouteId: 'RTE-003'
  },
  {
    id: 'VEH-004',
    vehicleNumber: 'GJ-01-GH-3456',
    registrationNumber: 'REG-Eicher-1029',
    vehicleType: 'Bus',
    capacity: 40,
    make: 'Eicher',
    model: 'Skyline Pro',
    manufacturingYear: 2020,
    color: 'Yellow',
    fuelType: 'Diesel',
    insuranceExpiry: '2026-08-12', // Expiring soon
    fitnessCertificateExpiry: '2026-09-01',
    permitExpiry: '2026-10-15',
    pollutionCertificateExpiry: '2026-08-01', // Expiring soon
    purchaseDate: '2020-02-14',
    currentStatus: 'Active',
    assignedDriverId: 'DRV-004',
    assignedRouteId: 'RTE-004'
  },
  {
    id: 'VEH-005',
    vehicleNumber: 'GJ-01-IJ-7890',
    registrationNumber: 'REG-Maruti-8911',
    vehicleType: 'Van',
    capacity: 8,
    make: 'Maruti Suzuki',
    model: 'Eeco Cargo',
    manufacturingYear: 2022,
    color: 'White',
    fuelType: 'CNG',
    insuranceExpiry: '2027-02-28',
    fitnessCertificateExpiry: '2027-01-15',
    permitExpiry: '2027-03-31',
    pollutionCertificateExpiry: '2026-11-30',
    purchaseDate: '2022-04-05',
    currentStatus: 'Active',
    assignedDriverId: 'DRV-005',
    assignedRouteId: 'RTE-005'
  }
];

export const MOCK_DRIVERS = [
  {
    id: 'DRV-001',
    name: 'Ramesh Patel',
    employeeId: 'EMP-D-001',
    licenseNumber: 'GJ0120220012345',
    licenseCategory: 'HMV',
    licenseExpiry: '2027-09-10',
    contactNumber: '+91-9876543210',
    address: '12, Shyam Nagar, Satellite, Ahmedabad',
    emergencyContact: '+91-9876543220',
    medicalFitnessDate: '2026-04-01',
    policeVerificationDate: '2025-11-15',
    joiningDate: '2022-02-01',
    assignedVehicleId: 'VEH-001',
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'DRV-002',
    name: 'Dilip Kumar',
    employeeId: 'EMP-D-002',
    licenseNumber: 'GJ0120200054321',
    licenseCategory: 'HMV',
    licenseExpiry: '2026-08-20', // Soon expiring
    contactNumber: '+91-9876543211',
    address: '45, Gokul Row House, Gota, Ahmedabad',
    emergencyContact: '+91-9876543221',
    medicalFitnessDate: '2026-03-10',
    policeVerificationDate: '2025-08-12',
    joiningDate: '2021-06-15',
    assignedVehicleId: 'VEH-002',
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'DRV-003',
    name: 'Vijay Singh',
    employeeId: 'EMP-D-003',
    licenseNumber: 'GJ0120230099887',
    licenseCategory: 'LMV',
    licenseExpiry: '2028-05-12',
    contactNumber: '+91-9876543212',
    address: '89, Dev Bungalows, Vastral, Ahmedabad',
    emergencyContact: '+91-9876543222',
    medicalFitnessDate: '2026-05-15',
    policeVerificationDate: '2026-01-20',
    joiningDate: '2023-04-01',
    assignedVehicleId: 'VEH-003',
    status: 'On Leave',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'DRV-004',
    name: 'Suresh Bishnoi',
    employeeId: 'EMP-D-004',
    licenseNumber: 'GJ0120210088776',
    licenseCategory: 'HMV',
    licenseExpiry: '2026-11-30',
    contactNumber: '+91-9876543213',
    address: '11, Maruti Tenements, Chandkheda, Ahmedabad',
    emergencyContact: '+91-9876543223',
    medicalFitnessDate: '2026-02-12',
    policeVerificationDate: '2025-09-01',
    joiningDate: '2020-03-10',
    assignedVehicleId: 'VEH-004',
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'DRV-005',
    name: 'Mahesh Sharma',
    employeeId: 'EMP-D-005',
    licenseNumber: 'GJ0120220044556',
    licenseCategory: 'LMV',
    licenseExpiry: '2027-10-15',
    contactNumber: '+91-9876543214',
    address: '74, Shivam Society, Bopal, Ahmedabad',
    emergencyContact: '+91-9876543224',
    medicalFitnessDate: '2026-04-18',
    policeVerificationDate: '2025-10-10',
    joiningDate: '2022-05-01',
    assignedVehicleId: 'VEH-005',
    status: 'Active',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  }
];

export const MOCK_ROUTES = [
  {
    id: 'RTE-001',
    routeName: 'North Zone Route A',
    routeCode: 'NZ-A',
    startingPoint: 'School Gate',
    endingPoint: 'Satellite Cross Road',
    stops: ['Chandkheda Circle', 'RTO Circle', 'Memnagar Bus Stand', 'Satellite Cross Road'],
    distance: '18.5 km',
    estimatedDuration: '45 min',
    vehicleId: 'VEH-001',
    vehicleNumber: 'GJ-01-AB-1234',
    driverId: 'DRV-001',
    driverName: 'Ramesh Patel',
    status: 'Active',
    studentCount: 32
  },
  {
    id: 'RTE-002',
    routeName: 'West Zone Route B',
    routeCode: 'WZ-B',
    startingPoint: 'School Gate',
    endingPoint: 'Bopal Circle',
    stops: ['Gota Cross Road', 'Sola Bridge', 'Bhadaj Circle', 'Bopal Circle'],
    distance: '22.0 km',
    estimatedDuration: '55 min',
    vehicleId: 'VEH-002',
    vehicleNumber: 'GJ-01-CD-5678',
    driverId: 'DRV-002',
    driverName: 'Dilip Kumar',
    status: 'Active',
    studentCount: 41
  },
  {
    id: 'RTE-003',
    routeName: 'East Zone Route C',
    routeCode: 'EZ-C',
    startingPoint: 'School Gate',
    endingPoint: 'Vastral Metro Station',
    stops: ['Kalupur Circle', 'Amraiwadi', 'Vastral Circle', 'Vastral Metro Station'],
    distance: '15.2 km',
    estimatedDuration: '40 min',
    vehicleId: 'VEH-003',
    vehicleNumber: 'GJ-01-EF-9012',
    driverId: 'DRV-003',
    driverName: 'Vijay Singh',
    status: 'Inactive',
    studentCount: 15
  },
  {
    id: 'RTE-004',
    routeName: 'South Zone Route D',
    routeCode: 'SZ-D',
    startingPoint: 'School Gate',
    endingPoint: 'Maninagar East',
    stops: ['Paldi Cross Road', 'Anjali Cross Road', 'Ghodasar Circle', 'Maninagar East'],
    distance: '16.8 km',
    estimatedDuration: '45 min',
    vehicleId: 'VEH-004',
    vehicleNumber: 'GJ-01-GH-3456',
    driverId: 'DRV-004',
    driverName: 'Suresh Bishnoi',
    status: 'Active',
    studentCount: 35
  },
  {
    id: 'RTE-005',
    routeName: 'Central Express Van',
    routeCode: 'CE-V',
    startingPoint: 'School Gate',
    endingPoint: 'C.G. Road',
    stops: ['Nehru Bridge', 'Navrangpura Circle', 'C.G. Road'],
    distance: '8.0 km',
    estimatedDuration: '20 min',
    vehicleId: 'VEH-005',
    vehicleNumber: 'GJ-01-IJ-7890',
    driverId: 'DRV-005',
    driverName: 'Mahesh Sharma',
    status: 'Active',
    studentCount: 6
  }
];

export const MOCK_PICKUP_POINTS = [
  { id: 'PKP-001', name: 'Chandkheda Circle', routeId: 'RTE-001', gpsLat: 23.1118, gpsLng: 72.5856, pickupTime: '07:05', dropTime: '14:20', studentsAssigned: 8 },
  { id: 'PKP-002', name: 'RTO Circle', routeId: 'RTE-001', gpsLat: 23.0798, gpsLng: 72.5802, pickupTime: '07:15', dropTime: '14:10', studentsAssigned: 12 },
  { id: 'PKP-003', name: 'Memnagar Bus Stand', routeId: 'RTE-001', gpsLat: 23.0487, gpsLng: 72.5412, pickupTime: '07:25', dropTime: '14:00', studentsAssigned: 6 },
  { id: 'PKP-004', name: 'Satellite Cross Road', routeId: 'RTE-001', gpsLat: 23.0225, gpsLng: 72.5314, pickupTime: '07:35', dropTime: '13:50', studentsAssigned: 6 },
  { id: 'PKP-005', name: 'Gota Cross Road', routeId: 'RTE-002', gpsLat: 23.0984, gpsLng: 72.5321, pickupTime: '06:55', dropTime: '14:35', studentsAssigned: 14 },
  { id: 'PKP-006', name: 'Sola Bridge', routeId: 'RTE-002', gpsLat: 23.0722, gpsLng: 72.5255, pickupTime: '07:10', dropTime: '14:20', studentsAssigned: 10 },
  { id: 'PKP-007', name: 'Bopal Circle', routeId: 'RTE-002', gpsLat: 23.0305, gpsLng: 72.4712, pickupTime: '07:30', dropTime: '13:55', studentsAssigned: 17 }
];

// studentId here is this module's own key; identity fields (name/class/
// section/admission no) are resolved from the shared roster below via
// ASSIGNMENT_LINKS -> shared/data/students.js.
const ASSIGNMENT_LINKS = [
  { id: 'ASN-001', sharedId: 'STU-101', vehicleId: 'VEH-001', vehicleNumber: 'GJ-01-AB-1234', routeId: 'RTE-001', routeName: 'North Zone Route A', pickupPointId: 'PKP-001', pickupPointName: 'Chandkheda Circle', feeStatus: 'Paid' },
  { id: 'ASN-002', sharedId: 'STU-102', vehicleId: 'VEH-001', vehicleNumber: 'GJ-01-AB-1234', routeId: 'RTE-001', routeName: 'North Zone Route A', pickupPointId: 'PKP-002', pickupPointName: 'RTO Circle', feeStatus: 'Pending' },
  { id: 'ASN-003', sharedId: 'STU-103', vehicleId: 'VEH-002', vehicleNumber: 'GJ-01-CD-5678', routeId: 'RTE-002', routeName: 'West Zone Route B', pickupPointId: 'PKP-005', pickupPointName: 'Gota Cross Road', feeStatus: 'Overdue' },
  { id: 'ASN-004', sharedId: 'STU-104', vehicleId: 'VEH-002', vehicleNumber: 'GJ-01-CD-5678', routeId: 'RTE-002', routeName: 'West Zone Route B', pickupPointId: 'PKP-006', pickupPointName: 'Sola Bridge', feeStatus: 'Paid' },
  { id: 'ASN-005', sharedId: 'STU-105', vehicleId: 'VEH-004', vehicleNumber: 'GJ-01-GH-3456', routeId: 'RTE-004', routeName: 'South Zone Route D', pickupPointId: 'PKP-007', pickupPointName: 'Bopal Circle', feeStatus: 'Paid' },
];

export const MOCK_ASSIGNMENTS = ASSIGNMENT_LINKS.map(({ id, sharedId, ...rest }) => {
  const s = findSharedStudent(sharedId);
  return {
    id,
    studentId: sharedId,
    studentName: s.name,
    class: classLabel(s),
    section: sectionLabel(s),
    admissionNumber: s.admissionNo,
    ...rest,
    startDate: '2026-06-01',
    endDate: '2027-04-30',
    schoolId: 'SCH-2026-09',
  };
});

export const MOCK_MAINTENANCE = [
  { id: 'MNT-001', vehicleId: 'VEH-001', vehicleNumber: 'GJ-01-AB-1234', maintenanceType: 'Oil Change', scheduledDate: '2026-07-20', completedDate: null, cost: 2500, vendorName: 'Valvoline Express Center', status: 'Scheduled', description: 'Regular engine oil and filter swap.' },
  { id: 'MNT-002', vehicleId: 'VEH-002', vehicleNumber: 'GJ-01-CD-5678', maintenanceType: 'Tyre Replacement', scheduledDate: '2026-07-10', completedDate: '2026-07-12', cost: 18000, vendorName: 'MRF Tyres Depot', status: 'Completed', description: 'Replaced rear double tyres.' },
  { id: 'MNT-003', vehicleId: 'VEH-003', vehicleNumber: 'GJ-01-EF-9012', maintenanceType: 'Emergency Repair', scheduledDate: '2026-07-16', completedDate: null, cost: 9500, vendorName: 'Force Authorized Service', status: 'In Progress', description: 'Radiator overheating issue resolution.' },
  { id: 'MNT-004', vehicleId: 'VEH-004', vehicleNumber: 'GJ-01-GH-3456', maintenanceType: 'Battery Replacement', scheduledDate: '2026-08-05', completedDate: null, cost: 6500, vendorName: 'Exide Battery Zone', status: 'Scheduled', description: 'Replace weak battery before school reopening.' }
];

export const MOCK_FUEL_LOGS = [
  { id: 'FUEL-001', vehicleId: 'VEH-001', vehicleNumber: 'GJ-01-AB-1234', fuelQuantity: 82, fuelCost: 7790, odometerReading: 45210, fuelStation: 'HP Fuel Center - SG Highway', date: '2026-07-15' },
  { id: 'FUEL-002', vehicleId: 'VEH-002', vehicleNumber: 'GJ-01-CD-5678', fuelQuantity: 60, fuelCost: 5400, odometerReading: 68112, fuelStation: 'Adani CNG - Gota', date: '2026-07-16' },
  { id: 'FUEL-003', vehicleId: 'VEH-004', vehicleNumber: 'GJ-01-GH-3456', fuelQuantity: 90, fuelCost: 8550, odometerReading: 91402, fuelStation: 'Indian Oil - Paldi', date: '2026-07-17' },
  { id: 'FUEL-004', vehicleId: 'VEH-005', vehicleNumber: 'GJ-01-IJ-7890', fuelQuantity: 35, fuelCost: 3150, odometerReading: 21890, fuelStation: 'Adani CNG - Bopal', date: '2026-07-17' }
];

export const MOCK_LOGS = [
  { id: 'LOG-001', timestamp: '2026-07-17T14:30:00Z', operatorName: 'Manish Dave (Transport Manager)', action: 'Student Assignment', details: 'Assigned student Arjun Sharma (STU-101) to Route NZ-A stop Chandkheda.' },
  { id: 'LOG-002', timestamp: '2026-07-17T11:15:00Z', operatorName: 'Manish Dave (Transport Manager)', action: 'Vehicle Update', details: 'Changed status of VEH-003 (GJ-01-EF-9012) to Maintenance.' },
  { id: 'LOG-003', timestamp: '2026-07-16T16:00:00Z', operatorName: 'Manish Dave (Transport Manager)', action: 'Maintenance Entry', details: 'Scheduled Routine Service/Oil Change for Vehicle GJ-01-AB-1234.' },
  { id: 'LOG-004', timestamp: '2026-07-15T09:20:00Z', operatorName: 'Manish Dave (Transport Manager)', action: 'Route Changes', details: 'Added new pickup stop Bhadaj Circle to Route WZ-B.' }
];

export const MOCK_STUDENTS = ['STU-101', 'STU-102', 'STU-103', 'STU-104', 'STU-105', 'STU-106', 'STU-107'].map((sharedId) => {
  const s = findSharedStudent(sharedId);
  return { id: sharedId, name: s.name, class: classLabel(s), section: sectionLabel(s), admissionNumber: s.admissionNo };
});

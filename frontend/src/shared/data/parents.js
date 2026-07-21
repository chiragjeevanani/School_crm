// ============================================================
// SHARED PARENT ↔ CHILDREN LINKAGE
// Base: parent/data/mockData.js's MOCK_PARENT (Rajesh Sharma → Aarav &
// Aanya). Extended with the guardians referenced by the shared student
// roster in accountant/school-admin/principal's constants.js (fee-payer
// / guardian contacts for STU-002..STU-008). Their guardian phone
// numbers there already matched the "guardianName"/"parentName" fields
// 1:1 with students.js, so they're folded in directly.
// ============================================================

import { findStudent } from './students';

export const MOCK_PARENTS = [
  {
    id: 'PAR-2024-8902',
    name: 'Mr. Rajesh Sharma',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    occupation: 'Software Engineer',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 98765 01234',
    address: 'Flat 402, Pine Crest Apartments, Sector 15, Dwarka, New Delhi - 110075',
    children: ['STU108902', 'STU108903'],
  },
  { id: 'PAR-002', name: 'Mr. Ketan Patel', phone: '+91 98765 00002', children: ['STU-002'] },
  { id: 'PAR-003', name: 'Mr. Sanjay Verma', phone: '+91 98765 00003', children: ['s013'] },
  { id: 'PAR-004', name: 'Mr. Raman Iyer', phone: '+91 98765 00004', children: ['STU-004'] },
  { id: 'PAR-005', name: 'Mr. Alok Gupta', phone: '+91 98765 00005', children: ['STU-005'] },
  { id: 'PAR-006', name: 'Mr. Venkat Reddy', phone: '+91 98765 00006', children: ['STU-006'] },
  { id: 'PAR-007', name: 'Mr. Praveen Mehta', phone: '+91 98765 00007', children: ['STU-007'] },
  { id: 'PAR-008', name: 'Mr. Amit Sen', phone: '+91 98765 00008', children: ['STU-008'] },
];

export const findParent = (id) => MOCK_PARENTS.find((p) => p.id === id);
export const findParentByChildId = (studentId) => MOCK_PARENTS.find((p) => p.children.includes(studentId));

// Convenience: resolve a parent's full list of children as student records.
export const childrenOf = (parentId) => {
  const parent = findParent(parentId);
  if (!parent) return [];
  return parent.children.map(findStudent).filter(Boolean);
};

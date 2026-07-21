// ============================================================
// SHARED ACADEMIC STRUCTURE — canonical classes / sections / subjects
// Extends teacher/data/mockData.js's mockClasses (Class 9 & 10) to cover
// Class 1-12, since other modules (school-admin, principal, accountant,
// transport, librarian) reference the full grade range.
// ============================================================

export const SUBJECT_SETS = {
  primary: ['English', 'Mathematics', 'EVS', 'Hindi', 'Art & Craft', 'Computer Basics'],
  middle: ['English', 'Mathematics', 'Science', 'Hindi', 'Social Studies', 'Computer Science'],
  secondary9: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'],
  secondary10: ['Mathematics', 'Statistics', 'Physics', 'Chemistry', 'English'],
  seniorSecondary: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science'],
};

export const STREAMS = ['Science', 'Commerce', 'Arts'];

// One row per class + section, matching the shape teacher/data/mockData.js
// already used for mockClasses ({ id, name, section, strength, subjects }).
export const CLASSES = [
  { id: 'cls-1a', name: 'Class 1', section: 'A', strength: 30, subjects: SUBJECT_SETS.primary },
  { id: 'cls-1b', name: 'Class 1', section: 'B', strength: 28, subjects: SUBJECT_SETS.primary },
  { id: 'cls-2a', name: 'Class 2', section: 'A', strength: 32, subjects: SUBJECT_SETS.primary },
  { id: 'cls-2b', name: 'Class 2', section: 'B', strength: 29, subjects: SUBJECT_SETS.primary },
  { id: 'cls-3a', name: 'Class 3', section: 'A', strength: 33, subjects: SUBJECT_SETS.primary },
  { id: 'cls-3b', name: 'Class 3', section: 'B', strength: 31, subjects: SUBJECT_SETS.primary },
  { id: 'cls-4a', name: 'Class 4', section: 'A', strength: 34, subjects: SUBJECT_SETS.primary },
  { id: 'cls-4b', name: 'Class 4', section: 'B', strength: 30, subjects: SUBJECT_SETS.primary },
  { id: 'cls-5a', name: 'Class 5', section: 'A', strength: 35, subjects: SUBJECT_SETS.primary },
  { id: 'cls-5b', name: 'Class 5', section: 'B', strength: 32, subjects: SUBJECT_SETS.primary },
  { id: 'cls-6a', name: 'Class 6', section: 'A', strength: 36, subjects: SUBJECT_SETS.middle },
  { id: 'cls-6b', name: 'Class 6', section: 'B', strength: 34, subjects: SUBJECT_SETS.middle },
  { id: 'cls-7a', name: 'Class 7', section: 'A', strength: 37, subjects: SUBJECT_SETS.middle },
  { id: 'cls-7b', name: 'Class 7', section: 'B', strength: 33, subjects: SUBJECT_SETS.middle },
  { id: 'cls-8a', name: 'Class 8', section: 'A', strength: 38, subjects: SUBJECT_SETS.middle },
  { id: 'cls-8b', name: 'Class 8', section: 'B', strength: 37, subjects: SUBJECT_SETS.middle },
  { id: 'cls-9a', name: 'Class 9', section: 'A', strength: 42, subjects: SUBJECT_SETS.secondary9 },
  { id: 'cls-9b', name: 'Class 9', section: 'B', strength: 38, subjects: SUBJECT_SETS.secondary9 },
  { id: 'cls-10a', name: 'Class 10', section: 'A', strength: 45, subjects: SUBJECT_SETS.secondary10 },
  { id: 'cls-10b', name: 'Class 10', section: 'B', strength: 40, subjects: SUBJECT_SETS.secondary10 },
  { id: 'cls-10c', name: 'Class 10', section: 'C', strength: 30, subjects: SUBJECT_SETS.secondary10 },
  { id: 'cls-11a', name: 'Class 11', section: 'A', stream: 'Science', strength: 30, subjects: SUBJECT_SETS.seniorSecondary },
  { id: 'cls-11b', name: 'Class 11', section: 'B', stream: 'Arts', strength: 25, subjects: SUBJECT_SETS.seniorSecondary },
  { id: 'cls-12a', name: 'Class 12', section: 'A', stream: 'Science', strength: 28, subjects: SUBJECT_SETS.seniorSecondary },
  { id: 'cls-12b', name: 'Class 12', section: 'B', stream: 'Commerce', strength: 27, subjects: SUBJECT_SETS.seniorSecondary },
  { id: 'cls-12c', name: 'Class 12', section: 'C', stream: 'Science', strength: 27, subjects: SUBJECT_SETS.seniorSecondary },
];

// Convenience lookups
export const CLASS_NAMES = [...new Set(CLASSES.map((c) => c.name))];

export const SECTIONS_BY_CLASS = CLASSES.reduce((acc, c) => {
  acc[c.name] = acc[c.name] || [];
  acc[c.name].push(c.section);
  return acc;
}, {});

export const findClass = (name, section) =>
  CLASSES.find((c) => c.name === name && (!section || c.section === section));

export const getClassSectionLabel = (name, section) => (section ? `${name} ${section}` : name);

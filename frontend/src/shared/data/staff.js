export const MOCK_STAFF = [];

export const findStaff = (id) => MOCK_STAFF.find((s) => s.id === id);
export const findStaffByName = (name) => MOCK_STAFF.find((s) => s.name === name);

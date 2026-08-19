import mongoose from 'mongoose';

const bankDetailsSchema = new mongoose.Schema(
  {
    accountName: { type: String, default: '', trim: true },
    accountNumber: { type: String, default: '', trim: true },
    ifscCode: { type: String, default: '', trim: true, uppercase: true },
    bankName: { type: String, default: '', trim: true },
    branchName: { type: String, default: '', trim: true },
    accountType: {
      type: String,
      enum: ['SAVINGS', 'CURRENT', 'SALARY'],
      default: 'SALARY',
    },
  },
  { _id: false }
);

const schoolUserSchema = new mongoose.Schema(
  {
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    employeeId: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: '', trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, default: '', select: false },
    role: {
      type: String,
      enum: ['TEACHER', 'LIBRARIAN', 'HR', 'ACCOUNTANT', 'TRANSPORT'],
      required: true,
      index: true,
    },
    phone: { type: String, default: '', trim: true },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      default: 'MALE',
    },
    specialization: { type: String, default: '', trim: true },
    joiningDate: { type: Date, default: null },
    department: { type: String, default: '', trim: true },
    designation: { type: String, default: '', trim: true },
    bankDetails: {
      type: bankDetailsSchema,
      default: () => ({}),
    },
    documents: [{ type: String, trim: true }], // Max 3 image file paths
    photo: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
    lastLoginAt: { type: Date, default: null },
    credentialsSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

schoolUserSchema.index({ schoolId: 1, email: 1 }, { unique: true });
schoolUserSchema.index({ schoolId: 1, employeeId: 1 }, { unique: true });
schoolUserSchema.index({ schoolId: 1, role: 1 });

schoolUserSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    schoolId: this.schoolId.toString(),
    employeeId: this.employeeId,
    firstName: this.firstName,
    lastName: this.lastName,
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    gender: this.gender,
    specialization: this.specialization,
    joiningDate: this.joiningDate,
    department: this.department,
    designation: this.designation,
    bankDetails: this.bankDetails || {
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      accountType: 'SALARY',
    },
    documents: Array.isArray(this.documents) ? this.documents : [],
    photo: this.photo || '',
    status: this.status,
    lastLoginAt: this.lastLoginAt,
    credentialsSentAt: this.credentialsSentAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const SchoolUser = mongoose.model('SchoolUser', schoolUserSchema);

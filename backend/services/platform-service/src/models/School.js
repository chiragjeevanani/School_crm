import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    schoolId: { type: String, required: true, trim: true, lowercase: true, unique: true },
    type: { type: String, required: true, trim: true },
    board: { type: String, required: true, trim: true },
    establishedYear: { type: Number, default: null },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    contact: {
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      alternatePhone: { type: String, default: '', trim: true },
      principalName: { type: String, default: '', trim: true },
    },
    address: {
      line1: { type: String, required: true, trim: true },
      line2: { type: String, default: '', trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    academic: {
      session: { type: String, required: true, trim: true },
      classFrom: { type: String, required: true, trim: true },
      classTo: { type: String, required: true, trim: true },
      medium: { type: String, required: true, trim: true },
      workingDays: [{ type: String, trim: true }],
    },
    admin: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      mobile: { type: String, required: true, trim: true },
      passwordHash: { type: String, default: '', select: false },
      hasLogin: { type: Boolean, default: false },
    },
    subscriptionPlan: { type: String, trim: true, default: '' },
    status: { type: String, required: true, trim: true, default: 'Active' },
    stats: {
      studentsCount: { type: Number, default: 0 },
      staffCount: { type: Number, default: 0 },
      maxStudents: { type: Number, default: 1000 },
      maxStaff: { type: Number, default: 80 },
      storageUsed: { type: Number, default: 0 },
      maxStorage: { type: Number, default: 100 },
    },
    createdBy: { type: String, default: null },
  },
  { timestamps: true }
);

schoolSchema.index({ name: 1 });

schoolSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    code: this.code,
    schoolId: this.schoolId,
    type: this.type,
    board: this.board,
    establishedYear: this.establishedYear,
    logo: this.logo,
    website: this.website,
    contact: this.contact,
    address: this.address,
    academic: this.academic,
    admin: this.admin
      ? {
          name: this.admin.name,
          email: this.admin.email,
          mobile: this.admin.mobile,
          hasLogin: Boolean(this.admin.hasLogin),
        }
      : null,
    subscriptionPlan: this.subscriptionPlan,
    status: this.status,
    stats: this.stats,
    createdBy: this.createdBy,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const School = mongoose.model('School', schoolSchema);

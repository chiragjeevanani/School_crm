import mongoose from 'mongoose';

const librarySettingsSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      unique: true,
      index: true,
    },
    finePerDay: {
      type: Number,
      default: 5,
      min: 0,
    },
    maxFineAmount: {
      type: Number,
      default: 500,
      min: 0,
    },
    gracePeriodDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    defaultIssueDays: {
      type: Number,
      default: 14,
      min: 1,
    },
    allowRenewal: {
      type: Boolean,
      default: true,
    },
    maxRenewals: {
      type: Number,
      default: 2,
      min: 0,
    },
    renewalPeriodDays: {
      type: Number,
      default: 14,
      min: 1,
    },
    maxBooksStudent: {
      type: Number,
      default: 3,
      min: 1,
    },
    maxBooksTeacher: {
      type: Number,
      default: 5,
      min: 1,
    },
    lostBookFineMultiplier: {
      type: Number,
      default: 1.5,
      min: 1,
    },
  },
  { timestamps: true }
);

librarySettingsSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    schoolId: this.schoolId.toString(),
    finePerDay: this.finePerDay ?? 5,
    maxFineAmount: this.maxFineAmount ?? 500,
    gracePeriodDays: this.gracePeriodDays ?? 0,
    defaultIssueDays: this.defaultIssueDays ?? 14,
    allowRenewal: this.allowRenewal ?? true,
    maxRenewals: this.maxRenewals ?? 2,
    renewalPeriodDays: this.renewalPeriodDays ?? 14,
    maxBooksStudent: this.maxBooksStudent ?? 3,
    maxBooksTeacher: this.maxBooksTeacher ?? 5,
    lostBookFineMultiplier: this.lostBookFineMultiplier ?? 1.5,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const LibrarySettings = mongoose.model('LibrarySettings', librarySettingsSchema);

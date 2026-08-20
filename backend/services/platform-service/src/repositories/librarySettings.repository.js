import mongoose from 'mongoose';
import { LibrarySettings } from '../models/LibrarySettings.js';

function toObjectId(id) {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return id;
  }
}

class LibrarySettingsRepository {
  async getSettings(schoolId) {
    const schoolObjId = toObjectId(schoolId);
    let settings = await LibrarySettings.findOne({ schoolId: schoolObjId });
    if (!settings) {
      // Create default settings for this school
      settings = await LibrarySettings.create({
        schoolId: schoolObjId,
        finePerDay: 5,
        maxFineAmount: 500,
        gracePeriodDays: 0,
        defaultIssueDays: 14,
        allowRenewal: true,
        maxRenewals: 2,
        renewalPeriodDays: 14,
        maxBooksStudent: 3,
        maxBooksTeacher: 5,
        lostBookFineMultiplier: 1.5,
      });
    }
    return settings;
  }

  async updateSettings(schoolId, updates) {
    const schoolObjId = toObjectId(schoolId);
    return LibrarySettings.findOneAndUpdate(
      { schoolId: schoolObjId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
  }
}

export const librarySettingsRepository = new LibrarySettingsRepository();

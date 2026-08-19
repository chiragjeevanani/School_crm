import mongoose from 'mongoose';

const libraryBookSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      default: '',
      trim: true,
    },
    bookCode: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'GENERAL',
    },
    publisher: {
      type: String,
      default: '',
      trim: true,
    },
    edition: {
      type: String,
      default: '',
      trim: true,
    },
    rackNumber: {
      type: String,
      default: '',
      trim: true,
    },
    shelfNumber: {
      type: String,
      default: '',
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'OUT_OF_STOCK', 'ARCHIVED'],
      default: 'AVAILABLE',
      index: true,
    },
  },
  { timestamps: true }
);

libraryBookSchema.index({ schoolId: 1, title: 1 });
libraryBookSchema.index({ schoolId: 1, category: 1 });
libraryBookSchema.index({ schoolId: 1, isbn: 1 });

libraryBookSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    schoolId: this.schoolId.toString(),
    title: this.title,
    author: this.author,
    isbn: this.isbn,
    bookCode: this.bookCode || `BK-${this._id.toString().slice(-4).toUpperCase()}`,
    category: this.category,
    publisher: this.publisher,
    edition: this.edition,
    rackNumber: this.rackNumber,
    shelfNumber: this.shelfNumber,
    totalCopies: this.totalCopies,
    availableCopies: this.availableCopies,
    issuedCopies: Math.max(0, this.totalCopies - this.availableCopies),
    price: this.price,
    description: this.description,
    status: this.availableCopies > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK',
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const LibraryBook = mongoose.model('LibraryBook', libraryBookSchema);

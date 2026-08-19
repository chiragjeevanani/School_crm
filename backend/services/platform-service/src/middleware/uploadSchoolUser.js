import multer from 'multer';
import path from 'path';
import { AppError } from '../../../shared/AppError.js';
import {
  convertUploadedImageToWebp,
  deleteMulterFiles,
  ensureUploadDirs,
  listMulterFiles,
  userDocumentsDir,
  userUploadsDir,
  toUserPhotoPublicPath,
  toUserDocumentPublicPath,
} from '../utils/upload.utils.js';

ensureUploadDirs();

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, file.fieldname === 'photo' ? userUploadsDir : userDocumentsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const prefix = file.fieldname === 'photo' ? 'user-photo' : 'user-doc';
    const safeBase = path
      .basename(file.originalname || prefix, ext)
      .replace(/[^a-z0-9_-]/gi, '-')
      .replace(/-+/g, '-')
      .slice(0, 40)
      .toLowerCase() || prefix;
    cb(null, `${safeBase}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5, // 1 photo + max 3 docs + tolerance
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype?.startsWith('image/')) {
      cb(new AppError('Only image files are allowed for photos and documents', 400));
      return;
    }
    cb(null, true);
  },
});

export const uploadSchoolUserFiles = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents', maxCount: 3 },
]);

export async function convertSchoolUserImages(req, _res, next) {
  try {
    const files = listMulterFiles(req.files);
    for (const file of files) {
      await convertUploadedImageToWebp(file);
    }
    next();
  } catch {
    deleteMulterFiles(req.files);
    next(new AppError('Please upload valid images. Files are converted to WebP format.', 400));
  }
}

export function collectSchoolUserUploadFiles(req) {
  return {
    photo: req.files?.photo?.[0] ? toUserPhotoPublicPath(req.files.photo[0].filename) : null,
    documents: (req.files?.documents || []).map((f) => toUserDocumentPublicPath(f.filename)),
  };
}

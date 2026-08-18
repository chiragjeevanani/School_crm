import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadsRoot = path.resolve(__dirname, '../../uploads');
export const studentUploadsDir = path.join(uploadsRoot, 'students');
export const studentDocumentsDir = path.join(studentUploadsDir, 'documents');
export const teacherUploadsDir = path.join(uploadsRoot, 'teachers');
export const teacherDocumentsDir = path.join(teacherUploadsDir, 'documents');

export function ensureUploadDirs() {
  fs.mkdirSync(studentUploadsDir, { recursive: true });
  fs.mkdirSync(studentDocumentsDir, { recursive: true });
  fs.mkdirSync(teacherUploadsDir, { recursive: true });
  fs.mkdirSync(teacherDocumentsDir, { recursive: true });
}

export function toStudentPhotoPublicPath(filename) {
  return `/uploads/students/${filename}`;
}

export function toStudentDocumentPublicPath(filename) {
  return `/uploads/students/documents/${filename}`;
}

export function toTeacherPhotoPublicPath(filename) {
  return `/uploads/teachers/${filename}`;
}

export function toTeacherDocumentPublicPath(filename) {
  return `/uploads/teachers/documents/${filename}`;
}

export function resolveUploadPath(publicPath) {
  if (!publicPath || typeof publicPath !== 'string') return null;
  const sanitized = publicPath.replace(/^\/+/, '');
  return path.join(uploadsRoot, sanitized.replace(/\//g, path.sep));
}

export function deleteUploadedFile(publicPath) {
  const filePath = resolveUploadPath(publicPath);
  if (!filePath) return;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function listMulterFiles(files) {
  if (!files) return [];
  if (Array.isArray(files)) return files.filter(Boolean);
  if (files.path || files.filename) return [files];
  return Object.values(files)
    .flat()
    .filter(Boolean);
}

export function deleteMulterFiles(files) {
  for (const file of listMulterFiles(files)) {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
}

export async function convertUploadedImageToWebp(file) {
  if (!file?.path) return file;
  const parsed = path.parse(file.path);
  const destPath = path.join(parsed.dir, `${parsed.name}.webp`);

  try {
    await sharp(file.path, { failOn: 'none' }).rotate().webp({ quality: 82 }).toFile(destPath);
  } catch {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw new Error('Invalid image file');
  }

  if (path.resolve(file.path) !== path.resolve(destPath) && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  file.filename = `${parsed.name}.webp`;
  file.path = destPath;
  file.mimetype = 'image/webp';
  return file;
}

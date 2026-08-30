import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

// Use memory storage so files are held in buffer and streamed directly to Cloudinary or disk safely
const storage = multer.memoryStorage();

// Strict File Filter for CA/ACCA Portal (Images, Documents, PDFs)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Unsupported file format: ${file.mimetype}. Allowed formats: JPG, PNG, WEBP, PDF, DOC, DOCX, XLS, XLSX, ZIP.`
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB maximum file size
  }
});

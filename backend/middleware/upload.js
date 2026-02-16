/**
 * Image upload middleware using Multer + Cloudinary
 * Validates file type and size, uploads to Cloudinary, stores URL in req.body.photo
 */

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const config = require('../config');
const AppError = require('../utils/AppError');

const { maxFileSize, allowedMimeTypes } = config.upload;

// Configure Cloudinary
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new AppError(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`, 400),
      false
    );
  }
  cb(null, true);
};


const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSize },
});

/**
 * Middleware: parse multipart form, upload photo to Cloudinary, set req.body.photo
 * Use as: uploadReportPhoto (handles single 'photo' field)
 */
const uploadReportPhoto = [
  multerUpload.single('photo'),
  async (req, res, next) => {
    if (!req.file) return next();

    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
      return next(new AppError('Image upload is not configured', 500));
    }

    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'animal-reports' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      console.log("File:", req.file);
      req.body.photo = result.secure_url;
    } catch (err) {
      return next(new AppError('Image upload failed', 500));
    }
    next();
  },
];

module.exports = { uploadReportPhoto, multerUpload };

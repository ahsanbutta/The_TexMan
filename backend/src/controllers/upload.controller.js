import { cloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Upload Single File to Cloudinary
 * POST /api/uploads/single
 */
export const uploadSingleFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded. Please select a file.');
  }

  // If Cloudinary credentials are mock/unconfigured, convert file to data URI or fallback safely
  if (
    !process.env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY === '123456789012345' ||
    process.env.CLOUDINARY_API_KEY === 'your_cloudinary_api_key'
  ) {
    const base64Data = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;
    return new ApiResponse(
      200,
      {
        url: dataUri,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      'File processed successfully (Data URI Mode)'
    ).send(res);
  }

  // Upload to Cloudinary using upload_stream
  const uploadPromise = new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'taxman_capital',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  const result = await uploadPromise;

  return new ApiResponse(
    200,
    {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    },
    'File uploaded to Cloudinary successfully'
  ).send(res);
});

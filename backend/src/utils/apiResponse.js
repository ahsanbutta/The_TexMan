/**
 * Standard API Response Helper
 * Enforces consistent format across all backend responses:
 * {
 *   success: true,
 *   message: "...",
 *   data: { ... },
 *   meta?: { ... }
 * }
 */
export class ApiResponse {
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      ...(this.meta ? { meta: this.meta } : {})
    });
  }
}

export const sendResponse = (res, statusCode, data, message = 'Success', meta = null) => {
  return new ApiResponse(statusCode, data, message, meta).send(res);
};

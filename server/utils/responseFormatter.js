/**
 * ResponseFormatter - Utility class for formatting API response in a consistent structure.
 */

class ResponseFormatter {

  /**
   * Formats a successful response with optional data and message.
     * @param {any} data - The data to include in the response (default: null)
     * @param {string} message - The message to include in the response (default: "Success")
     * @param {number} statusCode - The HTTP status code for the response (default: 200)
     * @returns {Object} - The formatted response object
   */
  static success(data = null, message = "Success", statusCode = 200) {
    return {
      success: true,
      data,
      message,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formats an error response with a message, status code, and optional error details.
   * @param {string} message - The error message to include in the response (default: "Error")
   * @param {number} statusCode - The HTTP status code for the error response (default: 500)
   * @param {any} error - Additional error details to include in the response (default: null)
   * @returns {Object} - The formatted error response object
   */
  static error(message = "Error", statusCode = 500, error = null) {
    return {
      success: false,
      message,
      error,
      statusCode,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Formats a validation error response with optional error details.
   * @param {any} error - Additional error details to include in the response (default: null)
   * @returns {Object} - The formatted validation error response object
   */
  static validationError(error = null) {
    return {
      success: false,
      message: "Validation Failed",
      error,
      statusCode: 400,
      timestamp: new Date().toISOString()
    }
  }

  // TODO: Add Paginated response.
}

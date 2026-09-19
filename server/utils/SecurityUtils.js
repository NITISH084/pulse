/**
 * SecurityUtils - Utility class for security-related functions such as password validation.
 *
**/

class SecurityUtils {

  // Password requirements can be configured via environment variables
  static PASSWORD_REQUIREMENTS = {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '6', 10),
    requireUppercase: (process.env.PASSWORD_REQUIRE_UPPERCASE || 'true') === 'true',
    requireLowercase: (process.env.PASSWORD_REQUIRE_LOWERCASE || 'true') === 'true',
    requireNumber: (process.env.PASSWORD_REQUIRE_NUMBER || 'true') === 'true',
    requireSymbol: (process.env.PASSWORD_REQUIRE_SYMBOL || 'true') === 'true'
  }

  /**
   * Validates a password based on configured requirements.
   * @param {string} password 
   * @returns {Object} - An object with success and errors properties. 
   */
  static validatePassword(password) {
    const errors = [];
    const requirements = this.PASSWORD_REQUIREMENTS;

    if (!password) {
      return {
        success: false,
        errors: ['Password is required']
      }
    }

    if (password.length < requirements.minLength) {
      errors.push(`Password must be at least ${requirements.minLength} characters long`);
    }

    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (requirements.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (requirements.requireSymbols && !/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // check for common weak passwords
    const weakPasswords = [
        'password', '123456', 'qwerty', 'admin', 'letmein',
        'password123', 'admin123', '12345678', 'welcome'
    ];

    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a more secure password.');
    }

    return {
      success: errors.length === 0,
      errors
    };
  }

  /**
   * Validates an IP address.
   * @param {string} ip 
   * @returns validation result.
   */
  static validateIp(ip) {
    const regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    return regex.test(ip);
  }

  /**
   * Validates a URL.
   * @param {string} url 
   * @returns validation result.
   */
  static validateURL(url) {
    const regex = /^https?:\/\/[^\s]+$/;
    return regex.test(url);
  }
}

export default SecurityUtils;

const { ValidationError } = require("../utils/errors");

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation - at least 8 chars, 1 upper, 1 lower, 1 number, 1 special char
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Name validation - only letters, spaces, hyphens, apostrophes
const NAME_REGEX = /^[a-zA-Z\s\-']{2,50}$/;

// Sanitization functions
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str.trim().replace(/[<>]/g, ""); // Basic XSS protection
};

const sanitizeEmail = (email) => {
  if (typeof email !== "string") return email;
  return email.trim().toLowerCase();
};

// Validation middleware factory
const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      const errors = [];

      for (const [field, rules] of Object.entries(schema)) {
        const value = req.body[field];

        // Check required fields
        if (rules.required && (!value || value.toString().trim() === "")) {
          errors.push(`${field} is required`);
          continue;
        }

        // Skip validation if field is not provided and not required
        if (!value && !rules.required) continue;

        // Type validation
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be a ${rules.type}`);
          continue;
        }

        // String length validation
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(
            `${field} must be at least ${rules.minLength} characters long`
          );
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(
            `${field} must be no more than ${rules.maxLength} characters long`
          );
        }

        // Email validation
        if (rules.email && !EMAIL_REGEX.test(value)) {
          errors.push(`${field} must be a valid email address`);
        }

        // Password validation
        if (rules.password && !PASSWORD_REGEX.test(value)) {
          errors.push(
            `${field} must contain at least 8 characters with uppercase, lowercase, number, and special character`
          );
        }

        // Name validation
        if (rules.name && !NAME_REGEX.test(value)) {
          errors.push(
            `${field} must contain only letters, spaces, hyphens, and apostrophes (2-50 characters)`
          );
        }

        // Custom validation function
        if (rules.validate && typeof rules.validate === "function") {
          const customError = rules.validate(value);
          if (customError) {
            errors.push(customError);
          }
        }

        // Sanitize the value
        if (rules.sanitize) {
          if (rules.email) {
            req.body[field] = sanitizeEmail(value);
          } else if (typeof value === "string") {
            req.body[field] = sanitizeString(value);
          }
        }
      }

      if (errors.length > 0) {
        throw new ValidationError(errors.join(", "));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Common validation schemas
const authValidation = {
  signup: validateInput({
    fname: { required: true, type: "string", name: true, sanitize: true },
    lname: { required: true, type: "string", name: true, sanitize: true },
    username: { required: true, type: "string", email: true, sanitize: true },
    password: { required: true, type: "string", password: true },
    org: { required: true, type: "string" },
    role: {
      required: true,
      type: "string",
      validate: (value) => {
        const validRoles = ["athlete", "coach", "admin"];
        return validRoles.includes(value.toLowerCase())
          ? null
          : "Role must be athlete, coach, or admin";
      },
    },
  }),

  login: validateInput({
    username: { required: true, type: "string", email: true, sanitize: true },
    password: { required: true, type: "string", minLength: 1 },
  }),

  forgotPassword: validateInput({
    email: { required: true, type: "string", email: true, sanitize: true },
    new_password: { required: true, type: "string", password: true },
  }),

  requestOTP: validateInput({
    prsn_first_nm: {
      required: true,
      type: "string",
      name: true,
      sanitize: true,
    },
    prsn_last_nm: {
      required: true,
      type: "string",
      name: true,
      sanitize: true,
    },
    prsn_email: { required: true, type: "string", email: true, sanitize: true },
  }),

  verifyOTP: validateInput({
    prsn_first_nm: {
      required: true,
      type: "string",
      name: true,
      sanitize: true,
    },
    prsn_last_nm: {
      required: true,
      type: "string",
      name: true,
      sanitize: true,
    },
    prsn_email: { required: true, type: "string", email: true, sanitize: true },
    otp: {
      required: true,
      type: "string",
      validate: (value) => {
        return /^\d{6}$/.test(value) ? null : "OTP must be a 6-digit number";
      },
    },
  }),

  resetPassword: validateInput({
    prsn_first_nm: {
      required: true,
      type: "string",
      name: true,
      sanitize: true,
    },
    prsn_last_nm: {
      required: true,
      type: "string",
      name: true,
      sanitize: true,
    },
    prsn_email: { required: true, type: "string", email: true, sanitize: true },
    otp: {
      required: true,
      type: "string",
      validate: (value) => {
        return /^\d{6}$/.test(value) ? null : "OTP must be a 6-digit number";
      },
    },
    new_password: { required: true, type: "string", password: true },
  }),
};

const personValidation = {
  addPerson: validateInput({
    prsn_first_nm: {
      required: true,
      type: "string",
      name: true,
      sanitize: true,
    },
    prsn_last_nm: {
      required: true,
      type: "string",
      name: true,
      sanitize: true,
    },
    prsn_email: { required: true, type: "string", email: true, sanitize: true },
    prsn_pwrd: { required: true, type: "string", password: true },
    org_rk: { required: true, type: "string" },
    prsn_role: {
      required: true,
      type: "string",
      validate: (value) => {
        const validRoles = ["athlete", "coach", "admin"];
        return validRoles.includes(value.toLowerCase())
          ? null
          : "Role must be athlete, coach, or admin";
      },
    },
  }),

  updatePerson: validateInput({
    prsn_first_nm: { type: "string", name: true, sanitize: true },
    prsn_last_nm: { type: "string", name: true, sanitize: true },
    prsn_email: { type: "string", email: true, sanitize: true },
  }),
};

const subscriptionsValidation = {
  create: validateInput({
    org_rk: { required: true, type: "number" },
    plan_type: {
      required: true,
      type: "string",
      validate: (value) => {
        const validPlans = ["free", "basic", "premium", "enterprise"];
        return validPlans.includes(value) ? null : "Invalid plan type";
      },
    },
    plan_name: { required: true, type: "string", minLength: 1, maxLength: 100 },
    billing_cycle: {
      required: false,
      type: "string",
      validate: (value) => {
        const validCycles = ["monthly", "yearly", "lifetime"];
        return validCycles.includes(value) ? null : "Invalid billing cycle";
      },
    },
    price_per_cycle: { required: false, type: "number", min: 0 },
    currency: { required: false, type: "string", maxLength: 3 },
    max_athletes: { required: false, type: "number", min: 0 },
    max_coaches: { required: false, type: "number", min: 0 },
    max_programs: { required: false, type: "number", min: 0 },
    max_meets_per_month: { required: false, type: "number", min: 0 },
    storage_limit_gb: { required: false, type: "number", min: 0 },
  }),
};

const adminValidation = {
  createOrganization: validateInput({
    org_name: { required: true, type: "string", minLength: 1, maxLength: 100 },
    org_type: { required: true, type: "string", minLength: 1, maxLength: 50 },
    org_code: { required: false, type: "string", maxLength: 50 },
  }),
  updateOrganization: validateInput({
    org_name: { required: true, type: "string", minLength: 1, maxLength: 100 },
    org_type: { required: true, type: "string", minLength: 1, maxLength: 50 },
    org_code: { required: false, type: "string", maxLength: 50 },
  }),
  updateSubscription: validateInput({
    plan_type: {
      required: false,
      type: "string",
      validate: (value) => {
        const validPlans = ["free", "basic", "premium", "enterprise"];
        return validPlans.includes(value) ? null : "Invalid plan type";
      },
    },
    plan_name: {
      required: false,
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
    billing_cycle: {
      required: false,
      type: "string",
      validate: (value) => {
        const validCycles = ["monthly", "yearly", "lifetime"];
        return validCycles.includes(value) ? null : "Invalid billing cycle";
      },
    },
    price_per_cycle: { required: false, type: "number", min: 0 },
    status: {
      required: false,
      type: "string",
      validate: (value) => {
        const validStatuses = [
          "active",
          "cancelled",
          "expired",
          "trial",
          "suspended",
        ];
        return validStatuses.includes(value) ? null : "Invalid status";
      },
    },
    max_athletes: { required: false, type: "number", min: 0 },
    max_coaches: { required: false, type: "number", min: 0 },
    max_programs: { required: false, type: "number", min: 0 },
    max_meets_per_month: { required: false, type: "number", min: 0 },
    storage_limit_gb: { required: false, type: "number", min: 0 },
  }),
};

module.exports = {
  validateInput,
  authValidation,
  personValidation,
  subscriptionsValidation,
  adminValidation,
  sanitizeString,
  sanitizeEmail,
};

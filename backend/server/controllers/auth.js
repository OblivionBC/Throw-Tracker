const { pool } = require("../db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

// Production-safe logging
const isDevelopment = process.env.NODE_ENV === "development";
const Logger = {
  log: (...args) => isDevelopment && console.log(...args),
  error: (...args) => isDevelopment && console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  info: (...args) => isDevelopment && console.info(...args),
  debug: (...args) => isDevelopment && console.debug(...args),
  critical: (...args) => console.error(...args) // Always log critical errors
};


const generateOTP = () => crypto.randomInt(100000, 999999).toString();
const hashOTP = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const checkRateLimit = async (prsn_rk) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM password_reset_otp 
     WHERE prsn_rk = $1 AND created_at > $2`,
    [prsn_rk, oneHourAgo]
  );
  return parseInt(result.rows[0].count) < 5;
};

const storeOTP = async (prsn_rk, otpHash, expiresAt) => {
  await pool.query(
    `INSERT INTO password_reset_otp 
     (prsn_rk, otp_hash, otp_expires_at, attempts_remaining, created_at) 
     VALUES ($1, $2, $3, 5, NOW())`,
    [prsn_rk, otpHash, expiresAt]
  );
};

const decrementOTPAttempts = async (otp, prsn_rk) => {
  const otpHash = hashOTP(otp);
  await pool.query(
    `UPDATE password_reset_otp 
     SET attempts_remaining = attempts_remaining - 1 
     WHERE prsn_rk = $1 AND otp_hash = $2 AND otp_expires_at > NOW() 
     AND is_used = false AND attempts_remaining > 0`,
    [prsn_rk, otpHash]
  );
};

const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");

const storeRefreshToken = async (userId, refreshToken, expiresAt) => {
  try {
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_at) VALUES ($1, $2, $3, NOW())",
      [userId, refreshToken, new Date(expiresAt * 1000)]
    );
  } catch (error) {
    Logger.error("Error storing refresh token:", error);
    throw error;
  }
};

const verifyAndRevokeRefreshToken = async (refreshToken) => {
  try {
    const result = await pool.query(
      "SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW() AND revoked = false",
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return null;
    }

    await pool.query(
      "UPDATE refresh_tokens SET revoked = true, used_at = NOW() WHERE token_hash = $1",
      [refreshToken]
    );

    return result.rows[0];
  } catch (error) {
    Logger.error("Error verifying refresh token:", error);
    return null;
  }
};

const revokeAllRefreshTokens = async (userId) => {
  try {
    await pool.query(
      "UPDATE refresh_tokens SET revoked = true, revoked_at = NOW() WHERE user_id = $1 AND revoked = false RETURNING id",
      [userId]
    );
  } catch (error) {
    Logger.error("Error revoking refresh tokens:", error);
    throw error;
  }
};

const parseJwtExpiration = (expirationString) => {
  if (!expirationString) return 15 * 60;

  const unit = expirationString.slice(-1);
  const value = parseInt(expirationString.slice(0, -1));

  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * (multipliers[unit] || 900);
};

// Parse refresh token expiration time from environment variable
const parseRefreshExpiration = (expirationString) => {
  if (!expirationString) {
    return 7 * 24 * 60 * 60; // Default 7 days
  }

  const unit = expirationString.slice(-1);
  const value = parseInt(expirationString.slice(0, -1));

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    default:
      return 7 * 24 * 60 * 60; // Default 7 days
  }
};

exports.login = asyncHandler(async (req, res) => {
  Logger.log("Logging In!");
  console.log("🔍 Login attempt received");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p inner join organization o on o.org_rk = p.org_rk WHERE p.prsn_email = $1 AND p.prsn_pwrd = crypt($2, p.prsn_pwrd);",
    [username, password]
  );

  if (result.rows.length === 0) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const user = result.rows[0];

  // Generate access token using JWT_EXPIRES_IN
  const accessTokenExpiresIn = parseJwtExpiration(process.env.JWT_EXPIRES_IN);
  const accessToken = jwt.sign(
    {
      id: user.prsn_rk,
      role: user.prsn_role,
      first_nm: user.prsn_first_nm,
      last_nm: user.prsn_last_nm,
      org_name: user.org_name,
      type: "access",
    },
    process.env.JWT_SECRET,
    { expiresIn: accessTokenExpiresIn }
  );

  // Generate refresh token using REFRESH_EXPIRES_IN
  const refreshTokenExpiresIn = parseRefreshExpiration(
    process.env.REFRESH_EXPIRES_IN
  );
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt =
    Math.floor(Date.now() / 1000) + refreshTokenExpiresIn;

  // Store refresh token in database
  await storeRefreshToken(user.prsn_rk, refreshToken, refreshTokenExpiresAt);

  // Set access token cookie (short-lived)
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Changed to None for cross-origin
    maxAge: accessTokenExpiresIn * 1000,
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  });

  // Set refresh token cookie (long-lived)
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Changed to None for cross-origin
    maxAge: refreshTokenExpiresIn * 1000,
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  });

  res.json({
    message: "Logged in",
    accessTokenExpiresIn: accessTokenExpiresIn,
    refreshTokenExpiresIn: refreshTokenExpiresIn,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    // Revoke the refresh token
    await verifyAndRevokeRefreshToken(refreshToken);
  }

  // Clear both cookies
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.json({ message: "Logged out" });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    throw new UnauthorizedError("No refresh token provided");
  }

  // Verify and revoke the refresh token
  const tokenData = await verifyAndRevokeRefreshToken(refreshToken);

  if (!tokenData) {
    // Clear invalid cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  // Get user data from database
  const user = await pool.query("SELECT * FROM person WHERE prsn_rk = $1", [
    tokenData.user_id,
  ]);

  if (user.rows.length === 0) {
    throw new NotFoundError("User");
  }

  // Generate new access token using JWT_EXPIRES_IN
  const accessTokenExpiresIn = parseJwtExpiration(process.env.JWT_EXPIRES_IN);
  const accessToken = jwt.sign(
    {
      id: user.rows[0].prsn_rk,
      role: user.rows[0].prsn_role,
      first_nm: user.rows[0].prsn_first_nm,
      last_nm: user.rows[0].prsn_last_nm,
      org_name: user.rows[0].org_name,
      type: "access",
    },
    process.env.JWT_SECRET,
    { expiresIn: accessTokenExpiresIn }
  );

  // Generate new refresh token using REFRESH_EXPIRES_IN - token rotation
  const refreshTokenExpiresIn = parseRefreshExpiration(
    process.env.REFRESH_EXPIRES_IN
  );
  const newRefreshToken = generateRefreshToken();
  const refreshTokenExpiresAt =
    Math.floor(Date.now() / 1000) + refreshTokenExpiresIn;

  // Store new refresh token in database
  await storeRefreshToken(
    user.rows[0].prsn_rk,
    newRefreshToken,
    refreshTokenExpiresAt
  );

  // Set new access token cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Changed to None for cross-origin
    maxAge: accessTokenExpiresIn * 1000,
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  });

  // Set new refresh token cookie
  res.cookie("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Changed to None for cross-origin
    maxAge: refreshTokenExpiresIn * 1000,
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  });

  res.json({
    message: "Token refreshed successfully",
    accessTokenExpiresIn: accessTokenExpiresIn,
    refreshTokenExpiresIn: refreshTokenExpiresIn,
  });
});

// Check token expiration status
exports.checkTokenStatus = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    throw new UnauthorizedError("No access token provided");
  }

  try {
    // Verify the current access token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Calculate time until expiration
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = decoded.exp;
    const expiresIn = expiresAt - now;

    // Check if token expires within 2 minutes (120 seconds)
    const isExpiringSoon = expiresIn <= 120 && expiresIn > 0;

    res.json({
      message: "Token is valid",
      expiresIn: expiresIn,
      isExpiringSoon: isExpiringSoon,
      expiresAt: expiresAt,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Token expired");
    }

    throw new UnauthorizedError("Invalid token");
  }
});

// Revoke all sessions for a user (admin function)
exports.revokeAllSessions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await revokeAllRefreshTokens(userId);

  // Clear cookies
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.json({ message: "All sessions revoked" });
});

// Signup function (no authentication required)
exports.signup = asyncHandler(async (req, res) => {
  const { fname, lname, username, password, org, role } = req.body;

  // Check if user already exists
  const alreadyExists = await pool.query(
    "SELECT * FROM person WHERE prsn_email = $1",
    [username]
  );

  if (alreadyExists.rowCount > 0) {
    throw new ConflictError("Email is already in use, please select another");
  }

  // Create new person
  const newPerson = await pool.query(
    "INSERT INTO person (prsn_first_nm, prsn_last_nm, prsn_email, prsn_pwrd, org_rk, prsn_role) VALUES($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6) RETURNING *",
    [fname, lname, username, password, org, role]
  );

  res.json({
    message: "User created successfully",
    user: newPerson.rows[0],
  });
});

// Forgot password function (no authentication required)
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email, new_password } = req.body;

  if (!email || !new_password) {
    throw new ValidationError("Email and new password are required");
  }

  const newPassword = await pool.query(
    "UPDATE person SET prsn_pwrd = crypt($2, gen_salt('bf')) where prsn_email = $1;",
    [email, new_password]
  );

  // Don't reveal if email exists or not for security
  res.json({
    message: "If the email exists, a password reset link has been sent.",
  });
});

// ============================================================================
// OTP (One-Time Password) Endpoints
// ============================================================================

// Request OTP for password reset
exports.requestOTP = asyncHandler(async (req, res) => {
  const { prsn_first_nm, prsn_last_nm, prsn_email } = req.body;
  Logger.log(req.body);
  if (!prsn_first_nm || !prsn_last_nm || !prsn_email) {
    throw new ValidationError("First name, last name, and email are required");
  }

  // Check if user exists with the provided information
  const userResult = await pool.query(
    "SELECT prsn_rk, prsn_email FROM person WHERE prsn_first_nm = $1 AND prsn_last_nm = $2 AND prsn_email = $3",
    [prsn_first_nm, prsn_last_nm, prsn_email]
  );
  Logger.log(userResult.rows[0]);
  // Always return success message for security (don't reveal if email exists)
  if (userResult.rows.length === 0) {
    res.json({
      message: "If the email exists, a password reset code has been sent.",
      success: true,
    });
    return;
  }

  const user = userResult.rows[0];

  if (!(await checkRateLimit(user.prsn_rk))) {
    res.json({
      message: "If the email exists, a password reset code has been sent.",
      success: true,
    });
    return;
  }

  // Generate OTP
  const otp = generateOTP();
  const otpHash = hashOTP(otp);

  // Set expiration to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Store OTP in database
  await storeOTP(user.prsn_rk, otpHash, expiresAt);

  // Send OTP via email using Resend.com
  try {
    const { Resend } = require("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "noreply@throwspace.app",
      to: prsn_email,
      subject: "Password Reset Code for Throwspace",
      html: `<p>Hey ${prsn_first_nm}! Here is your password reset code for Throwspace: <strong>${otp}</strong></p>
             <p>This code will expire in 10 minutes.</p>
             <p>If you didn't request this password reset, please ignore this email.</p>`,
    });
  } catch (emailError) {
    Logger.error("Email sending failed:", emailError);
  }

  res.json({
    message: "If the email exists, a password reset code has been sent.",
    success: true,
  });
});

// Verify OTP for password reset
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { prsn_first_nm, prsn_last_nm, prsn_email, otp } = req.body;

  if (!prsn_first_nm || !prsn_last_nm || !prsn_email || !otp) {
    throw new ValidationError(
      "First name, last name, email, and OTP are required"
    );
  }

  // Find user
  const userResult = await pool.query(
    "SELECT prsn_rk FROM person WHERE prsn_first_nm = $1 AND prsn_last_nm = $2 AND prsn_email = $3",
    [prsn_first_nm, prsn_last_nm, prsn_email]
  );

  if (userResult.rows.length === 0) {
    throw new ValidationError("Invalid OTP");
  }

  const user = userResult.rows[0];

  // Check OTP attempts and expiration before verification
  const otpCheckResult = await pool.query(
    `SELECT otp_rk, attempts_remaining, otp_expires_at, is_used
     FROM password_reset_otp
     WHERE prsn_rk = $1 AND otp_expires_at > NOW() AND is_used = false`,
    [user.prsn_rk]
  );

  if (otpCheckResult.rows.length === 0) {
    throw new ValidationError("No valid OTP found. Please request a new code.");
  }

  const otpRecord = otpCheckResult.rows[0];

  // Check if OTP has expired
  if (new Date() > new Date(otpRecord.otp_expires_at)) {
    throw new ValidationError("OTP has expired. Please request a new code.");
  }

  // Check if OTP has been used
  if (otpRecord.is_used) {
    throw new ValidationError(
      "OTP has already been used. Please request a new code."
    );
  }

  // Check if attempts are exhausted
  if (otpRecord.attempts_remaining <= 0) {
    throw new ValidationError(
      "Too many failed attempts. Please request a new OTP code."
    );
  }

  // Verify OTP
  const otpHash = hashOTP(otp);
  const otpVerifyResult = await pool.query(
    `SELECT * FROM password_reset_otp
     WHERE prsn_rk = $1 AND otp_hash = $2 AND otp_expires_at > NOW()
     AND is_used = false AND attempts_remaining > 0`,
    [user.prsn_rk, otpHash]
  );

  if (otpVerifyResult.rows.length === 0) {
    // Decrement attempts for invalid OTP
    await decrementOTPAttempts(otp, user.prsn_rk);

    // Get remaining attempts after decrement
    const remainingAttemptsResult = await pool.query(
      `SELECT attempts_remaining FROM password_reset_otp
       WHERE prsn_rk = $1 AND otp_expires_at > NOW() AND is_used = false`,
      [user.prsn_rk]
    );

    const remainingAttempts =
      remainingAttemptsResult.rows[0]?.attempts_remaining || 0;

    if (remainingAttempts <= 0) {
      throw new ValidationError(
        "Too many failed attempts. Please request a new OTP code."
      );
    } else {
      throw new ValidationError(
        `Invalid OTP. You have ${remainingAttempts} attempts remaining.`
      );
    }
  }

  // Mark OTP as used
  await pool.query(
    "UPDATE password_reset_otp SET is_used = true, used_at = NOW() WHERE otp_rk = $1",
    [otpVerifyResult.rows[0].otp_rk]
  );

  res.json({
    message: "OTP verified successfully",
    success: true,
  });
});

// Reset password with verified OTP
exports.resetPassword = asyncHandler(async (req, res) => {
  const { prsn_first_nm, prsn_last_nm, prsn_email, otp, new_password } =
    req.body;

  if (!prsn_first_nm || !prsn_last_nm || !prsn_email || !otp || !new_password) {
    throw new ValidationError("All fields are required");
  }

  // Find user
  const userResult = await pool.query(
    "SELECT prsn_rk FROM person WHERE prsn_first_nm = $1 AND prsn_last_nm = $2 AND prsn_email = $3",
    [prsn_first_nm, prsn_last_nm, prsn_email]
  );

  if (userResult.rows.length === 0) {
    throw new ValidationError("Invalid request");
  }

  const user = userResult.rows[0];

  // Verify OTP again
  const otpHash = hashOTP(otp);
  const otpVerifyResult = await pool.query(
    `SELECT * FROM password_reset_otp
     WHERE prsn_rk = $1 AND otp_hash = $2 AND otp_expires_at > NOW()
     AND is_used = false AND attempts_remaining > 0`,
    [user.prsn_rk, otpHash]
  );

  if (otpVerifyResult.rows.length === 0) {
    throw new ValidationError("Invalid OTP");
  }

  // Update password
  await pool.query(
    "UPDATE person SET prsn_pwrd = crypt($2, gen_salt('bf')) WHERE prsn_rk = $1",
    [user.prsn_rk, new_password]
  );

  // Clean up the used OTP
  await pool.query(
    "UPDATE password_reset_otp SET is_used = true, used_at = NOW() WHERE prsn_rk = $1 AND otp_hash = $2",
    [user.prsn_rk, otpHash]
  );

  res.json({
    message: "Password reset successfully",
    success: true,
  });
});

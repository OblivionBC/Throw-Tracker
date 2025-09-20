/*
  Purpose: Auth routes for JWT/Authentication endpoints
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { authValidation } = require("../middleware/validation");
const {
  login,
  logout,
  refreshToken,
  checkTokenStatus,
  revokeAllSessions,
  signup,
  forgotPassword,
  requestOTP,
  verifyOTP,
  resetPassword,
} = require("../controllers/auth");

// Auth routes (no authentication required)
router
  .post("/login", authValidation.login, login) // POST /auth/login
  .post("/signup", authValidation.signup, signup) // POST /auth/signup
  .post("/forgot-password", authValidation.forgotPassword, forgotPassword) // POST /auth/forgot-password
  .post("/request-otp", authValidation.requestOTP, requestOTP) // POST /auth/request-otp
  .post("/verify-otp", authValidation.verifyOTP, verifyOTP) // POST /auth/verify-otp
  .post("/reset-password", authValidation.resetPassword, resetPassword) // POST /auth/reset-password
  .post("/logout", logout) // POST /auth/logout
  .post("/refresh", refreshToken) // POST /auth/refresh
  .get("/token-status", checkTokenStatus); // GET /auth/token-status
console.log("Routes are Set Up")
// Protected auth routes (authentication required)
router.post("/revoke-all-sessions", requireAuth, revokeAllSessions); // POST /auth/revoke-all-sessions

module.exports = router;

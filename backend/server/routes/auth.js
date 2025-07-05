/*
  Purpose: Auth routes for JWT/Authentication endpoints
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  login,
  logout,
  refreshToken,
  checkTokenStatus,
  revokeAllSessions,
} = require("../controllers/auth");

// Auth routes (no authentication required)
router
  .post("/login", login) // POST /auth/login
  .post("/logout", logout) // POST /auth/logout
  .post("/refresh", refreshToken) // POST /auth/refresh
  .get("/token-status", checkTokenStatus); // GET /auth/token-status

// Protected auth routes (authentication required)
router.post("/revoke-all-sessions", requireAuth, revokeAllSessions); // POST /auth/revoke-all-sessions

module.exports = router;

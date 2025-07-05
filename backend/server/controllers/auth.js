/*
  Purpose: Auth.js holds all JWT/Authentication related HTTP Requests
*/
const { pool } = require(".././db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Helper function to generate refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Helper function to store refresh token in database
const storeRefreshToken = async (userId, refreshToken, expiresAt) => {
  try {
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_at) VALUES ($1, $2, $3, NOW())",
      [userId, refreshToken, new Date(expiresAt * 1000)]
    );
  } catch (error) {
    console.error("Error storing refresh token:", error);
    throw error;
  }
};

// Helper function to verify and revoke refresh token
const verifyAndRevokeRefreshToken = async (refreshToken) => {
  try {
    const result = await pool.query(
      "SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW() AND revoked = false",
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return null;
    }

    // Revoke the token (mark as used)
    await pool.query(
      "UPDATE refresh_tokens SET revoked = true, used_at = NOW() WHERE token_hash = $1",
      [refreshToken]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return null;
  }
};

// Helper function to revoke all refresh tokens for a user
const revokeAllRefreshTokens = async (userId) => {
  try {
    const result = await pool.query(
      "UPDATE refresh_tokens SET revoked = true, revoked_at = NOW() WHERE user_id = $1 AND revoked = false RETURNING id",
      [userId]
    );
  } catch (error) {
    console.error("Error revoking refresh tokens:", error);
    throw error;
  }
};

// Parse JWT expiration time from environment variable
const parseJwtExpiration = (expirationString) => {
  if (!expirationString) {
    return 15 * 60; // Default 15 minutes
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
      return 15 * 60; // Default 15 minutes
  }
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

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p inner join organization o on o.org_rk = p.org_rk WHERE p.prsn_email = $1 AND p.prsn_pwrd = crypt($2, p.prsn_pwrd);",
      [username, password]
    );
    if (result.rows.length == 0) {
      res.status(404).json("Record does not exist");
      return;
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
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: accessTokenExpiresIn * 1000,
    });

    // Set refresh token cookie (long-lived)
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: refreshTokenExpiresIn * 1000,
    });
    res.json({
      message: "Logged in",
      accessTokenExpiresIn: accessTokenExpiresIn,
      refreshTokenExpiresIn: refreshTokenExpiresIn,
    });
  } catch (err) {
    console.error("Error occurred while Logging In:", err.message);
    res.status(500).json({ message: "Error occurred while Logging In." });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      // Revoke the refresh token
      await verifyAndRevokeRefreshToken(refreshToken);
    }

    // Clear both cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.json({ message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookies even if there's an error
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json({ message: "Logged out" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify and revoke the refresh token
    const tokenData = await verifyAndRevokeRefreshToken(refreshToken);

    if (!tokenData) {
      // Clear invalid cookies
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Get user data from database
    const user = await pool.query("SELECT * FROM person WHERE prsn_rk = $1", [
      tokenData.user_id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
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
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: accessTokenExpiresIn * 1000,
    });

    // Set new refresh token cookie
    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: refreshTokenExpiresIn * 1000,
    });
    res.json({
      message: "Token refreshed successfully",
      accessTokenExpiresIn: accessTokenExpiresIn,
      refreshTokenExpiresIn: refreshTokenExpiresIn,
    });
  } catch (error) {
    console.error("Token refresh error:", error.message);

    // Clear cookies on error
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(500).json({ message: "Token refresh failed" });
  }
};

// Check token expiration status
exports.checkTokenStatus = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({
        message: "No access token provided",
        expiresIn: null,
        isExpiringSoon: false,
      });
    }

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
      return res.status(401).json({
        message: "Token expired",
        expiresIn: 0,
        isExpiringSoon: false,
      });
    }

    return res.status(403).json({
      message: "Invalid token",
      expiresIn: null,
      isExpiringSoon: false,
    });
  }
};

// Revoke all sessions for a user (admin function)
exports.revokeAllSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    await revokeAllRefreshTokens(userId);

    // Clear cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.json({ message: "All sessions revoked" });
  } catch (error) {
    console.error("Error revoking all sessions:", error);
    res.status(500).json({ message: "Error revoking sessions" });
  }
};

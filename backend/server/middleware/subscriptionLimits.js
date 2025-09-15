const { pool } = require("../db");
const { ConflictError } = require("../utils/errors");

// Middleware to check subscription limits before allowing resource creation
const checkSubscriptionLimits = (resourceType) => {
  return async (req, res, next) => {
    try {
      const org_rk = req.user?.org_rk || req.body?.org_rk;

      if (!org_rk) {
        return next(); // Skip if no org context
      }

      // Check if organization has reached the limit for this resource type
      const result = await pool.query(
        "SELECT check_organization_limits($1, $2) as within_limits",
        [org_rk, resourceType]
      );

      if (!result.rows[0].within_limits) {
        // Get current subscription details for better error message
        const subscriptionResult = await pool.query(
          `SELECT plan_name, max_${resourceType} as max_limit
           FROM organization_subscription 
           WHERE org_rk = $1 
           AND status IN ('active', 'trial')
           AND current_period_end > NOW()
           ORDER BY created_at DESC 
           LIMIT 1`,
          [org_rk]
        );

        const subscription = subscriptionResult.rows[0];
        const maxLimit = subscription?.max_limit;

        throw new ConflictError(
          `You have reached the limit for ${resourceType} on your ${
            subscription?.plan_name || "current"
          } plan. ` +
            `Maximum allowed: ${
              maxLimit || "unlimited"
            }. Please upgrade your plan to add more ${resourceType}.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Specific limit checkers for common resources
const checkAthleteLimit = checkSubscriptionLimits("athletes");
const checkCoachLimit = checkSubscriptionLimits("coaches");
const checkProgramLimit = checkSubscriptionLimits("programs");
const checkMeetLimit = checkSubscriptionLimits("meets");

// Helper function to get current subscription info
const getCurrentSubscriptionInfo = async (org_rk) => {
  try {
    const result = await pool.query(
      `SELECT 
        plan_name,
        plan_type,
        status,
        max_athletes,
        max_coaches,
        max_programs,
        max_meets_per_month,
        storage_limit_gb,
        features,
        current_period_end
      FROM organization_subscription 
      WHERE org_rk = $1 
      AND status IN ('active', 'trial')
      AND current_period_end > NOW()
      ORDER BY created_at DESC 
      LIMIT 1`,
      [org_rk]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting subscription info:", error);
    return null;
  }
};

// Helper function to check if a feature is enabled
const hasFeature = async (org_rk, featureName) => {
  try {
    const subscription = await getCurrentSubscriptionInfo(org_rk);
    if (!subscription) return false;

    return subscription.features?.[featureName] === true;
  } catch (error) {
    console.error("Error checking feature:", error);
    return false;
  }
};

// Custom middleware to check limits based on person role
const checkPersonRoleLimit = async (req, res, next) => {
  try {
    const { prsn_role, org_rk } = req.body;

    if (!prsn_role || !org_rk) {
      return next(); // Skip if no role or org context
    }

    let resourceType;
    if (prsn_role === "athlete") {
      resourceType = "athletes";
    } else if (prsn_role === "coach") {
      resourceType = "coaches";
    } else {
      return next(); // Skip for other roles (admin, etc.)
    }

    // Check if organization has reached the limit for this resource type
    const result = await pool.query(
      "SELECT check_organization_limits($1, $2) as within_limits",
      [org_rk, resourceType]
    );

    if (!result.rows[0].within_limits) {
      // Get current subscription details for better error message
      const subscriptionResult = await pool.query(
        `SELECT plan_name, max_${resourceType} as max_limit
         FROM organization_subscription 
         WHERE org_rk = $1 
         AND status IN ('active', 'trial')
         AND current_period_end > NOW()
         ORDER BY created_at DESC 
         LIMIT 1`,
        [org_rk]
      );

      const subscription = subscriptionResult.rows[0];
      const maxLimit = subscription?.max_limit;

      throw new ConflictError(
        `You have reached the limit for ${resourceType} on your ${
          subscription?.plan_name || "current"
        } plan. ` +
          `Maximum allowed: ${
            maxLimit || "unlimited"
          }. Please upgrade your plan to add more ${resourceType}.`
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkSubscriptionLimits,
  checkAthleteLimit,
  checkCoachLimit,
  checkProgramLimit,
  checkMeetLimit,
  checkPersonRoleLimit,
  getCurrentSubscriptionInfo,
  hasFeature,
};

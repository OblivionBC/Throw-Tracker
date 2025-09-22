const { pool } = require("../db");
const asyncHandler = require("../utils/asyncHandler");
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

// Get current subscription for an organization
exports.getCurrentSubscription = asyncHandler(async (req, res) => {
  const { org_rk } = req.params;

  const result = await pool.query(
    `SELECT 
      sub_rk,
      plan_type,
      plan_name,
      billing_cycle,
      price_per_cycle,
      currency,
      status,
      trial_ends_at,
      current_period_start,
      current_period_end,
      max_athletes,
      max_coaches,
      max_programs,
      max_meets_per_month,
      storage_limit_gb,
      features,
      created_at,
      updated_at
    FROM organization_subscription 
    WHERE org_rk = $1 
    AND status IN ('active', 'trial')
    AND current_period_end > NOW()
    ORDER BY created_at DESC 
    LIMIT 1`,
    [org_rk]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError("No active subscription found");
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
});

// Get subscription history for an organization
exports.getSubscriptionHistory = asyncHandler(async (req, res) => {
  const { org_rk } = req.params;

  const result = await pool.query(
    `SELECT 
      sub_rk,
      plan_type,
      plan_name,
      billing_cycle,
      price_per_cycle,
      status,
      current_period_start,
      current_period_end,
      created_at,
      cancelled_at,
      cancellation_reason
    FROM organization_subscription 
    WHERE org_rk = $1 
    ORDER BY created_at DESC`,
    [org_rk]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// Create new subscription (for upgrades/downgrades)
exports.createSubscription = asyncHandler(async (req, res) => {
  const {
    org_rk,
    plan_type,
    plan_name,
    billing_cycle = "monthly",
    price_per_cycle = 0,
    currency = "USD",
    trial_ends_at = null,
    max_athletes = null,
    max_coaches = null,
    max_programs = null,
    max_meets_per_month = null,
    storage_limit_gb = null,
    features = {},
  } = req.body;

  // Validate required fields
  if (!org_rk || !plan_type || !plan_name) {
    throw new ValidationError(
      "Organization ID, plan type, and plan name are required"
    );
  }

  // Check if organization exists
  const orgResult = await pool.query(
    "SELECT org_rk FROM organization WHERE org_rk = $1",
    [org_rk]
  );

  if (orgResult.rows.length === 0) {
    throw new NotFoundError("Organization not found");
  }

  // Cancel any existing active subscriptions
  await pool.query(
    `UPDATE organization_subscription 
     SET status = 'cancelled', 
         cancelled_at = NOW(),
         cancellation_reason = 'Upgraded to new plan'
     WHERE org_rk = $1 
     AND status IN ('active', 'trial')`,
    [org_rk]
  );

  // Calculate period dates
  const currentPeriodStart = new Date();
  const currentPeriodEnd = new Date();

  if (billing_cycle === "monthly") {
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  } else if (billing_cycle === "yearly") {
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
  } else if (billing_cycle === "lifetime") {
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 100); // Effectively lifetime
  }

  // Create new subscription
  const result = await pool.query(
    `INSERT INTO organization_subscription (
      org_rk, plan_type, plan_name, billing_cycle, price_per_cycle, currency,
      status, trial_ends_at, current_period_start, current_period_end,
      max_athletes, max_coaches, max_programs, max_meets_per_month, storage_limit_gb, features
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *`,
    [
      org_rk,
      plan_type,
      plan_name,
      billing_cycle,
      price_per_cycle,
      currency,
      trial_ends_at ? "trial" : "active",
      trial_ends_at,
      currentPeriodStart,
      currentPeriodEnd,
      max_athletes,
      max_coaches,
      max_programs,
      max_meets_per_month,
      storage_limit_gb,
      JSON.stringify(features),
    ]
  );

  // Update organization's current subscription reference
  await pool.query(
    "UPDATE organization SET current_subscription_rk = $1 WHERE org_rk = $2",
    [result.rows[0].sub_rk, org_rk]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: "Subscription created successfully",
  });
});

// Cancel subscription
exports.cancelSubscription = asyncHandler(async (req, res) => {
  const { sub_rk } = req.params;
  const { cancellation_reason = "User requested cancellation" } = req.body;

  const result = await pool.query(
    `UPDATE organization_subscription 
     SET status = 'cancelled', 
         cancelled_at = NOW(),
         cancellation_reason = $1
     WHERE sub_rk = $2 
     AND status IN ('active', 'trial')
     RETURNING *`,
    [cancellation_reason, sub_rk]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError("Active subscription not found");
  }

  res.json({
    success: true,
    data: result.rows[0],
    message: "Subscription cancelled successfully",
  });
});

// Check organization limits
exports.checkLimits = asyncHandler(async (req, res) => {
  const { org_rk } = req.params;
  const { limit_type } = req.query;

  if (!limit_type) {
    throw new ValidationError("Limit type is required");
  }

  const validLimitTypes = ["athletes", "coaches", "programs", "meets"];
  if (!validLimitTypes.includes(limit_type)) {
    throw new ValidationError("Invalid limit type");
  }

  const result = await pool.query(
    "SELECT check_organization_limits($1, $2) as within_limits",
    [org_rk, limit_type]
  );

  res.json({
    success: true,
    data: {
      limit_type,
      within_limits: result.rows[0].within_limits,
    },
  });
});

// Get available plans
exports.getAvailablePlans = asyncHandler(async (req, res) => {
  const plans = [
    {
      plan_type: "free",
      plan_name: "Free Plan",
      billing_cycle: "monthly",
      price_per_cycle: 0,
      currency: "USD",
      max_athletes: 10,
      max_coaches: 2,
      max_programs: 5,
      max_meets_per_month: 2,
      storage_limit_gb: 1,
      features: {
        basic_analytics: true,
        email_support: true,
        basic_reports: true,
      },
    },
    {
      plan_type: "basic",
      plan_name: "Basic Plan",
      billing_cycle: "monthly",
      price_per_cycle: 29.99,
      currency: "USD",
      max_athletes: 50,
      max_coaches: 5,
      max_programs: 25,
      max_meets_per_month: 10,
      storage_limit_gb: 10,
      features: {
        advanced_analytics: true,
        priority_support: true,
        custom_reports: true,
        data_export: true,
      },
    },
    {
      plan_type: "premium",
      plan_name: "Premium Plan",
      billing_cycle: "monthly",
      price_per_cycle: 79.99,
      currency: "USD",
      max_athletes: 200,
      max_coaches: 15,
      max_programs: 100,
      max_meets_per_month: 50,
      storage_limit_gb: 50,
      features: {
        advanced_analytics: true,
        priority_support: true,
        custom_reports: true,
        data_export: true,
        api_access: true,
        custom_branding: true,
      },
    },
    {
      plan_type: "enterprise",
      plan_name: "Enterprise Plan",
      billing_cycle: "monthly",
      price_per_cycle: 199.99,
      currency: "USD",
      max_athletes: null, // unlimited
      max_coaches: null, // unlimited
      max_programs: null, // unlimited
      max_meets_per_month: null, // unlimited
      storage_limit_gb: 500,
      features: {
        advanced_analytics: true,
        dedicated_support: true,
        custom_reports: true,
        data_export: true,
        api_access: true,
        custom_branding: true,
        sso_integration: true,
        custom_integrations: true,
      },
    },
  ];

  res.json({
    success: true,
    data: plans,
  });
});

// Middleware to check subscription limits
exports.checkSubscriptionLimits = (limitType) => {
  return asyncHandler(async (req, res, next) => {
    const org_rk = req.user?.org_rk || req.body?.org_rk;

    if (!org_rk) {
      return next(); // Skip if no org context
    }

    const result = await pool.query(
      "SELECT check_organization_limits($1, $2) as within_limits",
      [org_rk, limitType]
    );

    if (!result.rows[0].within_limits) {
      throw new ConflictError(
        `Organization has reached the limit for ${limitType}. Please upgrade your plan.`
      );
    }

    next();
  });
};

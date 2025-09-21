const { pool } = require("../db");
const asyncHandler = require("../utils/asyncHandler");
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

// Production-safe logging
const isDevelopment = process.env.NODE_ENV === 'development';
const Logger = {
  log: (...args) => isDevelopment && console.log(...args),
  error: (...args) => isDevelopment && console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  info: (...args) => isDevelopment && console.info(...args),
  debug: (...args) => isDevelopment && console.debug(...args),
  critical: (...args) => console.error(...args) // Always log critical errors
};


exports.getAllOrganizations = asyncHandler(async (req, res) => {
  try {
    const orgResult = await pool.query(`
      SELECT 
        o.org_rk,
        o.org_name,
        o.org_type,
        o.org_code
      FROM organization o
      ORDER BY o.org_rk DESC
    `);

    let subscriptionData = {};
    try {
      const subResult = await pool.query(`
        SELECT 
          org_rk,
          plan_name,
          plan_type,
          status,
          current_period_end,
          max_athletes,
          max_coaches,
          max_programs,
          max_meets_per_month
        FROM organization_subscription 
        WHERE status IN ('active', 'trial') 
          AND current_period_end > NOW()
      `);

      subResult.rows.forEach((sub) => {
        subscriptionData[sub.org_rk] = sub;
      });
    } catch (subError) {
      Logger.error("Subscription query failed:", subError.message);
    }

    let userCounts = {};
    try {
      const userResult = await pool.query(`
        SELECT 
          org_rk,
          prsn_role,
          COUNT(*) as count
        FROM person 
        GROUP BY org_rk, prsn_role
      `);

      userResult.rows.forEach((user) => {
        if (!userCounts[user.org_rk]) {
          userCounts[user.org_rk] = { athletes: 0, coaches: 0, admins: 0 };
        }
        userCounts[user.org_rk][user.prsn_role + "s"] = parseInt(user.count);
      });
    } catch (userError) {
      Logger.error("User counts query failed:", userError.message);
    }

    // Combine the data
    const organizations = orgResult.rows.map((org) => ({
      ...org,
      ...subscriptionData[org.org_rk],
      ...userCounts[org.org_rk],
      current_athletes: userCounts[org.org_rk]?.athletes || 0,
      current_coaches: userCounts[org.org_rk]?.coaches || 0,
      current_admins: userCounts[org.org_rk]?.admins || 0,
    }));

    res.json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    Logger.error("❌ Error in getAllOrganizations:", error);
    throw error;
  }
});

// Get organization by ID with detailed information
exports.getOrganizationById = asyncHandler(async (req, res) => {
  const { org_rk } = req.params;

  // Get organization details
  const orgResult = await pool.query(
    "SELECT * FROM organization WHERE org_rk = $1",
    [org_rk]
  );

  if (orgResult.rows.length === 0) {
    throw new NotFoundError("Organization not found");
  }

  const organization = orgResult.rows[0];

  // Get current subscription
  const subscriptionResult = await pool.query(
    `SELECT * FROM organization_subscription 
     WHERE org_rk = $1 
     AND status IN ('active', 'trial')
     AND current_period_end > NOW()
     ORDER BY created_at DESC 
     LIMIT 1`,
    [org_rk]
  );

  // Get user counts by role
  const userCountsResult = await pool.query(
    `SELECT 
      prsn_role,
      COUNT(*) as count
     FROM person 
     WHERE org_rk = $1 
     GROUP BY prsn_role`,
    [org_rk]
  );

  // Get resource counts
  const resourceCountsResult = await pool.query(
    `SELECT 
      (SELECT COUNT(*) FROM program WHERE org_rk = $1) as programs,
      (SELECT COUNT(*) FROM meet WHERE org_rk = $1) as meets,
      (SELECT COUNT(*) FROM practice WHERE org_rk = $1) as practices
    `,
    [org_rk]
  );

  // Get recent activity (last 30 days)
  const recentActivityResult = await pool.query(
    `SELECT 
      'person' as type,
      prsn_first_nm || ' ' || prsn_last_nm as name,
      prsn_role as role,
      created_at
     FROM person 
     WHERE org_rk = $1 AND created_at > NOW() - INTERVAL '30 days'
     
     UNION ALL
     
     SELECT 
      'program' as type,
      prog_nm as name,
      NULL as role,
      created_at
     FROM program 
     WHERE org_rk = $1 AND created_at > NOW() - INTERVAL '30 days'
     
     UNION ALL
     
     SELECT 
      'meet' as type,
      meet_nm as name,
      NULL as role,
      created_at
     FROM meet 
     WHERE org_rk = $1 AND created_at > NOW() - INTERVAL '30 days'
     
     ORDER BY created_at DESC
     LIMIT 20`,
    [org_rk]
  );

  // Format user counts
  const userCounts = {
    athletes: 0,
    coaches: 0,
    admins: 0,
  };

  userCountsResult.rows.forEach((row) => {
    userCounts[row.prsn_role] = parseInt(row.count);
  });

  res.json({
    success: true,
    data: {
      organization,
      subscription: subscriptionResult.rows[0] || null,
      userCounts,
      resourceCounts: resourceCountsResult.rows[0],
      recentActivity: recentActivityResult.rows,
    },
  });
});

// Create new organization
exports.createOrganization = asyncHandler(async (req, res) => {
  const { org_name, org_type, org_code } = req.body;

  if (!org_name) {
    throw new ValidationError("Organization name is required");
  }

  // Check if organization name already exists
  const existingOrg = await pool.query(
    "SELECT org_rk FROM organization WHERE org_name = $1",
    [org_name]
  );

  if (existingOrg.rows.length > 0) {
    throw new ConflictError("Organization name already exists");
  }

  const result = await pool.query(
    "INSERT INTO organization (org_name, org_type, org_code) VALUES ($1, $2, $3) RETURNING *",
    [org_name, org_type || "default", org_code || null]
  );

  // Create default free subscription for new organization
  await pool.query(
    `INSERT INTO organization_subscription (
      org_rk, plan_type, plan_name, billing_cycle, price_per_cycle, currency,
      status, current_period_start, current_period_end,
      max_athletes, max_coaches, max_programs, max_meets_per_month, storage_limit_gb, features
    ) VALUES ($1, 'free', 'Free Plan', 'monthly', 0, 'USD', 'active', NOW(), NOW() + INTERVAL '1 year', 10, 2, 5, 2, 1, '{"basic_analytics": true, "email_support": true, "basic_reports": true}')`,
    [result.rows[0].org_rk]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: "Organization created successfully with free plan",
  });
});

// Update organization
exports.updateOrganization = asyncHandler(async (req, res) => {
  const { org_rk } = req.params;
  const { org_name, org_type, org_code } = req.body;

  if (!org_name) {
    throw new ValidationError("Organization name is required");
  }

  // Check if organization exists
  const existingOrg = await pool.query(
    "SELECT org_rk FROM organization WHERE org_rk = $1",
    [org_rk]
  );

  if (existingOrg.rows.length === 0) {
    throw new NotFoundError("Organization not found");
  }

  // Check if new name conflicts with existing organizations
  const nameConflict = await pool.query(
    "SELECT org_rk FROM organization WHERE org_name = $1 AND org_rk != $2",
    [org_name, org_rk]
  );

  if (nameConflict.rows.length > 0) {
    throw new ConflictError("Organization name already exists");
  }

  const result = await pool.query(
    "UPDATE organization SET org_name = $1, org_type = $2, org_code = $3 WHERE org_rk = $4 RETURNING *",
    [org_name, org_type || "default", org_code || null, org_rk]
  );

  res.json({
    success: true,
    data: result.rows[0],
    message: "Organization updated successfully",
  });
});

// Delete organization (soft delete by deactivating)
exports.deleteOrganization = asyncHandler(async (req, res) => {
  const { org_rk } = req.params;

  // Check if organization exists
  const existingOrg = await pool.query(
    "SELECT org_rk FROM organization WHERE org_rk = $1",
    [org_rk]
  );

  if (existingOrg.rows.length === 0) {
    throw new NotFoundError("Organization not found");
  }

  // Check if organization has users
  const userCount = await pool.query(
    "SELECT COUNT(*) as count FROM person WHERE org_rk = $1",
    [org_rk]
  );

  if (parseInt(userCount.rows[0].count) > 0) {
    throw new ConflictError(
      "Cannot delete organization with existing users. Please remove all users first."
    );
  }

  // Cancel all subscriptions
  await pool.query(
    `UPDATE organization_subscription 
     SET status = 'cancelled', 
         cancelled_at = NOW(),
         cancellation_reason = 'Organization deleted by admin'
     WHERE org_rk = $1`,
    [org_rk]
  );

  // Delete organization
  await pool.query("DELETE FROM organization WHERE org_rk = $1", [org_rk]);

  res.json({
    success: true,
    message: "Organization deleted successfully",
  });
});

// Get all subscriptions with organization details
exports.getAllSubscriptions = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT 
      os.sub_rk,
      os.org_rk,
      o.org_name,
      os.plan_type,
      os.plan_name,
      os.billing_cycle,
      os.price_per_cycle,
      os.currency,
      os.status,
      os.trial_ends_at,
      os.current_period_start,
      os.current_period_end,
      os.max_athletes,
      os.max_coaches,
      os.max_programs,
      os.max_meets_per_month,
      os.storage_limit_gb,
      os.features,
      os.created_at,
      os.updated_at,
      os.cancelled_at,
      os.cancellation_reason,
      COUNT(DISTINCT CASE WHEN p.prsn_role = 'athlete' THEN p.prsn_rk END) as current_athletes,
      COUNT(DISTINCT CASE WHEN p.prsn_role = 'coach' THEN p.prsn_rk END) as current_coaches
    FROM organization_subscription os
    JOIN organization o ON os.org_rk = o.org_rk
    LEFT JOIN person p ON o.org_rk = p.org_rk
    GROUP BY os.sub_rk, os.org_rk, o.org_name, os.plan_type, os.plan_name, 
             os.billing_cycle, os.price_per_cycle, os.currency, os.status,
             os.trial_ends_at, os.current_period_start, os.current_period_end,
             os.max_athletes, os.max_coaches, os.max_programs, os.max_meets_per_month,
             os.storage_limit_gb, os.features, os.created_at, os.updated_at,
             os.cancelled_at, os.cancellation_reason
    ORDER BY os.created_at DESC
  `
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// Get subscription analytics
exports.getSubscriptionAnalytics = asyncHandler(async (req, res) => {
  // Get subscription counts by plan type
  const planCountsResult = await pool.query(
    `SELECT 
      plan_type,
      COUNT(*) as count,
      SUM(price_per_cycle) as total_revenue
    FROM organization_subscription 
    WHERE status IN ('active', 'trial')
    AND current_period_end > NOW()
    GROUP BY plan_type
    ORDER BY count DESC
  `
  );

  // Get subscription status counts
  const statusCountsResult = await pool.query(
    `SELECT 
      status,
      COUNT(*) as count
    FROM organization_subscription 
    GROUP BY status
    ORDER BY count DESC
  `
  );

  // Get monthly revenue trend (last 12 months)
  const revenueTrendResult = await pool.query(
    `SELECT 
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as new_subscriptions,
      SUM(price_per_cycle) as revenue
    FROM organization_subscription 
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month DESC
  `
  );

  // Get organization growth (using subscription creation as proxy since org table doesn't have created_at)
  const orgGrowthResult = await pool.query(
    `SELECT 
      DATE_TRUNC('month', os.created_at) as month,
      COUNT(DISTINCT os.org_rk) as new_organizations
    FROM organization_subscription os
    WHERE os.created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', os.created_at)
    ORDER BY month DESC
  `
  );

  res.json({
    success: true,
    data: {
      planCounts: planCountsResult.rows,
      statusCounts: statusCountsResult.rows,
      revenueTrend: revenueTrendResult.rows,
      organizationGrowth: orgGrowthResult.rows,
    },
  });
});

// Update subscription (admin override)
exports.updateSubscription = asyncHandler(async (req, res) => {
  const { sub_rk } = req.params;
  const {
    plan_type,
    plan_name,
    billing_cycle,
    price_per_cycle,
    status,
    max_athletes,
    max_coaches,
    max_programs,
    max_meets_per_month,
    storage_limit_gb,
    features,
  } = req.body;

  // Check if subscription exists
  const existingSub = await pool.query(
    "SELECT * FROM organization_subscription WHERE sub_rk = $1",
    [sub_rk]
  );

  if (existingSub.rows.length === 0) {
    throw new NotFoundError("Subscription not found");
  }

  const result = await pool.query(
    `UPDATE organization_subscription 
     SET plan_type = $1, plan_name = $2, billing_cycle = $3, price_per_cycle = $4,
         status = $5, max_athletes = $6, max_coaches = $7, max_programs = $8,
         max_meets_per_month = $9, storage_limit_gb = $10, features = $11,
         updated_at = NOW()
     WHERE sub_rk = $12
     RETURNING *`,
    [
      plan_type,
      plan_name,
      billing_cycle,
      price_per_cycle,
      status,
      max_athletes,
      max_coaches,
      max_programs,
      max_meets_per_month,
      storage_limit_gb,
      JSON.stringify(features || {}),
      sub_rk,
    ]
  );

  res.json({
    success: true,
    data: result.rows[0],
    message: "Subscription updated successfully",
  });
});

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { subscriptionsValidation } = require("../middleware/validation");
const {
  getCurrentSubscription,
  getSubscriptionHistory,
  createSubscription,
  cancelSubscription,
  checkLimits,
  getAvailablePlans,
  checkSubscriptionLimits,
} = require("../controllers/subscriptions");

// Public routes (no auth required)
router.get("/plans", getAvailablePlans); // GET /subscriptions/plans

// Protected routes (authentication required)
router.use(requireAuth); // Apply auth middleware to all routes below

// Subscription management
router.get("/current/:org_rk", getCurrentSubscription); // GET /subscriptions/current/:org_rk
router.get("/history/:org_rk", getSubscriptionHistory); // GET /subscriptions/history/:org_rk
router.post("/", subscriptionsValidation.create, createSubscription); // POST /subscriptions
router.post("/cancel/:sub_rk", cancelSubscription); // POST /subscriptions/cancel/:sub_rk

// Limit checking
router.get("/limits/:org_rk", checkLimits); // GET /subscriptions/limits/:org_rk?limit_type=athletes

// Export middleware for use in other routes
router.checkSubscriptionLimits = checkSubscriptionLimits;

module.exports = router;

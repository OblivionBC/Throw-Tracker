const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { adminValidation } = require("../middleware/validation");
const {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getAllSubscriptions,
  getSubscriptionAnalytics,
  updateSubscription,
} = require("../controllers/admin");

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({
      success: false,
      error: {
        message: "Admin access required",
        code: "ADMIN_REQUIRED",
      },
    });
  }
  next();
};

// Apply admin middleware to all routes
router.use(requireAuth);
router.use(requireAdmin);

// Organization management routes
router.get("/organizations", getAllOrganizations); // GET /admin/organizations
router.get("/organizations/:org_rk", getOrganizationById); // GET /admin/organizations/:org_rk
router.post(
  "/organizations",
  adminValidation.createOrganization,
  createOrganization
); // POST /admin/organizations
router.put(
  "/organizations/:org_rk",
  adminValidation.updateOrganization,
  updateOrganization
); // PUT /admin/organizations/:org_rk
router.delete("/organizations/:org_rk", deleteOrganization); // DELETE /admin/organizations/:org_rk

// Subscription management routes
router.get("/subscriptions", getAllSubscriptions); // GET /admin/subscriptions
router.get("/subscriptions/analytics", getSubscriptionAnalytics); // GET /admin/subscriptions/analytics
router.put(
  "/subscriptions/:sub_rk",
  adminValidation.updateSubscription,
  updateSubscription
); // PUT /admin/subscriptions/:sub_rk

module.exports = router;

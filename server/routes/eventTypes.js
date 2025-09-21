const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  getAllEventTypes,
  getEventTypeById,
} = require("../controllers/event_types");

router.get("/", requireAuth, getAllEventTypes); // GET /event-types
router.get("/:etyp_rk", requireAuth, getEventTypeById); // GET /event-types/:etyp_rk

module.exports = router;

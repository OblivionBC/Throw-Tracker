const router = require("express").Router({ mergeParams: true });
const { requireAuth } = require("../middleware/auth");
const {
  listForMeet,
  createForMeet,
  getOne,
  updateOne,
  deleteOne,
} = require("../controllers/meet_events");

// Nested under /meets/:meet_rk
router
  .get("/", requireAuth, listForMeet) // GET /meets/:meet_rk/events
  .post("/", requireAuth, createForMeet); // POST /meets/:meet_rk/events

// Direct by meet_event_rk
router
  .get("/:meet_event_rk", requireAuth, getOne) // GET /meets/:meet_rk/events/:meet_event_rk
  .put("/:meet_event_rk", requireAuth, updateOne) // PUT /meets/:meet_rk/events/:meet_event_rk
  .delete("/:meet_event_rk", requireAuth, deleteOne); // DELETE /meets/:meet_rk/events/:meet_event_rk

module.exports = router;

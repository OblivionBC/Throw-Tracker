/*
  Purpose: Meets routes for editing the Meet table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { checkMeetLimit } = require("../middleware/subscriptionLimits");
const {
  addMeet,
  getMeet,
  getAllMeets,
  deleteMeet,
  updateMeet,
  getMeetsForCoachOrg,
  createMeetFromTemplate,
  checkSchedulingConflicts,
  getMeetSchedule,
  assignCoachToEvent,
  getCoachAssignmentsForMeet,
} = require("../controllers/meets");

// Mount nested meet events routes
router.use("/:meet_rk/events", require("./meetEvents"));

// All meet routes require authentication
router
  .post("/", requireAuth, checkMeetLimit, addMeet) // POST /meets
  .post("/from-template", requireAuth, checkMeetLimit, createMeetFromTemplate) // POST /meets/from-template
  .get("/", requireAuth, getAllMeets) // GET /meets
  .get("/coach-org", requireAuth, getMeetsForCoachOrg) // GET /meets/coach-org
  .get("/:meet_rk", requireAuth, getMeet) // GET /meets/:meet_rk
  .get("/:meet_rk/schedule", requireAuth, getMeetSchedule) // GET /meets/:meet_rk/schedule
  .get("/:meet_rk/coach-assignments", requireAuth, getCoachAssignmentsForMeet) // GET /meets/:meet_rk/coach-assignments
  .post("/check-conflicts", requireAuth, checkSchedulingConflicts) // POST /meets/check-conflicts
  .post("/assign-coach", requireAuth, assignCoachToEvent) // POST /meets/assign-coach
  .put("/:meet_rk", requireAuth, updateMeet) // PUT /meets/:meet_rk
  .delete("/:meet_rk", requireAuth, deleteMeet); // DELETE /meets/:meet_rk

module.exports = router;

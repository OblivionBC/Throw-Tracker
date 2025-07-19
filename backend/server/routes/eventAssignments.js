/*
  Purpose: Event Assignments routes for editing the event_assignment table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addEventAssignment,
  getEventAssignmentsByMeet,
  getEventAssignmentsByAthlete,
  updateEventAssignment,
  deleteEventAssignment,
  getEventAssignment,
} = require("../controllers/event_assignments");

// All event assignment routes require authentication
router
  .post("/", requireAuth, addEventAssignment) // POST /event-assignments
  .get("/meet/:meet_rk", requireAuth, getEventAssignmentsByMeet) // GET /event-assignments/meet/:meet_rk
  .get("/athlete/:prsn_rk", requireAuth, getEventAssignmentsByAthlete) // GET /event-assignments/athlete/:prsn_rk
  .get("/:meet_rk/:prsn_rk/:etyp_rk", requireAuth, getEventAssignment) // GET /event-assignments/:meet_rk/:prsn_rk/:etyp_rk
  .put("/:meet_rk/:prsn_rk/:etyp_rk", requireAuth, updateEventAssignment) // PUT /event-assignments/:meet_rk/:prsn_rk/:etyp_rk
  .delete("/:meet_rk/:prsn_rk/:etyp_rk", requireAuth, deleteEventAssignment); // DELETE /event-assignments/:meet_rk/:prsn_rk/:etyp_rk

module.exports = router;

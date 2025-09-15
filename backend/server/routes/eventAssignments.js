/*
  Purpose: Event Assignments routes for editing the event_assignment table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addEventAssignment,
  getEventAssignmentsByMeet,
  getAllEventAssignmentsByMeet,
  getEventAssignmentsByMeetAndEvent,
  getEventAssignmentsByAthlete,
  updateEventAssignment,
  deleteEventAssignment,
  getEventAssignment,
  getAllEventAssignmentsForCoach,
} = require("../controllers/event_assignments");

// All event assignment routes require authentication
router
  .post("/", requireAuth, addEventAssignment) // POST /event-assignments
  .get("/coach/all", requireAuth, getAllEventAssignmentsForCoach) // GET /event-assignments/coach/all
  .get("/meet/:meet_rk", requireAuth, getEventAssignmentsByMeet) // GET /event-assignments/meet/:meet_rk
  .get("/meet/:meet_rk/all", requireAuth, getAllEventAssignmentsByMeet) // GET /event-assignments/meet/:meet_rk/all
  .get(
    "/meet/:meet_rk/event/:etyp_rk",
    requireAuth,
    getEventAssignmentsByMeetAndEvent
  ) // GET /event-assignments/meet/:meet_rk/event/:etyp_rk
  .get("/athlete/:prsn_rk", requireAuth, getEventAssignmentsByAthlete) // GET /event-assignments/athlete/:prsn_rk
  .get("/:meet_rk/:prsn_rk/:etyp_rk", requireAuth, getEventAssignment) // GET /event-assignments/:meet_rk/:prsn_rk/:etyp_rk
  .put("/:meet_rk/:prsn_rk/:etyp_rk", requireAuth, updateEventAssignment) // PUT /event-assignments/:meet_rk/:prsn_rk/:etyp_rk
  .delete("/:meet_rk/:prsn_rk/:etyp_rk", requireAuth, deleteEventAssignment); // DELETE /event-assignments/:meet_rk/:prsn_rk/:etyp_rk

module.exports = router;

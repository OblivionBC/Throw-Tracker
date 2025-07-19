const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  assignEventToAthlete,
  unassignEventFromAthlete,
  getEventsForAthlete,
  getAthletesForEvent,
} = require("../controllers/athlete_event_assignments");

router.post("/assign", requireAuth, assignEventToAthlete); // POST /athlete-event-assignments/assign
router.delete("/unassign", requireAuth, unassignEventFromAthlete); // DELETE /athlete-event-assignments/unassign
router.get("/athlete/:athlete_rk", requireAuth, getEventsForAthlete); // GET /athlete-event-assignments/athlete/:athlete_rk
router.get("/event/:etyp_rk", requireAuth, getAthletesForEvent); // GET /athlete-event-assignments/event/:etyp_rk

module.exports = router;

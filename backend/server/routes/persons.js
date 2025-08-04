/*
  Purpose: Persons routes for editing the Person table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addPerson,
  getPerson,
  getAllPersons,
  deletePerson,
  updatePassword,
  athletesForCoach,
  getMe,
  unassignedAthletesInOrg,
  assignCoachToAthlete,
  unassignCoachFromAthlete,
} = require("../controllers/persons");

// Protected routes (authentication required)
router
  .get("/me", requireAuth, getMe) // GET /persons/me
  .get("/athletes", requireAuth, athletesForCoach) // GET /persons/athletes (uses req.user.id)
  .get("/athletes/unassigned", requireAuth, unassignedAthletesInOrg) // GET /persons/athletes/unassigned
  .post("/athletes/assign-coach", requireAuth, assignCoachToAthlete) // POST /persons/athletes/assign-coach
  .post("/athletes/unassign-coach", requireAuth, unassignCoachFromAthlete); // POST /persons/athletes/unassign-coach

// Admin routes (authentication required)
router
  .post("/", requireAuth, addPerson) // POST /persons
  .get("/", requireAuth, getAllPersons) // GET /persons
  .get("/:prsn_rk", requireAuth, getPerson) // GET /persons/:prsn_rk
  .put("/:prsn_rk/password", requireAuth, updatePassword) // PUT /persons/:prsn_rk/password
  .delete("/:prsn_rk", requireAuth, deletePerson); // DELETE /persons/:prsn_rk

module.exports = router;

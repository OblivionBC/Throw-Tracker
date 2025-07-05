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
} = require("../controllers/persons");

// Protected routes (authentication required)
router
  .get("/me", requireAuth, getMe) // GET /persons/me
  .get("/athletes", requireAuth, athletesForCoach); // GET /persons/athletes (uses req.user.id)

// Admin routes (authentication required)
router
  .post("/", requireAuth, addPerson) // POST /persons
  .get("/", requireAuth, getAllPersons) // GET /persons
  .get("/:prsn_rk", requireAuth, getPerson) // GET /persons/:prsn_rk
  .put("/:prsn_rk/password", requireAuth, updatePassword) // PUT /persons/:prsn_rk/password
  .delete("/:prsn_rk", requireAuth, deletePerson); // DELETE /persons/:prsn_rk

module.exports = router;

/*
  Purpose: Program Athlete Assignments routes for editing the program_athlete_assignment table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  assignProgramToAthletes,
  getProgramAssignments,
  removeProgramFromAthlete,
  getAthletePrograms,
  getTrainingPeriodPrograms,
} = require("../controllers/program_athlete_assignments");

// All program athlete assignment routes require authentication
router.post("/programs/:prog_rk/assign", requireAuth, assignProgramToAthletes); // POST /program-athlete-assignments/programs/:prog_rk/assign
router.get(
  "/programs/:prog_rk/assignments",
  requireAuth,
  getProgramAssignments
); // GET /program-athlete-assignments/programs/:prog_rk/assignments
router.delete("/assignments/:paa_rk", requireAuth, removeProgramFromAthlete); // DELETE /program-athlete-assignments/assignments/:paa_rk
router.get(
  "/athletes/:athlete_prsn_rk/programs",
  requireAuth,
  getAthletePrograms
); // GET /program-athlete-assignments/athletes/:athlete_prsn_rk/programs
router.get(
  "/training-periods/:trpe_rk/programs",
  requireAuth,
  getTrainingPeriodPrograms
); // GET /program-athlete-assignments/training-periods/:trpe_rk/programs

module.exports = router;

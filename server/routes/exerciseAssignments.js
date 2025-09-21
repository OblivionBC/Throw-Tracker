/*
  Purpose: Exercise Assignments routes for editing the Exercise Assignment table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  getProgramsAndExerciseForTRPE,
  addExerciseAssignment,
  updateExerciseAssignment,
  deleteExerciseAssignment,
} = require("../controllers/exercise_assignments");

// All exercise assignment routes require authentication
router
  .post("/", requireAuth, addExerciseAssignment) // POST /exercise-assignments
  .get("/training-period/:trpe_rk", requireAuth, getProgramsAndExerciseForTRPE) // GET /exercise-assignments/training-period/:trpe_rk
  .put("/:assignment_rk", requireAuth, updateExerciseAssignment) // PUT /exercise-assignments/:assignment_rk
  .delete("/:assignment_rk", requireAuth, deleteExerciseAssignment); // DELETE /exercise-assignments/:assignment_rk

module.exports = router;

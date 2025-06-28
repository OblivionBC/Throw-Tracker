/*
  Purpose: Exercise Assignments routes for editing the Exercise Assignment table
*/

const router = require("express").Router();
const {
  getProgramsAndExerciseForTRPE,
  addExerciseAssignment,
  updateExerciseAssignment,
  deleteExerciseAssignment,
} = require("../controllers/exercise_assignments");

// RESTful routes
router
  .post("/", addExerciseAssignment) // POST /exercise-assignments
  .get("/training-period/:trpe_rk", getProgramsAndExerciseForTRPE) // GET /exercise-assignments/training-period/:trpe_rk
  .put("/:assignment_rk", updateExerciseAssignment) // PUT /exercise-assignments/:assignment_rk
  .delete("/:assignment_rk", deleteExerciseAssignment); // DELETE /exercise-assignments/:assignment_rk

module.exports = router;

/*
  Purpose: Exercises routes for editing the Exercise table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addExercise,
  getExercise,
  getAllExercises,
  getExerciseForCoach,
  deleteExercise,
  updateExercise,
} = require("../controllers/exercises");

// All exercise routes require authentication
router
  .post("/", requireAuth, addExercise) // POST /exercises
  .get("/", requireAuth, getAllExercises) // GET /exercises
  .get("/coach", requireAuth, getExerciseForCoach) // GET /exercises/coach (uses req.user.id)
  .get("/:excr_rk", requireAuth, getExercise) // GET /exercises/:excr_rk
  .put("/:excr_rk", requireAuth, updateExercise) // PUT /exercises/:excr_rk
  .delete("/:excr_rk", requireAuth, deleteExercise); // DELETE /exercises/:excr_rk

module.exports = router;

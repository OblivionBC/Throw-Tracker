/*
  Purpose: Exercises routes for editing the Exercise table
*/

const router = require("express").Router();
const {
  addExercise,
  getExercise,
  getAllExercises,
  getExerciseForCoach,
  deleteExercise,
  updateExercise,
} = require("../controllers/exercises");

// RESTful routes
router
  .post("/", addExercise) // POST /exercises
  .get("/", getAllExercises) // GET /exercises
  .get("/coach/:coach_prsn_rk", getExerciseForCoach) // GET /exercises/coach/:coach_prsn_rk
  .get("/:excr_rk", getExercise) // GET /exercises/:excr_rk
  .put("/:excr_rk", updateExercise) // PUT /exercises/:excr_rk
  .delete("/:excr_rk", deleteExercise); // DELETE /exercises/:excr_rk

module.exports = router;

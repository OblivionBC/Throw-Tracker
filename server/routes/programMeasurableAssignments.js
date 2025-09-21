/*
  Purpose: Program Measurable Assignments routes for editing the program_measurable_assignment table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addMeasurableToProgram,
  getProgramMeasurables,
  updateProgramMeasurable,
  removeMeasurableFromProgram,
  reorderProgramMeasurables,
  addMultipleMeasurablesToProgram,
} = require("../controllers/program_measurable_assignments");

// All program measurable assignment routes require authentication
router.post(
  "/programs/:prog_rk/measurables",
  requireAuth,
  addMeasurableToProgram
); // POST /program-measurable-assignments/programs/:prog_rk/measurables
router.post(
  "/programs/:prog_rk/measurables/batch",
  requireAuth,
  addMultipleMeasurablesToProgram
); // POST /program-measurable-assignments/programs/:prog_rk/measurables/batch
router.get(
  "/programs/:prog_rk/measurables",
  requireAuth,
  getProgramMeasurables
); // GET /program-measurable-assignments/programs/:prog_rk/measurables
router.put("/assignments/:prma_rk", requireAuth, updateProgramMeasurable); // PUT /program-measurable-assignments/assignments/:prma_rk
router.delete(
  "/assignments/:prma_rk",
  requireAuth,
  removeMeasurableFromProgram
); // DELETE /program-measurable-assignments/assignments/:prma_rk
router.put(
  "/programs/:prog_rk/reorder",
  requireAuth,
  reorderProgramMeasurables
); // PUT /program-measurable-assignments/programs/:prog_rk/reorder

module.exports = router;

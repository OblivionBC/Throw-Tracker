/*
  Purpose: Programs routes for editing the Program table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { checkProgramLimit } = require("../middleware/subscriptionLimits");
const {
  addProgram,
  getAllProgramsForCoach,
  getProgramDetails,
  getProgramsForTrainingPeriod,
  updateProgram,
  deleteProgram,
} = require("../controllers/programs");

// All program routes require authentication
router.post("/", requireAuth, checkProgramLimit, addProgram); // POST /programs
router.get("/", requireAuth, getAllProgramsForCoach); // GET /programs
router.get(
  "/training-period/:trpe_rk",
  requireAuth,
  getProgramsForTrainingPeriod
); // GET /programs/training-period/:trpe_rk
router.get("/:prog_rk", requireAuth, getProgramDetails); // GET /programs/:prog_rk
router.put("/:prog_rk", requireAuth, updateProgram); // PUT /programs/:prog_rk
router.delete("/:prog_rk", requireAuth, deleteProgram); // DELETE /programs/:prog_rk

module.exports = router;

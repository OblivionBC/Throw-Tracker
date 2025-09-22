/*
  Purpose: Training Periods routes for editing the Training Period table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addTrainingPeriod,
  getTrainingPeriod,
  getAllTrainingPeriods,
  deleteTrainingPeriod,
  updateTrainingPeriod,
  endDateMostRecentTrainingPeriod,
} = require("../controllers/trainingPeriods");

// All training period routes require authentication
router
  .post("/", requireAuth, addTrainingPeriod) // POST /training-periods
  .get("/", requireAuth, getAllTrainingPeriods) // GET /training-periods (uses req.user.id)
  .get("/person", requireAuth, getAllTrainingPeriods) // GET /training-periods/person (uses req.user.id)
  .get("/recent/end-date", requireAuth, endDateMostRecentTrainingPeriod) // GET /training-periods/recent/end-date
  .get("/:trpe_rk", requireAuth, getTrainingPeriod) // GET /training-periods/:trpe_rk
  .put("/:trpe_rk", requireAuth, updateTrainingPeriod) // PUT /training-periods/:trpe_rk
  .delete("/:trpe_rk", requireAuth, deleteTrainingPeriod); // DELETE /training-periods/:trpe_rk

module.exports = router;

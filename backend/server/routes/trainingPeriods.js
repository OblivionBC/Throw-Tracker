/*
  Purpose: Training Periods routes for editing the Training Period table
*/

const router = require("express").Router();
const {
  addTrainingPeriod,
  getTrainingPeriod,
  getAllTrainingPeriods,
  deleteTrainingPeriod,
  updateTrainingPeriod,
  endDateMostRecentTrainingPeriod,
} = require("../controllers/trainingPeriods");

// RESTful routes
router
  .post("/", addTrainingPeriod) // POST /training-periods
  .get("/", getAllTrainingPeriods) // GET /training-periods
  .get("/recent/end-date", endDateMostRecentTrainingPeriod) // GET /training-periods/recent/end-date
  .get("/:trpe_rk", getTrainingPeriod) // GET /training-periods/:trpe_rk
  .put("/:trpe_rk", updateTrainingPeriod) // PUT /training-periods/:trpe_rk
  .delete("/:trpe_rk", deleteTrainingPeriod); // DELETE /training-periods/:trpe_rk

module.exports = router;

/*
  Purpose: Measurements routes for editing the Measurement table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addMeasurement,
  getMeasurementsForPrac,
  deleteMeasurement,
  deleteMeasurementsForPrac,
  getmeasurementsForTRPEs,
  getMeasurementsForCoach,
  getMeasurementsForPerson,
} = require("../controllers/measurements");

// All measurement routes require authentication
router
  .post("/", requireAuth, addMeasurement) // POST /measurements
  .get("/practice/:prac_rk", requireAuth, getMeasurementsForPrac) // GET /measurements/practice/:prac_rk
  .get("/training-periods", requireAuth, getmeasurementsForTRPEs) // GET /measurements/training-periods
  .get("/coach", requireAuth, getMeasurementsForCoach) // GET /measurements/coach
  .get("/person/:prsn_rk", requireAuth, getMeasurementsForPerson) // GET /measurements/person/:prsn_rk
  .delete("/:meas_rk", requireAuth, deleteMeasurement) // DELETE /measurements/:meas_rk
  .delete("/practice/:prac_rk", requireAuth, deleteMeasurementsForPrac); // DELETE /measurements/practice/:prac_rk

module.exports = router;

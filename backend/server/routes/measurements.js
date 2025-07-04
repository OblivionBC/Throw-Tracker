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
} = require("../controllers/measurements");

// All measurement routes require authentication
router
  .post("/", requireAuth, addMeasurement) // POST /measurements
  .get("/practice/:prac_rk", requireAuth, getMeasurementsForPrac) // GET /measurements/practice/:prac_rk
  .get("/training-periods", requireAuth, getmeasurementsForTRPEs) // GET /measurements/training-periods
  .delete("/:meas_rk", requireAuth, deleteMeasurement) // DELETE /measurements/:meas_rk
  .delete("/practice/:prac_rk", requireAuth, deleteMeasurementsForPrac); // DELETE /measurements/practice/:prac_rk

module.exports = router;

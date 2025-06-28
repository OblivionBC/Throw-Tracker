/*
  Purpose: Measurements routes for editing the Measurement table
*/

const router = require("express").Router();
const {
  addMeasurement,
  getMeasurementsForPrac,
  deleteMeasurement,
  deleteMeasurementsForPrac,
  getmeasurementsForTRPEs,
} = require("../controllers/measurements");

// RESTful routes
router
  .post("/", addMeasurement) // POST /measurements
  .get("/practice/:prac_rk", getMeasurementsForPrac) // GET /measurements/practice/:prac_rk
  .get("/training-periods", getmeasurementsForTRPEs) // GET /measurements/training-periods
  .delete("/:meas_rk", deleteMeasurement) // DELETE /measurements/:meas_rk
  .delete("/practice/:prac_rk", deleteMeasurementsForPrac); // DELETE /measurements/practice/:prac_rk

module.exports = router;

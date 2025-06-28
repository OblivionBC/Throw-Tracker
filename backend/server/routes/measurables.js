/*
  Purpose: Measurables routes for editing the Measurable table
*/

const router = require("express").Router();
const {
  addMeasurable,
  getAllMeasurablesForPerson,
  getMeasurablesForPrac,
  updateMeasurable,
  deleteMeasurable,
} = require("../controllers/measurables");

// RESTful routes
router
  .post("/", addMeasurable) // POST /measurables
  .get("/person/:prsn_rk", getAllMeasurablesForPerson) // GET /measurables/person/:prsn_rk
  .get("/practice/:prac_rk", getMeasurablesForPrac) // GET /measurables/practice/:prac_rk
  .put("/:meas_rk", updateMeasurable) // PUT /measurables/:meas_rk
  .delete("/:meas_rk", deleteMeasurable); // DELETE /measurables/:meas_rk

module.exports = router;

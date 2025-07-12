/*
  Purpose: Measurables routes for editing the Measurable table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addMeasurable,
  getAllMeasurablesForPerson,
  getMeasurablesForPrac,
  updateMeasurable,
  deleteMeasurable,
  getMeasurablesForAthletes,
  getMeasurablesForCoach,
} = require("../controllers/measurables");

// All measurable routes require authentication
router
  .post("/", requireAuth, addMeasurable) // POST /measurables
  .get("/person", requireAuth, getAllMeasurablesForPerson) // GET /measurables/person (uses req.user.id)
  .get("/practice/:prac_rk", requireAuth, getMeasurablesForPrac) // GET /measurables/practice/:prac_rk
  .get("/athletes", requireAuth, getMeasurablesForAthletes) // GET /measurables/athletes
  .get("/coach", requireAuth, getMeasurablesForCoach) // GET /measurables/coach
  .put("/:meas_rk", requireAuth, updateMeasurable) // PUT /measurables/:meas_rk
  .delete("/:meas_rk", requireAuth, deleteMeasurable); // DELETE /measurables/:meas_rk

module.exports = router;

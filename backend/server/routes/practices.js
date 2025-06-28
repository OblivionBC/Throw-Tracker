/*
  Purpose: Practices routes for editing the Practice table
*/

const router = require("express").Router();
const {
  addPractice,
  getPractice,
  getAllPractices,
  getLastPractice,
  deletePractice,
  updatePractice,
  getPracticesInTrpe,
} = require("../controllers/practices");

// RESTful routes
router
  .post("/", addPractice) // POST /practices
  .get("/", getAllPractices) // GET /practices
  .get("/last", getLastPractice) // GET /practices/last
  .get("/training-period", getPracticesInTrpe) // GET /practices/training-period
  .get("/:prac_rk", getPractice) // GET /practices/:prac_rk
  .put("/:prac_rk", updatePractice) // PUT /practices/:prac_rk
  .delete("/:prac_rk", deletePractice); // DELETE /practices/:prac_rk

module.exports = router;

/*
  Purpose: Practices routes for editing the Practice table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addPractice,
  getPractice,
  getAllPractices,
  getLastPractice,
  deletePractice,
  updatePractice,
  getPracticesInTrpe,
} = require("../controllers/practices");

// All practice routes require authentication
router
  .post("/", requireAuth, addPractice) // POST /practices
  .get("/", requireAuth, getAllPractices) // GET /practices (uses req.user.id)
  .get("/last", requireAuth, getLastPractice) // GET /practices/last
  .get("/training-period/:trpe_rk", requireAuth, getPracticesInTrpe) // GET /practices/training-period
  .get("/:prac_rk", requireAuth, getPractice) // GET /practices/:prac_rk
  .put("/:prac_rk", requireAuth, updatePractice) // PUT /practices/:prac_rk
  .delete("/:prac_rk", requireAuth, deletePractice); // DELETE /practices/:prac_rk

module.exports = router;

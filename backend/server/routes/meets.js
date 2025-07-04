/*
  Purpose: Meets routes for editing the Meet table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addMeet,
  getMeet,
  getAllMeets,
  deleteMeet,
  updateMeet,
} = require("../controllers/meets");

// All meet routes require authentication
router
  .post("/", requireAuth, addMeet) // POST /meets
  .get("/", requireAuth, getAllMeets) // GET /meets
  .get("/:meet_rk", requireAuth, getMeet) // GET /meets/:meet_rk
  .put("/:meet_rk", requireAuth, updateMeet) // PUT /meets/:meet_rk
  .delete("/:meet_rk", requireAuth, deleteMeet); // DELETE /meets/:meet_rk

module.exports = router;

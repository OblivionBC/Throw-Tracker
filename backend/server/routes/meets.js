/*
  Purpose: Meets routes for editing the Meet table
*/

const router = require("express").Router();
const {
  addMeet,
  getMeet,
  getAllMeets,
  deleteMeet,
  updateMeet,
} = require("../controllers/meets");

// RESTful routes
router
  .post("/", addMeet) // POST /meets
  .get("/", getAllMeets) // GET /meets
  .get("/:meet_rk", getMeet) // GET /meets/:meet_rk
  .put("/:meet_rk", updateMeet) // PUT /meets/:meet_rk
  .delete("/:meet_rk", deleteMeet); // DELETE /meets/:meet_rk

module.exports = router;

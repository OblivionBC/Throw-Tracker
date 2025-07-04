/*
  Purpose: Programs routes for editing the Program table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { addProgram } = require("../controllers/programs");

// All program routes require authentication
router.post("/", requireAuth, addProgram); // POST /programs

module.exports = router;

/*
  Purpose: Programs routes for editing the Program table
*/

const router = require("express").Router();
const { addProgram } = require("../controllers/programs");

// RESTful routes
router.post("/", addProgram); // POST /programs

module.exports = router;

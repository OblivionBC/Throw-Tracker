/*
  Purpose: Persons routes for editing the Person table
*/

const router = require("express").Router();
const {
  addPerson,
  getPerson,
  getAllPersons,
  deletePerson,
  updatePassword,
  login,
  athletes,
} = require("../controllers/persons");

// RESTful routes
router
  .post("/", addPerson) // POST /persons
  .get("/", getAllPersons) // GET /persons
  .get("/athletes", athletes) // GET /persons/athletes
  .get("/:prsn_rk", getPerson) // GET /persons/:prsn_rk
  .put("/:prsn_rk/password", updatePassword) // PUT /persons/:prsn_rk/password
  .delete("/:prsn_rk", deletePerson) // DELETE /persons/:prsn_rk

  // Auth routes
  .post("/login", login); // POST /persons/login

module.exports = router;

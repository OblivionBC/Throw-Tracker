const router = require("express").Router();
const {
  addPerson,
  getPerson,
  getAllPersons,
  deletePerson,
  updatePerson,
} = require("../controllers/persons");

router
  .post("/add-person", addPerson)
  .get("/get-person/:prsn_rk", getPerson)
  .get("/get-all-persons", getAllPersons)
  .delete("/delete-person/:prsn_rk", deletePerson)
  .put("/update-person/:prsn_rk", updatePerson);

module.exports = router;

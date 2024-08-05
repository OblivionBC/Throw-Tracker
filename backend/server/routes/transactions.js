/*
  Purpose: Transactions holds all routes for editing the database and exports them with object router
*/

const router = require("express").Router();
const {
  addPerson,
  getPerson,
  getAllPersons,
  deletePerson,
  updatePerson,
} = require("../controllers/persons");

const {
  addPractice,
  getPractice,
  getAllPractices,
  deletePractice,
  updatePractice,
} = require("../controllers/practices");

const {
  addTrainingPeriod,
  getTrainingPeriod,
  getAlladdTrainingPeriods,
  deleteaddTrainingPeriod,
  updateaddTrainingPeriod,
} = require("../controllers/trainingPeriods");

router
  .post("/add-person", addPerson)
  .get("/get-person/:prsn_rk", getPerson)
  .get("/get-all-persons", getAllPersons)
  .delete("/delete-person/:prsn_rk", deletePerson)
  .put("/update-person/:prsn_rk", updatePerson)

  .post("/add-practice", addPractice)
  .get("/get-practice/:prac_rk", getPractice)
  .get("/get-all-practices", getAllPractices)
  .delete("/delete-practice/:prac_rk", deletePractice)
  .put("/update-practice/:prac_rk", updatePractice);

module.exports = router;

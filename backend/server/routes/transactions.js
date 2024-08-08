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
  getPracticesInTrpe,
} = require("../controllers/practices");

const {
  addTrainingPeriod,
  getTrainingPeriod,
  getAllTrainingPeriods,
  deleteTrainingPeriod,
  updateTrainingPeriod,
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
  .get("/get-practicesInTrpe/:trpe_rk", getPracticesInTrpe)
  .delete("/delete-practice/:prac_rk", deletePractice)
  .put("/update-practice/:prac_rk", updatePractice)

  .post("/add-trainingPeriod", addTrainingPeriod)
  .get("/get-trainingPeriod/:trpe_rk", getTrainingPeriod)
  .get("/get-all-trainingPeriods", getAllTrainingPeriods)
  .delete("/delete-trainingPeriod/:trpe_rk", deleteTrainingPeriod)
  .put("/update-trainingPeriod/:trpe_rk", updateTrainingPeriod);

module.exports = router;

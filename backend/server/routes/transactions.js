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
  getLastPractice,
  deletePractice,
  updatePractice,
  getPracticesWithImp,
  getPracticesInTrpe,
} = require("../controllers/practices");

const {
  addTrainingPeriod,
  getTrainingPeriod,
  getAllTrainingPeriods,
  deleteTrainingPeriod,
  updateTrainingPeriod,
} = require("../controllers/trainingPeriods");

const {
  addExercise,
  getExercise,
  getAllExercises,
  getExercisesInCurrentTRPE,
  deleteExercise,
  updateExercise,
} = require("../controllers/exercises");

const {
  addMeet,
  getMeet,
  getAllMeets,
  deleteMeet,
  updateMeet,
} = require("../controllers/meets");

const {
  addEvent,
  getEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} = require("../controllers/events");

router
  .post("/add-person", addPerson)
  .get("/get-person/:prsn_rk", getPerson)
  .get("/get-all-persons", getAllPersons)
  .delete("/delete-person/:prsn_rk", deletePerson)
  .put("/update-person/:prsn_rk", updatePerson)

  .post("/add-practice", addPractice)
  .get("/get-practice/:prac_rk", getPractice)
  .get("/get-all-practices", getAllPractices)
  .get("/get-last-practice", getLastPractice)
  .get("/get-practicesInTrpe/:trpe_rk", getPracticesInTrpe)
  .get("/get-practicesWithImp/:prac_implement", getPracticesWithImp)
  .delete("/delete-practice/:prac_rk", deletePractice)
  .put("/update-practice/:prac_rk", updatePractice)

  .post("/add-trainingPeriod", addTrainingPeriod)
  .get("/get-trainingPeriod/:trpe_rk", getTrainingPeriod)
  .get("/get-all-trainingPeriods", getAllTrainingPeriods)
  .delete("/delete-trainingPeriod/:trpe_rk", deleteTrainingPeriod)
  .put("/update-trainingPeriod/:trpe_rk", updateTrainingPeriod)

  .post("/add-excersise", addExercise)
  .get("/get-excersise/:excr_rk", getExercise)
  .get("/get-excersise/:trpe_rk", getAllExercises)
  .get("/get-exercisesInCurrentTRPE", getExercisesInCurrentTRPE)
  .delete("/delete-excercise/:excr_rk", deleteExercise)
  .put("/update-excercise/:excr_rk", updateExercise)

  .post("/add-meet", addMeet)
  .get("/get-meet/:meet_rk", getMeet)
  .get("/get-all-meets", getAllMeets)
  .delete("/delete-meet/:meet_rk", deleteMeet)
  .put("/update-meet/:meet_rk", updateMeet)

  .post("/add-event", addEvent)
  .get("/get-event/:even_rk", getEvent)
  .get("/get-all-event", getAllEvents)
  .delete("/delete-event/:even_rk", deleteEvent)
  .put("/update-event/:even_rk", updateEvent);
module.exports = router;

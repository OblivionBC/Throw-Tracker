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
  login,
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
  endDateMostRecentTrainingPeriod,
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

const {
  addMeasurable,
  getAllMeasurablesForPerson,
  getMeasurablesForPrac,
  updateMeasurable,
  deleteMeasurable,
} = require("../controllers/measurables");

const {
  addMeasurement,
  getMeasurementsForPrac,
  deleteMeasurement,
  deleteMeasurementsForPrac,
  getmeasurementsForTRPEs,
} = require("../controllers/measurements");

router
  .post("/add-person", addPerson)
  .get("/get-person/:prsn_rk", getPerson)
  .get("/get-all-persons", getAllPersons)
  .delete("/delete-person/:prsn_rk", deletePerson)
  .put("/update-person/:prsn_rk", updatePerson)
  .post("/login", login)

  .post("/add-practice", addPractice)
  .get("/get-practice/:prac_rk", getPractice)
  .post("/get-all-practices", getAllPractices)
  .get("/get-last-practice", getLastPractice)
  .get("/get-practicesInTrpe", getPracticesInTrpe)
  .delete("/delete-practice", deletePractice)
  .put("/update-practice", updatePractice)

  .post("/add-trainingPeriod", addTrainingPeriod)
  .get("/get-trainingPeriod/:trpe_rk", getTrainingPeriod)
  .post("/get-all-trainingPeriods", getAllTrainingPeriods)
  .delete("/delete-trainingPeriod", deleteTrainingPeriod)
  .put("/update-trainingPeriod", updateTrainingPeriod)
  .post("/endDateMostRecent_trainingPeriod", endDateMostRecentTrainingPeriod)

  .post("/add-excersise", addExercise)
  .get("/get-excersise/:excr_rk", getExercise)
  .get("/get-all-excersises/:trpe_rk", getAllExercises)
  .get("/get-exercisesInCurrentTRPE", getExercisesInCurrentTRPE)
  .delete("/delete-excercise/:excr_rk", deleteExercise)
  .put("/update-excercise/:excr_rk", updateExercise)

  .post("/add-measurable", addMeasurable)
  .get("/get-measurableForPrac", getMeasurablesForPrac)
  .post("/get-all-measurablesForPrsn", getAllMeasurablesForPerson)
  .delete("/delete-measurable", deleteMeasurable)
  .put("/update-measurable/:meas_rk", updateMeasurable)

  .post("/add-measurement", addMeasurement)
  .get("/get-measurementsForTRPEs", getmeasurementsForTRPEs)
  .get("/get-measurementsForPrac", getMeasurementsForPrac)
  .delete("/delete-measurement/:meas_rk", deleteMeasurement)
  .delete("/delete-measurements-for-practice", deleteMeasurementsForPrac)

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

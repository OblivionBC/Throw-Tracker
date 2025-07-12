// routes/index.js

const express = require("express");
const router = express.Router();

// Mount each feature router
router.use("/auth", require("./auth"));
router.use("/persons", require("./persons"));
router.use("/practices", require("./practices"));
router.use("/training-periods", require("./trainingPeriods"));
router.use("/exercises", require("./exercises"));
router.use("/meets", require("./meets"));
router.use("/events", require("./events"));
router.use("/measurables", require("./measurables"));
router.use("/measurements", require("./measurements"));
router.use("/exercise-assignments", require("./exerciseAssignments"));
router.use("/programs", require("./programs"));
router.use(
  "/program-athlete-assignments",
  require("./programAthleteAssignments")
);
router.use(
  "/program-measurable-assignments",
  require("./programMeasurableAssignments")
);

module.exports = router;

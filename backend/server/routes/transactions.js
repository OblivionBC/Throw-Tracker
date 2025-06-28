// routes/index.js

const express = require("express");
const router = express.Router();

// Mount each feature router
router.use("/persons", require("./persons"));
router.use("/practices", require("./practices"));
router.use("/training-periods", require("./trainingPeriods"));
router.use("/exercises", require("./exercises"));
router.use("/meets", require("./meets"));
router.use("/events", require("./events"));
router.use("/measurables", require("./measurables"));
router.use("/measurements", require("./measurements"));
router.use("/exercise-assignments", require("./exercise_assignments"));
router.use("/programs", require("./programs"));

module.exports = router;

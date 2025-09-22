const express = require("express");
const router = express.Router();

// Mount each feature router
router.use("/auth", require("./auth"));
router.use("/persons", require("./persons"));
router.use("/practices", require("./practices"));
router.use("/training-periods", require("./trainingPeriods"));
router.use("/exercises", require("./exercises"));
router.use("/meets", require("./meets"));
router.use("/meet-templates", require("./meetTemplates"));
router.use("/events", require("./events"));
router.use("/event-assignments", require("./eventAssignments"));
router.use("/event-types", require("./eventTypes"));
router.use("/athlete-event-assignments", require("./athleteEventAssignments"));
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
router.use("/subscriptions", require("./subscriptions"));
router.use("/admin", require("./admin"));

router.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
module.exports = router;

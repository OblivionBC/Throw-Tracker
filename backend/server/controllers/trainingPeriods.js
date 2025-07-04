/*
  Purpose: trainingPeriodss.js holds all the HTTP Requests for editing the TrainingPeriod Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");
const { TRPEDoesNotOverlap } = require("./rules");

exports.addTrainingPeriod = async (req, res) => {
  try {
    const { trpe_start_dt } = req.body;
    const prsn_rk = req.user.id;
    const overlap = await TRPEDoesNotOverlap(trpe_start_dt, prsn_rk);
    if (!overlap.pass) {
      return res.status(400).json({ message: overlap.message });
    }
    var newTrainingPeriod;

    console.log("Adding with End Date");
    newTrainingPeriod = await pool.query(
      "INSERT INTO training_period (trpe_start_dt, prsn_rk) VALUES($1, $2) RETURNING *",
      [trpe_start_dt, prsn_rk]
    );

    res.json(newTrainingPeriod.rows[0]);
    console.log("Adding Training Period for Person " + prsn_rk);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Adding Training Period." });
  }
};

exports.getAllTrainingPeriods = async (req, res) => {
  try {
    const prsn_rk = req.user.id;
    const allTrainingPeriods = await pool.query(
      "SELECT * FROM training_period WHERE prsn_rk = $1",
      [prsn_rk]
    );
    res.json(allTrainingPeriods.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Getting All Training Periods." });
  }
};

exports.getTrainingPeriod = async (req, res) => {
  try {
    const { trpe_rk } = req.params;
    const trainingPeriod = await pool.query(
      "SELECT * FROM training_period WHERE trpe_rk = $1",
      [trpe_rk]
    );

    res.json(trainingPeriod.rows[0]);
    console.log("Getting Training Period " + trpe_rk);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Getting Training Period." });
  }
};

exports.endDateMostRecentTrainingPeriod = async (req, res) => {
  try {
    const { trpe_end_dt } = req.body;
    const prsn_rk = req.user.id;
    const TrainingPeriod = await pool.query(
      "UPDATE training_period SET trpe_end_dt = $1 WHERE trpe_rk = ( SELECT trpe_rk FROM training_period where prsn_rk = $2 ORDER BY trpe_start_dt DESC LIMIT 1)",
      [trpe_end_dt, prsn_rk]
    );

    res.json(TrainingPeriod.rows);
    console.log("End Dating Most Recent Training Period for person " + prsn_rk);
    console.log(TrainingPeriod.rows);
  } catch (err) {
    console.error(
      "Error occurred while End Dating Most Recent Training Period for person" +
        prsn_rk +
        " Async Error:",
      err.message
    );
    res.status(500).json({
      message:
        "Error occurred while End Dating Most Recent Training Period for person " +
        prsn_rk,
    });
  }
};
exports.updateTrainingPeriod = async (req, res) => {
  try {
    const { trpe_rk, trpe_start_dt, trpe_end_dt } = req.body;
    const prsn_rk = req.user.id;
    //First we want to check that the start date is not overlapped by an existing trpe
    let overlapStart = await TRPEDoesNotOverlap(trpe_start_dt, prsn_rk);
    if (!overlapStart.pass) {
      overlapStart.message += " for Start Date";
      return res.status(400).json({ message: overlapStart.message });
    }
    //Next check if the end date is
    let overlapEnd = await TRPEDoesNotOverlap(trpe_end_dt, prsn_rk);
    if (!overlapEnd.pass) {
      overlapEnd.message += " for End Date";
      return res.status(400).json({ message: overlapEnd.message });
    }
    const updateTodo = await pool.query(
      "UPDATE training_period SET trpe_start_dt = $1, trpe_end_dt = $2 WHERE trpe_rk = $3",
      [trpe_start_dt, trpe_end_dt, trpe_rk]
    );
    res.json("Training Period was Updated");
    console.log("Updating Training Period " + trpe_rk);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Updating Training Period." });
  }
};

exports.deleteTrainingPeriod = async (req, res) => {
  try {
    const { trpe_rk } = req.params;
    const deleteTrainingPeriod = await pool.query(
      "DELETE FROM training_period WHERE trpe_rk = $1",
      [trpe_rk]
    );

    res.json("Training Period has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Deleting Training Period." });
  }
};

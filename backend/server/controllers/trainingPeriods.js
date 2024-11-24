/*
  Purpose: trainingPeriodss.js holds all the HTTP Requests for editing the TrainingPeriod Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addTrainingPeriod = async (req, res) => {
  try {
    const { trpe_start_dt, trpe_end_dt, prsn_rk } = req.body;
    var newTrainingPeriod;
    if (trpe_end_dt === "") {
      newTrainingPeriod = await pool.query(
        "INSERT INTO training_period tp (tp.trpe_start_dt, tp.trpe_end_dt, tp.prsn_rk) VALUES($1, $2, $3) RETURNING *",
        [trpe_start_dt, trpe_end_dt, prsn_rk]
      );
    } else {
      newTrainingPeriod = await pool.query(
        "INSERT INTO training_period (trpe_start_dt, trpe_end_dt, prsn_rk) VALUES($1, $2, $3) RETURNING *",
        [trpe_start_dt, trpe_end_dt, prsn_rk]
      );
    }

    res.json(newTrainingPeriod);
    console.log("Added training period to person " + prsn_rk);
  } catch (err) {
    console.error(
      "While adding training period to person Async Error:",
      err.message
    );
    res
      .status(500)
      .json({ message: "Error occurred while Adding Training Period." });
  }
};

exports.getAllTrainingPeriods = async (req, res) => {
  try {
    const { prsn_rk } = req.body;
    console.log("Getting");
    const allTrainingPeriod = await pool.query(
      "SELECT * FROM training_period where training_period.prsn_rk = $1",
      [prsn_rk]
    );
    res.json(allTrainingPeriod);
    console.log("Finding Training Periods For Person " + prsn_rk);
  } catch (err) {
    console.error(
      "Error occurred while Getting All TRPE Async Error:",
      err.message
    );
    res.status(500).json({ message: "Error occurred while Getting All TRPE." });
  }
};

exports.getTrainingPeriod = async (req, res) => {
  try {
    const { trpe_rk } = req.params;
    const TrainingPeriod = await pool.query(
      "SELECT * FROM training_period WHERE trpe_rk = $1",
      [trpe_rk]
    );

    res.json(TrainingPeriod.rows);
    console.log("Getting Training Period " + trpe_rk);
  } catch (err) {
    console.error(
      "Error occurred while Getting Training Period Async Error:",
      err.message
    );
    res
      .status(500)
      .json({ message: "Error occurred while Getting Training Period." });
  }
};

exports.endDateMostRecentTrainingPeriod = async (req, res) => {
  try {
    const { prsn_rk, trpe_end_dt } = req.body;
    const TrainingPeriod = await pool.query(
      "UPDATE training_period SET trpe_end_dt = $1 WHERE trpe_rk = ( SELECT trpe_rk FROM training_period where prsn_rk = $2 ORDER BY trpe_start_dt DESC LIMIT 1)",
      [trpe_end_dt, prsn_rk]
    );

    res.json(TrainingPeriod.rows);
    console.log("End Dating Most Recent Training Period for person " + prsn_rk);
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
    const updateTodo = await pool.query(
      "UPDATE training_period SET trpe_start_dt = $1, trpe_end_dt = $2 WHERE trpe_rk = $3",
      [trpe_start_dt, trpe_end_dt, trpe_rk]
    );
    res.json("TrainingPeriod was Updated");
    console.log("Updated Training Period " + trpe_rk);
  } catch (err) {
    console.error(
      "Error occurred while Updating Training Period " +
        trpe_rk +
        " Async Error:",
      err.message
    );
    res
      .status(500)
      .json({ message: "Error occurred while Updating Training Period." });
  }
};

exports.deleteTrainingPeriod = async (req, res) => {
  try {
    const { trpe_rk } = req.body;
    const deleteTrainingPeriod = await pool.query(
      "DELETE FROM training_period WHERE trpe_rk = $1",
      [trpe_rk]
    );
    res.json("TrainingPeriod has been Deleted");
    console.log("Training Period with row key " + trpe_rk + " deleted");
  } catch (err) {
    console.error(
      "Error occurred while Deleting Training Period" +
        trpe_rk +
        " Async Error:",
      err.message
    );
    res
      .status(500)
      .json({ message: "Error occurred while Deleting Training Period." });
  }
};

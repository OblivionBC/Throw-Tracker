/*
  Purpose: trainingPeriodss.js holds all the HTTP Requests for editing the TrainingPeriod Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addTrainingPeriod = async (req, res) => {
  try {
    console.log(req.body);
    const { trpe_start_dt, trpe_end_dt, prsn_rk } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newTrainingPeriod = await pool.query(
      "INSERT INTO training_period (trpe_start_dt, trpe_end_dt, prsn_rk) VALUES($1, $2, $3) RETURNING *",
      [trpe_start_dt, trpe_end_dt, prsn_rk]
    );

    res.json(newTrainingPeriod);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Adding Training Period." });
  }
};

exports.getAllTrainingPeriods = async (req, res) => {
  try {
    const allTrainingPeriod = await pool.query("SELECT * FROM training_period");
    res.json(allTrainingPeriod);
  } catch (err) {
    console.error("Async Error:", err.message);
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
    console.log(req.params);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Getting Training Period." });
  }
};

exports.updateTrainingPeriod = async (req, res) => {
  try {
    const { trpe_rk } = req.params;
    const { trpe_start_dt, trpe_end_dt, prsn_rk } = req.body;
    const updateTodo = await pool.query(
      "UPDATE training_period SET trpe_start_dt = $1, trpe_end_dt = $2, prsn_rk = $3 WHERE trpe_rk = $4",
      [trpe_start_dt, trpe_end_dt, prsn_rk, trpe_rk]
    );
    res.json("TrainingPeriod was Updated");
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Updating Training Period." });
  }
};

exports.deleteTrainingPeriod = async (req, res) => {
  try {
    const { trpe_rk } = req.params;
    const deleteRelatedPractices = await pool.query(
      "DELETE FROM practice WHERE trpe_rk = $1",
      [trpe_rk]
    );
    const deleteTrainingPeriod = await pool.query(
      "DELETE FROM training_period WHERE trpe_rk = $1",
      [trpe_rk]
    );
    res.json("TrainingPeriod has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Deleting Training Period." });
  }
};

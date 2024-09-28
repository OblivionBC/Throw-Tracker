/*
  Purpose: Exercises.js holds all the HTTP Requests for editing the Exercise Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addExercise = async (req, res) => {
  try {
    console.log(req.body);
    const { excr_nm, excr_reps, excr_sets, excr_weight, excr_notes, trpe_rk } =
      req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newExercise = await pool.query(
      "INSERT INTO Exercise (excr_nm, excr_reps, excr_sets, excr_weight, excr_notes, trpe_rk) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [excr_nm, excr_reps, excr_sets, excr_weight, excr_notes, trpe_rk]
    );

    res.json(newExercise);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Adding Exercise." });
  }
};

exports.getAllExercises = async (req, res) => {
  try {
    const allExercises = await pool.query("SELECT * FROM Exercise");
    res.json(allExercises);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred getting All Exercises." });
  }
};

exports.getExercisesInCurrentTRPE = async (req, res) => {
  try {
    const allExercises = await pool.query(
      "SELECT * FROM Exercise excr join training_period trpe on excr.trpe_rk = trpe.trpe_rk where trpe.trpe_end_dt is null and trpe.trpe_start_dt < current_date "
    );
    res.json(allExercises);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Getting Exercise from current TRPE." });
  }
};

exports.getExercise = async (req, res) => {
  try {
    const { excr_rk } = req.params;
    const Exercise = await pool.query(
      "SELECT * FROM Exercise WHERE excr_rk = $1",
      [excr_rk]
    );

    res.json(Exercise.rows);
    console.log(req.params);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Getting Exercise." });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { excr_rk } = req.params;
    const { excr_nm, excr_reps, excr_sets, excr_weight, excr_notes, trpe_rk } =
      req.body;
    const updateTodo = await pool.query(
      "UPDATE Exercise SET excr_nm = $1, excr_reps = $2, excr_sets = $3, excr_weight = $4, excr_notes = $5, trpe_rk = $6 WHERE excr_rk = $7",
      [excr_nm, excr_reps, excr_sets, excr_weight, excr_notes, trpe_rk, excr_rk]
    );
    res.json("Exercise was Updated");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Updating Exercise." });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { excr_rk } = req.params;
    const deleteExercise = await pool.query(
      "DELETE FROM Exercise WHERE excr_rk = $1",
      [prsn_rk]
    );

    res.json("Exercise has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Exercise." });
  }
};

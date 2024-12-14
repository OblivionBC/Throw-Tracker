/*
  Purpose: Exercises.js holds all the HTTP Requests for editing the Exercise Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addExercise = async (req, res) => {
  try {
    const { excr_nm, excr_notes, coach_prsn_rk, excr_units } = req.body;
    console.log("Adding exercise " + excr_nm + " for coach " + coach_prsn_rk);
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newExercise = await pool.query(
      "INSERT INTO Exercise (excr_nm, excr_notes, coach_prsn_rk, excr_units) VALUES($1, $2, $3, $4) RETURNING *",
      [excr_nm, excr_notes, coach_prsn_rk, excr_units]
    );

    res.json(newExercise);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: err.message });
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

exports.getExerciseForCoach = async (req, res) => {
  try {
    const { coach_prsn_rk } = req.body;

    const allExercises = await pool.query(
      "SELECT * FROM Exercise where coach_prsn_rk = $1;",
      [coach_prsn_rk]
    );
    res.json(allExercises);
  } catch (err) {
    console.error("Async Error:", err.message);
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
    const { excr_rk, excr_nm, excr_notes } = req.body;
    console.log("Updating exercise " + excr_rk + " : " + excr_nm);
    const updateTodo = await pool.query(
      "UPDATE Exercise SET excr_nm = $1, excr_notes = $2 WHERE excr_rk = $3",
      [excr_nm, excr_notes, excr_rk]
    );
    res.json("Exercise was Updated");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { excr_rk } = req.body;
    console.log("Deleting exercise " + excr_rk);
    const deleteExercise = await pool.query(
      "DELETE FROM Exercise WHERE excr_rk = $1",
      [excr_rk]
    );

    res.json("Exercise has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Exercise." });
  }
};

/*
  Purpose: Exercises.js holds all the HTTP Requests for editing the Exercise Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

// Input validation helper
const validateExerciseData = (data) => {
  const errors = [];
  if (!data.excr_nm || data.excr_nm.trim() === "") {
    errors.push("Exercise name is required");
  }
  if (!data.coach_prsn_rk) {
    errors.push("Coach person rank is required");
  }
  if (!data.excr_units || data.excr_units.trim() === "") {
    errors.push("Exercise units are required");
  }
  return errors;
};

exports.addExercise = async (req, res) => {
  try {
    const { excr_nm, excr_notes, coach_prsn_rk, excr_units } = req.body;

    // Input validation
    const validationErrors = validateExerciseData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    console.log("Adding exercise " + excr_nm + " for coach " + coach_prsn_rk);

    const newExercise = await pool.query(
      "INSERT INTO Exercise (excr_nm, excr_notes, coach_prsn_rk, excr_units) VALUES($1, $2, $3, $4) RETURNING *",
      [excr_nm, excr_notes, coach_prsn_rk, excr_units]
    );

    res.status(201).json(newExercise.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllExercises = async (req, res) => {
  try {
    const allExercises = await pool.query("SELECT * FROM Exercise");
    res.json(allExercises.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred getting All Exercises." });
  }
};

exports.getExerciseForCoach = async (req, res) => {
  try {
    const { coach_prsn_rk } = req.params;

    if (!coach_prsn_rk) {
      return res.status(400).json({ message: "Coach person rank is required" });
    }

    const allExercises = await pool.query(
      "SELECT * FROM Exercise where coach_prsn_rk = $1;",
      [coach_prsn_rk]
    );
    res.json(allExercises.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting exercises for coach." });
  }
};

exports.getExercise = async (req, res) => {
  try {
    const { excr_rk } = req.params;

    if (!excr_rk) {
      return res.status(400).json({ message: "Exercise rank is required" });
    }

    const exercise = await pool.query(
      "SELECT * FROM Exercise WHERE excr_rk = $1",
      [excr_rk]
    );

    if (exercise.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Getting Exercise." });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { excr_rk, excr_nm, excr_notes } = req.body;

    // Input validation
    if (!excr_rk) {
      return res.status(400).json({ message: "Exercise rank is required" });
    }
    if (!excr_nm || excr_nm.trim() === "") {
      return res.status(400).json({ message: "Exercise name is required" });
    }

    console.log("Updating exercise " + excr_rk + " : " + excr_nm);

    const updateExercise = await pool.query(
      "UPDATE Exercise SET excr_nm = $1, excr_notes = $2 WHERE excr_rk = $3 RETURNING *",
      [excr_nm, excr_notes, excr_rk]
    );

    if (updateExercise.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json({ success: true, exercise: updateExercise.rows[0] });
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { excr_rk } = req.params;

    if (!excr_rk) {
      return res.status(400).json({ message: "Exercise rank is required" });
    }

    console.log("Deleting exercise " + excr_rk);

    const deleteExercise = await pool.query(
      "DELETE FROM Exercise WHERE excr_rk = $1 RETURNING *",
      [excr_rk]
    );

    if (deleteExercise.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json({ success: true, message: "Exercise has been deleted" });
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Exercise." });
  }
};

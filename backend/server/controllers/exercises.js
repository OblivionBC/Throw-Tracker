/*
  Purpose: Exercises.js holds all the HTTP Requests for editing the Exercise Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

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

exports.addExercise = asyncHandler(async (req, res) => {
  const { excr_nm, excr_notes, excr_units } = req.body;
  const coach_prsn_rk = req.user.id;

  // Input validation
  const validationErrors = validateExerciseData({
    ...req.body,
    coach_prsn_rk,
  });
  if (validationErrors.length > 0) {
    throw new ValidationError(validationErrors.join(", "));
  }

  const newExercise = await pool.query(
    "INSERT INTO Exercise (excr_nm, excr_notes, coach_prsn_rk, excr_units) VALUES($1, $2, $3, $4) RETURNING *",
    [excr_nm, excr_notes, coach_prsn_rk, excr_units]
  );

  res.status(201).json(newExercise.rows[0]);
});

exports.getAllExercises = asyncHandler(async (req, res) => {
  const allExercises = await pool.query("SELECT * FROM Exercise");
  res.json(allExercises.rows);
});

exports.getExerciseForCoach = asyncHandler(async (req, res) => {
  const coach_prsn_rk = req.user.id;

  const allExercises = await pool.query(
    "SELECT * FROM Exercise where coach_prsn_rk = $1;",
    [coach_prsn_rk]
  );
  res.json(allExercises.rows);
});

exports.getExercise = asyncHandler(async (req, res) => {
  const { excr_rk } = req.params;

  if (!excr_rk) {
    throw new ValidationError("Exercise rank is required");
  }

  const exercise = await pool.query(
    "SELECT * FROM Exercise WHERE excr_rk = $1",
    [excr_rk]
  );

  if (exercise.rows.length === 0) {
    throw new NotFoundError("Exercise");
  }

  res.json(exercise.rows[0]);
});

exports.updateExercise = asyncHandler(async (req, res) => {
  const { excr_rk, excr_nm, excr_notes } = req.body;

  // Input validation
  if (!excr_rk) {
    throw new ValidationError("Exercise rank is required");
  }
  if (!excr_nm || excr_nm.trim() === "") {
    throw new ValidationError("Exercise name is required");
  }

  const updateExercise = await pool.query(
    "UPDATE Exercise SET excr_nm = $1, excr_notes = $2 WHERE excr_rk = $3 RETURNING *",
    [excr_nm, excr_notes, excr_rk]
  );

  if (updateExercise.rows.length === 0) {
    throw new NotFoundError("Exercise");
  }

  res.json({ success: true, exercise: updateExercise.rows[0] });
});

exports.deleteExercise = asyncHandler(async (req, res) => {
  const { excr_rk } = req.params;

  if (!excr_rk) {
    throw new ValidationError("Exercise rank is required");
  }

  const deleteExercise = await pool.query(
    "DELETE FROM Exercise WHERE excr_rk = $1 RETURNING *",
    [excr_rk]
  );

  if (deleteExercise.rows.length === 0) {
    throw new NotFoundError("Exercise");
  }

  res.json({ success: true, message: "Exercise has been deleted" });
});

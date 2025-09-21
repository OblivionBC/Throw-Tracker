/*
  Purpose: exercise_assignments.js holds all the HTTP Requests for editing the exercise_assignment Table
      The table is selected through the SQL Queries
*/
const { pool } = require("../db");
const { addMeasurable } = require("./measurables");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");
exports.addExerciseAssignment = asyncHandler(async (req, res) => {
  const {
    prog_rk,
    athlete_prsn_rk,
    exas_notes,
    excr_rk,
    exas_reps,
    exas_sets,
    exas_weight,
    is_measurable,
  } = req.body;
  const assigner_prsn_rk = req.user.id;

  if (!prog_rk || !athlete_prsn_rk || !excr_rk) {
    throw new ValidationError("Program, athlete, and exercise are required");
  }

  let meas_rk = undefined;

  // Make a measurable for the person
  if (is_measurable === true) {
    const getExercise = await pool.query(
      "SELECT * FROM exercise WHERE excr_rk = $1",
      [excr_rk]
    );

    if (getExercise.rowCount <= 0) {
      throw new NotFoundError("Exercise");
    }

    // Check if measurable already exists, if it does link the rk, else make a new one
    const alreadyExists = await pool.query(
      "SELECT meas_rk FROM measurable WHERE meas_id = $1 AND prsn_rk = $2",
      [getExercise.rows[0].excr_nm, athlete_prsn_rk]
    );

    if (alreadyExists.rowCount === 0) {
      // There is no existing Measurable, so create one
      const measurableResult = await addMeasurable(
        {
          body: {
            meas_id: getExercise.rows[0].excr_nm,
            meas_typ: getExercise.rows[0].excr_typ,
            meas_unit: getExercise.rows[0].excr_units,
            prsn_rk: athlete_prsn_rk,
          },
        },
        res
      );

      if (measurableResult.status !== 200) {
        throw new ValidationError(measurableResult.message);
      }

      meas_rk = measurableResult.data.rows[0].meas_rk;
    } else {
      meas_rk = alreadyExists.rows[0].meas_rk;
    }
  }

  let measure = "";
  is_measurable === true ? (measure = "Y") : (measure = "N");

  const newExercise = await pool.query(
    "INSERT INTO exercise_assignment (prog_rk, athlete_prsn_rk, assigner_prsn_rk, exas_notes, excr_rk, exas_reps, exas_sets, exas_weight, is_measurable, meas_rk) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    [
      prog_rk,
      athlete_prsn_rk,
      assigner_prsn_rk,
      exas_notes,
      excr_rk,
      exas_reps,
      exas_sets,
      exas_weight,
      measure,
      meas_rk,
    ]
  );

  res.json(newExercise.rows[0]);
});

exports.getExerciseAssignmentsInProgram = asyncHandler(async (req, res) => {
  const { prog_rk } = req.body;

  if (!prog_rk) {
    throw new ValidationError("Program key is required");
  }

  const allExercises = await pool.query(
    "SELECT * FROM exercise_assignment exas JOIN program prog ON exas.prog_rk = prog.prog_rk WHERE prog.prog_rk = $1",
    [prog_rk]
  );

  res.json(allExercises.rows);
});

exports.getProgramsAndExerciseForTRPE = asyncHandler(async (req, res) => {
  const { trpe_rk } = req.params;

  if (!trpe_rk) {
    throw new ValidationError("Training period key is required");
  }

  const allExercises = await pool.query(
    "SELECT prog.prog_rk, prog.prog_nm, excr.excr_nm, exas.excr_rk, exas.exas_rk, exas.meas_rk, exas.exas_reps, exas.exas_sets, exas.exas_weight, excr.excr_notes, exas.exas_notes, exas.is_measurable FROM program prog LEFT JOIN exercise_assignment exas ON exas.prog_rk = prog.prog_rk LEFT JOIN exercise excr ON excr.excr_rk = exas.excr_rk WHERE prog.trpe_rk = $1",
    [trpe_rk]
  );

  res.json(allExercises.rows);
});

exports.getExerciseAssignment = asyncHandler(async (req, res) => {
  const { exas_rk } = req.body;

  if (!exas_rk) {
    throw new ValidationError("Exercise assignment key is required");
  }

  const ExerciseAssignment = await pool.query(
    "SELECT * FROM exercise_assignment WHERE exas_rk = $1",
    [exas_rk]
  );

  if (ExerciseAssignment.rows.length === 0) {
    throw new NotFoundError("Exercise assignment");
  }

  res.json(ExerciseAssignment.rows[0]);
});

exports.updateExerciseAssignment = asyncHandler(async (req, res) => {
  const {
    athlete_prsn_rk,
    exas_notes,
    exas_rk,
    excr_rk,
    exas_reps,
    exas_sets,
    exas_weight,
    is_measurable,
    add_measurable,
  } = req.body;

  if (!exas_rk || !excr_rk) {
    throw new ValidationError(
      "Exercise assignment key and exercise key are required"
    );
  }

  let meas_rk = null;

  // Make a measurable for the person
  if (is_measurable === true && add_measurable === true) {
    const getExercise = await pool.query(
      "SELECT * FROM exercise WHERE excr_rk = $1",
      [excr_rk]
    );

    if (getExercise.rowCount <= 0) {
      throw new NotFoundError("Exercise");
    }

    // Check if measurable already exists, if it does link the rk, else make a new one
    const alreadyExists = await pool.query(
      "SELECT meas_rk FROM measurable WHERE meas_id = $1 AND prsn_rk = $2",
      [getExercise.rows[0].excr_nm, athlete_prsn_rk]
    );

    if (alreadyExists.rowCount === 0) {
      // There is no existing Measurable, so create one
      const measurableResult = await addMeasurable(
        {
          body: {
            meas_id: getExercise.rows[0].excr_nm,
            meas_typ: getExercise.rows[0].excr_typ,
            meas_unit: getExercise.rows[0].excr_units,
            prsn_rk: athlete_prsn_rk,
          },
        },
        res
      );

      if (measurableResult.status !== 200) {
        throw new ValidationError(measurableResult.message);
      }

      meas_rk = measurableResult.data.rows[0].meas_rk;
    } else {
      meas_rk = alreadyExists.rows[0].meas_rk;
    }
  }

  let measure = "";
  is_measurable === true ? (measure = "Y") : (measure = "N");

  const result = await pool.query(
    "UPDATE exercise_assignment SET exas_notes = $1, excr_rk = $2, exas_reps = $4, exas_sets = $5, exas_weight = $6, is_measurable = $7, meas_rk = $8 WHERE exas_rk = $3",
    [
      exas_notes,
      excr_rk,
      exas_rk,
      exas_reps,
      exas_sets,
      exas_weight,
      measure,
      meas_rk,
    ]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError("Exercise assignment");
  }

  res.json({ message: "Exercise assignment was updated successfully" });
});

exports.deleteExerciseAssignment = asyncHandler(async (req, res) => {
  const { exas_rk } = req.body;

  if (!exas_rk) {
    throw new ValidationError("Exercise assignment key is required");
  }

  const result = await pool.query(
    "DELETE FROM exercise_assignment WHERE exas_rk = $1",
    [exas_rk]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError("Exercise assignment");
  }

  res.json({ message: "Exercise assignment has been deleted successfully" });
});

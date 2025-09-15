/*
  Purpose: Measurables.js holds all the HTTP Requests for editing the Measurable Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.addMeasurable = asyncHandler(async (req, res) => {
  const { meas_id, meas_typ, meas_unit } = req.body;
  const prsn_rk = req.user.id;

  if (!meas_id || !meas_typ || !meas_unit) {
    throw new ValidationError("Measurable ID, type, and unit are required");
  }

  const alreadyExists = await pool.query(
    "SELECT * FROM measurable WHERE meas_id = $1 AND prsn_rk = $2",
    [meas_id, prsn_rk]
  );

  if (alreadyExists.rowCount > 0) {
    throw new ConflictError("A measurable with this name already exists");
  }

  const newMeasurable = await pool.query(
    "INSERT INTO measurable (meas_id, meas_typ, meas_unit, prsn_rk) VALUES($1, $2, $3, $4) RETURNING *",
    [meas_id, meas_typ, meas_unit, prsn_rk]
  );

  res.json(newMeasurable.rows[0]);
});

exports.getAllMeasurablesForPerson = asyncHandler(async (req, res) => {
  const prsn_rk = req.user.id;

  const measurables = await pool.query(
    "SELECT m.* FROM measurable m WHERE m.prsn_rk = $1",
    [prsn_rk]
  );

  res.json(measurables.rows);
});

exports.getMeasurablesForPrac = asyncHandler(async (req, res) => {
  const decodedArray = decodeURIComponent(req.query.key);
  const key = JSON.parse(decodedArray);

  if (!key) {
    throw new ValidationError("Practice key is required");
  }

  const measurables = await pool.query(
    "SELECT p.prac_dt, p.prac_rk, p.trpe_rk, me.meas_id, me.meas_unit, m.msrm_value FROM practice p JOIN measurement m ON m.prac_rk = p.prac_rk JOIN measurable me ON me.meas_rk = m.meas_rk WHERE p.prac_rk = $1",
    [key]
  );

  res.json(measurables.rows);
});

exports.updateMeasurable = asyncHandler(async (req, res) => {
  const { meas_id, meas_typ, meas_unit, meas_rk } = req.body;

  if (!meas_id || !meas_typ || !meas_unit || !meas_rk) {
    throw new ValidationError(
      "Measurable ID, type, unit, and measurable key are required"
    );
  }

  const result = await pool.query(
    "UPDATE measurable SET meas_id = $1, meas_typ = $2, meas_unit = $3 WHERE meas_rk = $4",
    [meas_id, meas_typ, meas_unit, meas_rk]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError("Measurable not found");
  }

  res.json({ message: "Measurable was updated successfully" });
});

exports.deleteMeasurable = asyncHandler(async (req, res) => {
  const { meas_rk } = req.body;

  if (!meas_rk) {
    throw new ValidationError("Measurable key is required");
  }

  const result = await pool.query("DELETE FROM measurable WHERE meas_rk = $1", [
    meas_rk,
  ]);

  if (result.rowCount === 0) {
    throw new NotFoundError("Measurable not found");
  }

  res.json({ message: "Measurable has been deleted successfully" });
});

exports.getAllMeasurables = asyncHandler(async (req, res) => {
  const prsn_rk = req.user.id;

  const allMeasurables = await pool.query(
    "SELECT * FROM measurable WHERE prsn_rk = $1",
    [prsn_rk]
  );

  res.json(allMeasurables.rows);
});

exports.getMeasurable = asyncHandler(async (req, res) => {
  const { meas_rk } = req.params;

  if (!meas_rk) {
    throw new ValidationError("Measurable key is required");
  }

  const measurable = await pool.query(
    "SELECT * FROM measurable WHERE meas_rk = $1",
    [meas_rk]
  );

  if (measurable.rows.length === 0) {
    throw new NotFoundError("Measurable not found");
  }

  res.json(measurable.rows[0]);
});

exports.getMeasurablesForAthletes = asyncHandler(async (req, res) => {
  const coach_prsn_rk = req.user.id;

  // Get all athletes for this coach and their measurables
  const measurables = await pool.query(
    `SELECT 
      m.meas_rk,
      m.meas_id,
      m.meas_typ,
      m.meas_unit,
      p.prsn_rk as athlete_prsn_rk,
      p.prsn_first_nm,
      p.prsn_last_nm
    FROM measurable m
    INNER JOIN person p ON m.prsn_rk = p.prsn_rk
    WHERE p.coach_prsn_rk = $1
    ORDER BY p.prsn_first_nm, p.prsn_last_nm, m.meas_id`,
    [coach_prsn_rk]
  );

  res.json(measurables.rows);
});

exports.getMeasurablesForCoach = asyncHandler(async (req, res) => {
  const coach_prsn_rk = req.user.id;

  // Get all measurables created by this coach
  const measurables = await pool.query(
    `SELECT 
      m.meas_rk,
      m.meas_id,
      m.meas_typ,
      m.meas_unit
    FROM measurable m
    WHERE m.prsn_rk = $1
    ORDER BY m.meas_id`,
    [coach_prsn_rk]
  );

  res.json(measurables.rows);
});

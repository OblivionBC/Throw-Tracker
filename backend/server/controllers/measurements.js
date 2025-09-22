/*
  Purpose: Measurements.js holds all the HTTP Requests for editing the Measurement Table
      The table is selected through the SQL Queries
*/
const { pool } = require("../db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.addMeasurement = asyncHandler(async (req, res) => {
  const { msrm_value, prac_rk, meas_rk } = req.body;

  if (!msrm_value || !prac_rk || !meas_rk) {
    throw new ValidationError(
      "Measurement value, practice key, and measurable key are required"
    );
  }

  const newMeasurement = await pool.query(
    "INSERT INTO Measurement (msrm_value, prac_rk, meas_rk) VALUES($1, $2, $3) RETURNING *",
    [msrm_value, prac_rk, meas_rk]
  );

  res.json(newMeasurement.rows[0]);
});

exports.getMeasurementsForPrac = asyncHandler(async (req, res) => {
  const { prac_rk } = req.params;

  if (!prac_rk) {
    throw new ValidationError("Practice key is required");
  }

  const Measurements = await pool.query(
    "SELECT m.*, msrm.msrm_value FROM measurement msrm INNER JOIN measurable m ON m.meas_rk = msrm.meas_rk INNER JOIN practice p ON p.prac_rk = msrm.prac_rk WHERE msrm.prac_rk = $1 ORDER BY p.prac_dt ASC",
    [prac_rk]
  );

  res.json(Measurements.rows);
});

exports.getmeasurementsForTRPEs = asyncHandler(async (req, res) => {
  const decodedArray = decodeURIComponent(req.query.keys);
  const keys = JSON.parse(decodedArray);

  if (!keys || !Array.isArray(keys)) {
    throw new ValidationError("Training period keys array is required");
  }

  const measurements = await pool.query(
    "SELECT msrm.msrm_rk, msrm.prac_rk, m.meas_id, msrm.msrm_value, m.meas_unit, m.prsn_rk, p.prac_rk, p.trpe_rk, p.prac_dt FROM measurement msrm INNER JOIN measurable m ON m.meas_rk = msrm.meas_rk INNER JOIN practice p ON p.prac_rk = msrm.prac_rk WHERE p.trpe_rk = ANY($1) ORDER BY p.prac_dt DESC",
    [keys]
  );

  res.json(measurements.rows);
});

exports.deleteMeasurement = asyncHandler(async (req, res) => {
  const { msrm_rk } = req.params;

  if (!msrm_rk) {
    throw new ValidationError("Measurement key is required");
  }

  const result = await pool.query(
    "DELETE FROM Measurement WHERE msrm_rk = $1",
    [msrm_rk]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError("Measurement not found");
  }

  res.json({ message: "Measurement has been deleted successfully" });
});

exports.deleteMeasurementsForPrac = asyncHandler(async (req, res) => {
  const { prac_rk } = req.body;

  if (!prac_rk) {
    throw new ValidationError("Practice key is required");
  }

  const result = await pool.query(
    "DELETE FROM Measurement WHERE prac_rk = $1",
    [prac_rk]
  );

  res.json({
    message: `Measurements have been deleted for practice ${prac_rk}`,
  });
});

// Get measurements for all athletes under a coach
exports.getMeasurementsForCoach = asyncHandler(async (req, res) => {
  const coach_prsn_rk = req.user.id;
  const { athlete_prsn_rk } = req.query; // Optional filter by specific athlete

  let query = `
    SELECT 
      msrm.msrm_rk, 
      msrm.prac_rk, 
      m.meas_id, 
      msrm.msrm_value, 
      m.meas_unit, 
      m.prsn_rk, 
      p.prac_rk, 
      p.trpe_rk, 
      p.prac_dt,
      athlete.prsn_first_nm as athlete_first_nm,
      athlete.prsn_last_nm as athlete_last_nm
    FROM measurement msrm 
    INNER JOIN measurable m ON m.meas_rk = msrm.meas_rk 
    INNER JOIN practice p ON p.prac_rk = msrm.prac_rk 
    INNER JOIN training_period tp ON tp.trpe_rk = p.trpe_rk
    INNER JOIN person athlete ON tp.prsn_rk = athlete.prsn_rk
    WHERE athlete.coach_prsn_rk = $1
  `;

  let params = [coach_prsn_rk];

  if (athlete_prsn_rk) {
    query += " AND athlete.prsn_rk = $2";
    params.push(athlete_prsn_rk);
  }

  query += " ORDER BY p.prac_dt DESC";

  const measurements = await pool.query(query, params);

  res.json(measurements.rows);
});

// Get all measurements for a specific person
exports.getMeasurementsForPerson = asyncHandler(async (req, res) => {
  const { prsn_rk } = req.params;

  if (!prsn_rk) {
    throw new ValidationError("Person ID (prsn_rk) is required");
  }

  const query = `
    SELECT 
      m.meas_rk,
      m.msrm_value,
      p.prac_rk,
      p.prac_dt,
      p.notes as prac_notes,
      meas.meas_id,
      meas.meas_unit,
      meas.meas_typ
    FROM measurement m
    INNER JOIN practice p ON m.prac_rk = p.prac_rk
    INNER JOIN measurable meas ON m.meas_rk = meas.meas_rk
    INNER JOIN training_period tp ON tp.trpe_rk = p.trpe_rk
    WHERE tp.prsn_rk = $1
    ORDER BY p.prac_dt DESC, meas.meas_id ASC
  `;

  const measurements = await pool.query(query, [prsn_rk]);

  res.json(measurements.rows);
});

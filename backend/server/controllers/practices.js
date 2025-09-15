const { pool } = require(".././db");
const rules = require("./rules");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.addPractice = asyncHandler(async (req, res) => {
  const { prac_dt, trpe_rk, notes } = req.body;
  const prsn_rk = req.user.id;

  if (!prac_dt || !trpe_rk) {
    throw new ValidationError(
      "Practice date and training period key are required"
    );
  }

  const PracDateWithinTRPE = await rules.PracDateWithinTRPE(
    prac_dt,
    prsn_rk,
    trpe_rk
  );

  if (!PracDateWithinTRPE.pass) {
    throw new ValidationError(PracDateWithinTRPE.message);
  }

  const newPractice = await pool.query(
    "INSERT INTO practice (prac_dt, trpe_rk, notes) VALUES($1, $2, $3) RETURNING *",
    [prac_dt, trpe_rk, notes]
  );

  res.json(newPractice.rows[0]);
});

exports.getAllPractices = asyncHandler(async (req, res) => {
  const prsn_rk = req.user.id;

  const allPractice = await pool.query(
    "SELECT p.prac_rk, p.prac_dt, p.trpe_rk, p.notes, COUNT(m.msrm_rk) AS measurement_count FROM practice p LEFT JOIN measurement m ON p.prac_rk = m.prac_rk INNER JOIN training_period tp ON tp.trpe_rk = p.trpe_rk WHERE tp.prsn_rk = $1 GROUP BY p.prac_rk ORDER BY p.prac_dt DESC",
    [prsn_rk]
  );

  res.json(allPractice.rows);
});

exports.getPracticesInTrpe = asyncHandler(async (req, res) => {
  const { trpe_rk } = req.params;

  if (!trpe_rk) {
    throw new ValidationError("Training period key is required");
  }

  const trpePractice = await pool.query(
    "SELECT p.prac_rk, p.prac_dt, p.notes, COUNT(m.msrm_rk) AS measurement_count FROM practice p LEFT JOIN measurement m ON p.prac_rk = m.prac_rk WHERE p.trpe_rk = $1 GROUP BY p.prac_rk",
    [trpe_rk]
  );

  res.json(trpePractice.rows);
});

exports.getLastPractice = asyncHandler(async (req, res) => {
  const practice = await pool.query(
    "SELECT p.prac_dt, p.prac_rk, p.trpe_rk, me.meas_id, me.meas_unit, m.msrm_value FROM practice p JOIN measurement m ON m.prac_rk = p.prac_rk JOIN measurable me ON me.meas_rk = m.meas_rk ORDER BY prac_dt DESC FETCH FIRST ROW ONLY"
  );

  res.json(practice.rows[0]);
});

exports.getPractice = asyncHandler(async (req, res) => {
  const { prac_rk } = req.params;

  if (!prac_rk) {
    throw new ValidationError("Practice key is required");
  }

  const practice = await pool.query(
    "SELECT * FROM practice WHERE prac_rk = $1",
    [prac_rk]
  );

  if (practice.rows.length === 0) {
    throw new NotFoundError("Practice not found");
  }

  res.json(practice.rows[0]);
});

exports.updatePractice = asyncHandler(async (req, res) => {
  const { prac_rk, prac_dt, trpe_rk, notes } = req.body;
  const prsn_rk = req.user.id;

  if (!prac_rk || !prac_dt || !trpe_rk) {
    throw new ValidationError(
      "Practice key, date, and training period key are required"
    );
  }

  const PracDateWithinTRPE = await rules.PracDateWithinTRPE(
    prac_dt,
    prsn_rk,
    trpe_rk
  );

  if (!PracDateWithinTRPE.pass) {
    throw new ValidationError(PracDateWithinTRPE.message);
  }

  const result = await pool.query(
    "UPDATE practice SET prac_dt = $1, trpe_rk = $2, notes = $4 WHERE prac_rk = $3",
    [prac_dt, trpe_rk, prac_rk, notes]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError("Practice not found");
  }

  res.json({ message: "Practice was updated successfully" });
});

exports.deletePractice = asyncHandler(async (req, res) => {
  const { prac_rk } = req.body;

  if (!prac_rk) {
    throw new ValidationError("Practice key is required");
  }

  const result = await pool.query("DELETE FROM practice WHERE prac_rk = $1", [
    prac_rk,
  ]);

  if (result.rowCount === 0) {
    throw new NotFoundError("Practice not found");
  }

  res.json({ message: "Practice has been deleted successfully" });
});

// Get all practices for athletes under a coach
exports.getAllPracticesForCoach = asyncHandler(async (req, res) => {
  const coach_prsn_rk = req.user.id;

  const allPractices = await pool.query(
    `SELECT 
      p.prac_rk, 
      p.prac_dt, 
      p.trpe_rk, 
      p.notes, 
      COUNT(m.msrm_rk) AS measurement_count,
      athlete.prsn_first_nm as athlete_first_nm,
      athlete.prsn_last_nm as athlete_last_nm,
      athlete.prsn_rk as athlete_prsn_rk
    FROM practice p 
    LEFT JOIN measurement m ON p.prac_rk = m.prac_rk 
    INNER JOIN training_period tp ON tp.trpe_rk = p.trpe_rk 
    INNER JOIN person athlete ON tp.prsn_rk = athlete.prsn_rk
    WHERE athlete.coach_prsn_rk = $1 
    GROUP BY p.prac_rk, athlete.prsn_first_nm, athlete.prsn_last_nm, athlete.prsn_rk
    ORDER BY p.prac_dt DESC`,
    [coach_prsn_rk]
  );

  res.json(allPractices.rows);
});

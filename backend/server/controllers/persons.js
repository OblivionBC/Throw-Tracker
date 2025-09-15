/*
  Purpose: Persons.js holds all the HTTP Requests for editing the Person Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.addPerson = asyncHandler(async (req, res) => {
  const {
    prsn_first_nm,
    prsn_last_nm,
    prsn_email,
    prsn_pwrd,
    org_rk,
    prsn_role,
  } = req.body;

  if (
    !prsn_first_nm ||
    !prsn_last_nm ||
    !prsn_email ||
    !prsn_pwrd ||
    !org_rk ||
    !prsn_role
  ) {
    throw new ValidationError("All required fields must be provided");
  }

  const alreadyExists = await pool.query(
    "select * from person where prsn_email = $1",
    [prsn_email]
  );

  if (alreadyExists.rowCount > 0) {
    throw new ConflictError("Email is already in use, please select another");
  }

  const newPerson = await pool.query(
    "INSERT INTO person (prsn_first_nm, prsn_last_nm, prsn_email, prsn_pwrd, org_rk, prsn_role) VALUES($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6) RETURNING *",
    [prsn_first_nm, prsn_last_nm, prsn_email, prsn_pwrd, org_rk, prsn_role]
  );

  res.json(newPerson.rows[0]);
});

exports.getAllPersons = asyncHandler(async (req, res) => {
  const allPersons = await pool.query("SELECT * FROM person");
  res.json(allPersons.rows);
});

exports.getPerson = asyncHandler(async (req, res) => {
  const { prsn_rk } = req.params;
  const person = await pool.query("SELECT * FROM person WHERE prsn_rk = $1", [
    prsn_rk,
  ]);

  if (person.rows.length === 0) {
    throw new NotFoundError("Person");
  }

  res.json(person.rows[0]);
});

exports.updatePerson = async (req, res) => {
  try {
    const { prsn_rk } = req.params;
    const { prsn_first_nm, prsn_last_nm, prsn_email } = req.body;
    const updateTodo = await pool.query(
      "UPDATE person SET prsn_first_nm = $1, prsn_last_nm = $2, prsn_email = $3 WHERE prsn_rk = $4",
      [prsn_first_nm, prsn_last_nm, prsn_email, prsn_rk]
    );
    res.json("Person was Updated");
  } catch (err) {
    console.error("Error occurred Updating Person:", err.message);
    res.status(500).json({ message: "Error occurred Updating Person." });
  }
};

exports.deletePerson = async (req, res) => {
  try {
    const { prsn_rk } = req.params;
    const deletePerson = await pool.query(
      "DELETE FROM person WHERE prsn_rk = $1",
      [prsn_rk]
    );

    res.json("Person has been Deleted");
  } catch (err) {
    console.error("Error deleting person:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Person." });
  }
};

exports.getMe = asyncHandler(async (req, res) => {
  const user = await pool.query(
    "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, p.profile_url, p.org_rk, o.org_name FROM person p INNER JOIN organization o ON o.org_rk = p.org_rk WHERE p.prsn_rk = $1",
    [req.user.id]
  );

  if (user.rows.length === 0) {
    throw new NotFoundError("User");
  }

  res.json({
    prsn_rk: user.rows[0].prsn_rk,
    prsn_first_nm: user.rows[0].prsn_first_nm,
    prsn_last_nm: user.rows[0].prsn_last_nm,
    prsn_email: user.rows[0].prsn_email,
    prsn_role: user.rows[0].prsn_role,
    profile_url: user.rows[0].profile_url,
    org_rk: user.rows[0].org_rk,
    org_name: user.rows[0].org_name,
  });
});

exports.athletesForCoach = asyncHandler(async (req, res) => {
  const coach_prsn_rk = req.user.id;

  const result = await pool.query(
    "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, p.profile_url, o.org_name FROM person p INNER JOIN organization o ON o.org_rk = p.org_rk WHERE p.coach_prsn_rk = $1",
    [coach_prsn_rk]
  );

  res.json(result.rows);
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { prsn_email, prsn_pwrd, prsn_first_nm, prsn_last_nm } = req.body;

  if (!prsn_email || !prsn_pwrd || !prsn_first_nm || !prsn_last_nm) {
    throw new ValidationError(
      "Email, password, first name, and last name are required"
    );
  }

  const result = await pool.query(
    "UPDATE person SET prsn_pwrd = crypt($1, gen_salt('bf')) WHERE prsn_email = $2 AND prsn_first_nm = $3 AND prsn_last_nm = $4 RETURNING *",
    [prsn_pwrd, prsn_email, prsn_first_nm, prsn_last_nm]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError("User not found or password reset unsuccessful");
  }

  res.json(result.rows[0]);
});

// Get unassigned athletes in the coach's org (no coach assigned)
exports.unassignedAthletesInOrg = asyncHandler(async (req, res) => {
  const coach = await pool.query(
    "SELECT org_rk FROM person WHERE prsn_rk = $1",
    [req.user.id]
  );

  if (coach.rows.length === 0) {
    throw new NotFoundError("Coach");
  }

  const org_rk = coach.rows[0].org_rk;

  const result = await pool.query(
    "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, p.profile_url, o.org_name FROM person p INNER JOIN organization o ON o.org_rk = p.org_rk WHERE p.org_rk = $1 AND p.coach_prsn_rk IS NULL AND p.prsn_role = 'ATHLETE'",
    [org_rk]
  );

  res.json(result.rows);
});

// Assign self as coach to an athlete
exports.assignCoachToAthlete = asyncHandler(async (req, res) => {
  const { athlete_rk } = req.body;
  const coach_prsn_rk = req.user.id;

  if (!athlete_rk) {
    throw new ValidationError("Athlete key is required");
  }

  // Verify the athlete exists and is unassigned
  const athlete = await pool.query(
    "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND prsn_role = 'ATHLETE' AND coach_prsn_rk IS NULL",
    [athlete_rk]
  );

  if (athlete.rows.length === 0) {
    throw new NotFoundError("Athlete not found or already assigned to a coach");
  }

  await pool.query("UPDATE person SET coach_prsn_rk = $1 WHERE prsn_rk = $2", [
    coach_prsn_rk,
    athlete_rk,
  ]);

  res.json({ message: "Coach assigned to athlete successfully" });
});

// Unassign coach from an athlete
exports.unassignCoachFromAthlete = asyncHandler(async (req, res) => {
  const { athlete_rk } = req.body;
  const coach_prsn_rk = req.user.id;

  if (!athlete_rk) {
    throw new ValidationError("Athlete key is required");
  }

  // Verify the athlete is currently assigned to this coach
  const athlete = await pool.query(
    "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND coach_prsn_rk = $2 AND prsn_role = 'ATHLETE'",
    [athlete_rk, coach_prsn_rk]
  );

  if (athlete.rows.length === 0) {
    throw new NotFoundError("Athlete not found or not assigned to you");
  }

  await pool.query(
    "UPDATE person SET coach_prsn_rk = NULL WHERE prsn_rk = $1",
    [athlete_rk]
  );

  res.json({ message: "Coach unassigned from athlete successfully" });
});

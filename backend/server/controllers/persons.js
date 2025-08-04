/*
  Purpose: Persons.js holds all the HTTP Requests for editing the Person Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addPerson = async (req, res) => {
  try {
    const {
      prsn_first_nm,
      prsn_last_nm,
      prsn_email,
      prsn_pwrd,
      org_rk,
      prsn_role,
    } = req.body;
    const alreadyExists = await pool.query(
      "select * from person where prsn_email = $1",
      [prsn_email]
    );
    if (alreadyExists.rowCount > 0)
      return res
        .status(400)
        .json({ message: "Email is already in use, please select another" });
    const newPerson = await pool.query(
      "INSERT INTO person (prsn_first_nm, prsn_last_nm, prsn_email, prsn_pwrd, org_rk, prsn_role) VALUES($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6) RETURNING *",
      [prsn_first_nm, prsn_last_nm, prsn_email, prsn_pwrd, org_rk, prsn_role]
    );

    res.json(newPerson.rows[0]);
  } catch (err) {
    console.error("Error occurred Adding Person:", err.message);
    res.status(500).json({ message: "Error occurred Adding Person." });
  }
};

exports.getAllPersons = async (req, res) => {
  try {
    const allPersons = await pool.query("SELECT * FROM person");
    res.json(allPersons.rows);
  } catch (err) {
    console.error("Error getting all persons:", err.message);
    res.status(500).json({ message: "Error occurred Getting All Persons." });
  }
};

exports.getPerson = async (req, res) => {
  try {
    const { prsn_rk } = req.params;
    const person = await pool.query("SELECT * FROM person WHERE prsn_rk = $1", [
      prsn_rk,
    ]);

    res.json(person.rows[0]);
  } catch (err) {
    console.error("Error occurred Getting Person:", err.message);
    res.status(500).json({ message: "Error occurred Getting Person." });
  }
};

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

exports.getMe = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p inner join organization o on o.org_rk = p.org_rk WHERE p.prsn_rk = $1;",
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.rows[0].prsn_rk,
      first_nm: user.rows[0].prsn_first_nm,
      last_nm: user.rows[0].prsn_last_nm,
      org_name: user.rows[0].org_name,
      email: user.rows[0].prsn_email,
      role: user.rows[0].prsn_role,
    });
  } catch (err) {
    console.error("Error occurred while getting user data:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while getting user data." });
  }
};

exports.athletesForCoach = async (req, res) => {
  try {
    const coach_prsn_rk = req.user.id;
    console.log(coach_prsn_rk);
    const result = await pool.query(
      "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p inner join organization o on o.org_rk = p.org_rk WHERE p.coach_prsn_rk = $1;",
      [coach_prsn_rk]
    );
    if (result.rows.length == 0) {
      res.status(404).json("Record does not exist");
      return;
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred while getting athletes:", err.message);
    res.status(500).json({ message: "Error occurred while Athlete Grab." });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { prsn_email, prsn_pwrd, prsn_first_nm, prsn_last_nm } = req.body;

    const result = await pool.query(
      "Update person set prsn_pwrd = crypt($1, gen_salt('bf')) where prsn_email = $2 and prsn_first_nm = $3 and prsn_last_nm = $4 returning *",
      [prsn_pwrd, prsn_email, prsn_first_nm, prsn_last_nm]
    );

    if (result.rows.length == 0) {
      res.status(500).json({
        message: "Password Reset was Unsuccessful",
      });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating password:", err.message);
    res.status(500).json({
      message: "Error occurred while Updating Password for User ",
    });
  }
};

// Get unassigned athletes in the coach's org (no coach assigned)
exports.unassignedAthletesInOrg = async (req, res) => {
  try {
    const coach = await pool.query(
      "SELECT org_rk FROM person WHERE prsn_rk = $1",
      [req.user.id]
    );
    if (coach.rows.length === 0)
      return res.status(404).json({ message: "Coach not found" });
    const org_rk = coach.rows[0].org_rk;
    console.log("Coach org_rk:", org_rk);

    // Let's see what roles exist in the org
    const rolesInOrg = await pool.query(
      "SELECT DISTINCT p.prsn_role FROM person p WHERE p.org_rk = $1",
      [org_rk]
    );
    console.log("Roles in org:", rolesInOrg.rows);

    // First, let's see all people in the org without coach
    const allPeopleWithoutCoach = await pool.query(
      "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, p.coach_prsn_rk, o.org_name FROM person p INNER JOIN organization o ON o.org_rk = p.org_rk WHERE p.org_rk = $1 AND p.coach_prsn_rk IS NULL",
      [org_rk]
    );
    console.log("All people without coach:", allPeopleWithoutCoach.rows);

    // Now try with ATHLETE role
    const result = await pool.query(
      "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p INNER JOIN organization o ON o.org_rk = p.org_rk WHERE p.org_rk = $1 AND p.coach_prsn_rk IS NULL AND p.prsn_role = 'ATHLETE'",
      [org_rk]
    );
    console.log("Unassigned athletes result:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error getting unassigned athletes:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting unassigned athletes." });
  }
};

// Assign self as coach to an athlete
exports.assignCoachToAthlete = async (req, res) => {
  try {
    const { athlete_rk } = req.body;
    const coach_prsn_rk = req.user.id;
    await pool.query(
      "UPDATE person SET coach_prsn_rk = $1 WHERE prsn_rk = $2 AND prsn_role = 'athlete'",
      [coach_prsn_rk, athlete_rk]
    );
    res.json({ message: "Coach assigned to athlete" });
  } catch (err) {
    console.error("Error assigning coach:", err.message);
    res.status(500).json({ message: "Error occurred assigning coach." });
  }
};

// Unassign coach from an athlete
exports.unassignCoachFromAthlete = async (req, res) => {
  try {
    const { athlete_rk } = req.body;
    const coach_prsn_rk = req.user.id;

    // Verify the athlete is currently assigned to this coach
    const athlete = await pool.query(
      "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND coach_prsn_rk = $2 AND prsn_role = 'ATHLETE'",
      [athlete_rk, coach_prsn_rk]
    );

    if (athlete.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Athlete not found or not assigned to you" });
    }

    await pool.query(
      "UPDATE person SET coach_prsn_rk = NULL WHERE prsn_rk = $1",
      [athlete_rk]
    );
    res.json({ message: "Coach unassigned from athlete" });
  } catch (err) {
    console.error("Error unassigning coach:", err.message);
    res.status(500).json({ message: "Error occurred unassigning coach." });
  }
};

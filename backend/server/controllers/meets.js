/*
  Purpose: Meets.js holds all the HTTP Requests for editing the Meet Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addMeet = async (req, res) => {
  try {
    console.log(req.body);
    const { meet_nm, meet_dt, meet_location } = req.body;
    const assigned_by_prsn_rk = req.user.id;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newMeet = await pool.query(
      "INSERT INTO Meet (meet_nm, meet_dt, meet_location, assigned_by_prsn_rk) VALUES($1, $2, $3, $4) RETURNING *",
      [meet_nm, meet_dt, meet_location, assigned_by_prsn_rk]
    );

    res.json(newMeet.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Adding Meet." });
  }
};

exports.getAllMeets = async (req, res) => {
  try {
    const allMeets = await pool.query("SELECT * FROM Meet");
    res.json(allMeets.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Getting All Meets." });
  }
};

exports.getMeet = async (req, res) => {
  try {
    const { meet_rk } = req.params;
    const Meet = await pool.query("SELECT * FROM Meet WHERE meet_rk = $1", [
      meet_rk,
    ]);

    res.json(Meet.rows[0]);
    console.log(req.params);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Getting Meets." });
  }
};

exports.updateMeet = async (req, res) => {
  try {
    const { meet_rk } = req.params;
    const { meet_nm, meet_dt, meet_location } = req.body;
    const assigned_by_prsn_rk = req.user.id;
    const updateTodo = await pool.query(
      "UPDATE Meet SET meet_nm = $1, meet_dt = $2, meet_location = $3, assigned_by_prsn_rk = $4 WHERE meet_rk = $5",
      [meet_nm, meet_dt, meet_location, assigned_by_prsn_rk, meet_rk]
    );
    res.json("Meet was Updated");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Updating Meet." });
  }
};

exports.deleteMeet = async (req, res) => {
  try {
    const { meet_rk } = req.params;
    const deleteMeet = await pool.query("DELETE FROM Meet WHERE meet_rk = $1", [
      meet_rk,
    ]);

    res.json("Meet has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Meet." });
  }
};

// Get meets for coach's organization
exports.getMeetsForCoachOrg = async (req, res) => {
  try {
    const coach_prsn_rk = req.user.id;

    // Get coach's organization
    const coach = await pool.query(
      "SELECT org_rk FROM person WHERE prsn_rk = $1",
      [coach_prsn_rk]
    );

    if (coach.rows.length === 0) {
      return res.status(404).json({ message: "Coach not found" });
    }

    const org_rk = coach.rows[0].org_rk;

    // Get all meets for the organization (including meets without org_rk for backward compatibility)
    const meets = await pool.query(
      `SELECT m.*, p.prsn_first_nm, p.prsn_last_nm 
       FROM Meet m 
       LEFT JOIN person p ON m.assigned_by_prsn_rk = p.prsn_rk 
       WHERE (m.org_rk = $1 OR m.org_rk IS NULL) 
       ORDER BY m.meet_dt`,
      [org_rk]
    );

    res.json(meets.rows);
  } catch (err) {
    console.error("Error getting meets for coach org:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting meets for organization." });
  }
};

/*
  Purpose: Persons.js holds all the HTTP Requests for editing the Person Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");
const jwt = require("jsonwebtoken");

exports.addPerson = async (req, res) => {
  try {
    console.log(req.body);
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
    console.log("Adding Person with email " + prsn_email);
  } catch (err) {
    console.error("Error occurred Adding Person Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Adding Person." });
  }
};

exports.getAllPersons = async (req, res) => {
  try {
    const allPersons = await pool.query("SELECT * FROM person");
    res.json(allPersons.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
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
    console.log("Got Person " + prsn_rk);
  } catch (err) {
    console.error("Error occurred Getting Person Async Error:", err.message);
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
    console.log("Updating Person " + prsn_rk);
    res.json("Person was Updated");
  } catch (err) {
    console.error("Error occurred Updating Person Async Error:", err.message);
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
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Person." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p inner join organization o on o.org_rk = p.org_rk WHERE p.prsn_email = $1 AND p.prsn_pwrd = crypt($2, p.prsn_pwrd);",
      [username, password]
    );
    if (result.rows.length == 0) {
      res.status(404).json("Record does not exist");
      console.log("Unsuccessful Login as User: " + username);
      return;
    }
    const token = jwt.sign(
      {
        id: result.rows[0].prsn_rk,
        role: result.rows[0].prsn_role,
        first_nm: result.rows[0].prsn_first_nm,
        last_nm: result.rows[0].prsn_last_nm,
        org_name: result.rows[0].org_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log("Setting cookie with token:", token.substring(0, 20) + "...");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 3600000,
    });
    console.log("Login Successful as " + username);

    res.json({ message: "Logged in" });
  } catch (err) {
    console.error("Error occurred while Logging In Async Error:", err.message);
    res.status(500).json({ message: "Error occurred while Logging In." });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM person WHERE prsn_rk = $1", [
      req.user.id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user.rows[0]);
    res.json({
      id: user.rows[0].prsn_rk,
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

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

exports.athletesForCoach = async (req, res) => {
  try {
    const coach_prsn_rk = req.user.id;
    console.log("Attempting to get athletes for coach: " + coach_prsn_rk);
    const result = await pool.query(
      "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p inner join organization o on o.org_rk = p.org_rk WHERE p.coach_prsn_rk = $1;",
      [coach_prsn_rk]
    );
    if (result.rows.length == 0) {
      res.status(404).json("Record does not exist");
      console.log("Unsuccessful Athlete Grab as User: " + coach_prsn_rk);
      return;
    }
    console.log("Athlete Grab Successful " + coach_prsn_rk);
    res.json(result.rows);
  } catch (err) {
    console.error(
      "Error occurred while Athlete Grab Async Error:",
      err.message
    );
    res.status(500).json({ message: "Error occurred while Athlete Grab." });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { prsn_email, prsn_pwrd, prsn_first_nm, prsn_last_nm } = req.body;
    console.log(req.body);
    console.log("Attempting Update Password as User: " + prsn_email);

    const result = await pool.query(
      "Update person set prsn_pwrd = crypt($1, gen_salt('bf')) where prsn_email = $2 and prsn_first_nm = $3 and prsn_last_nm = $4 returning *",
      [prsn_pwrd, prsn_email, prsn_first_nm, prsn_last_nm]
    );

    console.log(result.rows);
    if (result.rows.length == 0) {
      console.log("Unsuccessful Password Reset as User: " + prsn_email);
      res.status(500).json({
        message: "Password Reset was Unsuccessful",
      });
      return;
    }
    console.log(result.rows);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred while Updating Password for User ",
    });
  }
};

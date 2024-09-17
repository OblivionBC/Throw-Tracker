/*
  Purpose: Persons.js holds all the HTTP Requests for editing the Person Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

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
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newPerson = await pool.query(
      "INSERT INTO person (prsn_first_nm, prsn_last_nm, prsn_email, prsn_pwrd, org_rk, prsn_role) VALUES($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6) RETURNING *",
      [prsn_first_nm, prsn_last_nm, prsn_email, prsn_pwrd, org_rk, prsn_role]
    );

    res.json(newPerson);
  } catch (err) {
    console.error(err.message);
  }
};

exports.getAllPersons = async (req, res) => {
  try {
    const allPersons = await pool.query("SELECT * FROM person");
    res.json(allPersons);
  } catch (err) {
    console.log(err.message);
  }
};

exports.getPerson = async (req, res) => {
  try {
    const { prsn_rk } = req.params;
    const person = await pool.query("SELECT * FROM person WHERE prsn_rk = $1", [
      prsn_rk,
    ]);

    res.json(person.rows);
    console.log(req.params);
  } catch (err) {
    console.log(err.message);
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
    console.error(err.message);
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
    console.log(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const result = await pool.query(
      "SELECT p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm, p.prsn_email, p.prsn_role, o.org_name FROM person p inner join organization o on o.org_rk = p.org_rk WHERE p.prsn_email = $1 AND p.prsn_pwrd = crypt($2, p.prsn_pwrd);",
      [username, password]
    );
    if (result.rows.length == 0) {
      res.status(404).json("Record does not exist");
      return;
    }
    console.log(result.rows);
    res.json(result);
  } catch (err) {
    console.error(err.message);
  }
};

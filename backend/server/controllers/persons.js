/*
  Purpose: Persons.js holds all the HTTP Requests for editing the Person Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addPerson = async (req, res) => {
  try {
    console.log(req.body);
    const { prsn_first_nm, prsn_last_nm, prsn_email } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newPerson = await pool.query(
      "INSERT INTO person (prsn_first_nm, prsn_last_nm, prsn_email) VALUES($1, $2, $3) RETURNING *",
      [prsn_first_nm, prsn_last_nm, prsn_email]
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

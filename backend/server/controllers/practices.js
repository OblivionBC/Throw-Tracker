/*
  Purpose: practices.js holds all the HTTP Requests for editing the practice Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addPractice = async (req, res) => {
  try {
    console.log(req.body);
    const {
      prac_best,
      prac_implement,
      prac_implement_weight,
      prac_dt,
      trpe_rk,
    } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newPractice = await pool.query(
      "INSERT INTO practice (prac_best, prac_implement, prac_implement_weight, prac_dt, trpe_rk) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [prac_best, prac_implement, prac_implement_weight, prac_dt, trpe_rk]
    );

    res.json(newPractice);
  } catch (err) {
    console.error(err.message);
  }
};

exports.getAllPractices = async (req, res) => {
  try {
    const allPractice = await pool.query("SELECT * FROM practice");
    res.json(allPractice);
  } catch (err) {
    console.log(err.message);
  }
};

exports.getPractice = async (req, res) => {
  try {
    const { prac_rk } = req.params;
    const practice = await pool.query(
      "SELECT * FROM practice WHERE prac_rk = $1",
      [prac_rk]
    );

    res.json(practice.rows);
    console.log(req.params);
  } catch (err) {
    console.log(err.message);
  }
};

exports.updatePractice = async (req, res) => {
  try {
    const { prac_rk } = req.params;
    const {
      prac_best,
      prac_implement,
      prac_implement_weight,
      prac_dt,
      trpe_rk,
    } = req.body;
    const updateTodo = await pool.query(
      "UPDATE practice SET prac_best = $1, prac_implement = $2, prac_implement_weight = $3, prac_dt = $4, trpe_rk = $5 WHERE prac_rk = $6",
      [
        prac_best,
        prac_implement,
        prac_implement_weight,
        prac_dt,
        trpe_rk,
        prac_rk,
      ]
    );
    res.json("Practice was Updated");
  } catch (err) {
    console.error(err.message);
  }
};

exports.deletePractice = async (req, res) => {
  try {
    const { prac_rk } = req.params;
    const deletePractice = await pool.query(
      "DELETE FROM practice WHERE prac_rk = $1",
      [prac_rk]
    );

    res.json("Practice has been Deleted");
  } catch (err) {
    console.log(err.message);
  }
};

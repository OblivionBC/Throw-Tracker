/*
  Purpose: Measurements.js holds all the HTTP Requests for editing the Measurement Table
      The table is selected through the SQL Queries
*/
const { pool } = require("../db");

exports.addMeasurement = async (req, res) => {
  try {
    console.log(req.body);
    const { msrm_value, prac_rk, meas_rk } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newMeasurement = await pool.query(
      "INSERT INTO Measurement (msrm_value, prac_rk, meas_rkk) VALUES($1, $2, $3) RETURNING *",
      [msrm_value, prac_rk, meas_rk]
    );

    res.json(newMeasurement);
  } catch (err) {
    console.error(err.message);
  }
};

exports.getMeasurementsForPrac = async (req, res) => {
  try {
    const decodedArray = decodeURIComponent(req.query.key);
    const key = JSON.parse(decodedArray);

    const Measurements = await pool.query(
      "SELECT m.*, msrm.msrm_value from measurement msrm inner join measurable m on m.meas_rk = msrm.meas_rk inner join practice p on p.prac_rk = msrm.prac_rk where msrm.prac_rk = $1",
      [key]
    );
    res.json(Measurements);
  } catch (err) {
    console.log(err.message);
  }
};

exports.deleteMeasurement = async (req, res) => {
  try {
    const { msrm_rk } = req.params;
    const deleteMeasurement = await pool.query(
      "DELETE FROM Measurement WHERE msrm_rk = $1",
      [msrm_rk]
    );

    res.json("Measurement has been Deleted");
  } catch (err) {
    console.log(err.message);
  }
};
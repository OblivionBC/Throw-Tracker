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
      "INSERT INTO Measurement (msrm_value, prac_rk, meas_rk) VALUES($1, $2, $3) RETURNING *",
      [msrm_value, prac_rk, meas_rk]
    );

    res.json(newMeasurement);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Adding Measurement." });
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
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Getting Measurements For Practice." });
  }
};

exports.getmeasurementsForTRPEs = async (req, res) => {
  try {
    const decodedArray = decodeURIComponent(req.query.keys);
    const keys = JSON.parse(decodedArray);
    const measurements = await pool.query(
      "SELECT msrm.msrm_rk, msrm.prac_rk, m.meas_id, msrm.msrm_value, m.meas_unit, m.prsn_rk, p.prac_rk, p.trpe_rk from measurement msrm inner join measurable m on m.meas_rk = msrm.meas_rk  inner join practice p on p.prac_rk = msrm.prac_rk where p.trpe_rk = ANY($1);",
      [keys]
    );
    res.json(measurements);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred while Getting Measurements in the TRPE.",
    });
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
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Measurement." });
  }
};

exports.deleteMeasurementsForPrac = async (req, res) => {
  try {
    const { prac_rk } = req.body;
    const deleteMeasurement = await pool.query(
      "DELETE FROM Measurement WHERE prac_rk = $1",
      [prac_rk]
    );
    res.json("Measurements have been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Measurement." });
  }
};

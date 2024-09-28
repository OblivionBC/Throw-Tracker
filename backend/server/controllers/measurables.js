/*
  Purpose: Measurables.js holds all the HTTP Requests for editing the Measurable Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addMeasurable = async (req, res) => {
  try {
    console.log(req.body);
    const { meas_id, meas_typ, meas_unit, prsn_rk } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newMeasurable = await pool.query(
      "INSERT INTO Measurable (meas_id, meas_typ, meas_unit, prsn_rk) VALUES($1, $2, $3, $4) RETURNING *",
      [meas_id, meas_typ, meas_unit, prsn_rk]
    );

    res.json(newMeasurable);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred retreiving Adding Measurable to Database.",
    });
  }
};

exports.getAllMeasurablesForPerson = async (req, res) => {
  try {
    const { prsn_rk } = req.body;

    const measurables = await pool.query(
      "SELECT m.* FROM measurable m  where m.prsn_rk = $1",
      [prsn_rk]
    );
    res.json(measurables);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred retreiving All Measurables for Person.",
    });
  }
};

exports.getMeasurablesForPrac = async (req, res) => {
  try {
    const decodedArray = decodeURIComponent(req.query.key);
    const key = JSON.parse(decodedArray);

    const measurables = await pool.query(
      "SELECT p.prac_dt, p.prac_rk, p.trpe_rk, me.meas_id, me.meas_unit, m.msrm_value FROM practice p join measurement m on m.prac_rk = p.prac_rk join measurable me on me.meas_rk = m.meas_rk where p.prac_rk = $1",
      [key]
    );
    res.json(measurables);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred retreiving Getting Measurables for Practice.",
    });
  }
};

exports.updateMeasurable = async (req, res) => {
  try {
    const { meas_rk } = req.params;
    const { meas_id, meas_typ, meas_unit, prac_rk } = req.body;
    const updateTodo = await pool.query(
      "UPDATE Measurable SET meas_id = $1, meas_typ = $2, meas_unit = $3, prsn_rk = $4 WHERE meas_rk = $5",
      [meas_id, meas_typ, meas_unit, prsn_rk, meas_rk]
    );
    res.json("Measurable was Updated");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred updating Measurable." });
  }
};

exports.deleteMeasurable = async (req, res) => {
  try {
    const { meas_rk } = req.params;
    const deleteMeasurable = await pool.query(
      "DELETE FROM Measurable WHERE meas_rk = $1",
      [meas_rk]
    );

    res.json("Measurable has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Measurable." });
  }
};

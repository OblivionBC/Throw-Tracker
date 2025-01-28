/*
  Purpose: Measurables.js holds all the HTTP Requests for editing the Measurable Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addMeasurable = async (req, res) => {
  try {
    const { meas_id, meas_typ, meas_unit, prsn_rk } = req.body;
    console.log("Attempting Add Measurables for person " + prsn_rk);
    const alreadyExists = await pool.query(
      "select from measurable where meas_id = $1 and prsn_rk = $2",
      [meas_id, prsn_rk]
    );
    if (alreadyExists.rowCount > 0) {
      console.log("Already Exists");
      console.error("There is a measurable already with this name");
      return res
        .status(500)
        .json({ message: "There is a measurable already with this name" });
    }
    const newMeasurable = await pool.query(
      "INSERT INTO Measurable (meas_id, meas_typ, meas_unit, prsn_rk) VALUES($1, $2, $3, $4) RETURNING *",
      [meas_id, meas_typ, meas_unit, prsn_rk]
    );

    console.log(
      "Adding a measurable with name " +
        meas_id +
        " for the prsn in row " +
        prsn_rk
    );
    res.status(200).json({ message: "Measurable Added" });
    return { status: 200, data: newMeasurable };
  } catch (err) {
    console.error("Async Error:", err.message);
    return res.status(500).json({
      message: "Error occurred retreiving Adding Measurable to Database.",
    });
  }
};

exports.getAllMeasurablesForPerson = async (req, res) => {
  try {
    console.log("Finding");
    const { prsn_rk } = req.body;

    const measurables = await pool.query(
      "SELECT m.* FROM measurable m  where m.prsn_rk = $1",
      [prsn_rk]
    );
    res.json(measurables);
    console.log("Got all Measurables for Person " + prsn_rk);
  } catch (err) {
    console.error(
      "Error occurred retreiving All Measurables for Person Async Error:",
      err.message
    );
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
    console.log("Retreived Measurables for Practice " + key);
  } catch (err) {
    console.error(
      "Error occurred retreiving Getting Measurables for Practice Async Error:",
      err.message
    );
    res.status(500).json({
      message: "Error occurred retreiving Getting Measurables for Practice.",
    });
  }
};

exports.updateMeasurable = async (req, res) => {
  try {
    const { meas_id, meas_typ, meas_unit, meas_rk, prsn_rk } = req.body;
    const updateTodo = await pool.query(
      "UPDATE Measurable SET meas_id = $1, meas_typ = $2, meas_unit = $3, prsn_rk = $4 WHERE meas_rk = $5",
      [meas_id, meas_typ, meas_unit, prsn_rk, meas_rk]
    );
    res.json("Measurable was Updated");
    console.log("Measurable " + meas_rk + " Was Updated");
  } catch (err) {
    console.error(
      "Error occurred updating Measurable Async Error:",
      err.message
    );
    res.status(500).json({ message: "Error occurred updating Measurable." });
  }
};

exports.deleteMeasurable = async (req, res) => {
  try {
    const { meas_rk } = req.body;
    const deleteMeasurable = await pool.query(
      "DELETE FROM Measurable WHERE meas_rk = $1",
      [meas_rk]
    );
    console.log("Measurable " + meas_rk + " Has been deleted");
    res.json("Measurable has been Deleted");
  } catch (err) {
    console.error(
      "Error occurred Deleting Measurable Async Error:",
      err.message
    );
    res.status(500).json({ message: "Error occurred Deleting Measurable." });
  }
};

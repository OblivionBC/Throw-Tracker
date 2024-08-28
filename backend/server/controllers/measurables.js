/*
  Purpose: Measurables.js holds all the HTTP Requests for editing the Measurable Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addMeasurable = async (req, res) => {
  try {
    console.log(req.body);
    const { meas_id, meas_typ, meas_unit, prac_rk } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newMeasurable = await pool.query(
      "INSERT INTO Measurable (meas_id, meas_typ, meas_unit, prac_rk) VALUES($1, $2, $3, $4) RETURNING *",
      [meas_id, meas_typ, meas_unit, prac_rk]
    );

    res.json(newMeasurable);
  } catch (err) {
    console.error(err.message);
  }
};

exports.getAllMeasurablesForPerson = async (req, res) => {
  try {
    const decodedArray = decodeURIComponent(req.query.keys);
    const keys = JSON.parse(decodedArray);

    const measurables = await pool.query(
      "SELECT * FROM measurable m join practice p on p.prac_rk = m.prac_rk join training_period t on t.trpe_rk = p.trpe_rk join person prsn on prsn.prsn_rk = t.prsn_rk where prsn.prsn_rk = ANY($1)",
      [keys]
    );
    res.json(measurables);
  } catch (err) {
    console.log(err.message);
  }
};

exports.getMeasurablesForPrac = async (req, res) => {
  try {
    const decodedArray = decodeURIComponent(req.query.keys);
    const keys = JSON.parse(decodedArray);

    const measurables = await pool.query(
      "SELECT * FROM measurables where prac_rk = ANY($1)",
      [keys]
    );
    res.json(measurables);
  } catch (err) {
    console.log(err.message);
  }
};

exports.updateMeasurable = async (req, res) => {
  try {
    const { meas_rk } = req.params;
    const { meas_id, meas_typ, meas_unit, prac_rk } = req.body;
    const updateTodo = await pool.query(
      "UPDATE Measurable SET meas_id = $1, meas_typ = $2, meas_unit = $3, prac_rk = $4 WHERE meas_rk = $5",
      [meas_id, meas_typ, meas_unit, prac_rk, meas_rk]
    );
    res.json("Measurable was Updated");
  } catch (err) {
    console.error(err.message);
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
    console.log(err.message);
  }
};

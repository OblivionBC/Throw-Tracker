/*
  Purpose: practices.js holds all the HTTP Requests for editing the practice Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addPractice = async (req, res) => {
  try {
    console.log(req.body);
    const { prac_dt, trpe_rk } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newPractice = await pool.query(
      "INSERT INTO practice (prac_dt, trpe_rk) VALUES($1, $2) RETURNING *",
      [prac_dt, trpe_rk]
    );

    res.json(newPractice);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred while Adding Practice." });
  }
};

exports.getAllPractices = async (req, res) => {
  try {
    const { prsn_rk } = req.body;
    const allPractice = await pool.query(
      "SELECT  p.prac_rk, p.prac_dt, p.trpe_rk, COUNT(m.msrm_rk) AS measurement_count FROM practice p LEFT JOIN measurement m ON p.prac_rk = m.prac_rk inner join training_period tp on tp.trpe_rk = p.trpe_rk where tp.prsn_rk = $1 GROUP BY p.prac_rk ORDER BY p.prac_rk",
      [prsn_rk]
    );
    res.json(allPractice);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Getting All Practice." });
  }
};

exports.getPracticesInTrpe = async (req, res) => {
  try {
    const decodedArray = decodeURIComponent(req.query.keys);
    const keys = JSON.parse(decodedArray);

    const trpePractice = await pool.query(
      "SELECT * FROM practice where trpe_rk = ANY($1)",
      [keys]
    );
    res.json(trpePractice);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Getting Practices in the TRPE." });
  }
};

exports.getLastPractice = async (req, res) => {
  try {
    const practice = await pool.query(
      "SELECT p.prac_dt, p.prac_rk, p.trpe_rk, me.meas_id, me.meas_unit, m.msrm_value FROM practice p join measurement m on m.prac_rk = p.prac_rk join measurable me on me.meas_rk = m.meas_rk order by prac_dt desc fetch first row only"
    );
    res.json(practice);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Getting Last Practice." });
  }
};

exports.getPracticesWithImp = async (req, res) => {
  try {
    const { prac_implement } = req.params;
    const practice = await pool.query(
      "SELECT * FROM practice where prac_implement = $1",
      [prac_implement]
    );
    res.json(practice);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred while Getting All Practice with Implement.",
    });
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
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred while Getting Practice." });
  }
};

exports.updatePractice = async (req, res) => {
  try {
    const { prac_rk, prac_dt, trpe_rk } = req.body;
    const updateTodo = await pool.query(
      "UPDATE practice SET prac_best = 0, prac_implement = 'null', prac_implement_weight = 0, prac_dt = $1, trpe_rk = $2 WHERE prac_rk = $3",
      [prac_dt, trpe_rk, prac_rk]
    );
    res.json("Practice was Updated");
    console.log(updateTodo);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Updating Practice." });
  }
};

exports.deletePractice = async (req, res) => {
  try {
    const { prac_rk } = req.body;

    const deleteMeasurement = await pool.query(
      "DELETE FROM measurement WHERE prac_rk = $1",
      [prac_rk]
    );
    const deletePractice = await pool.query(
      "DELETE FROM practice WHERE prac_rk = $1",
      [prac_rk]
    );

    res.json("Practice has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Deleting Practice." });
  }
};

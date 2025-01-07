const { pool } = require(".././db");
const rules = require("./rules");

exports.addPractice = async (req, res) => {
  try {
    const { prac_dt, trpe_rk, prsn_rk, notes } = req.body;
    const PracDateWithinTRPE = await rules.PracDateWithinTRPE(
      prac_dt,
      prsn_rk,
      trpe_rk
    );
    console.log(PracDateWithinTRPE);
    if (!PracDateWithinTRPE.pass) {
      return res.status(400).json({ message: PracDateWithinTRPE.message });
    }
    const newPractice = await pool.query(
      "INSERT INTO practice (prac_dt, trpe_rk, notes) VALUES($1, $2, $3) RETURNING *",
      [prac_dt, trpe_rk, notes]
    );

    console.log("Added Practice for Training Period " + trpe_rk);
    res.json(newPractice);
  } catch (err) {
    console.error(
      "Error occurred while Adding Practice Async Error:",
      err.message
    );
    res.status(500).json({ message: "Error occurred while Adding Practice." });
  }
};

exports.getAllPractices = async (req, res) => {
  try {
    const { prsn_rk } = req.body;
    const allPractice = await pool.query(
      "SELECT  p.prac_rk, p.prac_dt, p.trpe_rk, p.notes, COUNT(m.msrm_rk) AS measurement_count FROM practice p LEFT JOIN measurement m ON p.prac_rk = m.prac_rk inner join training_period tp on tp.trpe_rk = p.trpe_rk where tp.prsn_rk = $1 GROUP BY p.prac_rk ORDER BY p.prac_dt desc",
      [prsn_rk]
    );
    console.log("Getting All Practices for person " + prsn_rk);
    res.json(allPractice);
  } catch (err) {
    console.error(
      "Error occurred while Getting All Practice Async Error:",
      err.message
    );
    res
      .status(500)
      .json({ message: "Error occurred while Getting All Practice." });
  }
};

exports.getPracticesInTrpe = async (req, res) => {
  try {
    const { trpe_rk } = req.body;
    const trpePractice = await pool.query(
      "SELECT p.prac_rk, p.prac_dt, p.notes, COUNT(m.msrm_rk) AS measurement_count FROM practice p LEFT JOIN measurement m ON p.prac_rk = m.prac_rk where p.trpe_rk = $1 GROUP BY p.prac_rk",
      [trpe_rk]
    );
    console.log("Getting Practices in the TRPE " + trpe_rk);
    res.json(trpePractice);
  } catch (err) {
    console.error(
      "Error occurred while Getting Practices in the TRPE Async Error:",
      err.message
    );
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
    console.log("Getting Last Practice");
  } catch (err) {
    console.error(
      "Error occurred while Getting Last Practice Async Error:",
      err.message
    );
    res
      .status(500)
      .json({ message: "Error occurred while Getting Last Practice." });
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
    console.log("Getting practice " + prac_rk);
  } catch (err) {
    console.error(
      "Error occurred while Getting Practice Async Error:",
      err.message
    );
    res.status(500).json({ message: "Error occurred while Getting Practice." });
  }
};

exports.updatePractice = async (req, res) => {
  try {
    const { prac_rk, prac_dt, trpe_rk, prsn_rk, notes } = req.body;
    console.log(req.body);
    const PracDateWithinTRPE = await rules.PracDateWithinTRPE(
      prac_dt,
      prsn_rk,
      trpe_rk
    );
    console.log(PracDateWithinTRPE);
    if (!PracDateWithinTRPE.pass) {
      return res.status(400).json({ message: PracDateWithinTRPE.message });
    }

    const updateTodo = await pool.query(
      "UPDATE practice SET prac_dt = $1, trpe_rk = $2, notes = $4 WHERE prac_rk = $3",
      [prac_dt, trpe_rk, prac_rk, notes]
    );
    res.json("Practice was Updated");
    console.log("Updating practice " + prac_rk);
  } catch (err) {
    console.error(
      "Error occurred while Updating Practice Async Error:",
      err.message
    );
    res
      .status(500)
      .json({ message: "Error occurred while Updating Practice." });
  }
};

exports.deletePractice = async (req, res) => {
  try {
    const { prac_rk } = req.body;
    const deletePractice = await pool.query(
      "DELETE FROM practice WHERE prac_rk = $1",
      [prac_rk]
    );

    res.json("Practice has been Deleted");
    console.log("Practice " + prac_rk + " has been Deleted");
  } catch (err) {
    console.error(
      "Error occurred while Deleting Practice Async Error:",
      err.message
    );
    res
      .status(500)
      .json({ message: "Error occurred while Deleting Practice." });
  }
};

//Rule 001 Practice Date is within the timeframe of a TRPE
const { pool } = require(".././db");

exports.PracDateWithinTRPE = async (req, res) => {
  try {
    //Need the date for the practice, and the person key for grabbing training periods
    const { prac_dt, prsn_rk } = req.body;
    const rule = await pool.query(
      " select * from training_period trpe where trpe.prsn_rk = $2 and trpe.trpe_start_dt <= $1 and trpe_end_dt is null;",
      [prac_dt, prsn_rk]
    );
    console.log(rule);
    if (rule.rowCount > 0) {
      res.status(0).json({
        message:
          "Passed Rule001 Practice Date is within a non-end dated Training Period",
      });
    } else {
      res.status(1).json({
        message:
          "Failed Rule001 Practice Date not within a non-end dated Training Period",
      });
    }
    res.json(rule);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Checking Rule 001." });
  }
};

//Rule 002 Training Period Start Date does not overlap Existing Training Periods
//returns rows where it does overlap
exports.TRPEDoesNotOverlap = async (req, res) => {
  try {
    //Need the trpe start/end date, as well as the prsn_rk
    //This rule can be used both for when changing a TRPE End date and Start date for cases where the date is inside of another trpe
    const { date, prsn_rk } = req.body;
    const rule = await pool.query(
      "select * from training_period trpe where trpe.prsn_rk = $2 and trpe_start_dt <= $1 and trpe_end_dt >= $1;",
      [date, prsn_rk]
    );
    console.log(rule);
    res.json(rule);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred while Checking Rule 002." });
  }
};

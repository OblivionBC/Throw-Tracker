const { pool } = require(".././db");

//Rule 001 Practice Date is within the timeframe of a TRPE
const PracDateWithinTRPE = async (prac_dt, prsn_rk, trpe_rk) => {
  try {
    //Need the date for the practice, and the person key for grabbing training periods
    const rule = await pool.query(
      "select * from training_period trpe where trpe.prsn_rk = $2 and trpe.trpe_start_dt <= $1 and trpe_rk = $3 and (trpe.trpe_end_dt >= $1 OR trpe_end_dt is null);",

      [prac_dt, prsn_rk, trpe_rk]
    );
    if (rule.rowCount > 0) {
      return {
        pass: true,
        message: "Passed: Practice Date is within the selected Training Period",
      };
    } else {
      return {
        pass: false,
        message:
          "Failed: Practice Date not within the selected Training Period Dates ",
      };
    }
  } catch (err) {
    console.error("Async Error checking Rule 001:", err.message);
    return {
      pass: fail,
      message: "Error has occurred",
    };
  }
};

//Rule 002 Training Period Start Date does not overlap Existing Training Periods
//returns rows where it does overlap
const TRPEDoesNotOverlap = async (date, prsn_rk) => {
  try {
    //Need the trpe start/end date, as well as the prsn_rk
    //This rule can be used both for when changing a TRPE End date and Start date for cases where the date is inside of another trpe
    console.log(date);
    const rule = await pool.query(
      "select * from training_period trpe where trpe.prsn_rk = $2 and trpe_start_dt < $1 and trpe_end_dt >= $1;",
      [date, prsn_rk]
    );
    if (rule.rowCount > 0) {
      return {
        pass: false,
        message:
          "Failed: Training Period is Overlapped by an existing Training Period, please try a different date",
      };
    } else {
      return {
        pass: true,
        message: "Passed: No Overlap ",
      };
    }
  } catch (err) {
    console.error("Async Error:", err.message);
    return {
      pass: false,
      message: "Error occurred while Checking Rule 002",
    };
  }
};

module.exports = {
  PracDateWithinTRPE,
  TRPEDoesNotOverlap,
};

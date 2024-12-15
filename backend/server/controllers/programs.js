/*
  Purpose: Programs.js holds all the HTTP Requests for editing the Program  Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addProgram = async (req, res) => {
  try {
    const { prog_nm, coach_prsn_rk, trpe_rk } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newProgram = await pool.query(
      "INSERT INTO program (prog_nm, coach_prsn_rk, trpe_rk) VALUES($1, $2, $3) RETURNING *",
      [prog_nm, coach_prsn_rk, trpe_rk]
    );

    res.json(newProgram);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Adding Program." });
  }
};

exports.getProgramAndExercises = async (req, res) => {
  try {
    const { prog_rk } = req.params;
    const Program = await pool.query(
      "select prog.prog_rk, prog.prog_nm, prog.coach_prsn_rk, exas.athlete_prsn_rk, exas.assigner_prsn_rk, exas.exas_notes, excr.excr_nm, excr.excr_reps, excr.excr_sets, excr.excr_weight, excr.excr_notes, exas.meas_rk from program prog inner join exercise_assignment exas on prog.prog_rk = exas.prog_rk inner join exercise excr on excr.excr_rk = exas.excr_rk where prog.prog_rk = $1",
      [prog_rk]
    );

    res.json(Program.rows);
    console.log(req.params);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Getting Exercise." });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const { prog_rk, prog_nm, coach_prsn_rk, trpe_rk } = req.body;
    const updateTodo = await pool.query(
      "UPDATE program SET prog_nm = $2, coach_prsn_rk = $3, trpe_rk = $4 WHERE prog_rk = $1",
      [prog_rk, prog_nm, coach_prsn_rk, trpe_rk]
    );
    res.json("program was Updated");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Updating program." });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const { prog_rk } = req.params;
    const deleteExercise = await pool.query(
      "DELETE FROM program WHERE prog_rk = $1",
      [prog_rk]
    );

    res.json("Program has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Program." });
  }
};

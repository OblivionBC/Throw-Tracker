/*
  Purpose: Programs.js holds all the HTTP Requests for editing the Program  Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addProgram = async (req, res) => {
  try {
    const { prog_nm } = req.body;
    const coach_prsn_rk = req.user.id;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    console.log("Creating Program for Coach : " + coach_prsn_rk);
    const newProgram = await pool.query(
      "INSERT INTO program (prog_nm, coach_prsn_rk) VALUES($1, $2) RETURNING *",
      [prog_nm, coach_prsn_rk]
    );

    res.json(newProgram.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Adding Program." });
  }
};

exports.getAllProgramsForCoach = async (req, res) => {
  try {
    const coach_prsn_rk = req.user.id;
    const programs = await pool.query(
      `SELECT 
        p.prog_rk, 
        p.prog_nm, 
        p.coach_prsn_rk,
        COUNT(DISTINCT prma.meas_rk) as measurable_count,
        COUNT(DISTINCT tp2.prsn_rk) as athlete_count
      FROM program p
      LEFT JOIN program_measurable_assignment prma ON p.prog_rk = prma.prog_rk
      LEFT JOIN program_athlete_assignment paa ON p.prog_rk = paa.prog_rk
      LEFT JOIN training_period tp2 ON paa.trpe_rk = tp2.trpe_rk
      WHERE p.coach_prsn_rk = $1
      GROUP BY p.prog_rk, p.prog_nm, p.coach_prsn_rk
      ORDER BY p.prog_rk DESC`,
      [coach_prsn_rk]
    );

    res.json(programs.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Getting Programs for Coach." });
  }
};

exports.getProgramDetails = async (req, res) => {
  try {
    const { prog_rk } = req.params;
    const coach_prsn_rk = req.user.id;

    // Get program details
    const programDetails = await pool.query(
      `SELECT 
        p.prog_rk, 
        p.prog_nm, 
        p.coach_prsn_rk
      FROM program p
      WHERE p.prog_rk = $1 AND p.coach_prsn_rk = $2`,
      [prog_rk, coach_prsn_rk]
    );

    if (programDetails.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Program not found or access denied." });
    }

    // Get measurables assigned to this program via program_measurable_assignment
    const measurables = await pool.query(
      `SELECT 
        prma.prma_rk,
        prma.meas_rk,
        prma.sort_order,
        prma.target_val,
        prma.target_reps,
        prma.target_sets,
        prma.target_weight,
        prma.target_unit,
        prma.notes,
        prma.is_measured,
        m.meas_id,
        m.meas_typ,
        m.meas_unit
      FROM program_measurable_assignment prma
      LEFT JOIN measurable m ON prma.meas_rk = m.meas_rk
      WHERE prma.prog_rk = $1
      ORDER BY prma.sort_order, m.meas_id`,
      [prog_rk]
    );

    // Get assigned training periods for this program
    const assignments = await pool.query(
      `SELECT 
        paa.trpe_rk,
        tp.trpe_start_dt,
        tp.trpe_end_dt,
        tp.prsn_rk as athlete_prsn_rk
      FROM program_athlete_assignment paa
      LEFT JOIN training_period tp ON paa.trpe_rk = tp.trpe_rk
      WHERE paa.prog_rk = $1`,
      [prog_rk]
    );

    const result = {
      program: programDetails.rows[0],
      measurables: measurables.rows,
      assignments: assignments.rows,
    };

    res.json(result);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Getting Program Details." });
  }
};

exports.getProgramsForTrainingPeriod = async (req, res) => {
  try {
    const { trpe_rk } = req.params;
    const coach_prsn_rk = req.user.id;

    // Get programs assigned to this training period via program_athlete_assignment
    const programs = await pool.query(
      `SELECT 
        p.prog_rk, 
        p.prog_nm, 
        p.coach_prsn_rk,
        paa.paa_rk,
        paa.assigned_dt,
        paa.notes
      FROM program p
      JOIN program_athlete_assignment paa ON p.prog_rk = paa.prog_rk
      WHERE paa.trpe_rk = $1 AND p.coach_prsn_rk = $2
      ORDER BY p.prog_nm`,
      [trpe_rk, coach_prsn_rk]
    );

    res.json(programs.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred Getting Programs for Training Period.",
    });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const { prog_rk, prog_nm } = req.body;
    const coach_prsn_rk = req.user.id;
    const updateTodo = await pool.query(
      "UPDATE program SET prog_nm = $2, coach_prsn_rk = $3 WHERE prog_rk = $1",
      [prog_rk, prog_nm, coach_prsn_rk]
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
    const coach_prsn_rk = req.user.id;

    // Validate that the program belongs to the coach
    const programCheck = await pool.query(
      "SELECT prog_rk FROM program WHERE prog_rk = $1 AND coach_prsn_rk = $2",
      [prog_rk, coach_prsn_rk]
    );

    if (programCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Program not found or access denied." });
    }

    // Delete the program - database will handle cascade deletes automatically
    await pool.query("DELETE FROM program WHERE prog_rk = $1", [prog_rk]);

    res.json("Program has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred Deleting Program." });
  }
};

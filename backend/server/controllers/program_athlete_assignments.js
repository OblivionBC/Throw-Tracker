/*
  Purpose: program_athlete_assignments.js holds all the HTTP Requests for editing the program_athlete_assignment Table
      The table manages which programs are assigned to which athletes
*/
const { pool } = require(".././db");

exports.assignProgramToAthletes = async (req, res) => {
  try {
    const { prog_rk } = req.params;
    const { assignments } = req.body; // Array of { trpe_rk, notes }
    const assigner_prsn_rk = req.user.id;

    // Validate that the program belongs to the coach
    const programCheck = await pool.query(
      "SELECT prog_rk FROM program WHERE prog_rk = $1 AND coach_prsn_rk = $2",
      [prog_rk, assigner_prsn_rk]
    );

    if (programCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Program not found or access denied." });
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const results = [];

      // Assign program to each training period
      for (const assignment of assignments) {
        const { trpe_rk, notes } = assignment;

        // Validate that the training period exists and belongs to an athlete of this coach
        const trainingPeriodCheck = await client.query(
          `SELECT tp.trpe_rk, p.prsn_rk, p.prsn_first_nm, p.prsn_last_nm 
           FROM training_period tp 
           JOIN person p ON tp.prsn_rk = p.prsn_rk 
           WHERE tp.trpe_rk = $1 AND p.coach_prsn_rk = $2`,
          [trpe_rk, assigner_prsn_rk]
        );

        if (trainingPeriodCheck.rows.length === 0) {
          return res.status(404).json({
            message: `Training period ${trpe_rk} not found or access denied.`,
          });
        }

        const athlete_prsn_rk = trainingPeriodCheck.rows[0].prsn_rk;

        // Check if assignment already exists
        const existingAssignment = await client.query(
          "SELECT paa_rk FROM program_athlete_assignment WHERE prog_rk = $1 AND trpe_rk = $2",
          [prog_rk, trpe_rk]
        );

        if (existingAssignment.rows.length > 0) {
          // Update existing assignment
          const updatedAssignment = await client.query(
            "UPDATE program_athlete_assignment SET notes = $1, assigned_dt = CURRENT_TIMESTAMP WHERE prog_rk = $2 AND trpe_rk = $3 RETURNING *",
            [notes, prog_rk, trpe_rk]
          );
          results.push(updatedAssignment.rows[0]);
        } else {
          // Create new assignment
          const newAssignment = await client.query(
            "INSERT INTO program_athlete_assignment (prog_rk, trpe_rk, assigner_prsn_rk, notes) VALUES($1, $2, $3, $4) RETURNING *",
            [prog_rk, trpe_rk, assigner_prsn_rk, notes]
          );
          results.push(newAssignment.rows[0]);
        }
      }

      await client.query("COMMIT");
      res.json({
        message: "Program assigned successfully",
        assignments: results,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred assigning program to athletes." });
  }
};

exports.getProgramAssignments = async (req, res) => {
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

    // Get all training periods assigned to this program
    const assignments = await pool.query(
      `SELECT 
        paa.paa_rk,
        paa.prog_rk,
        paa.trpe_rk,
        paa.assigner_prsn_rk,
        paa.assigned_dt,
        paa.notes,
        tp.trpe_start_dt,
        tp.trpe_end_dt,
        athlete.prsn_first_nm as athlete_first_nm,
        athlete.prsn_last_nm as athlete_last_nm,
        assigner.prsn_first_nm as assigner_first_nm,
        assigner.prsn_last_nm as assigner_last_nm
      FROM program_athlete_assignment paa
      LEFT JOIN training_period tp ON paa.trpe_rk = tp.trpe_rk
      LEFT JOIN person athlete ON tp.prsn_rk = athlete.prsn_rk
      LEFT JOIN person assigner ON paa.assigner_prsn_rk = assigner.prsn_rk
      WHERE paa.prog_rk = $1
      ORDER BY athlete.prsn_last_nm, athlete.prsn_first_nm, tp.trpe_start_dt`,
      [prog_rk]
    );

    res.json(assignments.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting program assignments." });
  }
};

exports.removeProgramFromAthlete = async (req, res) => {
  try {
    const { paa_rk } = req.params;
    const coach_prsn_rk = req.user.id;

    // Validate that the assignment belongs to a program owned by the coach
    const assignmentCheck = await pool.query(
      `SELECT paa.paa_rk FROM program_athlete_assignment paa
       JOIN program p ON paa.prog_rk = p.prog_rk
       WHERE paa.paa_rk = $1 AND p.coach_prsn_rk = $2`,
      [paa_rk, coach_prsn_rk]
    );

    if (assignmentCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Assignment not found or access denied." });
    }

    const deleteAssignment = await pool.query(
      "DELETE FROM program_athlete_assignment WHERE paa_rk = $1",
      [paa_rk]
    );

    res.json({ message: "Program assignment removed successfully" });
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred removing program assignment." });
  }
};

exports.getAthletePrograms = async (req, res) => {
  try {
    const { athlete_prsn_rk } = req.params;
    const coach_prsn_rk = req.user.id;

    // Validate that the athlete belongs to the coach
    const athleteCheck = await pool.query(
      "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND coach_prsn_rk = $2",
      [athlete_prsn_rk, coach_prsn_rk]
    );

    if (athleteCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Athlete not found or access denied." });
    }

    // Get all programs assigned to this athlete via training periods
    const programs = await pool.query(
      `SELECT 
        paa.paa_rk,
        paa.prog_rk,
        paa.trpe_rk,
        paa.assigned_dt,
        paa.notes,
        p.prog_nm,
        tp.trpe_start_dt,
        tp.trpe_end_dt,
        assigner.prsn_first_nm as assigner_first_nm,
        assigner.prsn_last_nm as assigner_last_nm
      FROM program_athlete_assignment paa
      LEFT JOIN program p ON paa.prog_rk = p.prog_rk
      LEFT JOIN training_period tp ON paa.trpe_rk = tp.trpe_rk
      LEFT JOIN person assigner ON paa.assigner_prsn_rk = assigner.prsn_rk
      WHERE tp.prsn_rk = $1
      ORDER BY paa.assigned_dt DESC`,
      [athlete_prsn_rk]
    );

    res.json(programs.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting athlete programs." });
  }
};

exports.getTrainingPeriodPrograms = async (req, res) => {
  try {
    const { trpe_rk } = req.params;
    const user_prsn_rk = req.user.id;

    // Validate that the training period belongs to the user
    const trainingPeriodCheck = await pool.query(
      "SELECT trpe_rk FROM training_period WHERE trpe_rk = $1 AND prsn_rk = $2",
      [trpe_rk, user_prsn_rk]
    );

    if (trainingPeriodCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Training period not found or access denied." });
    }

    // Get all programs assigned to this training period
    const programs = await pool.query(
      `SELECT 
        paa.paa_rk,
        paa.prog_rk,
        paa.trpe_rk,
        paa.assigned_dt,
        paa.notes,
        p.prog_nm,
        p.coach_prsn_rk,
        assigner.prsn_first_nm as assigner_first_nm,
        assigner.prsn_last_nm as assigner_last_nm
      FROM program_athlete_assignment paa
      LEFT JOIN program p ON paa.prog_rk = p.prog_rk
      LEFT JOIN person assigner ON paa.assigner_prsn_rk = assigner.prsn_rk
      WHERE paa.trpe_rk = $1
      ORDER BY paa.assigned_dt DESC`,
      [trpe_rk]
    );

    res.json(programs.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting training period programs." });
  }
};

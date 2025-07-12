/*
  Purpose: program_measurable_assignments.js holds all the HTTP Requests for editing the program_measurable_assignment Table
      The table manages which measurables are assigned to which programs with specific targets and settings
*/
const { pool } = require(".././db");

exports.addMeasurableToProgram = async (req, res) => {
  try {
    const { prog_rk } = req.params;
    const {
      meas_rk,
      sort_order,
      target_val,
      target_reps,
      target_sets,
      target_weight,
      target_unit,
      notes,
    } = req.body;
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

    // Validate that the measurable exists
    const measurableCheck = await pool.query(
      "SELECT meas_rk FROM measurable WHERE meas_rk = $1",
      [meas_rk]
    );

    if (measurableCheck.rows.length === 0) {
      return res.status(404).json({ message: "Measurable not found." });
    }

    // Check if assignment already exists
    const existingAssignment = await pool.query(
      "SELECT prma_rk FROM program_measurable_assignment WHERE prog_rk = $1 AND meas_rk = $2",
      [prog_rk, meas_rk]
    );

    if (existingAssignment.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Measurable is already assigned to this program." });
    }

    // Add measurable to program
    const newAssignment = await pool.query(
      `INSERT INTO program_measurable_assignment 
       (prog_rk, meas_rk, sort_order, target_val, target_reps, target_sets, target_weight, target_unit, notes, is_measured) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        prog_rk,
        meas_rk,
        sort_order || 1,
        target_val,
        target_reps,
        target_sets,
        target_weight,
        target_unit,
        notes,
        false, // Default is_measured to false
      ]
    );

    res.json(newAssignment.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred adding measurable to program." });
  }
};

exports.getProgramMeasurables = async (req, res) => {
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

    // Get measurables assigned to this program
    const measurables = await pool.query(
      `SELECT 
        prma.prma_rk,
        prma.prog_rk,
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

    res.json(measurables.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting program measurables." });
  }
};

exports.updateProgramMeasurable = async (req, res) => {
  try {
    const { prma_rk } = req.params;
    const {
      sort_order,
      target_val,
      target_reps,
      target_sets,
      target_weight,
      target_unit,
      notes,
      is_measured,
    } = req.body;
    const coach_prsn_rk = req.user.id;

    // Validate that the assignment belongs to a program owned by the coach
    const assignmentCheck = await pool.query(
      `SELECT prma.prma_rk FROM program_measurable_assignment prma
       JOIN program p ON prma.prog_rk = p.prog_rk
       WHERE prma.prma_rk = $1 AND p.coach_prsn_rk = $2`,
      [prma_rk, coach_prsn_rk]
    );

    if (assignmentCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Assignment not found or access denied." });
    }

    // Update the assignment
    const updatedAssignment = await pool.query(
      `UPDATE program_measurable_assignment 
       SET sort_order = $1, target_val = $2, target_reps = $3, target_sets = $4, 
           target_weight = $5, target_unit = $6, notes = $7, is_measured = $8
       WHERE prma_rk = $9 RETURNING *`,
      [
        sort_order,
        target_val,
        target_reps,
        target_sets,
        target_weight,
        target_unit,
        notes,
        is_measured,
        prma_rk,
      ]
    );

    res.json(updatedAssignment.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred updating program measurable." });
  }
};

exports.removeMeasurableFromProgram = async (req, res) => {
  try {
    const { prma_rk } = req.params;
    const coach_prsn_rk = req.user.id;

    // Validate that the assignment belongs to a program owned by the coach
    const assignmentCheck = await pool.query(
      `SELECT prma.prma_rk FROM program_measurable_assignment prma
       JOIN program p ON prma.prog_rk = p.prog_rk
       WHERE prma.prma_rk = $1 AND p.coach_prsn_rk = $2`,
      [prma_rk, coach_prsn_rk]
    );

    if (assignmentCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Assignment not found or access denied." });
    }

    // Remove the assignment
    await pool.query(
      "DELETE FROM program_measurable_assignment WHERE prma_rk = $1",
      [prma_rk]
    );

    res.json({ message: "Measurable removed from program successfully" });
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred removing measurable from program." });
  }
};

exports.reorderProgramMeasurables = async (req, res) => {
  try {
    const { prog_rk } = req.params;
    const { assignments } = req.body; // Array of { prma_rk, sort_order }
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

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update sort order for each assignment
      for (const assignment of assignments) {
        await client.query(
          "UPDATE program_measurable_assignment SET sort_order = $1 WHERE prma_rk = $2 AND prog_rk = $3",
          [assignment.sort_order, assignment.prma_rk, prog_rk]
        );
      }

      await client.query("COMMIT");
      res.json({ message: "Measurables reordered successfully" });
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
      .json({ message: "Error occurred reordering program measurables." });
  }
};

exports.addMultipleMeasurablesToProgram = async (req, res) => {
  try {
    const { prog_rk } = req.params;
    const { measurables } = req.body; // Array of measurable objects
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

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const results = [];

      for (const measurable of measurables) {
        const {
          meas_rk,
          sort_order,
          target_val,
          target_reps,
          target_sets,
          target_weight,
          target_unit,
          notes,
          is_measured,
        } = measurable;

        // Validate that the measurable exists
        const measurableCheck = await client.query(
          "SELECT meas_rk FROM measurable WHERE meas_rk = $1",
          [meas_rk]
        );

        if (measurableCheck.rows.length === 0) {
          throw new Error(`Measurable ${meas_rk} not found.`);
        }

        // Check if assignment already exists
        const existingAssignment = await client.query(
          "SELECT prma_rk FROM program_measurable_assignment WHERE prog_rk = $1 AND meas_rk = $2",
          [prog_rk, meas_rk]
        );

        if (existingAssignment.rows.length > 0) {
          // Update existing assignment
          const updatedAssignment = await client.query(
            `UPDATE program_measurable_assignment 
             SET sort_order = $1, target_val = $2, target_reps = $3, target_sets = $4, 
                 target_weight = $5, target_unit = $6, notes = $7, is_measured = $8
             WHERE prog_rk = $9 AND meas_rk = $10 RETURNING *`,
            [
              sort_order || 1,
              target_val,
              target_reps,
              target_sets,
              target_weight,
              target_unit,
              notes,
              is_measured || false,
              prog_rk,
              meas_rk,
            ]
          );
          results.push(updatedAssignment.rows[0]);
        } else {
          // Create new assignment
          const newAssignment = await client.query(
            `INSERT INTO program_measurable_assignment 
             (prog_rk, meas_rk, sort_order, target_val, target_reps, target_sets, target_weight, target_unit, notes, is_measured) 
             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
              prog_rk,
              meas_rk,
              sort_order || 1,
              target_val,
              target_reps,
              target_sets,
              target_weight,
              target_unit,
              notes,
              is_measured || false,
            ]
          );
          results.push(newAssignment.rows[0]);
        }
      }

      await client.query("COMMIT");
      res.json({
        message: "Measurables added to program successfully",
        measurables: results,
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
      .json({ message: "Error occurred adding measurables to program." });
  }
};

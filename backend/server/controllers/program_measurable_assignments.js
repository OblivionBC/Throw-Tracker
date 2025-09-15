/*
  Purpose: program_measurable_assignments.js holds all the HTTP Requests for editing the program_measurable_assignment Table
      The table manages which measurables are assigned to which programs with specific targets and settings
*/
const { pool } = require(".././db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.addMeasurableToProgram = asyncHandler(async (req, res) => {
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

  if (!prog_rk) {
    throw new ValidationError("Program ID is required");
  }

  if (!meas_rk) {
    throw new ValidationError("Measurable ID is required");
  }

  // Validate that the program belongs to the coach
  const programCheck = await pool.query(
    "SELECT prog_rk FROM program WHERE prog_rk = $1 AND coach_prsn_rk = $2",
    [prog_rk, coach_prsn_rk]
  );

  if (programCheck.rows.length === 0) {
    throw new NotFoundError("Program");
  }

  // Validate that the measurable exists
  const measurableCheck = await pool.query(
    "SELECT meas_rk FROM measurable WHERE meas_rk = $1",
    [meas_rk]
  );

  if (measurableCheck.rows.length === 0) {
    throw new NotFoundError("Measurable");
  }

  // Check if assignment already exists
  const existingAssignment = await pool.query(
    "SELECT prma_rk FROM program_measurable_assignment WHERE prog_rk = $1 AND meas_rk = $2",
    [prog_rk, meas_rk]
  );

  if (existingAssignment.rows.length > 0) {
    throw new ConflictError("Measurable is already assigned to this program");
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
});

exports.getProgramMeasurables = asyncHandler(async (req, res) => {
  const { prog_rk } = req.params;
  const coach_prsn_rk = req.user.id;

  if (!prog_rk) {
    throw new ValidationError("Program ID is required");
  }

  // Validate that the program belongs to the coach
  const programCheck = await pool.query(
    "SELECT prog_rk FROM program WHERE prog_rk = $1 AND coach_prsn_rk = $2",
    [prog_rk, coach_prsn_rk]
  );

  if (programCheck.rows.length === 0) {
    throw new NotFoundError("Program");
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
});

exports.updateProgramMeasurable = asyncHandler(async (req, res) => {
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

  if (!prma_rk) {
    throw new ValidationError("Assignment ID is required");
  }

  // Validate that the assignment belongs to a program owned by the coach
  const assignmentCheck = await pool.query(
    `SELECT prma.prma_rk FROM program_measurable_assignment prma
     JOIN program p ON prma.prog_rk = p.prog_rk
     WHERE prma.prma_rk = $1 AND p.coach_prsn_rk = $2`,
    [prma_rk, coach_prsn_rk]
  );

  if (assignmentCheck.rows.length === 0) {
    throw new NotFoundError("Assignment");
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
});

exports.removeMeasurableFromProgram = asyncHandler(async (req, res) => {
  const { prma_rk } = req.params;
  const coach_prsn_rk = req.user.id;

  if (!prma_rk) {
    throw new ValidationError("Assignment ID is required");
  }

  // Validate that the assignment belongs to a program owned by the coach
  const assignmentCheck = await pool.query(
    `SELECT prma.prma_rk FROM program_measurable_assignment prma
     JOIN program p ON prma.prog_rk = p.prog_rk
     WHERE prma.prma_rk = $1 AND p.coach_prsn_rk = $2`,
    [prma_rk, coach_prsn_rk]
  );

  if (assignmentCheck.rows.length === 0) {
    throw new NotFoundError("Assignment");
  }

  // Remove the assignment
  await pool.query(
    "DELETE FROM program_measurable_assignment WHERE prma_rk = $1",
    [prma_rk]
  );

  res.json({ message: "Measurable removed from program successfully" });
});

exports.reorderProgramMeasurables = asyncHandler(async (req, res) => {
  const { prog_rk } = req.params;
  const { assignments } = req.body; // Array of { prma_rk, sort_order }
  const coach_prsn_rk = req.user.id;

  if (!prog_rk) {
    throw new ValidationError("Program ID is required");
  }

  if (!assignments || !Array.isArray(assignments)) {
    throw new ValidationError("Assignments array is required");
  }

  // Validate that the program belongs to the coach
  const programCheck = await pool.query(
    "SELECT prog_rk FROM program WHERE prog_rk = $1 AND coach_prsn_rk = $2",
    [prog_rk, coach_prsn_rk]
  );

  if (programCheck.rows.length === 0) {
    throw new NotFoundError("Program");
  }

  // Begin transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update sort order for each assignment
    for (const assignment of assignments) {
      if (!assignment.prma_rk || !assignment.sort_order) {
        throw new ValidationError(
          "Each assignment must have prma_rk and sort_order"
        );
      }

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
});

exports.addMultipleMeasurablesToProgram = asyncHandler(async (req, res) => {
  const { prog_rk } = req.params;
  const { measurables } = req.body; // Array of measurable objects
  const coach_prsn_rk = req.user.id;

  if (!prog_rk) {
    throw new ValidationError("Program ID is required");
  }

  if (!measurables || !Array.isArray(measurables)) {
    throw new ValidationError("Measurables array is required");
  }

  // Validate that the program belongs to the coach
  const programCheck = await pool.query(
    "SELECT prog_rk FROM program WHERE prog_rk = $1 AND coach_prsn_rk = $2",
    [prog_rk, coach_prsn_rk]
  );

  if (programCheck.rows.length === 0) {
    throw new NotFoundError("Program");
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

      if (!meas_rk) {
        throw new ValidationError(
          "Measurable ID is required for each measurable"
        );
      }

      // Validate that the measurable exists
      const measurableCheck = await client.query(
        "SELECT meas_rk FROM measurable WHERE meas_rk = $1",
        [meas_rk]
      );

      if (measurableCheck.rows.length === 0) {
        throw new NotFoundError(`Measurable ${meas_rk}`);
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
});

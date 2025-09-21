const { pool } = require("../db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

// List all events scheduled for a meet (chronological)
exports.listForMeet = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;

  if (!meet_rk) {
    throw new ValidationError("Meet key is required");
  }

  const { rows } = await pool.query(
    `SELECT 
       me.meet_event_rk,
       me.meet_rk,
       me.etyp_rk,
       me.event_date,
       me.scheduled_time,
       me.event_order,
       me.notes,
       et.etyp_type_name,
       et.event_group_name,
       COUNT(ea.prsn_rk) AS athlete_count
     FROM meet_event me
     LEFT JOIN event_type et ON me.etyp_rk = et.etyp_rk
     LEFT JOIN event_assignment ea ON me.meet_rk = ea.meet_rk AND me.etyp_rk = ea.etyp_rk
     WHERE me.meet_rk = $1
     GROUP BY me.meet_event_rk, me.meet_rk, me.etyp_rk, me.event_date, me.scheduled_time, me.event_order, me.notes, et.etyp_type_name, et.event_group_name
     ORDER BY me.event_date, me.scheduled_time, me.event_order`,
    [meet_rk]
  );

  res.json(rows);
});

// Create a scheduled event for a meet
exports.createForMeet = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;
  const { etyp_rk, event_date, scheduled_time, event_order, notes } = req.body;

  if (!etyp_rk || !event_date || !scheduled_time) {
    throw new ValidationError(
      "Event type, date, and scheduled time are required"
    );
  }

  try {
    const insert = await pool.query(
      `INSERT INTO meet_event (meet_rk, etyp_rk, event_date, scheduled_time, event_order, notes)
       VALUES ($1, $2, $3, $4, COALESCE($5, 1), $6)
       RETURNING *`,
      [meet_rk, etyp_rk, event_date, scheduled_time, event_order, notes]
    );

    res.json(insert.rows[0]);
  } catch (err) {
    if (err?.constraint === "uq_meet_event_meet_etyp_date") {
      throw new ConflictError(
        "Event already scheduled for this meet on this date"
      );
    }
    throw err;
  }
});

// Get a specific meet_event
exports.getOne = asyncHandler(async (req, res) => {
  const { meet_event_rk } = req.params;

  if (!meet_event_rk) {
    throw new ValidationError("Meet event key is required");
  }

  const { rows } = await pool.query(
    `SELECT me.*, et.etyp_type_name, et.event_group_name
     FROM meet_event me
     LEFT JOIN event_type et ON me.etyp_rk = et.etyp_rk
     WHERE me.meet_event_rk = $1`,
    [meet_event_rk]
  );

  if (rows.length === 0) {
    throw new NotFoundError("Meet event not found");
  }

  res.json(rows[0]);
});

// Update a meet_event (date, time, order, notes)
exports.updateOne = asyncHandler(async (req, res) => {
  const { meet_event_rk } = req.params;
  const { event_date, scheduled_time, event_order, notes } = req.body;

  if (!meet_event_rk) {
    throw new ValidationError("Meet event key is required");
  }

  const result = await pool.query(
    `UPDATE meet_event 
     SET event_date = COALESCE($1, event_date),
         scheduled_time = COALESCE($2, scheduled_time),
         event_order = COALESCE($3, event_order),
         notes = COALESCE($4, notes)
     WHERE meet_event_rk = $5`,
    [event_date, scheduled_time, event_order, notes, meet_event_rk]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError("Meet event not found");
  }

  res.json({ message: "Meet event updated successfully" });
});

// Delete a meet_event
exports.deleteOne = asyncHandler(async (req, res) => {
  const { meet_event_rk } = req.params;

  if (!meet_event_rk) {
    throw new ValidationError("Meet event key is required");
  }

  const result = await pool.query(
    "DELETE FROM meet_event WHERE meet_event_rk = $1",
    [meet_event_rk]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError("Meet event not found");
  }

  res.json({ message: "Meet event deleted successfully" });
});

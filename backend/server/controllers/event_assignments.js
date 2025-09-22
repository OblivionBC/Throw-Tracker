/*
  Purpose: event_assignments.js holds all the HTTP Requests for editing the event_assignment Table
      The table manages which athletes are assigned to which events at meets
*/
const { pool } = require("../db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.addEventAssignment = asyncHandler(async (req, res) => {
  const {
    meet_rk,
    prsn_rk, // Athlete
    etyp_rk, // Event type
    attempt_one,
    attempt_two,
    attempt_three,
    attempt_four,
    attempt_five,
    attempt_six,
    final_mark,
    notes,
  } = req.body;
  const assigned_by_prsn_rk = req.user.id; // Coach who made the assignment

  if (!meet_rk || !prsn_rk || !etyp_rk) {
    throw new ValidationError("Meet, athlete, and event type are required");
  }

  // Validate that the meet exists
  const meetCheck = await pool.query(
    "SELECT meet_rk FROM meet WHERE meet_rk = $1",
    [meet_rk]
  );
  if (meetCheck.rows.length === 0) {
    throw new NotFoundError("Meet");
  }

  // Validate that the athlete exists and belongs to the coach
  const athleteCheck = await pool.query(
    "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND coach_prsn_rk = $2",
    [prsn_rk, assigned_by_prsn_rk]
  );
  if (athleteCheck.rows.length === 0) {
    throw new NotFoundError("Athlete or access denied");
  }

  // Validate event type exists
  const eventTypeCheck = await pool.query(
    "SELECT etyp_rk FROM event_type WHERE etyp_rk = $1",
    [etyp_rk]
  );
  if (eventTypeCheck.rows.length === 0) {
    throw new NotFoundError("Event type");
  }

  // Check if assignment already exists
  const existingAssignment = await pool.query(
    "SELECT meet_rk FROM event_assignment WHERE meet_rk = $1 AND prsn_rk = $2 AND etyp_rk = $3",
    [meet_rk, prsn_rk, etyp_rk]
  );
  if (existingAssignment.rows.length > 0) {
    throw new ConflictError(
      "Athlete is already assigned to this event at this meet"
    );
  }

  const newAssignment = await pool.query(
    `INSERT INTO event_assignment 
     (meet_rk, prsn_rk, assigned_by_prsn_rk, etyp_rk, attempt_one, attempt_two, attempt_three, 
      attempt_four, attempt_five, attempt_six, final_mark, notes) 
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [
      meet_rk,
      prsn_rk,
      assigned_by_prsn_rk,
      etyp_rk,
      attempt_one,
      attempt_two,
      attempt_three,
      attempt_four,
      attempt_five,
      attempt_six,
      final_mark,
      notes,
    ]
  );

  res.json(newAssignment.rows[0]);
});

exports.getEventAssignmentsByMeet = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;
  const coach_prsn_rk = req.user.id;

  // Validate that the meet exists
  const meetCheck = await pool.query(
    "SELECT meet_rk FROM meet WHERE meet_rk = $1",
    [meet_rk]
  );
  if (meetCheck.rows.length === 0) {
    throw new NotFoundError("Meet");
  }

  const assignments = await pool.query(
    `SELECT 
      ea.meet_rk,
      ea.prsn_rk,
      ea.assigned_by_prsn_rk,
      ea.etyp_rk,
      ea.attempt_one,
      ea.attempt_two,
      ea.attempt_three,
      ea.attempt_four,
      ea.attempt_five,
      ea.attempt_six,
      ea.final_mark,
      ea.notes,
      et.etyp_type_name as event_name,
      athlete.prsn_first_nm as athlete_first_nm,
      athlete.prsn_last_nm as athlete_last_nm,
      coach.prsn_first_nm as coach_first_nm,
      coach.prsn_last_nm as coach_last_nm
    FROM event_assignment ea
    LEFT JOIN event_type et ON ea.etyp_rk = et.etyp_rk
    LEFT JOIN person athlete ON ea.prsn_rk = athlete.prsn_rk
    LEFT JOIN person coach ON ea.assigned_by_prsn_rk = coach.prsn_rk
    WHERE ea.meet_rk = $1 AND athlete.coach_prsn_rk = $2
    ORDER BY athlete.prsn_last_nm, athlete.prsn_first_nm, et.etyp_type_name`,
    [meet_rk, coach_prsn_rk]
  );

  res.json(assignments.rows);
});

// Get all event assignments for a meet (for meet details modal)
exports.getAllEventAssignmentsByMeet = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;

  // Validate that the meet exists
  const meetCheck = await pool.query(
    "SELECT meet_rk FROM meet WHERE meet_rk = $1",
    [meet_rk]
  );
  if (meetCheck.rows.length === 0) {
    throw new NotFoundError("Meet");
  }

  const assignments = await pool.query(
    `SELECT 
      ea.meet_rk,
      ea.prsn_rk,
      ea.assigned_by_prsn_rk,
      ea.etyp_rk,
      ea.attempt_one,
      ea.attempt_two,
      ea.attempt_three,
      ea.attempt_four,
      ea.attempt_five,
      ea.attempt_six,
      ea.final_mark,
      ea.notes,
      et.etyp_type_name as event_name,
      athlete.prsn_first_nm as athlete_first_nm,
      athlete.prsn_last_nm as athlete_last_nm,
      coach.prsn_first_nm as coach_first_nm,
      coach.prsn_last_nm as coach_last_nm
    FROM event_assignment ea
    LEFT JOIN event_type et ON ea.etyp_rk = et.etyp_rk
    LEFT JOIN person athlete ON ea.prsn_rk = athlete.prsn_rk
    LEFT JOIN person coach ON ea.assigned_by_prsn_rk = coach.prsn_rk
    WHERE ea.meet_rk = $1
    ORDER BY athlete.prsn_last_nm, athlete.prsn_first_nm, et.etyp_type_name`,
    [meet_rk]
  );

  res.json(assignments.rows);
});

// Get event assignments for a specific meet and event
exports.getEventAssignmentsByMeetAndEvent = asyncHandler(async (req, res) => {
  const { meet_rk, etyp_rk } = req.params;

  // Validate that the meet exists
  const meetCheck = await pool.query(
    "SELECT meet_rk FROM meet WHERE meet_rk = $1",
    [meet_rk]
  );
  if (meetCheck.rows.length === 0) {
    throw new NotFoundError("Meet");
  }

  // Validate that the event type exists
  const eventTypeCheck = await pool.query(
    "SELECT etyp_rk FROM event_type WHERE etyp_rk = $1",
    [etyp_rk]
  );
  if (eventTypeCheck.rows.length === 0) {
    throw new NotFoundError("Event type");
  }

  const assignments = await pool.query(
    `SELECT 
      ea.meet_rk,
      ea.prsn_rk,
      ea.assigned_by_prsn_rk,
      ea.etyp_rk,
      ea.attempt_one,
      ea.attempt_two,
      ea.attempt_three,
      ea.attempt_four,
      ea.attempt_five,
      ea.attempt_six,
      ea.final_mark,
      ea.notes,
      et.etyp_type_name as event_name,
      athlete.prsn_first_nm as athlete_first_nm,
      athlete.prsn_last_nm as athlete_last_nm,
      coach.prsn_first_nm as coach_first_nm,
      coach.prsn_last_nm as coach_last_nm
    FROM event_assignment ea
    LEFT JOIN event_type et ON ea.etyp_rk = et.etyp_rk
    LEFT JOIN person athlete ON ea.prsn_rk = athlete.prsn_rk
    LEFT JOIN person coach ON ea.assigned_by_prsn_rk = coach.prsn_rk
    WHERE ea.meet_rk = $1 AND ea.etyp_rk = $2
    ORDER BY athlete.prsn_last_nm, athlete.prsn_first_nm`,
    [meet_rk, etyp_rk]
  );

  res.json(assignments.rows);
});

exports.getEventAssignmentsByAthlete = asyncHandler(async (req, res) => {
  const { prsn_rk } = req.params;
  const coach_prsn_rk = req.user.id;

  // Validate that the athlete belongs to the coach
  const athleteCheck = await pool.query(
    "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND coach_prsn_rk = $2",
    [prsn_rk, coach_prsn_rk]
  );
  if (athleteCheck.rows.length === 0) {
    throw new NotFoundError("Athlete or access denied");
  }

  const assignments = await pool.query(
    `SELECT 
      ea.meet_rk,
      ea.prsn_rk,
      ea.assigned_by_prsn_rk,
      ea.etyp_rk,
      ea.attempt_one,
      ea.attempt_two,
      ea.attempt_three,
      ea.attempt_four,
      ea.attempt_five,
      ea.attempt_six,
      ea.final_mark,
      ea.notes,
      et.etyp_type_name as event_name,
      m.meet_nm,
      m.meet_start_dt,
      m.meet_end_dt,
      m.meet_location,
      coach.prsn_first_nm as coach_first_nm,
      coach.prsn_last_nm as coach_last_nm
    FROM event_assignment ea
    LEFT JOIN event_type et ON ea.etyp_rk = et.etyp_rk
    LEFT JOIN meet m ON ea.meet_rk = m.meet_rk
    LEFT JOIN person coach ON ea.assigned_by_prsn_rk = coach.prsn_rk
    WHERE ea.prsn_rk = $1
    ORDER BY m.meet_start_dt, DESC, et.etyp_type_name`,
    [prsn_rk]
  );

  res.json(assignments.rows);
});

exports.updateEventAssignment = asyncHandler(async (req, res) => {
  const { meet_rk, prsn_rk, etyp_rk } = req.params;
  const {
    attempt_one,
    attempt_two,
    attempt_three,
    attempt_four,
    attempt_five,
    attempt_six,
    final_mark,
    notes,
  } = req.body;
  const coach_prsn_rk = req.user.id;

  // Validate that the assignment exists and belongs to the coach's athlete
  const assignmentCheck = await pool.query(
    `SELECT ea.meet_rk FROM event_assignment ea
     JOIN person athlete ON ea.prsn_rk = athlete.prsn_rk
     WHERE ea.meet_rk = $1 AND ea.prsn_rk = $2 AND ea.etyp_rk = $3 AND athlete.coach_prsn_rk = $4`,
    [meet_rk, prsn_rk, etyp_rk, coach_prsn_rk]
  );
  if (assignmentCheck.rows.length === 0) {
    throw new NotFoundError("Event assignment or access denied");
  }

  const updatedAssignment = await pool.query(
    `UPDATE event_assignment 
     SET attempt_one = $1, attempt_two = $2, attempt_three = $3, attempt_four = $4,
         attempt_five = $5, attempt_six = $6, final_mark = $7, notes = $8
     WHERE meet_rk = $9 AND prsn_rk = $10 AND etyp_rk = $11 RETURNING *`,
    [
      attempt_one,
      attempt_two,
      attempt_three,
      attempt_four,
      attempt_five,
      attempt_six,
      final_mark,
      notes,
      meet_rk,
      prsn_rk,
      etyp_rk,
    ]
  );

  res.json(updatedAssignment.rows[0]);
});

exports.deleteEventAssignment = asyncHandler(async (req, res) => {
  const { meet_rk, prsn_rk, etyp_rk } = req.params;
  const coach_prsn_rk = req.user.id;

  // Validate that the assignment exists and belongs to the coach's athlete
  const assignmentCheck = await pool.query(
    `SELECT ea.meet_rk FROM event_assignment ea
     JOIN person athlete ON ea.prsn_rk = athlete.prsn_rk
     WHERE ea.meet_rk = $1 AND ea.prsn_rk = $2 AND ea.etyp_rk = $3 AND athlete.coach_prsn_rk = $4`,
    [meet_rk, prsn_rk, etyp_rk, coach_prsn_rk]
  );
  if (assignmentCheck.rows.length === 0) {
    throw new NotFoundError("Event assignment or access denied");
  }

  await pool.query(
    "DELETE FROM event_assignment WHERE meet_rk = $1 AND prsn_rk = $2 AND etyp_rk = $3",
    [meet_rk, prsn_rk, etyp_rk]
  );

  res.json({ message: "Event assignment deleted successfully" });
});

exports.getEventAssignment = asyncHandler(async (req, res) => {
  const { meet_rk, prsn_rk, etyp_rk } = req.params;
  const coach_prsn_rk = req.user.id;

  const assignment = await pool.query(
    `SELECT 
      ea.meet_rk,
      ea.prsn_rk,
      ea.assigned_by_prsn_rk,
      ea.etyp_rk,
      ea.attempt_one,
      ea.attempt_two,
      ea.attempt_three,
      ea.attempt_four,
      ea.attempt_five,
      ea.attempt_six,
      ea.final_mark,
      ea.notes,
      et.etyp_type_name as event_name,
      athlete.prsn_first_nm as athlete_first_nm,
      athlete.prsn_last_nm as athlete_last_nm,
      coach.prsn_first_nm as coach_first_nm,
      coach.prsn_last_nm as coach_last_nm
    FROM event_assignment ea
    LEFT JOIN event_type et ON ea.etyp_rk = et.etyp_rk
    LEFT JOIN person athlete ON ea.prsn_rk = athlete.prsn_rk
    LEFT JOIN person coach ON ea.assigned_by_prsn_rk = coach.prsn_rk
    WHERE ea.meet_rk = $1 AND ea.prsn_rk = $2 AND ea.etyp_rk = $3 AND athlete.coach_prsn_rk = $4`,
    [meet_rk, prsn_rk, etyp_rk, coach_prsn_rk]
  );

  if (assignment.rows.length === 0) {
    throw new NotFoundError("Event assignment or access denied");
  }

  res.json(assignment.rows[0]);
});

exports.getAllEventAssignmentsForCoach = asyncHandler(async (req, res) => {
  const coach_prsn_rk = req.user.id;

  const assignments = await pool.query(
    `SELECT 
      ea.meet_rk,
      ea.prsn_rk,
      ea.assigned_by_prsn_rk,
      ea.etyp_rk,
      ea.attempt_one,
      ea.attempt_two,
      ea.attempt_three,
      ea.attempt_four,
      ea.attempt_five,
      ea.attempt_six,
      ea.final_mark,
      ea.notes,
      et.etyp_type_name as event_name,
      athlete.prsn_first_nm as athlete_first_nm,
      athlete.prsn_last_nm as athlete_last_nm,
      coach.prsn_first_nm as coach_first_nm,
      coach.prsn_last_nm as coach_last_nm,
             m.meet_nm,
       m.meet_start_dt,
       m.meet_end_dt,
       m.meet_location
    FROM event_assignment ea
    LEFT JOIN event_type et ON ea.etyp_rk = et.etyp_rk
    LEFT JOIN person athlete ON ea.prsn_rk = athlete.prsn_rk
    LEFT JOIN person coach ON ea.assigned_by_prsn_rk = coach.prsn_rk
    LEFT JOIN meet m ON ea.meet_rk = m.meet_rk
    WHERE athlete.coach_prsn_rk = $1
         ORDER BY m.meet_start_dt DESC, ea.meet_rk DESC`,
    [coach_prsn_rk]
  );

  res.json(assignments.rows);
});

/*
  Purpose: Meets.js holds all the HTTP Requests for editing the Meet Table
      The table is selected through the SQL Queries
*/
const { pool } = require("../db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.addMeet = asyncHandler(async (req, res) => {
  const {
    meet_nm,
    meet_start_dt,
    meet_end_dt,
    meet_location,
    meet_description,
  } = req.body;
  const assigned_by_prsn_rk = req.user.id;

  // Get the organization ID for the current user
  const userOrg = await pool.query(
    "SELECT org_rk FROM person WHERE prsn_rk = $1",
    [assigned_by_prsn_rk]
  );

  if (userOrg.rows.length === 0) {
    throw new NotFoundError("User");
  }

  const org_rk = userOrg.rows[0].org_rk;

  const newMeet = await pool.query(
    "INSERT INTO Meet (meet_nm, meet_start_dt, meet_end_dt, meet_location, meet_description, assigned_by_prsn_rk, org_rk) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      meet_nm,
      meet_start_dt,
      meet_end_dt,
      meet_location,
      meet_description,
      assigned_by_prsn_rk,
      org_rk,
    ]
  );

  res.json(newMeet.rows[0]);
});

exports.getAllMeets = asyncHandler(async (req, res) => {
  const user_prsn_rk = req.user.id;

  // Get the organization ID for the current user
  const userOrg = await pool.query(
    "SELECT org_rk FROM person WHERE prsn_rk = $1",
    [user_prsn_rk]
  );

  if (userOrg.rows.length === 0) {
    throw new NotFoundError("User organization not found");
  }

  const org_rk = userOrg.rows[0].org_rk;

  // Get meets only for the user's organization
  const allMeets = await pool.query(
    "SELECT * FROM Meet WHERE org_rk = $1 ORDER BY meet_start_dt DESC",
    [org_rk]
  );

  res.json(allMeets.rows);
});

exports.getMeet = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;
  const Meet = await pool.query(
    `SELECT m.*, p.prsn_first_nm, p.prsn_last_nm 
     FROM Meet m 
     LEFT JOIN person p ON m.assigned_by_prsn_rk = p.prsn_rk 
     WHERE m.meet_rk = $1`,
    [meet_rk]
  );

  if (Meet.rows.length === 0) {
    throw new NotFoundError("Meet");
  }

  res.json(Meet.rows[0]);
});

exports.updateMeet = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;
  const {
    meet_nm,
    meet_start_dt,
    meet_end_dt,
    meet_location,
    meet_description,
  } = req.body;
  const assigned_by_prsn_rk = req.user.id;

  const updateTodo = await pool.query(
    "UPDATE Meet SET meet_nm = $1, meet_start_dt = $2, meet_end_dt = $3, meet_location = $4, meet_description = $5, assigned_by_prsn_rk = $6 WHERE meet_rk = $7",
    [
      meet_nm,
      meet_start_dt,
      meet_end_dt,
      meet_location,
      meet_description,
      assigned_by_prsn_rk,
      meet_rk,
    ]
  );

  res.json("Meet was Updated");
});

exports.deleteMeet = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;
  const deleteMeet = await pool.query("DELETE FROM Meet WHERE meet_rk = $1", [
    meet_rk,
  ]);

  res.json("Meet has been Deleted");
});

// Get meets for coach's organization
exports.getMeetsForCoachOrg = asyncHandler(async (req, res) => {
  const coach_prsn_rk = req.user.id;

  // Get coach's organization
  const coach = await pool.query(
    "SELECT org_rk FROM person WHERE prsn_rk = $1",
    [coach_prsn_rk]
  );

  if (coach.rows.length === 0) {
    throw new NotFoundError("Coach");
  }

  const org_rk = coach.rows[0].org_rk;

  // Get all meets for the organization only
  const meets = await pool.query(
    `SELECT m.*, p.prsn_first_nm, p.prsn_last_nm 
     FROM Meet m 
     LEFT JOIN person p ON m.assigned_by_prsn_rk = p.prsn_rk 
     WHERE m.org_rk = $1 
     ORDER BY m.meet_start_dt`,
    [org_rk]
  );

  res.json(meets.rows);
});

exports.createMeetFromTemplate = asyncHandler(async (req, res) => {
  const {
    template_rk,
    meet_nm,
    meet_start_dt,
    meet_end_dt,
    meet_location,
    meet_description,
    event_schedules,
  } = req.body;
  const assigned_by_prsn_rk = req.user.id;

  if (!meet_nm || !meet_start_dt || !meet_end_dt) {
    throw new ValidationError(
      "Meet name, start date, and end date are required"
    );
  }

  // Get the organization ID for the current user
  const userOrg = await pool.query(
    "SELECT org_rk FROM person WHERE prsn_rk = $1",
    [assigned_by_prsn_rk]
  );

  if (userOrg.rows.length === 0) {
    throw new NotFoundError("User");
  }

  const org_rk = userOrg.rows[0].org_rk;

  // Create the meet
  const newMeet = await pool.query(
    "INSERT INTO Meet (meet_nm, meet_start_dt, meet_end_dt, meet_location, meet_description, assigned_by_prsn_rk, org_rk) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      meet_nm,
      meet_start_dt,
      meet_end_dt,
      meet_location,
      meet_description,
      assigned_by_prsn_rk,
      org_rk,
    ]
  );

  // If template is specified, create scheduled events
  if (template_rk) {
    const template = await pool.query(
      "SELECT * FROM meet_template WHERE template_rk = $1",
      [template_rk]
    );

    if (template.rows.length > 0) {
      const templateEvents = await pool.query(
        "SELECT * FROM meet_template_event WHERE template_rk = $1 ORDER BY event_order",
        [template_rk]
      );

      // Create meet events with schedules
      for (const templateEvent of templateEvents.rows) {
        const scheduledTime =
          event_schedules?.[templateEvent.etyp_rk] ||
          templateEvent.scheduled_time;

        // Use meet_start_dt as default event_date for template events
        const eventDate = meet_start_dt;

        await pool.query(
          "INSERT INTO meet_event (meet_rk, etyp_rk, event_date, scheduled_time, event_order) VALUES($1, $2, $3, $4, $5)",
          [
            newMeet.rows[0].meet_rk,
            templateEvent.etyp_rk,
            eventDate,
            scheduledTime,
            templateEvent.event_order,
          ]
        );
      }
    }
  }

  res.json(newMeet.rows[0]);
});

exports.checkSchedulingConflicts = asyncHandler(async (req, res) => {
  const { meet_rk, prsn_rk, etyp_rk } = req.body;
  const user_prsn_rk = req.user.id;

  if (!meet_rk || !prsn_rk || !etyp_rk) {
    throw new ValidationError("Meet, person, and event type are required");
  }

  // Check if the person is a coach or athlete
  const personCheck = await pool.query(
    "SELECT prsn_rk, coach_prsn_rk FROM person WHERE prsn_rk = $1",
    [prsn_rk]
  );

  if (personCheck.rows.length === 0) {
    throw new NotFoundError("Person");
  }

  const person = personCheck.rows[0];
  const isCoach = !person.coach_prsn_rk; // If no coach_prsn_rk, they are a coach

  // Get the scheduled time for this event
  const eventSchedule = await pool.query(
    "SELECT scheduled_time FROM meet_event WHERE meet_rk = $1 AND etyp_rk = $2",
    [meet_rk, etyp_rk]
  );

  if (eventSchedule.rows.length === 0) {
    throw new NotFoundError("Event not found in meet");
  }

  const eventTime = eventSchedule.rows[0].scheduled_time;

  // Check for conflicts
  let conflicts = [];

  if (isCoach) {
    // Check coach conflicts - coaches can be assigned to multiple events
    // but we should warn about overlapping times
    const coachAssignments = await pool.query(
      `SELECT 
        ea.meet_rk,
        ea.etyp_rk,
        me.scheduled_time,
        et.etyp_type_name,
        m.meet_nm
       FROM event_assignment ea
       JOIN meet_event me ON ea.meet_rk = me.meet_rk AND ea.etyp_rk = me.etyp_rk
       JOIN event_type et ON ea.etyp_rk = et.etyp_rk
       JOIN meet m ON ea.meet_rk = m.meet_rk
       WHERE ea.assigned_by_prsn_rk = $1 AND ea.meet_rk = $2 AND ea.etyp_rk != $3`,
      [prsn_rk, meet_rk, etyp_rk]
    );

    for (const assignment of coachAssignments.rows) {
      if (assignment.scheduled_time === eventTime) {
        conflicts.push({
          type: "coach_time_conflict",
          message: `You are already assigned to ${assignment.etyp_type_name} at the same time`,
          event: assignment.etyp_type_name,
          meet: assignment.meet_nm,
        });
      }
    }
  } else {
    // Check athlete conflicts - athletes cannot be in two events at the same time
    const athleteAssignments = await pool.query(
      `SELECT 
        ea.meet_rk,
        ea.etyp_rk,
        me.scheduled_time,
        et.etyp_type_name,
        m.meet_nm
       FROM event_assignment ea
       JOIN meet_event me ON ea.meet_rk = me.meet_rk AND ea.etyp_rk = me.etyp_rk
       JOIN event_type et ON ea.etyp_rk = et.etyp_rk
       JOIN meet m ON ea.meet_rk = m.meet_rk
       WHERE ea.prsn_rk = $1 AND ea.meet_rk = $2 AND ea.etyp_rk != $3`,
      [prsn_rk, meet_rk, etyp_rk]
    );

    for (const assignment of athleteAssignments.rows) {
      if (assignment.scheduled_time === eventTime) {
        conflicts.push({
          type: "athlete_time_conflict",
          message: `Athlete is already assigned to ${assignment.etyp_type_name} at the same time`,
          event: assignment.etyp_type_name,
          meet: assignment.meet_nm,
        });
      }
    }
  }

  res.json({ conflicts, hasConflicts: conflicts.length > 0 });
});

exports.getMeetSchedule = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;
  const user_prsn_rk = req.user.id;

  if (!meet_rk) {
    throw new ValidationError("Meet key is required");
  }

  // Get meet events with schedules
  const meetEvents = await pool.query(
    `SELECT 
      me.meet_event_rk,
      me.meet_rk,
      me.etyp_rk,
      me.event_date,
      me.scheduled_time,
      me.event_order,
      et.etyp_type_name,
      et.event_group_name,
      COUNT(ea.prsn_rk) as athlete_count
     FROM meet_event me
     LEFT JOIN event_type et ON me.etyp_rk = et.etyp_rk
     LEFT JOIN event_assignment ea ON me.meet_rk = ea.meet_rk AND me.etyp_rk = ea.etyp_rk
     WHERE me.meet_rk = $1
     GROUP BY me.meet_event_rk, me.meet_rk, me.etyp_rk, me.event_date, me.scheduled_time, me.event_order, et.etyp_type_name, et.event_group_name
     ORDER BY me.event_date, me.scheduled_time, me.event_order`,
    [meet_rk]
  );

  res.json(meetEvents.rows);
});

exports.assignCoachToEvent = asyncHandler(async (req, res) => {
  const { meet_rk, etyp_rk, coach_prsn_rk, notes } = req.body;
  const assigned_by_prsn_rk = req.user.id;

  if (!meet_rk || !etyp_rk || !coach_prsn_rk) {
    throw new ValidationError("Meet, event type, and coach are required");
  }

  // Verify the coach exists and belongs to the same organization
  const coachCheck = await pool.query(
    "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND coach_prsn_rk IS NULL",
    [coach_prsn_rk]
  );

  if (coachCheck.rows.length === 0) {
    throw new NotFoundError("Coach");
  }

  // Check for existing assignment
  const existingAssignment = await pool.query(
    "SELECT coach_assignment_rk FROM coach_event_assignment WHERE meet_rk = $1 AND etyp_rk = $2 AND coach_prsn_rk = $3",
    [meet_rk, etyp_rk, coach_prsn_rk]
  );

  if (existingAssignment.rows.length > 0) {
    throw new ConflictError("Coach is already assigned to this event");
  }

  // Create coach assignment
  const newAssignment = await pool.query(
    "INSERT INTO coach_event_assignment (meet_rk, etyp_rk, coach_prsn_rk, notes) VALUES($1, $2, $3, $4) RETURNING *",
    [meet_rk, etyp_rk, coach_prsn_rk, notes]
  );

  res.json(newAssignment.rows[0]);
});

exports.getCoachAssignmentsForMeet = asyncHandler(async (req, res) => {
  const { meet_rk } = req.params;

  if (!meet_rk) {
    throw new ValidationError("Meet key is required");
  }

  const assignments = await pool.query(
    `SELECT 
      cea.coach_assignment_rk,
      cea.meet_rk,
      cea.etyp_rk,
      cea.coach_prsn_rk,
      cea.assigned_dt,
      cea.notes,
      et.etyp_type_name,
      coach.prsn_first_nm as coach_first_nm,
      coach.prsn_last_nm as coach_last_nm
     FROM coach_event_assignment cea
     LEFT JOIN event_type et ON cea.etyp_rk = et.etyp_rk
     LEFT JOIN person coach ON cea.coach_prsn_rk = coach.prsn_rk
     WHERE cea.meet_rk = $1
     ORDER BY et.etyp_type_name, coach.prsn_last_nm`,
    [meet_rk]
  );

  res.json(assignments.rows);
});

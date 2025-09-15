const { pool } = require(".././db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.createMeetTemplate = asyncHandler(async (req, res) => {
  const { template_nm, template_description, events } = req.body;
  const created_by_prsn_rk = req.user.id;

  if (!template_nm) {
    throw new ValidationError("Template name is required");
  }

  // Get the organization ID for the current user
  const userOrg = await pool.query(
    "SELECT org_rk FROM person WHERE prsn_rk = $1",
    [created_by_prsn_rk]
  );

  if (userOrg.rows.length === 0) {
    throw new NotFoundError("User");
  }

  const org_rk = userOrg.rows[0].org_rk;

  // Enforce cap of 2 templates per organization
  const { rows: existingCountRows } = await pool.query(
    "SELECT COUNT(*)::int AS cnt FROM meet_template WHERE org_rk = $1",
    [org_rk]
  );
  const existingCount = existingCountRows[0]?.cnt || 0;
  if (existingCount >= 2) {
    throw new ValidationError(
      "Template limit reached (max 2 per organization)"
    );
  }

  // Create the meet template
  const newTemplate = await pool.query(
    "INSERT INTO meet_template (template_nm, template_description, org_rk, created_by_prsn_rk) VALUES($1, $2, $3, $4) RETURNING *",
    [template_nm, template_description, org_rk, created_by_prsn_rk]
  );

  // Create template events
  if (events && events.length > 0) {
    for (const event of events) {
      await pool.query(
        "INSERT INTO meet_template_event (template_rk, etyp_rk, event_order, scheduled_time) VALUES($1, $2, $3, $4)",
        [
          newTemplate.rows[0].template_rk,
          event.etyp_rk,
          event.event_order,
          event.scheduled_time,
        ]
      );
    }
  }

  res.json(newTemplate.rows[0]);
});

exports.getMeetTemplatesForOrg = asyncHandler(async (req, res) => {
  const user_prsn_rk = req.user.id;

  // Get the organization ID for the current user
  const userOrg = await pool.query(
    "SELECT org_rk FROM person WHERE prsn_rk = $1",
    [user_prsn_rk]
  );

  if (userOrg.rows.length === 0) {
    throw new NotFoundError("User");
  }

  const org_rk = userOrg.rows[0].org_rk;

  // Get templates with their events
  const templates = await pool.query(
    `SELECT 
      mt.template_rk,
      mt.template_nm,
      mt.template_description,
      mt.created_dt,
      p.prsn_first_nm,
      p.prsn_last_nm
     FROM meet_template mt
     LEFT JOIN person p ON mt.created_by_prsn_rk = p.prsn_rk
     WHERE mt.org_rk = $1
     ORDER BY mt.template_nm`,
    [org_rk]
  );

  // Get events for each template
  const templatesWithEvents = await Promise.all(
    templates.rows.map(async (template) => {
      const events = await pool.query(
        `SELECT 
          mte.template_event_rk,
          mte.etyp_rk,
          mte.event_order,
          mte.scheduled_time,
          et.etyp_type_name,
          et.event_group_name
         FROM meet_template_event mte
         LEFT JOIN event_type et ON mte.etyp_rk = et.etyp_rk
         WHERE mte.template_rk = $1
         ORDER BY mte.event_order`,
        [template.template_rk]
      );

      return {
        ...template,
        events: events.rows,
      };
    })
  );

  res.json(templatesWithEvents);
});

exports.getMeetTemplateById = asyncHandler(async (req, res) => {
  const { template_rk } = req.params;
  const user_prsn_rk = req.user.id;

  if (!template_rk) {
    throw new ValidationError("Template ID is required");
  }

  // Verify the template belongs to the user's organization
  const template = await pool.query(
    `SELECT mt.*, p.prsn_first_nm, p.prsn_last_nm
     FROM meet_template mt
     LEFT JOIN person p ON mt.created_by_prsn_rk = p.prsn_rk
     WHERE mt.template_rk = $1 AND mt.org_rk = (
       SELECT org_rk FROM person WHERE prsn_rk = $2
     )`,
    [template_rk, user_prsn_rk]
  );

  if (template.rows.length === 0) {
    throw new NotFoundError("Template");
  }

  // Get template events
  const events = await pool.query(
    `SELECT 
      mte.template_event_rk,
      mte.etyp_rk,
      mte.event_order,
      mte.scheduled_time,
      et.etyp_type_name,
      et.event_group_name
     FROM meet_template_event mte
     LEFT JOIN event_type et ON mte.etyp_rk = et.etyp_rk
     WHERE mte.template_rk = $1
     ORDER BY mte.event_order`,
    [template_rk]
  );

  res.json({
    ...template.rows[0],
    events: events.rows,
  });
});

exports.updateMeetTemplate = asyncHandler(async (req, res) => {
  const { template_rk } = req.params;
  const { template_nm, template_description, events } = req.body;
  const user_prsn_rk = req.user.id;

  if (!template_rk) {
    throw new ValidationError("Template ID is required");
  }

  if (!template_nm) {
    throw new ValidationError("Template name is required");
  }

  // Verify the template belongs to the user's organization
  const templateCheck = await pool.query(
    "SELECT template_rk FROM meet_template WHERE template_rk = $1 AND org_rk = (SELECT org_rk FROM person WHERE prsn_rk = $2)",
    [template_rk, user_prsn_rk]
  );

  if (templateCheck.rows.length === 0) {
    throw new NotFoundError("Template");
  }

  // Update template
  await pool.query(
    "UPDATE meet_template SET template_nm = $1, template_description = $2 WHERE template_rk = $3",
    [template_nm, template_description, template_rk]
  );

  // Delete existing events
  await pool.query("DELETE FROM meet_template_event WHERE template_rk = $1", [
    template_rk,
  ]);

  // Create new events
  if (events && events.length > 0) {
    for (const event of events) {
      await pool.query(
        "INSERT INTO meet_template_event (template_rk, etyp_rk, event_order, scheduled_time) VALUES($1, $2, $3, $4)",
        [template_rk, event.etyp_rk, event.event_order, event.scheduled_time]
      );
    }
  }

  res.json({ message: "Template updated successfully." });
});

exports.deleteMeetTemplate = asyncHandler(async (req, res) => {
  const { template_rk } = req.params;
  const user_prsn_rk = req.user.id;

  if (!template_rk) {
    throw new ValidationError("Template ID is required");
  }

  // Verify the template belongs to the user's organization
  const templateCheck = await pool.query(
    "SELECT template_rk FROM meet_template WHERE template_rk = $1 AND org_rk = (SELECT org_rk FROM person WHERE prsn_rk = $2)",
    [template_rk, user_prsn_rk]
  );

  if (templateCheck.rows.length === 0) {
    throw new NotFoundError("Template");
  }

  // Delete template events first
  await pool.query("DELETE FROM meet_template_event WHERE template_rk = $1", [
    template_rk,
  ]);

  // Delete template
  await pool.query("DELETE FROM meet_template WHERE template_rk = $1", [
    template_rk,
  ]);

  res.json({ message: "Template deleted successfully." });
});
